/* eslint-disable */
/*
dester builds:
core/style/lib/schema2Inject.ts
*/
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify';
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { regexp } from '@wareset-utilites/regexp';
import { jsx2tokens } from '@rastree/jsx2tokens';
import { clone } from '../../../utils/clone';
import { calcVariables } from '../calcVariables';
import { CssProgram } from '../../classes/CssProgram';
import { storefyExpression, STOREFY } from '../../../template/classes/storefyExpression';
/* filename: core/style/lib/schema2Inject.ts
  timestamp: 2022-01-22T03:47:38.418Z */

var schema2Inject = (schema, salt, jsVars, {
  calc = true,
  global = true
} = {}) => {
  schema = clone(schema);
  var jsattr = salt + 'A';
  var jsscoper = salt + 'S';
  var jsinject = salt + 'I';
  var res = '';

  if (schema.length) {
    forEachLeft(schema, v => {
      v[2][0] = jsattr + '%' + v[2][0] + '%' + jsattr;

      if (calc) {
        v[2][1] = calcVariables(v[2][1], calc !== 'all');
      }
    });
    var isJsVars = jsVars && jsVars.length > 0;
    var isScoper; // = isJsVars

    res += jsonStringify(CssProgram.toCode(schema, {
      minify: true,
      scoper: jsscoper,
      global
    })).replace(regexp("(" + jsscoper + ")|" + jsattr + "%([^]*?)%" + jsattr + "\\s*:?|" + salt + "(\\d+)" + salt, 'g'), (_full, _jsscoper, _jsattr, _jsinject) => {
      if (_jsscoper) _full = "\" + _" + jsscoper + " + \"", isScoper = true;else if (_jsattr) _full = "\" + _" + jsattr + "(\"" + _jsattr + "\") + \"";else if (_jsinject) _full = "\" + _" + jsinject + "[" + _jsinject + "] + \"";
      return _full;
    });

    if (isJsVars) {
      res = "[[" + jsVars.map(v => storefyExpression(jsx2tokens(v[1]).tokens, salt)).join(', ') + "], (_" + jsinject + ") => (" + res + ")]";
    }

    var fn = "_" + jsattr;
    if (isScoper) fn += ", _" + jsscoper;
    if (isJsVars) fn += ", " + (STOREFY + salt);
    res = "(" + fn + ") => (" + res + ")";
  }

  return res;
};

export { schema2Inject };
