import { trim } from '@wareset-utilites/string/trim'
import { unique } from '@wareset-utilites/unique'

import { FLAGS } from '../lib/__flags__'

import { NodeDirty } from './utils'
import { calcVariables } from '../lib/calcVariables'
import { getDelimeter } from '../../utils/getDelimeter'
import { removeComments } from '../../utils/removeComments'

const fixAtruleName = (s: string): string =>
  calcVariables(trim(removeComments(s), '\\s@;'))

export class CssAtrule extends NodeDirty {
  readonly type = FLAGS.ATRULE
  // readonly data!: [string, string] // = [NULL, EMPTY]

  get name(): string {
    const data0 = this.data[0]
    return (!data0 || data0[0] === '@' ? '' : '@') + data0 || 'null'
  }
  set name(s: string) {
    this.data[0] = fixAtruleName(s)
  }
  get value(): string {
    return this.data[1] || ''
  }
  set value(s: string) {
    this.data[1] = fixAtruleName(s)
  }

  __raw__(s: string): string {
    const __s__ = fixAtruleName(s)
    const __d__ = getDelimeter(__s__)
    const [name, value] = __s__.replace(/\s*(?=[^\w-])\s*/, __d__).split(__d__)
    this.data[0] = name || 'null', this.data[1] = value
    return s
  }

  get isMedia(): boolean {
    return /^\s*@?(?:media|supports)\b/.test(this.name)
  }

  toString(): string {
    const name = this.name
    let value = this.value
    if (this.isMedia) {
      let i = this.index
      const program = this.__program__
      const tempArr: string[] = [this.value]
      let node: any
      let deep = this.deep
      while (--i >= 0 && deep) {
        node = program[i]
        if (node.type !== FLAGS.COMMENT) {
          if (node.type === FLAGS.ATRULE && node.name === name) {
            if (node.deep < deep) tempArr.unshift(node.value)
          }

          if (node.deep < deep) deep = node.deep
        }
      }

      // prettier-ignore
      const atruleValues: string[] = unique([].concat(
        ...(tempArr.map((v) => trim(v).split(/\s*\band\b\s*/)) as any)
      ) as string[])

      value = atruleValues.join(' and ')
    }

    if (name === '@media') {
      value = value.replace(
        /(?:(?:min|max)-)?([\w]+)\s*([<>]=)\s*/g,
        (_, _attr, _type) => (_type === '>=' ? 'min' : 'max') + '-' + _attr + ':'
      )
    }

    return name + (value ? ' ' : '') + value
  }
}
