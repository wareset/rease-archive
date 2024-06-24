import { trimArrayBy, trimLeftArrayBy, trimRightArrayBy } from '@rastree/utilites'

import {
  TypeToken,
  TOKEN_SPACE, TOKEN_COMMENT_LINE, TOKEN_COMMENT_BLOCK
} from './jsx2tokens'

const __needRemoveToken__ = (token: TypeToken): boolean =>
  token.type === TOKEN_SPACE ||
  token.type === TOKEN_COMMENT_LINE || token.type === TOKEN_COMMENT_BLOCK ||
  /^[,;]$/.test(token.value)

export const trimLeftTokens = (
  tokens: TypeToken[]
): TypeToken[] => trimLeftArrayBy(tokens, __needRemoveToken__)

export const trimRightTokens = (
  tokens: TypeToken[]
): TypeToken[] => trimRightArrayBy(tokens, __needRemoveToken__)
  
export const trimTokens = (
  tokens: TypeToken[]
): TypeToken[] => trimArrayBy(tokens, __needRemoveToken__)
