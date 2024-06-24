/* eslint-disable */
/*
dester builds:
core/template/lib/trimTokens.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var last = require('@wareset-utilites/array/last');

var utils = require('../utils');

var source2Tokens = require('../source2Tokens');
/* filename: core/template/lib/trimTokens.ts
  timestamp: 2022-01-21T16:28:05.559Z */


var trimTokens = (tokensOrString, clone) => {
  var tokens = utils.getTokens(tokensOrString, clone);
  var token;

  var fix = () => token.type === source2Tokens.TOKEN_SPACE || /^[,;]$/.test(token.value);

  while ((token = last.last(tokens)) && fix()) {
    tokens.pop();
  }

  while ((token = tokens[0]) && fix()) {
    tokens.shift();
  }

  return tokens;
};

exports.trimTokens = trimTokens;
