import { TypeToken } from './jsx2tokens'

export const stringifyTokens = (tokens: TypeToken[]): string =>
  tokens.map((v) => v.value).join('')
