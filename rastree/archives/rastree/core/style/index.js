/* eslint-disable */
/*
dester builds:
core/style/index.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var jsonParse = require('@wareset-utilites/lang/jsonParse');

var includes = require('@wareset-utilites/array/includes');

var isString = require('@wareset-utilites/is/isString');

var isArray = require('@wareset-utilites/is/isArray');

var trim = require('@wareset-utilites/string/trim');

var keys = require('@wareset-utilites/object/keys');

var last = require('@wareset-utilites/array/last');

var regexp = require('@wareset-utilites/regexp');

var jsx2tokens = require('@rastree/jsx2tokens');

var removeComments = require('../utils/removeComments');

var replaceQuotes = require('../utils/replaceQuotes');

var getDelimeter = require('../utils/getDelimeter');

var source2Tokens = require('./lib/source2Tokens');

var schema2Inject = require('./lib/schema2Inject');

var CssProgram = require('./classes/CssProgram');
/* filename: core/style/index.ts
  timestamp: 2022-01-22T03:47:35.916Z */


var style = (source, {
  js = false,
  calc = false,
  global = true,
  scoper,
  externalCss = true
} = {}) => {
  source = trim.trim(removeComments.removeComments(source));

  var __d__ = getDelimeter.getDelimeter(source, 'js', 'lowers');

  var jsVars = [];

  if (js) {
    js = isString.isString(js) ? trim.trim(js) : 'var';
    var jsi = 0;
    var jsInjects = {};
    source = source.replace(regexp.regexp("((?:--|:)?\\b" + js + "\\(\\s*)?((`|'|\")(?:[^\\\\]|\\\\\\3|\\\\(?!\\3).)*?(?:\\3|$))(\\s*\\))?", 'g'), // /(:?\bvar\(\s*)?((`|'|")(?:[^\\]|\\\3|\\(?!\3).)*?(?:\3|$))(\s*\))?/g,
    (_full, _start, _jsStr, _3, _end) => {
      if (_start && _end) {
        var key = jsx2tokens.stringifyTokens(jsx2tokens.trimCircleBrackets(jsx2tokens.removeExtraSpaces(jsx2tokens.jsx2tokens(trim.trim(jsonParse.jsonParse(replaceQuotes.replaceQuotes(_jsStr)))).tokens)));
        if (!(key in jsInjects)) jsInjects[key] = jsi++;
        _full = __d__ + jsInjects[key] + __d__;
      }

      return _full;
    });
    jsVars = keys.keys(jsInjects || {}).map(v => [jsInjects[v], v]).sort((a, b) => a[0] - b[0]); // console.log(source)
    // console.log(jsonStringify(jsVars))
  }

  var tokens = source2Tokens.source2Tokens(source);
  var program = new CssProgram.CssProgram(tokens); // console.log(program.toCode())

  var schemaNoVars = [];
  var schemaJsVars = [];
  var needScoper = false;
  forEachLeft.forEachLeft(program.toSchema(), node => {
    if (!needScoper) {
      var selector = last.last(node[1]);

      if (isArray.isArray(selector)) {
        needScoper = includes.includes(selector, ':scoped') || !global && includes.includes(selector, ':stated');
      }
    }

    (('' + node).indexOf(__d__) > -1 ? schemaJsVars : schemaNoVars).push(node);
  }); // console.log('needScoper', needScoper)
  // console.log(schemaNoVars, schemaJsVars)
  // prettier-ignore

  var cssExternal = '',
      cssNoVars = '',
      cssJsVars = '';
  var options = {
    calc,
    global
  };

  if (externalCss) {
    cssExternal = CssProgram.CssProgram.toCode(schemaNoVars, {
      global,
      scoper
    });
  } else cssNoVars = schema2Inject.schema2Inject(schemaNoVars, __d__, [], options);

  cssJsVars = schema2Inject.schema2Inject(schemaJsVars, __d__, jsVars, options);
  return {
    needScoper,
    cssExternal,
    cssNoVars,
    cssJsVars
  };
};

exports.style = style;
