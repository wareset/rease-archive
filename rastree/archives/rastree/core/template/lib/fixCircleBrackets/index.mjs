/* eslint-disable */
/*
dester builds:
core/template/lib/fixCircleBrackets.ts
*/
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { last } from '@wareset-utilites/array/last';
import { trimTokens } from '../trimTokens';
import { getTokens } from '../utils';
import { TOKEN_PUCNTUATOR } from '../source2Tokens';
/* filename: core/template/lib/fixCircleBrackets.ts
  timestamp: 2022-01-21T16:27:59.088Z */

var fakePunctuator = (value, deep = 0) => ({
  deep,
  type: TOKEN_PUCNTUATOR,
  value,
  range: [-1, -1],
  loc: {
    start: {
      line: -1,
      column: 0
    },
    end: {
      line: -1,
      column: -1
    }
  }
}); // eslint-disable-next-line default-param-last


var needWrap = (tokens, deep = 0, noWrap) => tokens.some(v => v.deep <= deep && v.type === TOKEN_PUCNTUATOR && !(noWrap || /--|\+\+|[()[\].:]/.test(v.value)) // /[{};,?|&=]/.test(v.value)
);

var fixCircleBrackets = (tokensOrString, noWrap, clone) => {
  var tokens = getTokens(tokensOrString, clone);
  trimTokens(tokens);

  if (tokens[0] && tokens[0].value === '(' && last(tokens).value === ')' && !needWrap(tokens.slice(1, -1), tokens[0].deep + 1, noWrap)) {
    tokens.shift(), tokens.pop();
    forEachLeft(tokens, v => v.deep--);
    return fixCircleBrackets(tokens, noWrap, false);
  } // console.log(tokens)


  if (!noWrap && needWrap(tokens)) {
    forEachLeft(tokens, v => v.deep++);
    tokens.unshift(fakePunctuator('(')), tokens.push(fakePunctuator(')'));
  }

  return tokens;
};

export { fixCircleBrackets };
