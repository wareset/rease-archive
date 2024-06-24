/* eslint-disable */
/*
dester builds:
core/style/classes/CssSelector.ts
*/
import { trim } from '@wareset-utilites/string/trim';
import { NodeDirty } from '../utils';
import { selector2List } from '../../lib/selector2List';
import { removeComments } from '../../../utils/removeComments';
/* filename: core/style/classes/CssSelector.ts
  timestamp: 2022-01-22T03:47:33.230Z */

class CssSelector extends NodeDirty {
  constructor(...args) {
    super(...args);
    this.type = 2
    /* SELECTOR */
    ;
  }

  // readonly data!: [string] // = ['&']
  get value() {
    return this.data[0] || '';
  }

  set value(s) {
    this.__raw__(s);
  }

  __raw__(s) {
    this.data[0] = trim(removeComments(s));
    return s;
  }

  toString() {
    return this.toSchema().join('') || 'null';
  }

  toSchema() {
    var i = this.index;
    var program = this.__program__;
    var tempArr = [this.value];
    var node;
    var deep = this.deep;

    while (i-- && deep) {
      node = program[i];

      if (node.type !== 0
      /* COMMENT */
      ) {
        if (node.type === 2
        /* SELECTOR */
        ) {
          if (node.deep < deep) tempArr.unshift(node.value);
        }

        if (node.deep < deep) deep = node.deep;
      }
    } // console.log(tempArr)


    var res = selector2List(tempArr);
    return res || ['null'];
  }

}

export { CssSelector };
