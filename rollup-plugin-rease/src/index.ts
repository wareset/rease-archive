import {
  join as path_join,
  parse as path_parse,
  relative as path_relative,
} from 'path'
import { writeFileSync as fs_writeFileSync } from 'fs'

import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { compiler } from 'rastree'

export default function({
  env = 'client' as 'client' | 'server',
  debug = false as boolean | ((path: string) => boolean),
  extensions = ['.rease', '.js', '.ts', '.jsx', '.tsx'],

  include = null as FilterPattern,
  exclude = null as FilterPattern,
} = {}): any {
  if (env !== 'server') env = 'client'
  const cwd = process.cwd()
  const filter = createFilter(include, exclude)
  const debugFn = typeof debug === 'function'
    ? debug
    : (id: string): boolean => debug && id.startsWith(cwd)

  // const cache = new Map()

  return {
    name: 'rollup-plugin-rease',

    // eslint-disable-next-line consistent-return, @typescript-eslint/no-unused-vars
    // resolveId(importee: any, _importer: any): any {
    //   if (!filter(importee)) return null
    //   if (!extensions.some((v: string) => importee.endsWith(v))) return null
    //   // console.log(111, importee, _importer)
    //   cache.set(importee, null)
    //   return { id: importee, external: false }
    // },

    transform(code: string, id: string): string | null {
      // if (!cache.has(id)) return null
      if (!filter(id)) return null
      if (!extensions.some((v: string) => id.endsWith(v))) return null
      if (/\.[tj]s$/.test(id) && !/\brease\/(?:env|css|jsx)\b/.test(code)) return null
      // console.log(1, cwd)
      // console.log(2, id)

      const compiled = compiler(code, {
        env   : env,
        salt  : id,
        useJSX: !/\.[jt]s$/.test(id)
      })

      if (!/\bnode_modules\b/.test(id) && debugFn(id)) {
        const filename = path_relative(cwd, id)

        const a = filename.split('.')
        a.splice(-1, 0, env)
        
        const data = path_parse(a.join('.'))
        let file = path_join(data.dir, '__' + data.base)
        if (/\.[jt]sx$/.test(file)) file = file.slice(0, -1)
        fs_writeFileSync(file, '/* eslint-disable */\n// @ts-nocheck\n' + compiled)
      }

      return compiled
    }
  }
}
