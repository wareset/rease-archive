import { trim } from '@wareset-utilites/string/trim'

import { FLAGS } from '../lib/__flags__'

import { NodeDirty } from './utils'
import { getDelimeter } from '../../utils/getDelimeter'
import { removeComments } from '../../utils/removeComments'

export class CssAttribute extends NodeDirty {
  readonly type = FLAGS.ATTRIBUTE
  // readonly data!: [string, string] // = [NULL, NULL]

  get name(): string {
    return this.data[0] || 'null'
  }
  set name(s: string) {
    this.data[0] = trim(removeComments(s), '\\s:')
  }
  get value(): string {
    return this.data[1] || 'null'
  }
  set value(s: string) {
    this.data[1] = trim(removeComments(s), '\\s;')
  }

  __raw__(s: string): string {
    const __d__ = getDelimeter(s)
    const [name, value] = s.replace(/\s*(:|\s)\s*/, __d__).split(__d__)
    this.name = name || 'null', this.value = value || 'null'
    return s
  }

  toString(): string {
    return this.toSchema().join(': ')
  }

  toSchema(): [string, string] {
    return [this.name, this.value]
  }
}
