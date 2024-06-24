import { TypeToken, TOKEN_SPACE, TOKEN_PUCNTUATOR } from './jsx2tokens'

// let n = 0
// const fn = (): number => (n < 9 || (n = 0), ++n)
const isTrimedSpace = (token: TypeToken, salt: number): boolean | number =>
  token.type !== TOKEN_PUCNTUATOR || /[^-+)}\]]/.test(token.value) && salt

export const removeExtraSpaces = (
  tokens: TypeToken[]
): TypeToken[] => {
  let token: TypeToken, tokenLast: TypeToken, tokenNext: TypeToken

  for (let i = tokens.length; i-- > 0;) {
    if ((token = tokens[i]).type === TOKEN_SPACE) {
      if (
        !(tokenLast = tokens[i - 1]) ||
        !(tokenNext = tokens[i + 1]) ||
        isTrimedSpace(tokenLast, 1) !== isTrimedSpace(tokenNext, 2)
      ) {
        tokens.splice(i, 1)
      } else {
        token.value = /[\r\n\u2028\u2029]/.test(token.value) ? '\n' : ' '
      }
    }
  }
  return tokens
}
