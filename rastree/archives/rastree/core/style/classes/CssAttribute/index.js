/* eslint-disable */
/*
dester builds:
core/style/classes/CssAttribute.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var trim = require('@wareset-utilites/string/trim');

var utils = require('../utils');

var getDelimeter = require('../../../utils/getDelimeter');

var removeComments = require('../../../utils/removeComments');
/* filename: core/style/classes/CssAttribute.ts
  timestamp: 2022-01-22T03:47:28.124Z */


class CssAttribute extends utils.NodeDirty {
  constructor(...args) {
    super(...args);
    this.type = 4
    /* ATTRIBUTE */
    ;
  }

  // readonly data!: [string, string] // = [NULL, NULL]
  get name() {
    return this.data[0] || 'null';
  }

  set name(s) {
    this.data[0] = trim.trim(removeComments.removeComments(s), '\\s:');
  }

  get value() {
    return this.data[1] || 'null';
  }

  set value(s) {
    this.data[1] = trim.trim(removeComments.removeComments(s), '\\s;');
  }

  __raw__(s) {
    var __d__ = getDelimeter.getDelimeter(s);

    var [name, value] = s.replace(/\s*(:|\s)\s*/, __d__).split(__d__);
    this.name = name || 'null', this.value = value || 'null';
    return s;
  }

  toString() {
    return this.toSchema().join(': ');
  }

  toSchema() {
    return [this.name, this.value];
  }

}

exports.CssAttribute = CssAttribute;
