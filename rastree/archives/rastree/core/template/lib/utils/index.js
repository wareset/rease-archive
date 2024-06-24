/* eslint-disable */
/*
dester builds:
core/template/lib/utils.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var isArray = require('@wareset-utilites/is/isArray');

var source2Tokens = require('../source2Tokens');

var clone = require('../../../utils/clone');
/* filename: core/template/lib/utils.ts
  timestamp: 2022-01-21T16:28:06.650Z */


var getTokens = (tokensOrString, isClone) => isArray.isArray(tokensOrString = tokensOrString || []) ? isClone ? clone.clone(tokensOrString) : tokensOrString : source2Tokens.source2Tokens(tokensOrString).tokens;

exports.getTokens = getTokens;
