/* eslint-disable */
/*
dester builds:
core/style/classes/CssKeyframe.ts
*/
import { trim } from '@wareset-utilites/string/trim';
import { NodeDirty } from '../utils';
import { calcVariables } from '../../lib/calcVariables';
import { removeComments } from '../../../utils/removeComments';
/* filename: core/style/classes/CssKeyframe.ts
  timestamp: 2022-01-22T03:47:30.659Z */

class CssKeyframe extends NodeDirty {
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
    this.data[0] = calcVariables(trim(removeComments(s)));
    return s;
  }

  toString() {
    return this.value;
  }

}

export { CssKeyframe };
