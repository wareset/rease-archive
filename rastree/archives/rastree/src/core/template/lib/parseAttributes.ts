import { forEachLeft } from '@wareset-utilites/array/forEachLeft'

import {
  TypeToken, TOKEN_SPACE,
  stringifyTokens, trimTokens
} from '@rastree/jsx2tokens'

export const parseAttributes = (
  tokens: TypeToken[]
): string[][] => {
  // const tokens: TypeToken[] = getTokens(tokensOrString, true)
  trimTokens(tokens)

  let token: TypeToken, j: number
  let i = tokens.length

  const fix = (n: number): void => {
    if ((token = tokens[i + n]) && token.type === TOKEN_SPACE) {
      tokens.splice(i + n, 1), j++
    }
  }
  while (i-- > 0) {
    if ((token = tokens[i]) && !token.deep && token.value === '=') {
      j = 0, fix(1), fix(-1), i += j
    }
  }

  let tmp1: any // , tmp2: any
  let cur: TypeToken[] = []
  let attr = [cur]
  const attrList = [attr]
  forEachLeft(tokens, (token) => {
    if (
      !token.deep &&
      ((tmp1 = token.value === '=') ||
        token.type === TOKEN_SPACE ||
        token.value === ',')
    ) {
      trimTokens(cur)
      if (tmp1) cur.length && attr.push(cur = [])
      else attr[0].length && attrList.push(attr = [cur = []])
    } else cur.push(token)
  })
  trimTokens(cur)
  // if (!cur.length) attr.pop()
  if (attr[0] && !attr[0].length) attr.pop()
  if (attrList[0] && !attrList[0].length) attrList.pop()

  return attrList.map((v) => v.map(stringifyTokens))
}
