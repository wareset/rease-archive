/* eslint-disable */
/*
dester builds:
lib/validateAttributes.ts
*/
import { toUppercase } from '@wareset-utilites/string/toUppercase';
import { toLowercase } from '@wareset-utilites/string/toLowercase';
import { isBoolean } from '@wareset-utilites/is/isBoolean';
import { isString } from '@wareset-utilites/is/isString';
import { warn, isValidVariable, isValidCid } from '../utils';
import jsonStringify from '@wareset-utilites/lang/jsonStringify';
import forEachLeft from '@wareset-utilites/array/forEachLeft';
import concat from '@wareset-utilites/array/concat';
import isFunction from '@wareset-utilites/is/isFunction';
import keys from '@wareset-utilites/object/keys';
import is from '@wareset-utilites/object/is';
import unique from '@wareset-utilites/unique';
import typed from '@wareset-utilites/typed';
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
      if (isBoolean(res.client)) ctrue = true, cfalse = false;
      if (isBoolean(res.server)) strue = true, sfalse = false;
      res.client = v === 'all' || v === 'client' || v === 'browser' ? ctrue : v === 'server' ? cfalse : res.client;
      res.server = v === 'all' || v === 'server' ? strue : v === 'client' || v === 'browser' ? sfalse : res.server;
    }
  },
  server: {
    types: [Boolean],
    apply: (res, v) => {
      res.server = isBoolean(v) ? v : isBoolean(res.client) ? !res.client : res.server || FAKE_TRUE;
    }
  },
  client: {
    types: [Boolean],
    apply: (res, v) => {
      res.client = isBoolean(v) ? v : isBoolean(res.server) ? !res.server : res.client || FAKE_TRUE;
    }
  },
  browser: {
    types: [Boolean],
    apply: (res, v = res.client) => {
      res.client = isBoolean(v) ? v : isBoolean(res.server) ? !res.server : res.client || FAKE_TRUE;
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
      if (isBoolean(v)) res.global = v, res.scoped = !res.global;else if (isBoolean(res.scoped)) res.global = !res.scoped;else res.global = FAKE_FALSE, res.scoped = FAKE_TRUE;
    }
  },
  scoped: {
    types: [Boolean],
    apply: (res, v) => {
      if (isBoolean(v)) res.scoped = v, res.global = !res.scoped;else if (isBoolean(res.global)) res.scoped = !res.global;else res.global = FAKE_FALSE, res.scoped = FAKE_TRUE;
    }
  }
}; // prettier-ignore

var SECTION_ATTRIBUTES = {
  options: {
    'name': {
      types: [String],
      check: isValidVariable,
      apply: (res, v) => {
        res.name = v;
      }
    },
    'cid': {
      types: [String],
      check: isValidCid,
      apply: (res, v) => {
        res.cid = v;
      }
    },
    'css-scope-type': {
      types: ['class', 'attribute', String],
      check: v => v !== 'data' && [...(v + '')].every((v, k, a) => toLowercase(v) !== toUppercase(v) || /[\w]/.test(v) || v === '-' && k && k < a.length - 1),
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
        res['--js'] = isString(v) ? v : v === true ? 'var' : res['--js'];
      }
    }
  }
};
var undef;

var validateAttributes = (sectionName, attrsArr) => {
  var attrs = {};
  var attrKeys = []; // prettier-ignore

  forEachLeft(attrsArr, ([n, v]) => {
    attrKeys.unshift(n), attrs[n] = v;
  });
  attrKeys = unique(attrKeys).reverse();
  var val, tmp;
  var res = {};
  var section = SECTION_ATTRIBUTES[sectionName];
  forEachLeft(unique([...attrKeys, ...keys(section)]), attrName => {
    if (!(attrName in section)) {
      warn("Attribute \"" + attrName + "\" not support in section \"" + sectionName + "\".");
    } else {
      val = undef;
      var options = section[attrName];

      if (attrName in attrs) {
        val = attrs[attrName];
        var types = concat(...options.types);

        if (!types.some(v => isFunction(v) ? typed(val, v) : is(val, v))) {
          warn("The attribute \"" + attrName + "\" must be: " + types.map(v => '' + (v && v.name || jsonStringify(v))).join(', ') + ".");
          val = undef;
        } else if ((tmp = options.check) && !tmp(val)) {
          console.warn("The attribute \"" + attrName + "\" cannot be value: \"" + val + "\".");
          val = undef;
        }
      }

      options.apply(res, val);
    }
  });
  forEachLeft(keys(res), attrName => {
    var v = res[attrName];
    if (v === FAKE_TRUE || v === FAKE_FALSE) res[attrName] = v === FAKE_TRUE;
  }); // console.log(sectionName, res)

  return res;
};

export { validateAttributes };
