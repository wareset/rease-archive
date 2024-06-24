/* eslint-disable security/detect-unsafe-regex */

import { forEachLeft } from '@wareset-utilites/array/forEachLeft'

type TagName = string
type Attributes = string
type Content = string
type ContentOffset = number
export type TypeNode = [TagName, Attributes, Content, ContentOffset]

export const splitComponent = (source: string): TypeNode[] => {
  const arr1: [string, string, string, number, number][] = []

  let i: number, indexEnd: number
  source.replace(
    /(<((?:rease-)?(?:script|style|template|options)\b)((?:\s(?:[^>`'"]+|(?:(`|'|")(?:[^\\]|\\\4|\\(?!\4).)*?(?:\4|$)))*)*?))(?:\/>|>(?:<\2[^]*?<\/\2|[^])*?(<\/\2[^]*?>))|<\/((?:rease-)?(?:script|style|template|options)\b)[^]*?>|(<!--[^]*?(?:-->|$))/g,
    (_full, _tagOp, _tagName, _attrs, _4, _tagCl, _tagFix, _cmt, _idx) => {
      // prettier-ignore
      // console.log([_full, _tagOp, _tagName, _attrs, _tagCl, _tagFix, _cmt, _idx])

      if (!_cmt) {
        if (!_tagFix) {
          indexEnd = _idx + _full.length - (_tagCl || ' ').length
          arr1.push([_tagOp, _tagName, _attrs, _idx, indexEnd])
        } else if ((i = arr1.length) && arr1.some((v) => _tagFix === v[1])) {
          while (i-- && arr1[i][1] !== _tagFix) arr1.pop()
          if (arr1[i]) arr1[i][4] = _idx
        }
      }
      return ''
    }
  )

  // console.table(arr1)

  const res: TypeNode[] = []
  forEachLeft(arr1, (v) => {
    const tagArr = v[1].split('-')
    const i = v[0].length + v[3] + 1
    res.push([tagArr[1] || tagArr[0], v[2], source.slice(i, v[4]), i])
  })

  return res
}
