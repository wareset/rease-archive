/* eslint-disable */
/*
dester builds:
core/template/lib/parseAttributes.ts
*/
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { trimTokens, TOKEN_SPACE, stringifyTokens } from '@rastree/jsx2tokens';
/* filename: core/template/lib/parseAttributes.ts
  timestamp: 2022-01-22T03:47:48.516Z */

var parseAttributes = tokens => {
  // const tokens: TypeToken[] = getTokens(tokensOrString, true)
  trimTokens(tokens);
  var token, j;
  var i = tokens.length;

  var fix = n => {
    if ((token = tokens[i + n]) && token.type === TOKEN_SPACE) {
      tokens.splice(i + n, 1), j++;
    }
  };

  while (i-- > 0) {
    if ((token = tokens[i]) && !token.deep && token.value === '=') {
      j = 0, fix(1), fix(-1), i += j;
    }
  }

  var tmp1; // , tmp2: any

  var cur = [];
  var attr = [cur];
  var attrList = [attr];
  forEachLeft(tokens, token => {
    if (!token.deep && ((tmp1 = token.value === '=') || token.type === TOKEN_SPACE || token.value === ',')) {
      trimTokens(cur);
      if (tmp1) cur.length && attr.push(cur = []);else attr[0].length && attrList.push(attr = [cur = []]);
    } else cur.push(token);
  });
  trimTokens(cur); // if (!cur.length) attr.pop()

  if (attr[0] && !attr[0].length) attr.pop();
  if (attrList[0] && !attrList[0].length) attrList.pop();
  return attrList.map(v => v.map(stringifyTokens));
};

export { parseAttributes };
