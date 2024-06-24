/* eslint-disable */
/*
dester builds:
bin/compile.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var toCodeSnakecase = require('@wareset-utilites/string/toCodeSnakecase');

var toCapitalize = require('@wareset-utilites/string/toCapitalize');

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var isObject = require('@wareset-utilites/is/isObject');

var trycatch = require('@wareset-utilites/trycatch');

var keys = require('@wareset-utilites/object/keys');

var kleur = require('kleur');

var fs = require('fs');

var path = require('path');

var rastree = require('../..');

var parseComponent = require('../../lib/parseComponent');

var utils = require('../../lib/utils');

var preprocessors = require('../../preprocessors');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);

  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }

  n["default"] = e;
  return Object.freeze(n);
}

var rastree__default = /*#__PURE__*/_interopDefaultLegacy(rastree);

var preprocessors__namespace = /*#__PURE__*/_interopNamespace(preprocessors);
/* filename: bin/compile.ts
  timestamp: 2022-01-22T03:47:19.341Z */


var undef;

var messageError = (...a) => {
  var res = a.map(v => isObject.isObject(v) ? jsonStringify.jsonStringify(v, undef, 2) : v).join('\n').split('\n').map(v => kleur.bgRed(kleur.white(' ' + v + ' '))).join('\n');
  res = kleur.bold(kleur.red(' ERROR: \n')) + res;
  throw res;
};

var fnFalse = () => false;

var fakeStat = file => trycatch.trycatch(() => fs.statSync(file), {
  isFile: fnFalse,
  isDirectory: fnFalse
});

var compile = ({
  code,
  input,
  output,
  css = true,
  debug
}) => {
  if (!input && !code) messageError('Please specify the "Input" file');

  if (input) {
    input = path.resolve(input);
    if (!fakeStat(input).isFile()) messageError('"Input" is not a file:', input);
  } // console.log(args)
  // console.log({ input, output })


  var component = parseComponent.parseComponent(code || fs.readFileSync(input).toString());
  var {
    options,
    sections
  } = component;
  options.cid = utils.validateCid(options.cid, input);

  options.name = (name => {
    if (!name || !utils.isValidVariable(name)) {
      var inputParse = path.parse(input);
      name = toCodeSnakecase.toCodeSnakecase(inputParse.name);

      if (!utils.isValidVariable(name)) {
        var inputArr = inputParse.dir.split(/[/\\]+/);

        while (inputArr.length && !utils.isValidVariable(name)) {
          name = toCodeSnakecase.toCodeSnakecase(inputArr.pop() + ' ' + name);
        }

        if (!utils.isValidVariable(name)) {
          name = 'Rease_' + name;
          if (!utils.isValidVariable(name)) name = 'Rease_';
        }
      }
    }

    name = toCapitalize.toCapitalize(name) + '_' + options.cid;
    return name;
  })(options.name);

  forEachLeft.forEachLeft(keys.keys(sections), sectionName => {
    var section = sections[sectionName];
    forEachLeft.forEachLeft(section, ({
      attributes
    }, k) => {
      var src = attributes.src;

      if (src) {
        section[k].code = fs.readFileSync(path.resolve(path.dirname(input || __filename), src)).toString();
      }

      var lang = attributes.lang || src && path.extname(src).slice(1);

      if (lang) {
        if (lang === attributes.lang && !(lang in preprocessors__namespace)) {
          messageError("Lang \"" + lang + "\" not support");
        }

        if (lang in preprocessors__namespace) {
          section[k].code = preprocessors__namespace[lang](section[k].code);
        } // console.log(section[k].code)
        // console.log(attributes)

      }
    });
  }); // console.log(options)
  // console.log(jsonStringify(sections, undefined, 2))

  var res = rastree__default["default"](component, {
    externalCss: !css
  });

  if (debug) {
    if (!output) {
      output = input || messageError('Please specify the "Output" file');
    } else output = path.resolve(output);

    if (fakeStat(output).isDirectory()) {
      output = path.join(output, path.parse(input).base);
    }

    var {
      cssExternal,
      codeClient
      /* , codeServer */

    } = res;
    fs.mkdirSync(path.dirname(output), {
      recursive: true
    });
    fs.writeFileSync(output + '.client.js', codeClient); // fsWriteFileSync(output + '.server.js', codeServer)

    if (!css) fs.writeFileSync(output + '.css', cssExternal);else trycatch.trycatch(() => fs.unlinkSync(output + '.css'));
  }

  return res;
};

exports.compile = compile;
