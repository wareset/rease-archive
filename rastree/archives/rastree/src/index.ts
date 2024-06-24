import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { endsWith } from '@wareset-utilites/string/endsWith'
import { trimLeft } from '@wareset-utilites/string/trimLeft'
import { isString } from '@wareset-utilites/is/isString'
import { trim } from '@wareset-utilites/string/trim'
import { keys } from '@wareset-utilites/object/keys'

import { parseComponent, TypeParseComponent } from './lib/parseComponent'
import { createScoper, validateCid, isValidVariable } from './lib/utils'

import { style as rastreeStyle } from './core/style'
import { template as rastreeTemplate } from './core/template'
import {
  extractImports,
  TypeImports,
  __REASE_COMPONENT__,
  mergeImports as scriptMergeImports
} from './core/script/lib/extractImports'
import { getDelimeter } from './core/utils/getDelimeter'

// const sections = rastreeParseComponent(rease)
// applyAllAttributes(sections)

const __createComponent__ = ({
  name = '',
  cid = '',
  imports = {},
  code = '',
  module = '',
  template = '',
  // needScoper,
  // scoper = ``,
  cssJsVars,
  cssNoVars
}: {
  name?: string
  cid?: string
  imports?: TypeImports
  code?: string
  module?: string
  template?: string
  needScoper?: boolean
  scoper?: string
  cssJsVars?: string[]
  cssNoVars?: string[]
} = {}): string => {
  const __d__ = getDelimeter(code + module + name)
  let res = '/* eslint-disable */\n'

  // res +=
  //   '/* eslint-disable @typescript-eslint/explicit-function-return-type */\n'
  // res += `import { RComponent as ReaseComponent${__d__} } from "rease";\n`

  // let cid = ``
  // if (needScoper && scoper) {
  //   cid = `  static cid = ${scoper}\n`
  // }

  let reaseThis = ''
  let reaseThisName = 'this'
  let reaseProps = ''
  // imports
  // console.log(imports)
  forEachLeft(keys(imports), (srcName) => {
    const src = imports[srcName]
    const props: string[] = []
    // console.log(src)
    if (srcName !== __REASE_COMPONENT__) {
      forEachLeft(keys(src), (iName) => {
        // console.log(iName)
        if (iName === '*') {
          forEachLeft(src[iName], (v) => {
            res += `import * as ${v} from ${jsonStringify(srcName)};\n`
          })
        } else if (iName === '@') res += `import ${jsonStringify(srcName)};\n`
        else {
          // prettier-ignore
          props.push(...src[iName].map((v) => v === iName ? v : iName + ' as ' + v))
        }
      })
    } else {
      srcName = 'rease'
      forEachLeft(keys(src), (iName) => {
        if (iName === 'default') {
          reaseThis += src[iName]
            .map(
              (v) =>
                `    const ${v} = ${reaseThisName}; /* ${reaseThisName = v} */\n`
            )
            .join('')
        } else if (iName === 'props') {
          const propsArr = [...src[iName]]
          const props0 = propsArr.shift()

          props.push('getProperty as getProps' + __d__)
          reaseProps += `    const ${props0} = getProps${__d__}(${reaseThisName});\n`
          reaseProps += propsArr
            .map((v) => `    const ${v} = ${props0};\n`)
            .join('')
        }
      })
    }

    // console.log(props)

    if (props.length) {
      res += `import { ${props.join(', ')} } from ${jsonStringify(srcName)};\n`
    }
  })

  let ordinaryStyles = (cssNoVars || []).join(', ')
  let reactiveStyles = (cssJsVars || []).join(', ')

  // prettier-ignore
  if (ordinaryStyles) {
    // res += `import { ordinaryStyles as ordinaryStyles${__d__} } from "rease";\n`
    // ordinaryStyles = `\nordinaryStyles${__d__}(${name}, [${ordinaryStyles}]);\n`
    ordinaryStyles = `${name}.css = ${ordinaryStyles}`
  }
  // prettier-ignore
  if (reactiveStyles) {
    // res += `import { reactiveStyles as reactiveStyles${__d__} } from "rease";\n`
    // reactiveStyles = `  reactiveStyles${__d__}(${name}, [${reactiveStyles}]);\n`
    reactiveStyles = `    ,${reactiveStyles}`
  }

  if (res) res += '\n'
  if (module = trim(module)) res += module + '\n'
  if (res) res += '\n'
  // prettier-ignore
  res +=
`export default function ${name}() {
${reaseThis}${reaseProps}${trimLeft(code)}
  return [
${template}
${reactiveStyles}
  ]
}
${name}.cid = ${jsonStringify(cid)}
${ordinaryStyles}
${name}.nid = 0
`

  // console.log(res)
  return res
}

const rastree = (
  source: string | TypeParseComponent,
  { externalCss = false }: { externalCss?: boolean } = {}
): {
  cssExternal: string
  codeClient: string
  codeServer: string
} => {
  const { options, sections } = isString(source)
    ? parseComponent(source)
    : source
  const { script, style, template } = sections
  // console.log('options', options)

  const cid = options.cid = validateCid(options.cid)
  const [scoper] = createScoper(
    cid,
    options['css-scope-type']
  )
  // console.log('scoper', [cid, scoper, scoperInject])

  // console.log(style)
  // const styles = []
  // let needScoper = false
  let cssExternal = ''
  const cssJsVars: any = []
  const cssNoVars: any = []
  forEachLeft(style, ({ attributes, code }) => {
    if (trim(code)) {
      // console.log(attributes)
      // console.log(code)

      const css = rastreeStyle(code, {
        global: !attributes.scoped || attributes.global,
        calc  : attributes['--calc'],
        js    : attributes['--js'],
        externalCss,
        scoper
      })
      // console.log(css)
      // if (css.needScoper) needScoper = true
      if (css.cssExternal) cssExternal += '\n' + css.cssExternal
      if (css.cssJsVars) cssJsVars.push(css.cssJsVars)
      if (css.cssNoVars) cssNoVars.push(css.cssNoVars)
      // styles.push(css)
      // console.log(css)
      // console.log(css.cssExternal)
    }
  })
  cssExternal = trimLeft(cssExternal)
  // console.log(styles)

  // console.log(template)
  let templateClientCodeDirty = ''
  // let templateServerCodeDirty = ''
  forEachLeft(template, ({ attributes, code }) => {
    if (code = trimLeft(code)) {
      if (attributes.client) templateClientCodeDirty += code
      // if (attributes.server) templateServerCodeDirty += code
    }
  })

  templateClientCodeDirty = trim(templateClientCodeDirty)
  // templateServerCodeDirty = trim(templateServerCodeDirty)
  console.log('templateClientCodeDirty\n', [templateClientCodeDirty])
  const templateClientCode = rastreeTemplate(templateClientCodeDirty).toString()
  const templateServerCode = templateClientCode
  // console.log(`templateClientCode\n`, [templateClientCode])
  // console.log(`templateServerCode`, templateServerCode)

  const scriptClient = { imports: {}, module: '', code: '' }
  const scriptServer = { imports: {}, module: '', code: '' }
  // console.log(script)
  forEachLeft(script, ({ attributes, code: codeDirty }) => {
    const { client, server, module } = attributes
    const { imports, code } = extractImports(codeDirty)
    // console.log({ imports, code })

    if (client) {
      scriptClient[module ? 'module' : 'code'] += code
      scriptMergeImports(scriptClient.imports, imports)
    }
    if (server) {
      scriptServer[module ? 'module' : 'code'] += code
      scriptMergeImports(scriptServer.imports, imports)
    }
  })
  options.name = isValidVariable(options.name) ? options.name : 'Rease'
  if (!endsWith(options.name, options.cid)) options.name += '_' + options.cid
  const name = options.name
  // console.log(`cssJsVars`, cssJsVars)
  // console.log(`cssNoVars`, cssNoVars)

  const codeClient = __createComponent__({
    name,
    cid,
    // needScoper,
    // scoper: scoperInject,
    cssJsVars,
    cssNoVars,
    ...scriptClient,
    template: templateClientCode
  })
  const codeServer = __createComponent__({
    name,
    cid,
    // needScoper,
    // scoper: scoperInject,
    ...scriptServer,
    template: templateServerCode
  })

  // console.log(codeClient)
  // console.log(codeServer)

  return { cssExternal, codeClient, codeServer }
}

export default rastree
