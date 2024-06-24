import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { instanceOf } from '@wareset-utilites/lang/instanceOf'
import { repeat } from '@wareset-utilites/string/repeat'
import { isArray } from '@wareset-utilites/is/isArray'
import { trim } from '@wareset-utilites/string/trim'

import { FLAGS } from '../lib/__flags__'

import { ProgramDirty, NodeDirty } from './utils'

import { TypeToken } from '../lib/source2Tokens'

import { CssComment } from './CssComment'
import { CssAtrule } from './CssAtrule'
import { CssAttribute } from './CssAttribute'
import { CssKeyframe } from './CssKeyframe'
import { CssSelector } from './CssSelector'

const CLASSES: any = {
  [FLAGS.COMMENT]  : CssComment,
  [FLAGS.ATRULE]   : CssAtrule,
  [FLAGS.ATTRIBUTE]: CssAttribute,
  [FLAGS.KEYFRAME] : CssKeyframe,
  [FLAGS.SELECTOR] : CssSelector
}

export interface TypeCssProgramToCodeOptions {
  indent?: string
  concise?: boolean
  global?: boolean
  scoper?: string
  minify?: boolean
}

export type TypeSchema = [FLAGS, string[], string[]][]

export const CSS_PROGRAM_TO_CODE_OPTIONS: TypeCssProgramToCodeOptions = {
  indent : '\t',
  concise: false,
  global : true,
  scoper : '[scoped]',
  minify : false
}

const normalizeSelector = (
  arr: string[],
  options: TypeCssProgramToCodeOptions
): string => {
  const { global, scoper = CSS_PROGRAM_TO_CODE_OPTIONS.scoper! } = options
  arr = arr.map((v) => {
    if (v === ':global') v = ''
    else if (v === ':scoped') v = scoper
    else if (v === ':stated') v = global ? '' : scoper
    return v
  })
  return arr.join('')
}

export class CssProgram extends ProgramDirty {
  constructor(tokens: TypeToken[]) {
    super()
    forEachLeft(tokens, (v: TypeToken) => {
      const ClassName = CLASSES[v[1]]
      if (ClassName) this.push(new ClassName({ deep: v[0], raw: v[2] }))
    })
  }

  toSchema(): TypeSchema {
    const res: any = []
    let i: number, node: any, deep: number, type: string | number
    let i2: number, node2: any, deep2: number, type2: string | number
    // let pCount: number

    forEachLeft(this, (v, str) => {
      if (instanceOf(v, NodeDirty) && (str = v.toSchema())) {
        // ;({ deep, type } = v)
        res.push([v.deep, v.type, [], [], str])
      }
    })

    // BEGIN SEPARATATION SUPPORTS AND MEDIA FN
    const sets = (cb: Function): void => {
      let now: any
      let i = -1
      while (++i < res.length) {
        node = res[i], deep = node[0], type = node[1]

        if (cb()) now = node, res.splice(i, 1), --i
        else if (now && node[0] <= now[0] && type !== FLAGS.COMMENT) now = 0
        else if (now && node[0] > now[0]) node[2].push(now[4]), --node[0]
      }
    }

    sets(() => type === FLAGS.ATRULE && /^\s*@supports\b/.test(node[4]))
    sets(() => type === FLAGS.ATRULE && /^\s*@media\b/.test(node[4]))
    // END SEPARATATION SUPPORTS AND MEDIA FN

    i = -1
    let isMedia: boolean
    let needRemove: boolean
    while (++i < res.length) {
      node = res[i], deep = node[0], type = node[1]

      // if (type === TYPE_CSS_ATTRIBUTE) {
      //   i2 = i
      //   second: while (++i2 < len(res)) {
      //     ;(node2 = res[i2]), (deep2 = node2[0]), (type2 = node2[1])
      //     if (type2 !== TYPE_COMMENT && deep2 < deep) break second
      //     if (type2 === TYPE_CSS_ATTRIBUTE && deep2 === deep) {
      //       if (EMPTY + node[2] === EMPTY + node2[2])
      //         node.push(node2[4]), splice(res, i2--, 1)
      //     }
      //   }
      // }

      if (type !== FLAGS.ATTRIBUTE && type !== FLAGS.COMMENT) {
        i2 = i
        needRemove = false
        isMedia = /^\s*@(?:media|supports)\b/.test(node[4])
        if (isMedia) needRemove = true
        while (++i2 < res.length) {
          node2 = res[i2], deep2 = node2[0], type2 = node2[1]
          if (type2 !== FLAGS.COMMENT && deep2 <= deep) break
          if (deep2 > deep) {
            needRemove = true

            if (isMedia) node2[2].push(node[4])
            else {
              if (node[4][0] === '@') {
                node2[3] = node2[3].filter((v: string) => v[0] === '@')
              } else if (type === FLAGS.SELECTOR) node2[3].length = 0

              node2[3].push(node[4])
            }
          }
        }
        if (needRemove) res.splice(i--, 1)
      }
    }

    i = -2
    let i3 = 0
    while (++i < res.length) {
      node = res[i] || ['', '', '', '', '']

      // if (node[1] === TYPE_COMMENT && (len(node[2]) || len(node[3]))) {
      //   ;[node[2], node[3]] = res[i - 1]
      //     ? [res[i - 1][2], res[i - 1][3]]
      //     : [[], []]
      // }

      if (!node._t) node._t = node[2] + '|' + node[3]
      // if (node._t !== '|') {
      i3 = 0
      i2 = i
      while (++i2 < res.length) {
        node2 = res[i2]
        if (!node2._t) node2._t = node2[2] + '|' + node2[3]

        if (node._t === node2._t) {
          if (node[4] === node2[4]) res.splice(i2--, 1)
          else if (i2 - i > 1) {
            res.splice(i2, 1), res.splice(i + ++i3 + 1, 0, node2)
          }
        }
      }
      // }
    }

    // console.log(res)
    return res.map(([, type, media, path, attrs]: any) => [
      type,
      [...media, ...path],
      attrs
    ])
  }

  toCode(
    arr?: TypeSchema | TypeCssProgramToCodeOptions,
    options?: TypeCssProgramToCodeOptions
  ): string {
    if (!isArray(arr)) options = arr, arr = this.toSchema()
    return CssProgram.toCode(arr, options)
  }

  static toCode(
    arr: TypeSchema,
    options?: TypeCssProgramToCodeOptions
  ): string {
    options = { ...CSS_PROGRAM_TO_CODE_OPTIONS, ...options || {} }
    const { indent, minify, concise } = options

    const SEP = minify ? '' : ' '
    const CRLF = minify ? '' : '\n'
    const IND = minify ? '' : '' + indent
    const SEMI = ':' + (minify ? '' : ' ')

    const FBO = !minify && concise ? '' : '{'
    const FBC = !minify && concise ? '' : '}'
    const CSP = !minify && concise ? '' : ';'

    let res = ''
    let start = ''
    let space = ''
    let temp: any = []

    let lk = 0
    let is: boolean
    forEachLeft(arr, (v: any) => {
      if (!minify || v[0] !== FLAGS.COMMENT) {
        const __l1__ = v[1].length
        const __t1__ = repeat(IND, __l1__)
        const COMMA = v[0] === FLAGS.COMMENT ? '' : CSP
        const attr =
          CRLF + __t1__ + (isArray(v[2]) ? v[2].join(SEMI) : v[2]) + COMMA

        start = ''
        space = ''
        is = false
        const cache: any[] = []
        if (!v[1].length) res += repeat(FBC, lk)
        forEachLeft(v[1], (v2: any, k2: any) => {
          if (isArray(v2)) v2 = normalizeSelector(v2, options!)
          cache.push(v2)

          if (!space) space = SEP
          if (temp[k2] !== v2) {
            temp = []
            if (!is) is = !!(res += repeat(FBC, lk - k2))
            start += CRLF + repeat(IND, k2) + v2 + SEP + FBO
          }
        })

        res += start + attr + space
        temp = [...cache]
        lk = __l1__
      }
    })

    res += repeat(FBC, lk)
    res = trim(res) + CRLF

    // const { global, scoper } = options
    // if (!isVoid(global) || !isVoid(scoper)) {
    //   res = res.replace(
    //     REG_CSS_TYPE_ORIGIN,
    //     global ? CSS_TYPE_GLOBAL : CSS_TYPE_SCOPED
    //   )
    // }

    // if (!isVoid(scoper)) {
    //   res = res.replace(REG_CSS_TYPE_GLOBAL, '')
    //   res = res.replace(REG_CSS_TYPE_SCOPED, scoper || '')
    // }
    // console.log(arr)

    return res
  }
}
