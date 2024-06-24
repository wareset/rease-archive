import { startsWith } from '@wareset-utilites/string/startsWith'
import { endsWith } from '@wareset-utilites/string/endsWith'
import { trim } from '@wareset-utilites/string/trim'

import { FLAGS } from '../lib/__flags__'

import { NodeDirty } from './utils'

const createCommentValue = (value: string): string =>
  (value = trim(value)) &&
  value.slice(
    startsWith(value, '/*') || startsWith(value, '//') ? 2 : 0,
    startsWith(value, '/*') && endsWith(value, '*/') ? -2 : void 0
  )

export class CssComment extends NodeDirty {
  readonly type = FLAGS.COMMENT
  // readonly data!: [string] // = [EMPTY]

  get value(): string {
    return '/*' + this.data[0] + '*/'
  }
  set value(v: string) {
    this.__raw__(v)
  }

  __raw__(s: string): string {
    this.data[0] = createCommentValue(s)
    return s
  }

  toString(): string {
    return this.value
  }
}
