/* eslint-disable security/detect-unsafe-regex */

import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { jsonParse } from '@wareset-utilites/lang/jsonParse'
import { includes } from '@wareset-utilites/array/includes'
import { isString } from '@wareset-utilites/is/isString'
import { isArray } from '@wareset-utilites/is/isArray'
import { trim } from '@wareset-utilites/string/trim'
import { keys } from '@wareset-utilites/object/keys'
import { last } from '@wareset-utilites/array/last'
import { regexp } from '@wareset-utilites/regexp'

import {
  jsx2tokens,
  removeExtraSpaces, trimCircleBrackets, stringifyTokens
} from '@rastree/jsx2tokens'

import { removeComments } from '../utils/removeComments'
import { replaceQuotes } from '../utils/replaceQuotes'
import { getDelimeter } from '../utils/getDelimeter'

import { source2Tokens } from './lib/source2Tokens'
import { schema2Inject } from './lib/schema2Inject'

import { CssProgram, TypeSchema } from './classes/CssProgram'

export const style = (
  source: string,
  {
    js = false,
    calc = false,
    global = true,
    scoper,
    externalCss = true
  }: {
    js?: boolean | string
    calc?: boolean | 'all'
    global?: boolean
    scoper?: string
    externalCss?: boolean
  } = {}
): {
  needScoper: boolean
  cssExternal: string
  cssNoVars: string
  cssJsVars: string
} => {
  source = trim(removeComments(source))
  const __d__ = getDelimeter(source, 'js', 'lowers')

  let jsVars: [number, string][] = []
  if (js) {
    js = isString(js) ? trim(js) : 'var'
    let jsi = 0
    const jsInjects: { [key: string]: number } = {}
    source = source.replace(
      regexp(
        `((?:--|:)?\\b${js}\\(\\s*)?((\`|'|")(?:[^\\\\]|\\\\\\3|\\\\(?!\\3).)*?(?:\\3|$))(\\s*\\))?`,
        'g'
      ),
      // /(:?\bvar\(\s*)?((`|'|")(?:[^\\]|\\\3|\\(?!\3).)*?(?:\3|$))(\s*\))?/g,
      (_full, _start, _jsStr, _3, _end) => {
        if (_start && _end) {
          const key = stringifyTokens(
            trimCircleBrackets(
              removeExtraSpaces(
                jsx2tokens(trim(jsonParse(replaceQuotes(_jsStr))))
              )
            )
          )
          if (!(key in jsInjects)) jsInjects[key] = jsi++
          _full = __d__ + jsInjects[key] + __d__
        }
        return _full
      }
    )

    jsVars = keys(jsInjects || {})
      .map((v) => [jsInjects![v], v])
      .sort((a: any, b: any) => a[0] - b[0]) as any
    // console.log(source)
    // console.log(jsonStringify(jsVars))
  }

  const tokens = source2Tokens(source)
  const program = new CssProgram(tokens)
  // console.log(program.toCode())

  const schemaNoVars: TypeSchema = []
  const schemaJsVars: TypeSchema = []

  let needScoper = false
  forEachLeft(program.toSchema(), (node) => {
    if (!needScoper) {
      const selector = last(node[1])
      if (isArray(selector)) {
        needScoper =
          includes(selector, ':scoped') ||
          !global && includes(selector, ':stated')
      }
    }
    (('' + node).indexOf(__d__) > -1 ? schemaJsVars : schemaNoVars).push(node)
  })

  // console.log('needScoper', needScoper)
  // console.log(schemaNoVars, schemaJsVars)

  // prettier-ignore
  let cssExternal = '', cssNoVars = '', cssJsVars = ''
  const options = { calc, global }
  if (externalCss) {
    cssExternal = CssProgram.toCode(schemaNoVars, { global, scoper })
  } else cssNoVars = schema2Inject(schemaNoVars, __d__, [], options)
  cssJsVars = schema2Inject(schemaJsVars, __d__, jsVars, options)

  return { needScoper, cssExternal, cssNoVars, cssJsVars }
}
