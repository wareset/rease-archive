import { trim } from '@wareset-utilites/string/trim'

import { FLAGS } from '../lib/__flags__'

import { NodeDirty } from './utils'
import { selector2List } from '../lib/selector2List'
import { removeComments } from '../../utils/removeComments'

export class CssSelector extends NodeDirty {
  readonly type = FLAGS.SELECTOR
  // readonly data!: [string] // = ['&']

  get value(): string {
    return this.data[0] || ''
  }
  set value(s: string) {
    this.__raw__(s)
  }

  __raw__(s: string): string {
    this.data[0] = trim(removeComments(s))
    return s
  }

  toString(): string {
    return this.toSchema().join('') || 'null'
  }

  toSchema(): string[] {
    let i = this.index
    const program = this.__program__
    const tempArr: string[] = [this.value]
    let node: any
    let deep = this.deep
    while (i-- && deep) {
      node = program[i]
      if (node.type !== FLAGS.COMMENT) {
        if (node.type === FLAGS.SELECTOR) {
          if (node.deep < deep) tempArr.unshift(node.value)
        }

        if (node.deep < deep) deep = node.deep
      }
    }

    // console.log(tempArr)
    const res = selector2List(tempArr)
    return res || ['null']
  }
}
