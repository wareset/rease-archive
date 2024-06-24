/* eslint-disable */
/*
dester builds:
core/style/classes/CssAttribute.ts
*/
import { trim } from '@wareset-utilites/string/trim';
import { NodeDirty } from '../utils';
import { getDelimeter } from '../../../utils/getDelimeter';
import { removeComments } from '../../../utils/removeComments';
/* filename: core/style/classes/CssAttribute.ts
  timestamp: 2022-01-22T03:47:28.124Z */

class CssAttribute extends NodeDirty {
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
    this.data[0] = trim(removeComments(s), '\\s:');
  }

  get value() {
    return this.data[1] || 'null';
  }

  set value(s) {
    this.data[1] = trim(removeComments(s), '\\s;');
  }

  __raw__(s) {
    var __d__ = getDelimeter(s);

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

export { CssAttribute };
