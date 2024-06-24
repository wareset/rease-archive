/* eslint-disable */
/*
dester builds:
core/style/classes/CssProgram.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var instanceOf = require('@wareset-utilites/lang/instanceOf');

var repeat = require('@wareset-utilites/string/repeat');

var isArray = require('@wareset-utilites/is/isArray');

var trim = require('@wareset-utilites/string/trim');

var utils = require('../utils');

var CssComment = require('../CssComment');

var CssAtrule = require('../CssAtrule');

var CssAttribute = require('../CssAttribute');

var CssKeyframe = require('../CssKeyframe');

var CssSelector = require('../CssSelector');
/* filename: core/style/classes/CssProgram.ts
  timestamp: 2022-01-22T03:47:31.860Z */


var CLASSES = {
  [0
  /* COMMENT */
  ]: CssComment.CssComment,
  [1
  /* ATRULE */
  ]: CssAtrule.CssAtrule,
  [4
  /* ATTRIBUTE */
  ]: CssAttribute.CssAttribute,
  [3
  /* KEYFRAME */
  ]: CssKeyframe.CssKeyframe,
  [2
  /* SELECTOR */
  ]: CssSelector.CssSelector
};
var CSS_PROGRAM_TO_CODE_OPTIONS = {
  indent: '\t',
  concise: false,
  global: true,
  scoper: '[scoped]',
  minify: false
};

var normalizeSelector = (arr, options) => {
  var {
    global,
    scoper = CSS_PROGRAM_TO_CODE_OPTIONS.scoper
  } = options;
  arr = arr.map(v => {
    if (v === ':global') v = '';else if (v === ':scoped') v = scoper;else if (v === ':stated') v = global ? '' : scoper;
    return v;
  });
  return arr.join('');
};

class CssProgram extends utils.ProgramDirty {
  constructor(tokens) {
    super();
    forEachLeft.forEachLeft(tokens, v => {
      var ClassName = CLASSES[v[1]];
      if (ClassName) this.push(new ClassName({
        deep: v[0],
        raw: v[2]
      }));
    });
  }

  toSchema() {
    var res = [];
    var i, node, deep, type;
    var i2, node2, deep2, type2; // let pCount: number

    forEachLeft.forEachLeft(this, (v, str) => {
      if (instanceOf.instanceOf(v, utils.NodeDirty) && (str = v.toSchema())) {
        // ;({ deep, type } = v)
        res.push([v.deep, v.type, [], [], str]);
      }
    }); // BEGIN SEPARATATION SUPPORTS AND MEDIA FN

    var sets = cb => {
      var now;
      var i = -1;

      while (++i < res.length) {
        node = res[i], deep = node[0], type = node[1];
        if (cb()) now = node, res.splice(i, 1), --i;else if (now && node[0] <= now[0] && type !== 0
        /* COMMENT */
        ) now = 0;else if (now && node[0] > now[0]) node[2].push(now[4]), --node[0];
      }
    };

    sets(() => type === 1
    /* ATRULE */
    && /^\s*@supports\b/.test(node[4]));
    sets(() => type === 1
    /* ATRULE */
    && /^\s*@media\b/.test(node[4])); // END SEPARATATION SUPPORTS AND MEDIA FN

    i = -1;
    var isMedia;
    var needRemove;

    while (++i < res.length) {
      node = res[i], deep = node[0], type = node[1]; // if (type === TYPE_CSS_ATTRIBUTE) {
      //   i2 = i
      //   second: while (++i2 < len(res)) {
      //     ;(node2 = res[i2]), (deep2 = node2[0]), (type2 = node2[1])
      //     if (type2 !== TYPE_COMMENT && deep2 < deep) break second
      //     if (type2 === TYPE_CSS_ATTRIBUTE && deep2 === deep) {
      //       if (EMPTY + node[2] === EMPTY + node2[2])
      //         node.push(node2[4]), splice(res, i2--, 1)
      //     }
      //   }
      // }

      if (type !== 4
      /* ATTRIBUTE */
      && type !== 0
      /* COMMENT */
      ) {
        i2 = i;
        needRemove = false;
        isMedia = /^\s*@(?:media|supports)\b/.test(node[4]);
        if (isMedia) needRemove = true;

        while (++i2 < res.length) {
          node2 = res[i2], deep2 = node2[0], type2 = node2[1];
          if (type2 !== 0
          /* COMMENT */
          && deep2 <= deep) break;

          if (deep2 > deep) {
            needRemove = true;
            if (isMedia) node2[2].push(node[4]);else {
              if (node[4][0] === '@') {
                node2[3] = node2[3].filter(v => v[0] === '@');
              } else if (type === 2
              /* SELECTOR */
              ) node2[3].length = 0;

              node2[3].push(node[4]);
            }
          }
        }

        if (needRemove) res.splice(i--, 1);
      }
    }

    i = -2;
    var i3 = 0;

    while (++i < res.length) {
      node = res[i] || ['', '', '', '', '']; // if (node[1] === TYPE_COMMENT && (len(node[2]) || len(node[3]))) {
      //   ;[node[2], node[3]] = res[i - 1]
      //     ? [res[i - 1][2], res[i - 1][3]]
      //     : [[], []]
      // }

      if (!node._t) node._t = node[2] + '|' + node[3]; // if (node._t !== '|') {

      i3 = 0;
      i2 = i;

      while (++i2 < res.length) {
        node2 = res[i2];
        if (!node2._t) node2._t = node2[2] + '|' + node2[3];

        if (node._t === node2._t) {
          if (node[4] === node2[4]) res.splice(i2--, 1);else if (i2 - i > 1) {
            res.splice(i2, 1), res.splice(i + ++i3 + 1, 0, node2);
          }
        }
      } // }

    } // console.log(res)


    return res.map(([, type, media, path, attrs]) => [type, [...media, ...path], attrs]);
  }

  toCode(arr, options) {
    if (!isArray.isArray(arr)) options = arr, arr = this.toSchema();
    return CssProgram.toCode(arr, options);
  }

  static toCode(arr, options) {
    options = { ...CSS_PROGRAM_TO_CODE_OPTIONS,
      ...(options || {})
    };
    var {
      indent,
      minify,
      concise
    } = options;
    var SEP = minify ? '' : ' ';
    var CRLF = minify ? '' : '\n';
    var IND = minify ? '' : '' + indent;
    var SEMI = ':' + (minify ? '' : ' ');
    var FBO = !minify && concise ? '' : '{';
    var FBC = !minify && concise ? '' : '}';
    var CSP = !minify && concise ? '' : ';';
    var res = '';
    var start = '';
    var space = '';
    var temp = [];
    var lk = 0;
    var is;
    forEachLeft.forEachLeft(arr, v => {
      if (!minify || v[0] !== 0
      /* COMMENT */
      ) {
        var __l1__ = v[1].length;

        var __t1__ = repeat.repeat(IND, __l1__);

        var COMMA = v[0] === 0
        /* COMMENT */
        ? '' : CSP;
        var attr = CRLF + __t1__ + (isArray.isArray(v[2]) ? v[2].join(SEMI) : v[2]) + COMMA;
        start = '';
        space = '';
        is = false;
        var cache = [];
        if (!v[1].length) res += repeat.repeat(FBC, lk);
        forEachLeft.forEachLeft(v[1], (v2, k2) => {
          if (isArray.isArray(v2)) v2 = normalizeSelector(v2, options);
          cache.push(v2);
          if (!space) space = SEP;

          if (temp[k2] !== v2) {
            temp = [];
            if (!is) is = !!(res += repeat.repeat(FBC, lk - k2));
            start += CRLF + repeat.repeat(IND, k2) + v2 + SEP + FBO;
          }
        });
        res += start + attr + space;
        temp = [...cache];
        lk = __l1__;
      }
    });
    res += repeat.repeat(FBC, lk);
    res = trim.trim(res) + CRLF; // const { global, scoper } = options
    // if (!isVoid(global) || !isVoid(scoper)) {
    //   res = res.replace(
    //     REG_CSS_TYPE_ORIGIN,
    //     global ? CSS_TYPE_GLOBAL : CSS_TYPE_SCOPED
    //   )
    // }
    // if (!isVoid(scoper)) {
    //   res = res.replace(REG_CSS_TYPE_GLOBAL, '')
    //   res = res.replace(REG_CSS_TYPE_SCOPED, scoper || '')
    // }
    // console.log(arr)

    return res;
  }

}

exports.CSS_PROGRAM_TO_CODE_OPTIONS = CSS_PROGRAM_TO_CODE_OPTIONS;
exports.CssProgram = CssProgram;
