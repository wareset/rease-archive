/* eslint-disable */
/*
dester builds:
core/style/classes/CssAtrule.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var trim = require('@wareset-utilites/string/trim');

var unique = require('@wareset-utilites/unique');

var utils = require('../utils');

var calcVariables = require('../../lib/calcVariables');

var getDelimeter = require('../../../utils/getDelimeter');

var removeComments = require('../../../utils/removeComments');
/* filename: core/style/classes/CssAtrule.ts
  timestamp: 2022-01-22T03:47:26.737Z */


var fixAtruleName = s => calcVariables.calcVariables(trim.trim(removeComments.removeComments(s), '\\s@;'));

class CssAtrule extends utils.NodeDirty {
  constructor(...args) {
    super(...args);
    this.type = 1
    /* ATRULE */
    ;
  }

  // readonly data!: [string, string] // = [NULL, EMPTY]
  get name() {
    var data0 = this.data[0];
    return (!data0 || data0[0] === '@' ? '' : '@') + data0 || 'null';
  }

  set name(s) {
    this.data[0] = fixAtruleName(s);
  }

  get value() {
    return this.data[1] || '';
  }

  set value(s) {
    this.data[1] = fixAtruleName(s);
  }

  __raw__(s) {
    var __s__ = fixAtruleName(s);

    var __d__ = getDelimeter.getDelimeter(__s__);

    var [name, value] = __s__.replace(/\s*(?=[^\w-])\s*/, __d__).split(__d__);

    this.data[0] = name || 'null', this.data[1] = value;
    return s;
  }

  get isMedia() {
    return /^\s*@?(?:media|supports)\b/.test(this.name);
  }

  toString() {
    var name = this.name;
    var value = this.value;

    if (this.isMedia) {
      var i = this.index;
      var program = this.__program__;
      var tempArr = [this.value];
      var node;
      var deep = this.deep;

      while (--i >= 0 && deep) {
        node = program[i];

        if (node.type !== 0
        /* COMMENT */
        ) {
          if (node.type === 1
          /* ATRULE */
          && node.name === name) {
            if (node.deep < deep) tempArr.unshift(node.value);
          }

          if (node.deep < deep) deep = node.deep;
        }
      } // prettier-ignore


      var atruleValues = unique.unique([].concat(...tempArr.map(v => trim.trim(v).split(/\s*\band\b\s*/))));
      value = atruleValues.join(' and ');
    }

    if (name === '@media') {
      value = value.replace(/(?:(?:min|max)-)?([\w]+)\s*([<>]=)\s*/g, (_, _attr, _type) => (_type === '>=' ? 'min' : 'max') + '-' + _attr + ':');
    }

    return name + (value ? ' ' : '') + value;
  }

}

exports.CssAtrule = CssAtrule;
