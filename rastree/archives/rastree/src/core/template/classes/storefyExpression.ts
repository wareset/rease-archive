// import { findIndexLeft } from '@wareset-utilites/array/findIndexLeft'
// import { trim } from '@wareset-utilites/string/trim'

import {
  TypeToken, TOKEN_PUCNTUATOR,
  stringifyTokens, trimCircleBrackets
} from '@rastree/jsx2tokens'
// import { getTokens } from '../lib/utils'
// import { jsx2tokens } from '../lib/jsx2tokens'

export const STOREFY = '_$'

const __getStoreValue__ =
  (tokens: TypeToken[], last: number, stores: string[], salt: string): number => {
    const token = tokens[last]
    const deep = token.deep

    let i = last
    for (let token2, deep2 = deep; i-- > 0;) {
      token2 = tokens[i]
      if (deep === deep2) {
        if (token2.type === TOKEN_PUCNTUATOR && !/^[.})\]]$/.test(token2.value)) break
      }
      deep2 = token2.deep
    }

    const store = stringifyTokens(tokens.splice(++i, last - i).slice(0, -1)).trim()
    let idx = stores.indexOf(store)
    if (idx < 0) idx = stores.length, stores.push(store)
    token.value += salt + idx
    return i
  }

export const storefyExpression =
  (tokens: TypeToken[], salt: string): string => {
    // const tokens: TypeToken[] = getTokens(tokensOrString, clone)

    const stores: string[] = []
    for (let i = tokens.length; i-- > 0;) {
      if (i && tokens[i].value === '$' && tokens[i - 1].value === '.') {
        i = __getStoreValue__(tokens, i, stores, salt)
      }
    }

    let res: string
    if (stores.length) {
      const attrs = stores.map((_, k) => '$' + salt + k).join(', ')
      const data = stringifyTokens(trimCircleBrackets(tokens)).trim()
      if (stores.length === 1 && attrs === data) res = stores[0]
      else res = `${STOREFY + salt}.s([${stores.join(', ')}], (${attrs}) => (${data}))`
    } else {
      res = '(' + stringifyTokens(trimCircleBrackets(tokens)).trim() + ')'
    }

    console.log([res])
    return res
  }
