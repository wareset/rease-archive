import {
  TypeToken,
  jsx2tokens,
  // stringifyTokens,
  TOKEN_MODIFIER
} from '@rastree/jsx2tokens'

import { safeRemoveQuotes } from '@rastree/utilites'

// @ts-ignore
import { render as lessRender } from 'less'

const buildCss = (s: string, REPLACERS: { [key: string]: string }): string =>
  '`\n' + s.replace(/(`|\${)|(_reasecss_\d+_)/g, (_f, needSlash, replacer) =>
    needSlash ? '\\' + needSlash
      : replacer in REPLACERS ? '${' + REPLACERS[replacer] + '}'
        : replacer).trim() + '\n`'

export const less2css = (source: string): string => {
  source = source.trim()
  if (source[0] !== '`') throw source
  const tokens = jsx2tokens(source, false)
  // console.log(source)
  // console.log(tokens)

  let counter = 0
  const deep0 = tokens[0].deep

  const REPLACERS: { [key: string]: string } = {}

  let repkey: string | null = null
  let code = ''
  for (let token: TypeToken, i = tokens.length; i-- > 0;) {
    token = tokens[i]
    if (token.deep === deep0) {
      repkey = null
      code = (token.value = safeRemoveQuotes(token.value)) + code
    } else if (repkey == null) {
      token.type = TOKEN_MODIFIER
      REPLACERS[repkey = `_reasecss_${counter++}_`] = token.value
      code = (token.value = repkey) + code
    } else {
      tokens.splice(i, 1)
      REPLACERS[repkey] = token.value + REPLACERS[repkey]
    }

    // console.log(token)
  }

  // console.log(REPLACERS)
  // console.log(code)

  // compileCss(code)

  let lesscode = ''
  lessRender(
    code,
    { sync: true },
    (_: any, res: any) => {
      lesscode = res.css
      console.log(res)
    }
  )

  return buildCss(lesscode, REPLACERS)
}

export default less2css

// const CSS_VALUE_REGEX = /[:;{}]|\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|((?:(`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$)|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*(?:\)|$))*(?:\)|$))*(?:\)|$)|[^{};:/\r\n]|\/(?![/*]))+)/g

// const compileCss = (source: string): any => {
//   CSS_VALUE_REGEX.lastIndex = 0
//   for (let matches: RegExpMatchArray, s: string; matches = CSS_VALUE_REGEX.exec(source);) {
//     s = matches[0].trim()
//     console.log(s)
//   }
// }
