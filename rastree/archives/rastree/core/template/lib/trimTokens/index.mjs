/* eslint-disable */
/*
dester builds:
core/template/lib/trimTokens.ts
*/
import { last } from '@wareset-utilites/array/last';
import { getTokens } from '../utils';
import { TOKEN_SPACE } from '../source2Tokens';
/* filename: core/template/lib/trimTokens.ts
  timestamp: 2022-01-21T16:28:05.559Z */

var trimTokens = (tokensOrString, clone) => {
  var tokens = getTokens(tokensOrString, clone);
  var token;

  var fix = () => token.type === TOKEN_SPACE || /^[,;]$/.test(token.value);

  while ((token = last(tokens)) && fix()) {
    tokens.pop();
  }

  while ((token = tokens[0]) && fix()) {
    tokens.shift();
  }

  return tokens;
};

export { trimTokens };
