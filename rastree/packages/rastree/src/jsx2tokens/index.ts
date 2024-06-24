export * from 'jsx2tokens'

import { jsx2tokens, TOKEN_TYPES as TYPES } from 'jsx2tokens'
import { TypeToken, TypeTokenType } from 'jsx2tokens'
export { TYPES }

import { trimArrayBy, trimLeftArrayBy, trimRightArrayBy } from '../utilites'

/*
createFakeToken
--------------------------------------------------------------------------------
*/
export function createFakeToken(
  value: string, deep: number, type?: TypeTokenType, rangeAndLoc?: boolean
): TypeToken {
  return {
    deep,
    type: type || jsx2tokens(value)[0].type,
    value,
    ...rangeAndLoc && {
      range: [-1, -1],
      loc  : { start: { line: -1, column: 0 }, end: { line: -1, column: -1 } }
    }
  } as TypeToken
}

/*
nextRealTokenIndex, prevRealTokenIndex
--------------------------------------------------------------------------------
*/
export function nextRealTokenIndex(
  tokens: TypeToken[],
  currentIndex: number
): number {
  while (currentIndex++ < tokens.length) {
    if (tokens[currentIndex] &&
      tokens[currentIndex].type !== TYPES.SPACE &&
      tokens[currentIndex].type !== TYPES.COMMENT_LINE &&
      tokens[currentIndex].type !== TYPES.COMMENT_BLOCK
    ) break
  }
  return currentIndex < tokens.length ? currentIndex : -1
}

export function prevRealTokenIndex(
  tokens: TypeToken[],
  currentIndex: number
): number {
  while (currentIndex-- > 0) {
    if (tokens[currentIndex] &&
      tokens[currentIndex].type !== TYPES.SPACE &&
      tokens[currentIndex].type !== TYPES.COMMENT_LINE &&
      tokens[currentIndex].type !== TYPES.COMMENT_BLOCK
    ) break
  }
  return currentIndex
}

// let n = 0
// const fn = (): number => (n < 9 || (n = 0), ++n)
function _isTrimedSpace(token: TypeToken, salt: number): boolean | number {
  return token.type !== TYPES.PUCNTUATOR || /[^-+)}\]]/.test(token.value) && salt
}
/*
removeExtraSpaces
--------------------------------------------------------------------------------
*/
export function removeExtraSpaces(
  tokens: TypeToken[]
): TypeToken[] {
  let token: TypeToken, tokenLast: TypeToken, tokenNext: TypeToken

  for (let i = tokens.length; i-- > 0;) {
    if ((token = tokens[i]).type === TYPES.SPACE) {
      if (
        !(tokenLast = tokens[i - 1]) ||
        !(tokenNext = tokens[i + 1]) ||
        _isTrimedSpace(tokenLast, 1) !== _isTrimedSpace(tokenNext, 2)
      ) {
        tokens.splice(i, 1)
      } else {
        token.value = /[\r\n\u2028\u2029]/.test(token.value) ? '\n' : ' '
      }
    }
  }
  return tokens
}

/*
stringifyTokens
--------------------------------------------------------------------------------
*/
export function stringifyTokens(tokens: TypeToken[]): string {
  return tokens.map((v) => v.value).join('')
}
/*
trimTokens, trimLeftTokens, trimRightTokens
--------------------------------------------------------------------------------
*/
function __needRemoveToken__(token: TypeToken): boolean {
  return token.type === TYPES.SPACE ||
  token.type === TYPES.COMMENT_LINE || token.type === TYPES.COMMENT_BLOCK ||
  /^[,;]$/.test(token.value)
}
export function trimLeftTokens(
  tokens: TypeToken[]
): TypeToken[] { return trimLeftArrayBy(tokens, __needRemoveToken__) }

export function trimRightTokens(
  tokens: TypeToken[]
): TypeToken[] { return trimRightArrayBy(tokens, __needRemoveToken__) }
  
export function trimTokens(
  tokens: TypeToken[]
): TypeToken[] { return trimArrayBy(tokens, __needRemoveToken__) }

function _every_(v: TypeToken, k: number, a: TypeToken[]): boolean {
  return k < 1 || k === a.length - 1 || v.deep > a[0].deep
}

function _deep_min_(v: TypeToken):void { v.deep-- }

/*
trimCircleBrackets
--------------------------------------------------------------------------------
*/
export function trimCircleBrackets(
  tokens: TypeToken[]
): TypeToken[] {
  trimTokens(tokens)
  
  if (
    tokens.length &&
      tokens[0].value === '(' &&
      tokens[tokens.length - 1].value === ')' &&
      tokens.every(_every_)
      // (v.deep - 1 !== a[0].deep || v.type !== TOKEN_PUCNTUATOR || !/^[,{}]$|=/.test(v.value)))
  ) {
    tokens.shift(), tokens.pop(), trimTokens(tokens)
    tokens.forEach(_deep_min_)
  }
  
  return tokens
}

/*
trimCurlyBrackets
--------------------------------------------------------------------------------
*/
export function trimCurlyBrackets(
  tokens: TypeToken[]
): TypeToken[] {
  trimTokens(tokens)

  if (
    tokens.length &&
    tokens[0].value === '{' &&
    tokens[tokens.length - 1].value === '}' &&
    tokens.every(_every_)
    // (v.deep - 1 !== a[0].deep || v.type !== TOKEN_PUCNTUATOR || !/^[,:]$|=/.test(v.value)))
  ) {
    tokens.shift(), tokens.pop(), trimTokens(tokens)
    tokens.forEach(_deep_min_)
  }

  return tokens
}
