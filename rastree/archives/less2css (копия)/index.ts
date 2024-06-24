import {
  TypeToken,
  jsx2tokens,
  // stringifyTokens,
  TOKEN_TYPES as TYPES
} from '../jsx2tokens'

import { safeRemoveQuotes } from '../utilites'

// @ts-ignore
import less from 'less'

function buildCss(s: string, cid: string, REPLACERS: { [key: string]: string }): string {
  return '`' + s.replace(/(`|\${)|(_reasecid_)|(_reasecss_\d+_)/g,
    function(_f, needSlash, scope, replacer) {
      return needSlash ? '\\' + needSlash
        : scope ? '${_' + cid + '}'
          : replacer in REPLACERS ? '${' + REPLACERS[replacer] + '}'
            : replacer
    }).trim() + '`'
}
export function less2css(
  source: string, cid: string, isGlobal: boolean
): string {
  source = source.trim()
  if (source[0] !== '`') throw source
  const tokens = jsx2tokens(source, { useJSX: false })
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
      token.type = TYPES.MODIFIER
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

  let css = ''
  less.render(
    code,
    { sync: true, compress: true },
    function(_: any, res: any) {
      css = res.css
      // console.log(res)
    }
  )

  if (!isGlobal) {
    css = css.replace(/(\.[^\s>+,~{}();'"`]+)(?=[^{}();'"`]*{)/g, '$1_reasecid_')
  }

  return buildCss(css, cid, REPLACERS)
}

// const CSS_VALUE_REGEX = /[:;{}]|\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|((?:(`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$)|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*(?:\)|$))*(?:\)|$))*(?:\)|$)|[^{};:/\r\n]|\/(?![/*]))+)/g

// const compileCss = (source: string): any => {
//   CSS_VALUE_REGEX.lastIndex = 0
//   for (let matches: RegExpMatchArray, s: string; matches = CSS_VALUE_REGEX.exec(source);) {
//     s = matches[0].trim()
//     console.log(s)
//   }
// }
