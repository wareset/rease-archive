import { TypeToken } from './jsx2tokens'
import { trimTokens } from './trimTokens'

export const trimCircleBrackets = (
  tokens: TypeToken[]
): TypeToken[] => {
  trimTokens(tokens)

  if (
    tokens.length &&
    tokens[0].value === '(' &&
    tokens[tokens.length - 1].value === ')' &&
    tokens.every((v, k, a) => k < 1 || k === a.length - 1 || v.deep > a[0].deep)
    // (v.deep - 1 !== a[0].deep || v.type !== TOKEN_PUCNTUATOR || !/^[,{}]$|=/.test(v.value)))
  ) {
    tokens.shift(), tokens.pop(), trimTokens(tokens)
    tokens.forEach((v) => {
      v.deep--
    })
  }

  return tokens
}
