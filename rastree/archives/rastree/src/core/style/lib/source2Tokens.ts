/* eslint-disable security/detect-unsafe-regex */

import { trim } from '@wareset-utilites/string/trim'

import { FLAGS } from './__flags__'

import { replaceQuotes } from '../../utils/replaceQuotes'

export type TypeToken = [number, FLAGS, string]

const setTokenType = (token: TypeToken | null, deepNext: number): void => {
  if (token) {
    // eslint-disable-next-line prefer-const
    let [deep, type, raw] = token

    type = FLAGS.SELECTOR
    if (raw[0] === '@') type = FLAGS.ATRULE
    else if (deep >= deepNext) type = FLAGS.ATTRIBUTE
    else if (/^\s*(from|to|\d+(\.\d*)?%?)\s*$/.test(raw)) type = FLAGS.KEYFRAME

    token[1] = type
  }
}

/*
FOR NEW VERSION

const CSS_VALUE_REGEX = /[{}]|\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|((?:(`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$)|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*(?:\)|$))*(?:\)|$))*(?:\)|$)|[^{};:/\r\n]|\/(?![/*]))+)/g
const q = 'zxc: "zxcc\\\\\\"c";qqq: (3px); calc(33 + (var(23)) s;df)  + sf; '.match(
  CSS_VALUE_REGEX
)
console.log(q)
*/

export const source2Tokens = (source: string): TypeToken[] => {
  const res: TypeToken[] = []
  let token: TypeToken | null

  let deep = 0
  let other = ''
  let trimed: string
  source.replace(
    /((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))|([{};])|(\s+)|(\burl\([^'"`][^]*?(?<!\\)\))|([^])|$/g,
    (_full, _string, _2, _comment, _punct, _space, _urlDirty, _other) => {
      // console.log([_full, _string, _comment, _punct, _space, _other])

      if (_urlDirty) {
        _urlDirty = 'url("' + _urlDirty.slice(4, -1).replace(/\s+/g, '') + '")'
        _full = _other = _urlDirty
      }

      if (_comment) {
        res.push([deep, FLAGS.COMMENT, _comment])
      } else {
        if (_space) _full = ' '
        else if (_punct) _full = ''
        else if (_string) _full = replaceQuotes(_full)

        if (_full) other += _full
        else if (trimed = trim(other)) {
          setTokenType(token, deep)
          res.push(token = [deep, FLAGS.COMMENT, trimed]), other = ''
        }

        if (_punct) {
          if (_punct === '}') deep--
          else if (_punct === '{') deep++
          setTokenType(token, deep), token = null
        }
      }

      return ''
    }
  )
  setTokenType(token!, -1)
  // console.log(res)

  return res
}
