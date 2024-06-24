import * as nodeFs from 'fs'
import * as nodePath from 'path'
import nodeWatch from 'node-watch'

import { getExports } from './utils/getExports'
import { hash, slashes2posix, trimTsx, stringify } from './utils'
import { copySyncRecursive, createDirSyncRecursive } from './utils/fs'

import { RollupOptions, Plugin } from 'rollup'
import { createRouter } from 'like-file-router'

export type TypeRollupOptionsWithoutInputAndOutput = Omit<RollupOptions, 'input' | 'output'>

import rollupRease from 'rollup-plugin-rease'

const filterRouteFile = (src: string): boolean =>
  nodePath.parse(src).base[0] !== '_' && /\.tsx?$/.test(src)

const readdirSyncRecursive = (src: string): string[] => {
  const res: string[] = []

  const stat = nodeFs.statSync(src = nodePath.resolve(src))
  if (stat.isDirectory()) {
    const files = nodeFs.readdirSync(src)
    for (let i = files.length; i-- > 0;) {
      if (nodePath.parse(files[i]).base[0] !== '_') {
        res.push(...readdirSyncRecursive(nodePath.join(src, files[i])))
      }
    }
  } else if (filterRouteFile(src)) res.push(src)

  return res
}

const timestamp = (code: string, id: string): string | null => {
  if (/\.[tj]sx?$/.test(id)) {
    return `/* filename: ${id}\n  timestamp: ${new Date().toISOString()} */\n${code}`
  }
  return null
}

export default ({
  dirSrc = 'src',
  dirTemp = 'tmp',
  dirOutput = 'app',

  dirSrcAssets = 'assets',
  dirSrcRoutes = 'routes',

  fileSrcClient = 'client.ts',
  fileSrcServer = 'server.ts',
  fileSrcTemplate = 'template.html',

  rollupClientPluginsBefore = [] as Plugin[],
  rollupClientOptions = {} as TypeRollupOptionsWithoutInputAndOutput,
  rollupServerPluginsBefore = [] as Plugin[],
  rollupServerOptions = {} as TypeRollupOptionsWithoutInputAndOutput,

  debug = false,
  devmode = false,
  watchStatic = true
} = {}): [RollupOptions, RollupOptions] => {
  const _DIR_ROOT = nodePath.resolve()
  const DIR_SRC = nodePath.resolve(_DIR_ROOT, dirSrc)
  const DIR_TMP = nodePath.resolve(_DIR_ROOT, dirTemp)
  const DIR_APP = nodePath.resolve(_DIR_ROOT, dirOutput)

  /*
  Копируем все ассеты и отслеживаем их
  */
  const DIR_SRC_ASSETS = nodePath.resolve(DIR_SRC, dirSrcAssets)
  const DIR_APP_ASSETS = nodePath.resolve(DIR_APP, 'assets')
  copySyncRecursive(DIR_SRC_ASSETS, DIR_APP_ASSETS)
  if (devmode && watchStatic) {
    nodeWatch(DIR_SRC_ASSETS, { recursive: true }, (evt, name) => {
      name = nodePath.relative(DIR_SRC_ASSETS, nodePath.resolve(name)).trim()
      // console.log([evt, name])
      if (name) {
        switch (evt) {
          case 'remove':
            nodeFs.unlinkSync(nodePath.join(DIR_APP_ASSETS, name))
            break
          default:
            copySyncRecursive(nodePath.join(DIR_SRC_ASSETS, name),
              nodePath.join(DIR_APP_ASSETS, name))
        }
      }
    })
  }
  
  /*
  Находим все роуты
  */
  const DIR_SRC_ROUTES = nodePath.resolve(DIR_SRC, dirSrcRoutes)
  const ROUTE_LIST = readdirSyncRecursive(DIR_SRC_ROUTES)
    .map((input) => {
      let route = nodePath.relative(DIR_SRC_ROUTES, input).trim()
      const clientOutput = (devmode ? route.replace(/[^\w$]+/g, '_') : hash(input)) + '.js'
      const exports = getExports(nodeFs.readFileSync(input, 'utf8'), input, /x$/.test(route))
      route = route.replace(/([/\\]*index)?(\.rease)?\.tsx?$/, '') || '/'
      return { route, input, clientOutput, exports }
    })
    .filter((v) => Object.keys(v.exports).length > 0)
  // console.log(ROUTE_LIST)

  const DIR_APP_ASSETS_PUBLIC_BUILD =
    nodePath.resolve(DIR_APP_ASSETS, 'static', 'build')
  if (nodeFs.existsSync(DIR_APP_ASSETS_PUBLIC_BUILD)) {
    const oldBuilds = nodeFs.readdirSync(DIR_APP_ASSETS_PUBLIC_BUILD)
    for (let i = oldBuilds.length; i--;) {
      nodeFs.unlinkSync(nodePath.resolve(DIR_APP_ASSETS_PUBLIC_BUILD, oldBuilds[i]))
    }
  }

  /*
  Создаем темплейт
  */
  const FILE_TEMPLATE = nodePath.resolve(DIR_SRC, fileSrcTemplate)
  let template = nodeFs.readFileSync(FILE_TEMPLATE, 'utf8')
  template = '`' + template.replace(/([\\`])/g, '\\$1') + '`'
  // console.log(template)

  /*
  Создаем tmp для сервера и клиента
  */
  createDirSyncRecursive(DIR_TMP)

  /*
  Создаем сервер
  */
  const FILE_SERVER = nodePath.resolve(DIR_TMP, 'server.ts')
  let server = '/* eslint-disable no-tabs */\n'
  server += `import { default as route } from '${slashes2posix(
    nodePath.relative(DIR_TMP, trimTsx(nodePath.resolve(DIR_SRC, fileSrcServer)))
  )}'\n`

  server += `\nconst templateFactory = (rease: any): string => ${template}\n\n`

  for (let i = 0; i < ROUTE_LIST.length; i++) {
    const chunk = ROUTE_LIST[i]
    const variable = '_' + chunk.clientOutput.slice(0, -3)
    server += `import * as ${variable} from '${slashes2posix(
      nodePath.relative(DIR_TMP, trimTsx(chunk.input))
    )}'\n`
    server += `route.__reaserve__(${stringify(chunk.route)}, ${
      stringify(chunk.clientOutput.slice(0, -3))
    }, ${variable}, templateFactory)\n\n`
  }

  nodeFs.writeFileSync(FILE_SERVER, server)

  /*
  Создаем клиент
  */
  const FILE_CLIENT = nodePath.resolve(DIR_TMP, 'client.ts')
  let client = '/* eslint-disable no-tabs */\n'
  client += `import { default as reaserveClient } from '${slashes2posix(
    nodePath.relative(DIR_TMP, trimTsx(nodePath.resolve(DIR_SRC, fileSrcClient)))
  )}'\n`

  const router = createRouter({ on(): any {} } as any)
  const errorsObj = {} as any
  let errorDir = ''

  for (let i = 0; i < ROUTE_LIST.length; i++) {
    const chunk = ROUTE_LIST[i]
    if (chunk.exports.default) {
      const dir = slashes2posix(
        nodePath.relative(DIR_TMP, trimTsx(chunk.input))
      )
      if (/^\+?\d+$/.test(chunk.route)) errorsObj[chunk.route] = dir
      else if (/^\+Err$/i.test(chunk.route)) errorDir = `, () => import('${dir}')`
      else router.get(chunk.route, () => dir)
    }
  }

  let errors = '{\n'
  for (const k in errorsObj) errors += `  ${k}: () => import('${errorsObj[k]}'),\n`
  errors += '\n}'

  let clientRoutes = '{\n'
  for (const k in router._routes.GET) {
    if (+k >= 0) {
      clientRoutes += `  '${k}': [${router._routes.GET[k].map((v) =>
        `\n    [${v.regex}, () => import('${(v as any).handlers[0]!()}')]\n`)}],\n`
    } else {
      const k2 = k
      clientRoutes += `  '${k}': {\n`
      for (const k in router._routes.GET[k2]) {
        clientRoutes += `    '${k}': [${router._routes.GET[k].map((v) =>
          `\n      [${v.regex}, () => import('${(v as any).handlers[0]!()}')]\n`)}],\n`
      }
      clientRoutes += '\n  }'
    }
  }
  clientRoutes += '\n}'
  
  // client += '\nconst routes = ' + clientRoutes + '\n'
  client += `\nreaserveClient(${clientRoutes}, ${errors}${errorDir})\n`

  nodeFs.writeFileSync(FILE_CLIENT, client)

  /*
  ------------------------------------------------------------------------------
  ROLLUP
  ------------------------------------------------------------------------------
  */
  const fullRollupOptionsClient: RollupOptions = {
    ...rollupClientOptions,
    input : [],
    output: {
      compact       : true,
      format        : 'system',
      dir           : DIR_APP_ASSETS_PUBLIC_BUILD,
      chunkFileNames: devmode ? '_[name]-[hash].js' : '[hash].js'
    },
    plugins: [
      (() => ({
        name: 'reaserve-client',
        buildStart(this: any) {
          this.emitFile({
            type             : 'chunk',
            id               : FILE_CLIENT,
            fileName         : 'index.js',
            preserveSignature: 'strict'
          })

          for (let i = ROUTE_LIST.length; i--;) {
            const chunk = ROUTE_LIST[i]
            if (chunk.exports.default) {
              this.emitFile({
                type             : 'chunk',
                id               : chunk.input,
                fileName         : chunk.clientOutput,
                preserveSignature: 'strict'
              })
            }
          }
        },
        transform: timestamp
      }))(),
      ...rollupClientPluginsBefore,
      rollupRease({ env: 'client', debug }),
      ...rollupClientOptions.plugins || []
    ]
  }

  const fullRollupOptionsServer: RollupOptions = {
    ...rollupServerOptions,
    input : [FILE_SERVER], // 'src/index.ts',
    output: {
      compact  : true,
      sourcemap: false,
      format   : 'cjs',
      file     : nodePath.resolve(DIR_APP, 'index.js'),
    },
    plugins: [
      (() => ({
        name     : 'reaserve-server',
        // buildStart() {
        //   this.addWatchFile(FILE_TEMPLATE)
        // },
        // resolveId(id: string) {
        //   // console.log(222, file)
        //   if (/node:/.test(id)) id = id.slice(5)
        //   if (id && id[0] !== '.' && id[0] !== '/' &&
        //   external.some((v) => id.startsWith(v))) {
        //     // console.log('resolveId', id)
        //     return { id, external: true }
        //   }
        //   return null
        //   // return { id }
        // },
        transform: timestamp
      }))(),
      ...rollupServerPluginsBefore,
      rollupRease({ env: 'server', debug }),
      ...rollupServerOptions.plugins || []
    ]
  }

  return [fullRollupOptionsClient, fullRollupOptionsServer]
}
