/* eslint-disable */
/*
dester builds:
lib/validateAttributes.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var toUppercase = require('@wareset-utilites/string/toUppercase');

var toLowercase = require('@wareset-utilites/string/toLowercase');

var isBoolean = require('@wareset-utilites/is/isBoolean');

var isString = require('@wareset-utilites/is/isString');

var utils = require('../utils');

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var concat = require('@wareset-utilites/array/concat');

var isFunction = require('@wareset-utilites/is/isFunction');

var keys = require('@wareset-utilites/object/keys');

var is = require('@wareset-utilites/object/is');

var unique = require('@wareset-utilites/unique');

var typed = require('@wareset-utilites/typed');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var jsonStringify__default = /*#__PURE__*/_interopDefaultLegacy(jsonStringify);

var forEachLeft__default = /*#__PURE__*/_interopDefaultLegacy(forEachLeft);

var concat__default = /*#__PURE__*/_interopDefaultLegacy(concat);

var isFunction__default = /*#__PURE__*/_interopDefaultLegacy(isFunction);

var keys__default = /*#__PURE__*/_interopDefaultLegacy(keys);

var is__default = /*#__PURE__*/_interopDefaultLegacy(is);

var unique__default = /*#__PURE__*/_interopDefaultLegacy(unique);

var typed__default = /*#__PURE__*/_interopDefaultLegacy(typed);
/* filename: lib/validateAttributes.ts
  timestamp: 2022-01-22T03:47:58.907Z */


var FAKE_TRUE = {};
var FAKE_FALSE = {}; // prettier-ignore

var __env__ = {
  env: {
    types: ['server', ['client', 'browser'], 'all'],
    apply: (res, v) => {
      var ctrue = FAKE_TRUE,
          cfalse = FAKE_FALSE;
      var strue = FAKE_TRUE,
          sfalse = FAKE_FALSE;
      if (isBoolean.isBoolean(res.client)) ctrue = true, cfalse = false;
      if (isBoolean.isBoolean(res.server)) strue = true, sfalse = false;
      res.client = v === 'all' || v === 'client' || v === 'browser' ? ctrue : v === 'server' ? cfalse : res.client;
      res.server = v === 'all' || v === 'server' ? strue : v === 'client' || v === 'browser' ? sfalse : res.server;
    }
  },
  server: {
    types: [Boolean],
    apply: (res, v) => {
      res.server = isBoolean.isBoolean(v) ? v : isBoolean.isBoolean(res.client) ? !res.client : res.server || FAKE_TRUE;
    }
  },
  client: {
    types: [Boolean],
    apply: (res, v) => {
      res.client = isBoolean.isBoolean(v) ? v : isBoolean.isBoolean(res.server) ? !res.server : res.client || FAKE_TRUE;
    }
  },
  browser: {
    types: [Boolean],
    apply: (res, v = res.client) => {
      res.client = isBoolean.isBoolean(v) ? v : isBoolean.isBoolean(res.server) ? !res.server : res.client || FAKE_TRUE;
    }
  }
}; // prettier-ignore

var __module__ = {
  context: {
    types: ['module'],
    apply: (res, v) => {
      res.module = v === 'module' || res.module;
    }
  },
  module: {
    types: [Boolean],
    apply: (res, v) => {
      res.module = v;
    }
  }
};
var __src__ = {
  src: {
    types: [String],
    apply: (res, v) => {
      res.src = v;
    }
  }
};
var __stylescope__ = {
  global: {
    types: [Boolean],
    apply: (res, v) => {
      if (isBoolean.isBoolean(v)) res.global = v, res.scoped = !res.global;else if (isBoolean.isBoolean(res.scoped)) res.global = !res.scoped;else res.global = FAKE_FALSE, res.scoped = FAKE_TRUE;
    }
  },
  scoped: {
    types: [Boolean],
    apply: (res, v) => {
      if (isBoolean.isBoolean(v)) res.scoped = v, res.global = !res.scoped;else if (isBoolean.isBoolean(res.global)) res.scoped = !res.global;else res.global = FAKE_FALSE, res.scoped = FAKE_TRUE;
    }
  }
}; // prettier-ignore

var SECTION_ATTRIBUTES = {
  options: {
    'name': {
      types: [String],
      check: utils.isValidVariable,
      apply: (res, v) => {
        res.name = v;
      }
    },
    'cid': {
      types: [String],
      check: utils.isValidCid,
      apply: (res, v) => {
        res.cid = v;
      }
    },
    'css-scope-type': {
      types: ['class', 'attribute', String],
      check: v => v !== 'data' && [...(v + '')].every((v, k, a) => toLowercase.toLowercase(v) !== toUppercase.toUppercase(v) || /[\w]/.test(v) || v === '-' && k && k < a.length - 1),
      apply: (res, v) => {
        res['css-scope-type'] = v;
      }
    }
  },
  script: { ...__src__,
    lang: {
      types: [['ts', 'typescript']],
      apply: (res, v) => {
        if (v === 'typescript' || v === 'ts') res.lang = 'ts';else res.lang = v;
      }
    },
    ...__module__,
    ...__env__
  },
  template: { ...__src__,
    lang: {
      types: [['pug', 'jade']],
      apply: (res, v) => {
        if (v === 'pug' || v === 'jade') res.lang = 'pug';else res.lang = v;
      }
    },
    ...__env__
  },
  style: { ...__src__,
    'lang': {
      types: ['less', 'scss', 'sass', 'stylus'],
      apply: (res, v) => {
        res.lang = v;
      }
    },
    // ...__module__,
    ...__stylescope__,
    '--calc': {
      types: [Boolean, 'all'],
      apply: (res, v) => {
        res['--calc'] = v === 'all' ? v : v === true ? v : res['--calc'];
      }
    },
    '--js': {
      types: [Boolean, String],
      check: v => v === !!v || v && /^[$a-z]+[$\w]*$/i.test(v + ''),
      apply: (res, v) => {
        res['--js'] = isString.isString(v) ? v : v === true ? 'var' : res['--js'];
      }
    }
  }
};
var undef;

var validateAttributes = (sectionName, attrsArr) => {
  var attrs = {};
  var attrKeys = []; // prettier-ignore

  forEachLeft__default["default"](attrsArr, ([n, v]) => {
    attrKeys.unshift(n), attrs[n] = v;
  });
  attrKeys = unique__default["default"](attrKeys).reverse();
  var val, tmp;
  var res = {};
  var section = SECTION_ATTRIBUTES[sectionName];
  forEachLeft__default["default"](unique__default["default"]([...attrKeys, ...keys__default["default"](section)]), attrName => {
    if (!(attrName in section)) {
      utils.warn("Attribute \"" + attrName + "\" not support in section \"" + sectionName + "\".");
    } else {
      val = undef;
      var options = section[attrName];

      if (attrName in attrs) {
        val = attrs[attrName];
        var types = concat__default["default"](...options.types);

        if (!types.some(v => isFunction__default["default"](v) ? typed__default["default"](val, v) : is__default["default"](val, v))) {
          utils.warn("The attribute \"" + attrName + "\" must be: " + types.map(v => '' + (v && v.name || jsonStringify__default["default"](v))).join(', ') + ".");
          val = undef;
        } else if ((tmp = options.check) && !tmp(val)) {
          console.warn("The attribute \"" + attrName + "\" cannot be value: \"" + val + "\".");
          val = undef;
        }
      }

      options.apply(res, val);
    }
  });
  forEachLeft__default["default"](keys__default["default"](res), attrName => {
    var v = res[attrName];
    if (v === FAKE_TRUE || v === FAKE_FALSE) res[attrName] = v === FAKE_TRUE;
  }); // console.log(sectionName, res)

  return res;
};

exports.validateAttributes = validateAttributes;
