/* eslint-disable */
/*
dester builds:
core/style/index.ts
*/
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { jsonParse } from '@wareset-utilites/lang/jsonParse';
import { includes } from '@wareset-utilites/array/includes';
import { isString } from '@wareset-utilites/is/isString';
import { isArray } from '@wareset-utilites/is/isArray';
import { trim } from '@wareset-utilites/string/trim';
import { keys } from '@wareset-utilites/object/keys';
import { last } from '@wareset-utilites/array/last';
import { regexp } from '@wareset-utilites/regexp';
import { stringifyTokens, trimCircleBrackets, removeExtraSpaces, jsx2tokens } from '@rastree/jsx2tokens';
import { removeComments } from '../utils/removeComments';
import { replaceQuotes } from '../utils/replaceQuotes';
import { getDelimeter } from '../utils/getDelimeter';
import { source2Tokens } from './lib/source2Tokens';
import { schema2Inject } from './lib/schema2Inject';
import { CssProgram } from './classes/CssProgram';
/* filename: core/style/index.ts
  timestamp: 2022-01-22T03:47:35.916Z */

var style = (source, {
  js = false,
  calc = false,
  global = true,
  scoper,
  externalCss = true
} = {}) => {
  source = trim(removeComments(source));

  var __d__ = getDelimeter(source, 'js', 'lowers');

  var jsVars = [];

  if (js) {
    js = isString(js) ? trim(js) : 'var';
    var jsi = 0;
    var jsInjects = {};
    source = source.replace(regexp("((?:--|:)?\\b" + js + "\\(\\s*)?((`|'|\")(?:[^\\\\]|\\\\\\3|\\\\(?!\\3).)*?(?:\\3|$))(\\s*\\))?", 'g'), // /(:?\bvar\(\s*)?((`|'|")(?:[^\\]|\\\3|\\(?!\3).)*?(?:\3|$))(\s*\))?/g,
    (_full, _start, _jsStr, _3, _end) => {
      if (_start && _end) {
        var key = stringifyTokens(trimCircleBrackets(removeExtraSpaces(jsx2tokens(trim(jsonParse(replaceQuotes(_jsStr)))).tokens)));
        if (!(key in jsInjects)) jsInjects[key] = jsi++;
        _full = __d__ + jsInjects[key] + __d__;
      }

      return _full;
    });
    jsVars = keys(jsInjects || {}).map(v => [jsInjects[v], v]).sort((a, b) => a[0] - b[0]); // console.log(source)
    // console.log(jsonStringify(jsVars))
  }

  var tokens = source2Tokens(source);
  var program = new CssProgram(tokens); // console.log(program.toCode())

  var schemaNoVars = [];
  var schemaJsVars = [];
  var needScoper = false;
  forEachLeft(program.toSchema(), node => {
    if (!needScoper) {
      var selector = last(node[1]);

      if (isArray(selector)) {
        needScoper = includes(selector, ':scoped') || !global && includes(selector, ':stated');
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
    cssExternal = CssProgram.toCode(schemaNoVars, {
      global,
      scoper
    });
  } else cssNoVars = schema2Inject(schemaNoVars, __d__, [], options);

  cssJsVars = schema2Inject(schemaJsVars, __d__, jsVars, options);
  return {
    needScoper,
    cssExternal,
    cssNoVars,
    cssJsVars
  };
};

export { style };
