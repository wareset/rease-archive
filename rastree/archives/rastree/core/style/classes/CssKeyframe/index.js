/* eslint-disable */
/*
dester builds:
core/style/classes/CssKeyframe.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var trim = require('@wareset-utilites/string/trim');

var utils = require('../utils');

var calcVariables = require('../../lib/calcVariables');

var removeComments = require('../../../utils/removeComments');
/* filename: core/style/classes/CssKeyframe.ts
  timestamp: 2022-01-22T03:47:30.659Z */


class CssKeyframe extends utils.NodeDirty {
  constructor(...args) {
    super(...args);
    this.type = 3
    /* KEYFRAME */
    ;
  }

  // readonly data!: [string] // = [NULL]
  get value() {
    var data0 = this.data[0];
    return data0 + (/^\s*\d+(\.\d*)?\s*$/.test(data0) ? '%' : '') || 'null';
  }

  set value(s) {
    this.__raw__(s);
  }

  __raw__(s) {
    this.data[0] = calcVariables.calcVariables(trim.trim(removeComments.removeComments(s)));
    return s;
  }

  toString() {
    return this.value;
  }

}

exports.CssKeyframe = CssKeyframe;
