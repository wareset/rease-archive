import {
  TypeToken,
  TOKEN_SPACE,
  TOKEN_COMMENT_LINE, TOKEN_COMMENT_BLOCK
} from './jsx2tokens'

export const nextRealTokenIndex = (
  tokens: TypeToken[],
  currentIndex: number
): number => {
  while (currentIndex++ < tokens.length) {
    if (tokens[currentIndex] &&
      tokens[currentIndex].type !== TOKEN_SPACE &&
      tokens[currentIndex].type !== TOKEN_COMMENT_LINE &&
      tokens[currentIndex].type !== TOKEN_COMMENT_BLOCK
    ) break
  }
  return currentIndex < tokens.length ? currentIndex : -1
}
