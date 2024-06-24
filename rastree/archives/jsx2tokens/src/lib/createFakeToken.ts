import { TypeToken, TypeTokenType, jsx2tokens } from './jsx2tokens'

export const createFakeToken = (
  value: string, deep: number, type?: TypeTokenType, rangeAndLoc?: boolean
): TypeToken => ({
  deep,
  type: type || jsx2tokens(value)[0].type,
  value,
  ...rangeAndLoc && {
    range: [-1, -1],
    loc  : { start: { line: -1, column: 0 }, end: { line: -1, column: -1 } }
  }
} as TypeToken)
