/* eslint-disable */
/*
dester builds:
core/style/classes/CssComment.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var startsWith = require('@wareset-utilites/string/startsWith');

var endsWith = require('@wareset-utilites/string/endsWith');

var trim = require('@wareset-utilites/string/trim');

var utils = require('../utils');
/* filename: core/style/classes/CssComment.ts
  timestamp: 2022-01-22T03:47:29.432Z */


var createCommentValue = value => (value = trim.trim(value)) && value.slice(startsWith.startsWith(value, '/*') || startsWith.startsWith(value, '//') ? 2 : 0, startsWith.startsWith(value, '/*') && endsWith.endsWith(value, '*/') ? -2 : void 0);

class CssComment extends utils.NodeDirty {
  constructor(...args) {
    super(...args);
    this.type = 0
    /* COMMENT */
    ;
  }

  // readonly data!: [string] // = [EMPTY]
  get value() {
    return '/*' + this.data[0] + '*/';
  }

  set value(v) {
    this.__raw__(v);
  }

  __raw__(s) {
    this.data[0] = createCommentValue(s);
    return s;
  }

  toString() {
    return this.value;
  }

}

exports.CssComment = CssComment;
