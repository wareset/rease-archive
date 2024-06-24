/* eslint-disable */
/*
dester builds:
core/style/lib/schema2Inject.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var regexp = require('@wareset-utilites/regexp');

var jsx2tokens = require('@rastree/jsx2tokens');

var clone = require('../../../utils/clone');

var calcVariables = require('../calcVariables');

var CssProgram = require('../../classes/CssProgram');

var storefyExpression = require('../../../template/classes/storefyExpression');
/* filename: core/style/lib/schema2Inject.ts
  timestamp: 2022-01-22T03:47:38.418Z */


var schema2Inject = (schema, salt, jsVars, {
  calc = true,
  global = true
} = {}) => {
  schema = clone.clone(schema);
  var jsattr = salt + 'A';
  var jsscoper = salt + 'S';
  var jsinject = salt + 'I';
  var res = '';

  if (schema.length) {
    forEachLeft.forEachLeft(schema, v => {
      v[2][0] = jsattr + '%' + v[2][0] + '%' + jsattr;

      if (calc) {
        v[2][1] = calcVariables.calcVariables(v[2][1], calc !== 'all');
      }
    });
    var isJsVars = jsVars && jsVars.length > 0;
    var isScoper; // = isJsVars

    res += jsonStringify.jsonStringify(CssProgram.CssProgram.toCode(schema, {
      minify: true,
      scoper: jsscoper,
      global
    })).replace(regexp.regexp("(" + jsscoper + ")|" + jsattr + "%([^]*?)%" + jsattr + "\\s*:?|" + salt + "(\\d+)" + salt, 'g'), (_full, _jsscoper, _jsattr, _jsinject) => {
      if (_jsscoper) _full = "\" + _" + jsscoper + " + \"", isScoper = true;else if (_jsattr) _full = "\" + _" + jsattr + "(\"" + _jsattr + "\") + \"";else if (_jsinject) _full = "\" + _" + jsinject + "[" + _jsinject + "] + \"";
      return _full;
    });

    if (isJsVars) {
      res = "[[" + jsVars.map(v => storefyExpression.storefyExpression(jsx2tokens.jsx2tokens(v[1]).tokens, salt)).join(', ') + "], (_" + jsinject + ") => (" + res + ")]";
    }

    var fn = "_" + jsattr;
    if (isScoper) fn += ", _" + jsscoper;
    if (isJsVars) fn += ", " + (storefyExpression.STOREFY + salt);
    res = "(" + fn + ") => (" + res + ")";
  }

  return res;
};

exports.schema2Inject = schema2Inject;
