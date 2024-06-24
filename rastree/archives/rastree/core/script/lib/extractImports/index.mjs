/* eslint-disable */
/*
dester builds:
core/script/lib/extractImports.ts
*/
import { forEachRight } from '@wareset-utilites/array/forEachRight';
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { startsWith } from '@wareset-utilites/string/startsWith';
import { jsonParse } from '@wareset-utilites/lang/jsonParse';
import { trim } from '@wareset-utilites/string/trim';
import { keys } from '@wareset-utilites/object/keys';
import { unique } from '@wareset-utilites/unique';
import { replaceQuotes } from '../../../utils/replaceQuotes';
import { removeComments } from '../../../utils/removeComments';
/* filename: core/script/lib/extractImports.ts
  timestamp: 2022-01-22T03:47:25.061Z */

var __REASE_COMPONENT__ = 'rease/component';

var fixReaseImportName = v => startsWith(v, __REASE_COMPONENT__) ? __REASE_COMPONENT__ : v;

var concatImports = (obj1, obj2) => {
  obj1 = { ...obj1
  };
  obj2 && forEachLeft(keys(obj2), k => {
    obj1[k] = [...(obj1[k] || []), ...obj2[k]];
  });
  forEachLeft(keys(obj1), k => {
    obj1[k] = unique(obj1[k], v => !!v);
  });
  return obj1;
};

var mergeImports = (importsOrigin, imports) => {
  forEachLeft(keys(imports), key => {
    importsOrigin[key] = key in importsOrigin ? concatImports(importsOrigin[key], imports[key]) : concatImports(imports[key]);
  });
};

var splitImports = source => {
  // const arr = source.split(/(?<=\{)|(?=\})|,/g).map((v) => trim(v))
  // console.log(arr)
  var res = {};
  var deep = 0;
  var tmp, key, value;
  forEachLeft(source.split(/(?<=\{)|(?=\})|,/g), v => {
    v = trim(v);
    if (v === '{') deep++;else if (v === '}') deep--;else if (v) {
      value = (tmp = v.split(/\s+/)).pop();
      key = tmp[0] || (deep ? value : 'default');
      (res[key] || (res[key] = [])).push(value);
    }
  });
  if (!keys(res).length) res['@'] = [];
  return concatImports(res);
}; // /(?:\bimport\b((?:\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|[^/'"`;()[\]]+)*?)\bfrom\b(?:\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|\s*))?((`|'|")(?:[^\\]|\\\3|\\(?!\3).)*?(?:\3|$))([\s;]*)|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))/g,


var extractImports = source => {
  var imports = {};
  var arr = [];
  var mayBeImports = [];
  source.replace(/((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))([\s;]*)|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))|((?<!\.\s*)\bimport\b)|(\bfrom\b)/g, (_full, _string, _3, _semi, _comment, _import, _from, _index) => {
    // console.log([_full, _string, _semi, _comment, _import, _from, _index])
    if (_import) arr = [_index];else if (_from) arr.length && (arr[1] = _index);else if (_string) {
      if (arr.length) {
        if (arr.length < 2) arr[1] = _index;
        var lastIndex = (_semi || '').length + _string.length;
        arr.push(_string, _index + lastIndex), mayBeImports.push(arr);
      }

      arr = [];
    }
    return '';
  });
  var code = source;
  forEachRight(mayBeImports, ([_import, _from, _string, _last]) => {
    var propsDirty = trim(removeComments(source.slice(_import + 6, _from)));

    if (!propsDirty || /^[^-+/?:'"`;()[\]]+$/.test(propsDirty)) {
      var importObj = splitImports(propsDirty); // console.log([propsDirty])

      _string = fixReaseImportName(jsonParse(replaceQuotes(_string)));
      if (!(_string in imports)) imports[_string] = importObj;else imports[_string] = concatImports(imports[_string], importObj);
      code = code.slice(0, _import) + '\n' + code.slice(_last);
    }
  }); // console.log(code)
  // console.log(imports)

  return {
    code,
    imports
  };
};

export { __REASE_COMPONENT__, concatImports, extractImports, fixReaseImportName, mergeImports, splitImports };
