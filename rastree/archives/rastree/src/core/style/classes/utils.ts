import { instanceOf } from '@wareset-utilites/lang/instanceOf'

// let undef: undefined
// export const $UNDEF = undef
// export const $NULL = null
// export const SPACE = ' '
// export const EMPTY = ''

// export const NULL = EMPTY + $NULL

export class ProgramDirty extends Array {
  constructor(...a: any[]) {
    super(), a.length && this.push(...a)
  }

  __setParent__(a: NodeDirty[]): NodeDirty[] {
    return a.filter((v) => instanceOf(v, NodeDirty) && (v.__program__ = this))
  }

  unshift(...a: NodeDirty[]): any {
    super.unshift(...this.__setParent__(a))
    return this
  }
  splice(n1: number, n2: number, ...a: NodeDirty[]): any {
    super.splice(n1, n2, ...this.__setParent__(a))
    return this
  }
  push(...a: NodeDirty[]): any {
    super.push(...this.__setParent__(a))
    return this
  }
  set(k: number, value: NodeDirty): this {
    this[k] = this.__setParent__([value])[0]
    return this
  }

  // eslint-disable-next-line class-methods-use-this
  toString(): string {
    return 'null'
  }

  // get __toString__(): string {
  //   return this.toString()
  // }
}

export class NodeDirty {
  readonly type!: string | number
  deep: number = 0
  readonly data: string[] = []

  // name!: string
  // value!: string

  #raw!: string
  #__program__!: ProgramDirty

  constructor({ raw = '', deep = 0 } = {}) {
    this.raw = raw, this.deep = deep
  }

  get raw(): string {
    return this.#raw
  }
  // eslint-disable-next-line class-methods-use-this
  __raw__(v: string): string {
    return v
  }
  // eslint-disable-next-line grouped-accessor-pairs
  set raw(v) {
    this.#raw = this.__raw__(v)
  }

  get __program__(): ProgramDirty {
    return this.#__program__
  }
  set __program__(v: ProgramDirty) {
    this.#__program__ = v
  }

  get index(): number {
    return this.__program__.indexOf(this)
  }

  remove(): this {
    this.__program__.splice(this.index, 1)
    return this
  }

  // eslint-disable-next-line class-methods-use-this
  toString(): string {
    return 'null'
  }

  toSchema(): any {
    return this.toString()
  }

  get __toString__(): string {
    return this.toString()
  }

  get __toSchema__(): string {
    return this.toSchema()
  }
}
