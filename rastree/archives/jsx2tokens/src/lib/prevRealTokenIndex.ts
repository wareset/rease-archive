import {
  TypeToken,
  TOKEN_SPACE,
  TOKEN_COMMENT_LINE, TOKEN_COMMENT_BLOCK
} from './jsx2tokens'

export const prevRealTokenIndex = (
  tokens: TypeToken[],
  currentIndex: number
): number => {
  while (currentIndex-- > 0) {
    if (tokens[currentIndex] &&
      tokens[currentIndex].type !== TOKEN_SPACE &&
      tokens[currentIndex].type !== TOKEN_COMMENT_LINE &&
      tokens[currentIndex].type !== TOKEN_COMMENT_BLOCK
    ) break
  }
  return currentIndex
}
