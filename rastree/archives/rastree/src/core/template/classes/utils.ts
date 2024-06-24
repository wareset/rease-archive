import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { jsonParse } from '@wareset-utilites/lang/jsonParse'
import { repeat } from '@wareset-utilites/string/repeat'
import { trim } from '@wareset-utilites/string/trim'

import { TypeToken } from '@rastree/jsx2tokens'
// import { getDelimeter } from '../../utils/getDelimeter'

// export const VAL_STORE = '_$'
// export const VAL_TAG = '_tg'
// export const VAL_TEXT = '_tx'

export const offset = (count: number): string => repeat('  ', count)

// prettier-ignore
export const normalizeDeep = (tokens: TypeToken[], deep?: number): TypeToken[] => (
  tokens[0] && (deep = tokens[0].deep) &&
    forEachLeft(tokens, (token) => {
      token.deep -= deep!
    }), tokens)

export const isLiteral = (v: string): boolean => {
  try {
    jsonParse(v)
    return true
  } catch (e) {
    /* */
  }
  return false
}

// prettier-ignore
const __jsonParseTry__ = (v: string): string => {
  try {
    v = jsonParse(v)
  } catch (e) {
    v = v.slice(1, -1)
  }
  return v
}
// prettier-ignore
export const fixArgsValue = (v: string): string =>
  (v = trim(v, '\\s+'))[0] === '"'
    ? fixArgsValue(__jsonParseTry__(v))
    : v[0] === '(' ? fixArgsValue(v.slice(1, -1)) : v
