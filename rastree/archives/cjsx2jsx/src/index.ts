import {
  TypeToken, jsx2tokens, jsxTokenize,
  TOKEN_JSX_COMMENT,
  TOKEN_SPACE, TOKEN_JSX_TAG_OPENER_END, TOKEN_JSX_TAG_CLOSER_END,
  stringifyTokens, trimTokens
} from '@rastree/jsx2tokens'

import { isChildlessTagName, chunkifyArrayBy } from '@rastree/utilites'

const TYPE_TEXT = 'text'
const TYPE_HTML = 'html'
const TYPE_CJSX = 'cjsx'

declare type TypeCjsx = typeof TYPE_TEXT | typeof TYPE_HTML | typeof TYPE_CJSX

const createTag = (tokens: TypeToken[]): [string, string] => {
  let tag = 'div'
  let id = ''
  const classesArr: string[] = []
  let attrs = ''

  chunkifyArrayBy(tokens, (v, k, a) =>
    v.deep === a[0].deep &&
    (/^[#.{(]/.test(v.value) || !v.value.trim() ||
      !!k && v.deep === a[k - 1].deep &&
      (/^[})]/.test(a[k - 1].value) || !a[k - 1].value.trim())))
    .forEach((tokens) => {
      const str = stringifyTokens(trimTokens(tokens))
      // console.log(tokens)
      if (str) {
        switch (str[0]) {
          case '#':
            id = str.slice(1).trim()
            break
          case '.':
            classesArr.push(str.slice(1).trim())
            break
          case '(':
            attrs = stringifyTokens(tokens.slice(1, -1).map((token, k, a) => {
              const deep0 = a[0].deep
              // eslint-disable-next-line prefer-const
              let { deep, type, value } = token
              if (deep === deep0) {
                if (type === TOKEN_SPACE || /^[,;]$/.test(value)) {
                  type = TOKEN_SPACE
                  value = ' '
                  if (!k || k === a.length - 1 || a[k - 1] && a[k - 1].type === TOKEN_SPACE) {
                    value = ''
                  }
                }
              }
              token.type = type
              token.value = value
              return token
            }))
            break
          default:
            tag = str
        }
      }
    })

  let classes = classesArr.join(' ').trim()
  if (id) id = ` id="${id}"`
  if (classes) classes = ` class="${classes}"`
  if (attrs) attrs = ` ${attrs}`

  const start = `<${tag}${id}${classes}${attrs}>`
  const end = isChildlessTagName(tag) ? '' : `</${tag}>`
  return [start, end]
}

export const cjsx2jsx = (source: string, minify: boolean = false): string => {
  let res = ''
  let cur: [number, TypeCjsx, string, string?] | [] = []
  const arr: any[][] = []
  let separator = ''

  let RN = ''
  let lastCur: any
  const offset = minify ? (): any => '' : (n: any): string => RN + ' '.repeat(n || 0)
  const setRes = (): void => {
    while (arr.length) {
      if (!cur[0] || arr[0][0] >= cur[0]) {
        res += (lastCur === arr[0] ? '' : offset(arr[0][0])) + arr.shift()![3]
      } else break
    }
    if (cur[2]) res += offset(cur[0]) + cur[2]
    else res += ' ' //  offset(0)
    if (cur[3]) arr.unshift(cur)
    RN = '\n'
    lastCur = cur
    cur = []
  }

  let idx = -1
  let content: string, indent: number
  void source.replace(/(?<=^|\n)([^\n]*)(?=\n|$)/g, (_full, _content, _idx) => {
    if (_content && idx < _idx && _content.trim()) {
      indent = _content.indexOf(content = _content.replace(/^\s+/, ''))
      idx = _idx += indent
      if (!separator && indent) separator = _content[0]

      // console.log([_content])

      switch (content[0]) {
        case '|': {
          const text = content.slice(/\s/.test(content[1]) ? 2 : 1) || ''
          cur = [indent, TYPE_TEXT, text]
          break
        }
        case '<': {
          const prg = jsxTokenize(source.slice(_idx), true, (token) => {
            if (token.deep === 0) {
              if (token.type === TOKEN_JSX_TAG_OPENER_END ||
                token.type === TOKEN_JSX_TAG_CLOSER_END) return true
            }
            // console.log(token)
            idx = _idx + token.range[1]
            return token.deep === 0 && token.type === TOKEN_JSX_COMMENT
          })
          const start = prg.range[0] + _idx
          const end = prg.range[1] + start
          const text = source.slice(start, end)
          cur = [indent, TYPE_HTML, text]
          break
        }
        default: {
          let text = ''
          let isComma = 0
          const tkns: any[] = []
          cur = [indent, TYPE_CJSX, '', '']
          const tokens = jsx2tokens(source.slice(_idx), false, (token, _k, a) => {
            if (isComma) isComma--
            if (token.deep === 0) {
              if (token.value === ':') {
                isComma = 2
                tkns.push(a.slice(0, -1))
                a.length = 0
              } else if (!isComma && token.type === TOKEN_SPACE) {
                if (!/\n/.test(token.value)) {
                  text = token.value.slice(1)
                  text += source.slice(_idx + token.range[1]).replace(/\r?\n[^]*$/, '')
                  if (!text.trim()) text = ''
                }
                return true
              }
            }

            // console.log(token)
            idx = _idx + token.range[1]
            return false
          })
          if (trimTokens([...tokens]).length) tkns.push(tokens)
          tkns.forEach((v) => {
            const [start, end] = createTag(v)
            cur[2] += start
            cur[3] = end + cur[3]
          })
          cur[2] += text
        }
      }

      // console.log(cur)

      if (cur[2] || cur[1] === TYPE_TEXT) setRes()
    }

    return ''
  })

  setRes()
  console.log(res)
  return res
}

export default cjsx2jsx
