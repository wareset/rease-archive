/* eslint-disable */
/*
dester builds:
core/template/lib/normalizeTokens.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var utils = require('../utils');

var source2Tokens = require('../source2Tokens');

var n = 0;

var fn = () => (n < 9 || (n = 0), ++n);

var isTrimedSpace = token => token.type !== source2Tokens.TOKEN_PUCNTUATOR || /[^-+]/.test(token.value) && fn();

var normalizeTokens = (tokensOrString, clone) => {
  var tokens = utils.getTokens(tokensOrString, clone);
  var token, tokenLast, tokenNext;
  var i = tokens.length;

  while (i--) {
    if ((token = tokens[i]) && token.type === source2Tokens.TOKEN_SPACE) {
      if (!(tokenLast = tokens[i - 1]) || !(tokenNext = tokens[i + 1]) || isTrimedSpace(tokenLast) !== isTrimedSpace(tokenNext)) {
        tokens.splice(i, 1);
      } else {
        token.value = /[\r\n\u2028\u2029]/.test(token.value) ? '\n' : ' ';
      }
    }
  }

  return tokens;
};

exports.normalizeTokens = normalizeTokens;
