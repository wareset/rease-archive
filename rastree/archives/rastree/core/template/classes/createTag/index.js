/* eslint-disable */
/*
dester builds:
core/template/classes/createTag.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Boolean = require('@wareset-utilites/lang/Boolean');

var findIndexLeft = require('@wareset-utilites/array/findIndexLeft');

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');

var trimRight = require('@wareset-utilites/string/trimRight');

var jsonParse = require('@wareset-utilites/lang/jsonParse');

var concat = require('@wareset-utilites/array/concat');

var keys = require('@wareset-utilites/object/keys');

var trim = require('@wareset-utilites/string/trim');

var last = require('@wareset-utilites/array/last');

var isNaN = require('@wareset-utilites/is/isNaN');

var jsx2tokens = require('@rastree/jsx2tokens');

var utils = require('../utils');

var storefyExpression = require('../storefyExpression');

var replaceQuotes = require('../../../utils/replaceQuotes');

var parseAttributes = require('../../lib/parseAttributes');
/* filename: core/template/classes/createTag.ts
  timestamp: 2022-01-22T03:47:42.221Z */


var isExpression = v => {
  if (v[0] === '{' && last.last(v) === '}') {
    try {
      return jsx2tokens.jsx2tokens(v).tokens.slice(1, -1).every(v => v.deep);
    } catch (e) {
      /* */
    }
  }

  return false;
};

var fixArrayValues = arr => {
  var data = [];
  var islit;
  arr.forEach(v => {
    if (v) {
      if (!islit) islit = utils.isLiteral(v), data.push(v);else {
        (islit = utils.isLiteral(v)) ? data[data.length - 1] = jsonStringify.jsonStringify(jsonParse.jsonParse(last.last(data)) + jsonParse.jsonParse(v)) : data.push(v);
      }
    }
  });
  return data;
};

var unquoteValue = value => {
  try {
    value = trim.trim(jsonParse.jsonParse(replaceQuotes.replaceQuotes(value)));
  } catch (e) {
    /* */
  }

  return value;
};

var safetyKey = value => {
  if (/^\d+[^\d]|[^$\w]/.test(value)) value = jsonStringify.jsonStringify(value);
  return value;
};

var fixIfExpression = value => isExpression(value) ? value.slice(1, -1) : value;

var normalizeSysValue = (value, salt) => storefyExpression.storefyExpression(jsx2tokens.jsx2tokens(isExpression(value) ? value.slice(1, -1) : jsonStringify.jsonStringify(value)).tokens, salt);

var normalizeValue = (value, salt) => {
  var res;

  if (value.indexOf('{') < 0 || value.indexOf('}') < 0) {
    res = [jsonStringify.jsonStringify(value)];
  } else if (isExpression(value)) {
    res = [storefyExpression.storefyExpression(jsx2tokens.jsx2tokens(value.slice(1, -1)).tokens, salt)];
  } else {
    var tokens = jsx2tokens.jsx2tokens(value).tokens;
    res = [];
    var token;

    for (var i = 0; i <= tokens.length; ++i) {
      token = tokens[i];

      if (!token || i && !token.deep && (token.value === '{' || token.value === '}' && ++i)) {
        res.push(...normalizeValue(jsx2tokens.stringifyTokens(tokens.splice(0, i)), salt));
        i = 0;
      }
    }
  }

  return res;
}; // const splitByTokens = (value: string, spliter: string): string[] => {
//   const tokens = jsx2tokens(value).tokens
//   const res: string[] = []
//   let token: TypeToken
//   for (let i = 0; i <= tokens.length; ++i) {
//     token = tokens[i]
//     if (!token || (i && !token.deep && token.value === spliter)) {
//       res.push(
//         stringifyTokens(tokens.splice(0, i + 1).slice(0, token ? -1 : void 0))
//       )
//       i = 0
//     }
//   }
//   return res
// }


var killquotes = str => str.replace(/['"`]+/g, '');

var normalizeAttributes = ([name, value], _salt) => {
  console.log(1, [name, value]);
  name = unquoteValue(name);

  if (isExpression(name)) {
    value = name, name = trim.trim(name.slice(1, -1));
  }

  if (!value || (name[0] === ':' || name.indexOf('use:') > -1) && killquotes(value) === killquotes(name)) {
    value = '';
  } else {
    value = unquoteValue(value);
  } // else if (/^['"`]/.test(value) && isExpression(value.slice(1, -1))) {
  //   value = trim(jsonParse(replaceQuotes(value)))
  // }
  // value = unquoteValue(value)
  // if (name.indexOf(':') > -1) {
  //   if (last(name) === ')') {
  //     const idx = name.indexOf('(')
  //     value = '{' + name.slice(idx + 1, -1) + '}'
  //     name = name.slice(0, idx)
  //   } else if (name === value) {
  //     value = '' // '{}'
  //   }
  // }
  // if (isExpression(value)) {
  //   value = storefyExpression(trim(value.slice(1, -1)), salt)
  // } else if (/^['"`]/.test(value)) {
  //   value = jsonStringify(trim(jsonParse(replaceQuotes(value))))
  // }


  console.log(2, [name, value]);
  return [name, value];
};

var ENVS = {
  c: 'client',
  client: 'client',
  b: 'client',
  browser: 'client',
  s: 'server',
  server: 'server'
}; // eslint-disable-next-line @typescript-eslint/explicit-function-return-type

var parseTagAttributes = (tokens, salt) => {
  var arr = parseAttributes.parseAttributes(tokens).map(v => normalizeAttributes(v));
  var tag;
  var flags = {};
  var props = {
    client: {},
    server: {},
    all: {}
  }; // const uses0: [string, any][] = []
  // const refs: { [key: string]: [string, string][] } = {}

  var uses = [];
  var rules = [];
  var sys = {};
  var tagArr = arr.shift();

  if (tagArr) {
    if (tagArr[1]) tag = tagArr[1];else {
      tag = tagArr[0];

      if (tag !== 'this' && /^[-a-z]+[-a-z\d]*$/.test(tag)) {
        tag = jsonStringify.jsonStringify(tag);
      }
    }
  }

  sys.tag = tag || '"fragment"';
  arr.forEach(([name, value]) => {
    // --FLAGS
    if (/^--/.test(name)) {
      flags[name.replace(/^-+/, '')] = true;
      return;
    }

    var matches; // TAG

    if (matches = /^r?:tag.?(?:Name)?(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) sys.tag = storefyExpression.storefyExpression(matches[1], salt);else if (value) sys.tag = normalizeSysValue(value, salt);
      return;
    } // SLOT


    if (matches = /^r?:slot(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) sys.slot = storefyExpression.storefyExpression(matches[1], salt);else if (value) sys.slot = normalizeSysValue(value, salt);
      return;
    } // NAME


    if (matches = /^r?:name(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) sys.name = storefyExpression.storefyExpression(matches[1], salt);else if (value) sys.name = normalizeSysValue(value, salt);
      return;
    } // VARS


    if (matches = /^r?:(?:var|let)s?(?:\(([^]+)\))?$/i.exec(name)) {
      var vars = jsx2tokens.stringifyTokens(jsx2tokens.trimCircleBrackets(jsx2tokens.jsx2tokens(fixIfExpression(matches[1] || value)).tokens));

      if (vars) {
        var args = [];
        var vals = [];
        parseAttributes.parseAttributes(jsx2tokens.jsx2tokens(vars).tokens).forEach(v => {
          args.push(v[0]);
          vals.push(v[1] || 'void 0');
        });
        rules.push(['VARS', {
          args: args.join(', '),
          vals: vals.join(', ')
        }]);
      }

      return;
    } // ELSEIF


    if (matches = /^r?:el(?:se)?.?if(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) value = storefyExpression.storefyExpression(matches[1], salt);else if (value) value = normalizeSysValue(value, salt);
      rules.push(['ELSEIF', value]);
      return;
    } // ELSE


    if (matches = /^r?:else(?:\(([^]+)\))?$/i.exec(name)) {
      rules.push(['ELSE', 'true']);
      return;
    } // IF


    if (matches = /^r?:if(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) value = storefyExpression.storefyExpression(matches[1], salt);else if (value) value = normalizeSysValue(value, salt);
      rules.push(['IF', value]);
      return;
    } // FOR


    if (matches = /^r?:(?:for(?:each)?|each)(?:\(([^]+)\))?$/i.exec(name)) {
      value = matches[1] || (isExpression(value) ? value.slice(1, -1) : jsonStringify.jsonStringify(value));

      var _tokens = jsx2tokens.trimCircleBrackets(jsx2tokens.jsx2tokens(value).tokens);

      if (_tokens.length) {
        var _args = '';
        var end = findIndexLeft.findIndexLeft(_tokens, v => v.value === 'in' && v.type === jsx2tokens.TOKEN_KEYWORD);

        if (end > -1) {
          _args = jsx2tokens.stringifyTokens(jsx2tokens.trimCircleBrackets(_tokens.splice(0, end)));
        }

        var each = storefyExpression.storefyExpression(_tokens.slice(1), salt);
        if (each) rules.push(['FOR', {
          each,
          args: _args
        }]);
      }

      return;
    } // todo


    if (matches = /^r?:key$/i.exec(name)) {
      if (matches[1]) value = storefyExpression.storefyExpression(matches[1], salt);else if (value) value = normalizeSysValue(value, salt);
      if (value) rules.push(['KEY', value]);
      return;
    } // // MIXIN
    // if (/^r?:mixin$/i.test(name)) {
    //   rules.push(['MIXIN', normalizeSysValue(value, salt)])
    //   return
    // }
    // REFS
    // if (
    //   matches = /^(?:(c|s|b|client|server|browser)\W+)?ref(?::([^]*?)(?:[^\w.\]]+(\w+))?)$/i.exec(
    //     name
    //   )
    // ) {
    //   // console.log(444, matches)
    //   let env = (matches[1] || '').toLowerCase()
    //   if (env) env = (ENVS as any)[env] || ''
    //   name = safetyKey(matches[2] || '_')
    //   value = fixIfExpression(value)
    //   if (matches[3]) value = value ? `${matches[3]}, ${value}` : matches[3]
    //   value = `[${value}]`;
    //   (refs[name] || (refs[name] = [])).push([value, env])
    //   return
    // }
    // console.log(9944, name, value, fixIfExpression(value))
    // USES


    if (matches = /^(?:(c|s|b|client|server|browser)\W+)?use:(.+)$/i.exec(name)) {
      // console.log(555, matches)
      var env = (matches[1] || '').toLowerCase();
      if (env) env = ENVS[env] || '';
      name = matches[2];
      if (value) name += "(" + fixIfExpression(value) + ")";
      uses.push([name, env]); // console.log(666, env, name)

      return;
    } // if (
    //   (matches = /^(?:(c|s|client|server)\W+)?use(?::([^]+?)(?:[^\w.\]]+(\w+))?)$/i.exec(
    //     name
    //   ))
    // ) {
    //   let env = (matches[1] || '').toLowerCase()
    //   if (env) env = (ENVS as any)[env] || ''
    //   // const nameArr =
    //   //   matches[2].indexOf(':') < 0
    //   //     ? [matches[2]]
    //   //     : splitByTokens(matches[2], ':')
    //   name = matches[3] ? safetyKey(matches[3]) : ''
    //   value = `[${matches[2]}, [${normalizeSysValue(value, salt, true)}]]`
    //   if (!name) uses0.push([value, env])
    //   else (uses[name] || (uses[name] = [])).push([value, env])
    //   return
    // }
    // PROP


    if (matches = /^(?:(c|s|b|client|server|browser)\W+)?(.+)$/i.exec(name)) {
      var _env = (matches[1] || '').toLowerCase();

      if (_env) _env = ENVS[_env] || '';
      name = matches[2];

      if (name.indexOf(':') > -1) {
        var _arr = name.split(':');

        if (!isNaN.isNaN(+_arr[1])) name = trim.trim(_arr[0]);
      }

      name = safetyKey(name);

      if (_env in props) {
        if (!props[_env][name]) props[_env][name] = [value];else props[_env][name].push(' ', value);
        if (!props.all[name]) props.all[name] = [value];else props.all[name].push(' ', value);
      } else {
        for (var _env2 in props) {
          if (!props[_env2][name]) props[_env2][name] = [value];else props[_env2][name].push(' ', value);
        }
      }

      return;
    }

    console.error('Incorrect propname: { ' + name + ' : ' + value + ' }');
  }); // eslint-disable-next-line guard-for-in

  for (var env in props) {
    var propsEnv = props[env];

    for (var a = keys.keys(propsEnv), i = a.length; i-- > 0;) {
      var key = a[i];

      var _arr2 = fixArrayValues(concat.concat(...propsEnv[key].map(v => v ? normalizeValue(v, salt) : 'true')));

      if (!_arr2.length) delete propsEnv[key];else if (_arr2.length === 1) propsEnv[key] = _arr2[0];else propsEnv[key] = storefyExpression.STOREFY + salt + ".c([" + _arr2.join(', ') + "])"; // если комплексный массив, то добавить к нему ключ '%complex%' например
    }
  } // console.log('flags', flags)
  // console.log('props', props)
  // console.log('uses', uses)
  // console.log('sys', sys)


  return {
    flags,
    props,
    uses,
    rules,
    sys
  };
};

var createTag = ({
  props,
  uses,
  rules,
  sys
}, _salt, deep, env, tagId) => {
  var res = '';
  var end = '';
  var propsStr = '';
  var propsEnv = props[env || ''] || props.all; // eslint-disable-next-line guard-for-in

  for (var k in propsEnv) {
    propsStr += k + ': ' + propsEnv[k] + ', ';
  }

  if (propsStr) propsStr = '{ ' + propsStr.slice(0, -2) + ' }'; // let uses0Str = uses0
  //   .map((v) => (!v[1] || !env || v[1] === env ? v[0] : ''))
  //   .filter(__Boolean__)
  //   .join(', ')
  // if (uses0Str) uses0Str = `[${uses0Str}]`
  // let refsStr = ''
  // let refsStrTemp = ''
  // // eslint-disable-next-line guard-for-in
  // for (const k in refs) {
  //   refsStrTemp = refs[k]
  //     .map((v) => !v[1] || !env || v[1] === env ? v[0] : '')
  //     .filter(__Boolean__)
  //     .join(', ')
  //   if (refsStrTemp) refsStr += k + `: [${refsStrTemp}], `
  // }
  // if (refsStr) refsStr = '{ ' + refsStr.slice(0, -2) + ' }'

  var usesStr = '';
  var usesStrTemp = '';
  usesStrTemp = uses.map(v => !v[1] || !env || v[1] === env ? v[0] : '').filter(Boolean.Boolean).join(', ');
  if (usesStrTemp) usesStr = "[" + usesStrTemp + "]";
  var slotStr = '';

  if (sys.slot) {
    slotStr = ', ' + sys.slot;
  }

  rules.forEach(([rule, value]) => {
    if (value) {
      var key; // , args: any

      switch (rule) {
        case 'VARS':
          res += utils.offset(deep) + "((" + value.args + ") => (\n";
          end = "\n" + utils.offset(deep) + "))(" + value.vals + ")" + end;
          deep++;
          break;

        case 'ELSEIF':
        case 'ELSE':
        case 'IF':
          key = {
            ELSEIF: 8,
            ELSE: 7,
            IF: 9
          }[rule];
          res += utils.offset(deep) + "[" + key + ", " + value + ", () => \n";
          end = "\n" + utils.offset(deep) + slotStr + "]" + end;
          slotStr = '';
          deep++;
          break;

        case 'FOR':
          res += utils.offset(deep) + "[6, " + value.each + ", (" + value.args + ") => \n";
          end = "\n" + utils.offset(deep) + slotStr + "]" + end;
          slotStr = '';
          deep++;
          break;

        case 'KEY':
          slotStr = (slotStr || ',') + (", " + value); // res += `${offset(deep)}[1, ${value}, () => [\n`
          // end = `\n${offset(deep)}]${slotStr}]` + end
          // slotStr = ''
          // deep++

          break;
        // case 'MIXIN':
        //   args = `propsMixin${salt} = {}`
        //   propsStr =
        //     (propsStr ? propsStr.slice(0, -1) + ',' : '{') +
        //     ` ...propsMixin${salt}}`
        //   res += `${offset(deep)}[4, ${value}, (${args}) => [\n`
        //   end = `\n${offset(deep)}]${slotStr}]` + end
        //   slotStr = ''
        //   deep++
        //   break

        default:
          console.error('Incorrect rule: { ' + rule + ' : ' + value + ' }');
      }
    }
  });
  var nameStr = '';

  if (sys.name) {
    nameStr = sys.name;
  }

  var attrs = trimRight.trimRight([sys.tag, propsStr, usesStr, nameStr].join(', '), ',\\s');
  res += utils.offset(deep) + "[" + ++tagId[0] + ", [" + attrs + "], [";
  end = "]" + slotStr + "]" + end;
  deep++; // res += end
  // console.log(res)

  return [res, end, deep];
};

exports.createTag = createTag;
exports.fixArrayValues = fixArrayValues;
exports.parseTagAttributes = parseTagAttributes;
