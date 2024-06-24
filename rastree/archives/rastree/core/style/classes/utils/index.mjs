/* eslint-disable */
/*
dester builds:
core/style/classes/utils.ts
*/
function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import { instanceOf } from '@wareset-utilites/lang/instanceOf';
/* filename: core/style/classes/utils.ts
  timestamp: 2022-01-22T03:47:34.620Z */
// let undef: undefined
// export const $UNDEF = undef
// export const $NULL = null
// export const SPACE = ' '
// export const EMPTY = ''
// export const NULL = EMPTY + $NULL

class ProgramDirty extends Array {
  constructor(...a) {
    super(), a.length && this.push(...a);
  }

  __setParent__(a) {
    return a.filter(v => instanceOf(v, NodeDirty) && (v.__program__ = this));
  }

  unshift(...a) {
    super.unshift(...this.__setParent__(a));
    return this;
  }

  splice(n1, n2, ...a) {
    super.splice(n1, n2, ...this.__setParent__(a));
    return this;
  }

  push(...a) {
    super.push(...this.__setParent__(a));
    return this;
  }

  set(k, value) {
    this[k] = this.__setParent__([value])[0];
    return this;
  } // eslint-disable-next-line class-methods-use-this


  toString() {
    return 'null';
  }

}

var _raw = /*#__PURE__*/_classPrivateFieldLooseKey("raw");

var _program__ = /*#__PURE__*/_classPrivateFieldLooseKey("__program__");

class NodeDirty {
  // name!: string
  // value!: string
  constructor({
    raw = '',
    deep = 0
  } = {}) {
    this.type = void 0;
    this.deep = 0;
    this.data = [];
    Object.defineProperty(this, _raw, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _program__, {
      writable: true,
      value: void 0
    });
    this.raw = raw, this.deep = deep;
  }

  get raw() {
    return _classPrivateFieldLooseBase(this, _raw)[_raw];
  } // eslint-disable-next-line class-methods-use-this


  __raw__(v) {
    return v;
  } // eslint-disable-next-line grouped-accessor-pairs


  set raw(v) {
    _classPrivateFieldLooseBase(this, _raw)[_raw] = this.__raw__(v);
  }

  get __program__() {
    return _classPrivateFieldLooseBase(this, _program__)[_program__];
  }

  set __program__(v) {
    _classPrivateFieldLooseBase(this, _program__)[_program__] = v;
  }

  get index() {
    return this.__program__.indexOf(this);
  }

  remove() {
    this.__program__.splice(this.index, 1);

    return this;
  } // eslint-disable-next-line class-methods-use-this


  toString() {
    return 'null';
  }

  toSchema() {
    return this.toString();
  }

  get __toString__() {
    return this.toString();
  }

  get __toSchema__() {
    return this.toSchema();
  }

}

export { NodeDirty, ProgramDirty };
