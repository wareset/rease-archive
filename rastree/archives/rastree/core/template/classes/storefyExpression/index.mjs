/* eslint-disable */
/*
dester builds:
core/template/classes/storefyExpression.ts
*/
import { stringifyTokens, trimCircleBrackets, TOKEN_PUCNTUATOR } from '@rastree/jsx2tokens';
/* filename: core/template/classes/storefyExpression.ts
  timestamp: 2022-01-22T03:47:45.155Z */
// import { getTokens } from '../lib/utils'
// import { jsx2tokens } from '../lib/jsx2tokens'

var STOREFY = '_$';

var __getStoreValue__ = (tokens, last, stores, salt) => {
  var token = tokens[last];
  var deep = token.deep;
  var i = last;

  for (var token2, deep2 = deep; i-- > 0;) {
    token2 = tokens[i];

    if (deep === deep2) {
      if (token2.type === TOKEN_PUCNTUATOR && !/^[.})\]]$/.test(token2.value)) break;
    }

    deep2 = token2.deep;
  }

  var store = stringifyTokens(tokens.splice(++i, last - i).slice(0, -1)).trim();
  var idx = stores.indexOf(store);
  if (idx < 0) idx = stores.length, stores.push(store);
  token.value += salt + idx;
  return i;
};

var storefyExpression = (tokens, salt) => {
  // const tokens: TypeToken[] = getTokens(tokensOrString, clone)
  var stores = [];

  for (var i = tokens.length; i-- > 0;) {
    if (i && tokens[i].value === '$' && tokens[i - 1].value === '.') {
      i = __getStoreValue__(tokens, i, stores, salt);
    }
  }

  var res;

  if (stores.length) {
    var attrs = stores.map((_, k) => '$' + salt + k).join(', ');
    var data = stringifyTokens(trimCircleBrackets(tokens)).trim();
    if (stores.length === 1 && attrs === data) res = stores[0];else res = STOREFY + salt + ".s([" + stores.join(', ') + "], (" + attrs + ") => (" + data + "))";
  } else {
    res = '(' + stringifyTokens(trimCircleBrackets(tokens)).trim() + ')';
  }

  console.log([res]);
  return res;
};

export { STOREFY, storefyExpression };
