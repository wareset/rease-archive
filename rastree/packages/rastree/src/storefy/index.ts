// import {
//   jsx2tokens, TypeToken,
//   stringifyTokens, trimTokens, prevRealTokenIndex, nextRealTokenIndex,
//   TYPES.PUCNTUATOR, trimCircleBrackets
// } from '@rastree/jsx2tokens'

// const __getStoreValue__ = (
//   tokens: TypeToken[], last: number, stores: string[], salt: string
// ): number => {
//   const token = tokens[last]
//   const deep = token.deep

//   let i = last
//   for (let token2: TypeToken, deep2 = deep; i-- > 0;) {
//     token2 = tokens[i]
//     if (deep === deep2) {
//       if (token2.type === TYPES.PUCNTUATOR && !/^[.})\]]$/.test(token2.value)) break
//     }
//     deep2 = token2.deep
//   }

//   const store = stringifyTokens(tokens.splice(++i, last - i).slice(0, -1)).trim()
//   let idx = stores.indexOf(store)
//   if (idx < 0) idx = stores.length, stores.push(store)
//   token.value = salt + '[' + idx + ']'
//   return i
// }

// export const storefyExpression = (
//   source: string, rease: string, rxkey: string, salt: string | number
// ): [string, boolean] => {
//   salt = rease + salt
//   const tokens = trimTokens(jsx2tokens(source))

//   const stores: string[] = []
//   for (let i = tokens.length, j: number; i-- > 0;) {
//     if (i && tokens[i].value.match(rxkey) &&
//     (j = prevRealTokenIndex(tokens, i)) > -1 && tokens[j].value === '.' &&
//     (j = prevRealTokenIndex(tokens, j)) > -1 && tokens[j].value !== rease &&
//     ((j = nextRealTokenIndex(tokens, i)) < 0 || !/^(?:=|[^=]=)$/.test(tokens[j].value))) {
//       i = __getStoreValue__(tokens, i, stores, salt)
//     }
//   }

//   let res: string
//   let isStore = false
//   if (stores.length) {
//     isStore = true
//     // const attrs = stores.map((_, k) => salt + k).join(', ')
//     const data = stringifyTokens(trimCircleBrackets(tokens)).trim()
//     if (stores.length === 1 && salt + '[0]' === data) res = stores[0]
//     else res = `${rease}.r([${stores.join(', ')}], (${salt}) => (${data}))`
//   } else {
//     res = stringifyTokens(tokens).trim()
//   }

//   return [res, isStore]
// }

// export const STOREFY_COMMENT_MARKER = '/*rease.r*/'

// export const storefy = (
//   source: string, rease: string = 'rease', rxkey = '\\$|value|subscribe'
// ): string => {
//   rxkey = `^(?:${rxkey})$`
//   let i = 1
//   let isStore = false
//   let res: [string, boolean] = [source, isStore]
//   while ((res = storefyExpression(res[0], rease, rxkey, i))[1] && i++ < 9) {
//     isStore = isStore || res[1]
//   }
//   if (isStore) res[0] = STOREFY_COMMENT_MARKER + res[0]
//   return res[0]
// }

// export const isStorefy = (v: any): boolean =>
//   (v += '').indexOf(STOREFY_COMMENT_MARKER) > -1

// export default storefy

import {
  jsx2tokens, TypeToken,
  trimCircleBrackets, trimTokens,
  stringifyTokens, prevRealTokenIndex,
  TOKEN_TYPES as TYPES
} from '../jsx2tokens'

function isNot2(token: TypeToken | null): boolean {
  return !token || token.type === TYPES.PUCNTUATOR && /[^.})\]!]$/.test(token.value)
  // token.type === TYPES.TEMPLATE_HEAD || token.type === TYPES.TEMPLATE_MIDDLE ||
  // token.type === TYPES.MODIFIER
}
function __getStoreValue__(
  tokens: TypeToken[], last: number, stores: string[], salt: string
): number {
  const token = tokens[last]
  const deep = token.deep

  let i = last++
  for (let token2: TypeToken, deep2 = deep; i-- > 0;) {
    token2 = tokens[i]
    if (deep > token2.deep) break
    if (deep === deep2) {
      if (token2.type === TYPES.PUCNTUATOR && !/^[.})\]!]$/.test(token2.value)
      // token.type === TYPES.TEMPLATE_HEAD || token.type === TYPES.TEMPLATE_MIDDLE ||
      // token.type === TYPES.MODIFIER
      ) {
        break
      }
    }
    deep2 = token2.deep
  }
  i++

  while (tokens[i] && (tokens[i].value === '!' ||
    tokens[i].type === TYPES.SPACE ||
    tokens[i].type === TYPES.COMMENT_LINE ||
    tokens[i].type === TYPES.COMMENT_BLOCK)) i++

  const store = stringifyTokens(tokens.splice(i, last - i - 1)) + tokens[i].value // .trim()
  // console.log(22, [store])
  let idx = stores.indexOf(store)
  if (idx < 0) idx = stores.length, stores.push(store)
  tokens[i].value = salt + '[' + idx + ']'
  return i
}

export function storefyExpression(
  source: string, rease: string, useJSX = true
): [string, number] {
  const identifiers: any = {}
  const tokens = trimTokens(jsx2tokens(source, {
    useJSX,
    proxy(token) {
      if (token.type === TYPES.IDENTIFIER) identifiers[token.value] = true
    }
  }))
  // console.log(tokens)
  // throw tokens

  let n = 0
  let salt = '_$'
  while (salt + n in identifiers) n++
  salt += n

  const stores: string[] = []
  for (let i = tokens.length, j: number; i-- > 0;) {
    if (i && tokens[i].value === '!' &&
    (j = prevRealTokenIndex(tokens, i)) > -1 && tokens[j].value === '!' &&
    (j = prevRealTokenIndex(tokens, j)) > -1 && tokens[j].deep === tokens[i].deep &&
    !isNot2(tokens[j])) {
      tokens.splice(j + 1, i - j)
      i = __getStoreValue__(tokens, j, stores, salt)
    }
  }

  let res: string
  let isStore = 0
  if (stores.length) {
    isStore++
    const data = stringifyTokens(trimCircleBrackets(tokens)).trim()
    if (stores.length === 1 && salt + '[0]' === data) res = stores[0]
    else res = `${rease}([${stores.join(', ')}], (${salt}) => (${data}))`, isStore++
  } else {
    res = stringifyTokens(tokens).trim()
  }
  // console.log([res, isStore])
  return [res, isStore]
}

export const STOREFY_COMMENT_MARKER_STRICT = '/*r2.$*/'
export const STOREFY_COMMENT_MARKER_MAYBE = '/*r1.$*/'

export function storefy(
  source: string, rease: string = '_$', useJSX = true
): string {
  // console.log(source)
  let i = 1
  let isStore = 0
  let res: [string, number] = [source, isStore]
  while ((res = storefyExpression(res[0], rease, useJSX))[1] && i++ < 99) {
    isStore = isStore > res[1] ? isStore : res[1]
  }
  if (isStore) {
    res[0] =
      (isStore > 1 ? STOREFY_COMMENT_MARKER_STRICT : STOREFY_COMMENT_MARKER_MAYBE) + res[0]
  }
  return res[0]
}

export function isStorefy(v: any): boolean {
  return (v += '').indexOf(STOREFY_COMMENT_MARKER_STRICT) === 0
}
export function isStorefyForExpo(v: any): boolean {
  return (v += '').indexOf(STOREFY_COMMENT_MARKER_MAYBE) === 0 || isStorefy(v)
}
