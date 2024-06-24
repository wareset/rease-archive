/* eslint-disable security/detect-unsafe-regex */

import { trim } from '@wareset-utilites/string/trim'

import { FLAGS } from '../lib/__flags__'

import { NodeDirty } from './utils'
import { calcVariables } from '../lib/calcVariables'
import { removeComments } from '../../utils/removeComments'
export class CssKeyframe extends NodeDirty {
  readonly type = FLAGS.KEYFRAME
  // readonly data!: [string] // = [NULL]

  get value(): string {
    const data0 = this.data[0]
    return data0 + (/^\s*\d+(\.\d*)?\s*$/.test(data0) ? '%' : '') || 'null'
  }
  set value(s: string) {
    this.__raw__(s)
  }

  __raw__(s: string): string {
    this.data[0] = calcVariables(trim(removeComments(s)))
    return s
  }

  toString(): string {
    return this.value
  }
}
