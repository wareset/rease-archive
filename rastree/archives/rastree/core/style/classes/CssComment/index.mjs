/* eslint-disable */
/*
dester builds:
core/style/classes/CssComment.ts
*/
import { startsWith } from '@wareset-utilites/string/startsWith';
import { endsWith } from '@wareset-utilites/string/endsWith';
import { trim } from '@wareset-utilites/string/trim';
import { NodeDirty } from '../utils';
/* filename: core/style/classes/CssComment.ts
  timestamp: 2022-01-22T03:47:29.432Z */

var createCommentValue = value => (value = trim(value)) && value.slice(startsWith(value, '/*') || startsWith(value, '//') ? 2 : 0, startsWith(value, '/*') && endsWith(value, '*/') ? -2 : void 0);

class CssComment extends NodeDirty {
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

export { CssComment };
