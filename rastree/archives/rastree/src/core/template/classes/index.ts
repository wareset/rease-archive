import { findIndexRight } from '@wareset-utilites/array/findIndexRight'
import { findIndexLeft } from '@wareset-utilites/array/findIndexLeft'
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
import { trimRight } from '@wareset-utilites/string/trimRight'
import { trimLeft } from '@wareset-utilites/string/trimLeft'
import { repeat } from '@wareset-utilites/string/repeat'
import { trim } from '@wareset-utilites/string/trim'
import { last } from '@wareset-utilites/array/last'
import { throwTypeError } from '@wareset-utilites/error'

import { normalizeDeep, offset } from './utils'

import { replaceQuotes } from '../../utils/replaceQuotes'
// import { stringifyTokens } from '../lib/stringifyTokens'
import { getDelimeter } from '../../utils/getDelimeter'

import { STOREFY, storefyExpression } from './storefyExpression'
import { createTag, parseTagAttributes, fixArrayValues } from './createTag'

import {
  TypeToken,
  jsx2tokens,
  TOKEN_STRING,
  TOKEN_TEMPLATE,
  TOKEN_JSX_TAG_OPENER_START,
  TOKEN_JSX_TAG_OPENER_END,
  TOKEN_JSX_TAG_CLOSER_START,
  TOKEN_JSX_TAG_CLOSER_END,
  TOKEN_JSX_EXPRESSION_END,
  TOKEN_JSX_TEXT,
  TOKEN_JSX_COMMENT
} from '@rastree/jsx2tokens'

const fixStringAndTemplate = (tokens: TypeToken[]): void => {
  let token: TypeToken
  for (let i = 0; i < tokens.length; ++i) {
    if (
      (token = tokens[i]).type === TOKEN_STRING ||
      token.type === TOKEN_TEMPLATE
    ) {
      try {
        token.value = replaceQuotes(token.value)
      } catch (e) {
        /* */
      }
    }
  }
}

const fixTagScriptAndStyle = (tokens: TypeToken[]): void => {
  let token: TypeToken
  for (let i = 0; i < tokens.length; ++i) {
    if (
      (token = tokens[i]).type === TOKEN_JSX_TAG_OPENER_START &&
      /^(style|script)$/.test(tokens[++i].value)
    ) {
      let start = i =
        findIndexLeft(
          tokens,
          // eslint-disable-next-line no-loop-func
          (v) => v.deep === token.deep && v.type === TOKEN_JSX_TAG_OPENER_END,
          i
        ) + 1

      const end = findIndexLeft(
        tokens,
        // eslint-disable-next-line no-loop-func
        (v) => v.deep === token.deep && v.type === TOKEN_JSX_TAG_CLOSER_START,
        i
      )
      // console.log(11, start, end, tokens[i + 1])
      if (end > start) {
        const tokenJsxText = tokens[start++]
        tokenJsxText.type = TOKEN_JSX_TEXT
        tokenJsxText.deep++
        for (
          let j = 0, a = tokens.splice(start, end - start);
          j < a.length;
          ++j
        ) {
          tokenJsxText.value += a[j].value
          if (tokenJsxText.range) tokenJsxText.range[1] = a[j].range[1]
          if (tokenJsxText.loc) tokenJsxText.loc.end = a[j].loc.end
        }
      }
    }
  }

  fixStringAndTemplate(tokens)
}

const fixChildren = (list: string[], deep: number): string => {
  let count = 0
  for (let i = 0; i < list.length; ++i) {
    if (list[i]) {
      if (list[i][0] === '.') {
        count++
        list[i] = '\n' + offset(deep) + list[i]
      } else list[i] = '\n' + list[i] + ','
    } else {
      list.splice(i--, 1)
    }
  }

  let res = trim(list.join(''), ',')
  if (count) {
    if (count < list.length) res += '\n' + offset(deep)
    res += repeat(']})()', count)
  }
  return res
}

const createTemplateTree = (
  tokens: TypeToken[]
): (JsxTag | JsxText | JsxComment | JsxHtml
)[] => {
  // console.log(tokens)
  // @ts-ignore
  // console.log(ERR)
  const res: (JsxTag | JsxText | JsxComment | JsxHtml)[] = []
  let token: TypeToken, type: string, deep: number

  // prettier-ignore
  const set = (tmp?: any): TypeToken[] =>
    (tmp = tokens.splice(findIndexRight(tokens,
      (v) => v.deep === deep) + 1, tokens.length), tokens.pop(), tmp)

  let node, tmp: any, textNode!: JsxText | null
  while (tokens.length) {
    token = tokens.pop()!, { type, deep } = token
    if (
      (tmp = type === TOKEN_JSX_TAG_OPENER_END) ||
      type === TOKEN_JSX_TAG_CLOSER_END
    ) {
      textNode = null
      // prettier-ignore
      node = tmp
        ? new JsxTag(set())
        : new (JsxTag as any)(
          ...[set(), createTemplateTree(set()), set()].reverse()
        )

      res.unshift(node)
    } else if (
      (tmp = type === TOKEN_JSX_TEXT) ||
      type === TOKEN_JSX_EXPRESSION_END
    ) {
      node = tmp ? new JsxWholeText([token]) : new JsxExpression(set())

      if (!tmp && node.tokens[0] && node.tokens[0]!.value === '%') {
        const tokens = node.tokens
        if (tokens.length > 1 && last(tokens as any[]).value === '%') {
          tokens.pop()
        }
        tokens.shift()
        textNode = null
        res.unshift(new JsxHtml(tokens))
      } else if (textNode) textNode.children.unshift(node)
      else res.unshift(textNode = new JsxText([node]))
    } else if (type === TOKEN_JSX_COMMENT) {
      textNode = null
      const jsxtext = createTemplateTree(
        jsx2tokens(token.value.slice(4, -3), true).tokens
      )[0] as JsxText
      if (jsxtext) {
        node = new JsxComment(jsxtext.children)
        res.unshift(node)
      }
    } else {
      console.error(tokens)
      console.error(token)
      throwTypeError(type)
    }
  }

  return res
}

class __NodeDirty__ {
  // toString(): string {
  //   return ''
  // }

  get __toString__(): string {
    return this.toString()
  }
}

export class JsxTag extends __NodeDirty__ {
  // opener?: string[][]
  // closer?: string[][]

  tokens: TypeToken[]
  constructor(
    opener: TypeToken[],
    public children: (JsxTag | JsxText | JsxComment | JsxHtml)[] = [],
    _closer?: TypeToken[]
  ) {
    super()
    this.tokens = normalizeDeep(opener)
  }

  toString({
    deep = 0,
    salt = '',
    pre = false,
    env = null,
    tagId = [9]
  }: {
    deep?: number
    salt?: string
    pre?: boolean
    env?: TypeEnv
    tagId?: [number]
  } = {}): string {
    const attrs = parseTagAttributes(this.tokens, salt)
    // console.log(env, attrs)
    const deepOrigin = deep

    // console.log(attrs)

    let res = ''
    if (attrs.flags.rease && attrs.sys.tag === '"script"') {
      try {
        const ctx = (this as any).children[0].children[0].tokens[0].value
        if (trim(ctx)) {
          res = '...(() => {\n' + ctx + `\n${offset(deepOrigin)}return [`
        }
      } catch (e) {
        /* */
      }
    } else {
      const data = createTag(attrs, salt, deep, env, tagId)
      pre = pre || attrs.flags.pre || attrs.sys.tag === '"pre"'
      deep = data[2]++

      let childs = fixChildren(
        this.children.map((v) => v.toString({ deep, salt, pre, env, tagId })),
        deep
      )

      if (childs) childs += '\n' + offset(deep - 1)
      res = data[0] + childs + data[1]
    }

    return res
  }
}

export class JsxExpression extends __NodeDirty__ {
  tokens: TypeToken[]
  constructor(tokens: TypeToken[]) {
    super()
    this.tokens = normalizeDeep(tokens)
  }

  toString({ salt = '' } = {}): string {
    return storefyExpression(this.tokens, salt)
  }
}

export class JsxHtml extends __NodeDirty__ {
  tokens: TypeToken[]
  constructor(tokens: TypeToken[]) {
    super()
    this.tokens = normalizeDeep(tokens)
  }

  toString({ deep = 0, salt = '' } = {}): string {
    const res = storefyExpression(this.tokens, salt)

    return offset(deep) + `[3, ${res}]`
  }
}

export class JsxComment extends __NodeDirty__ {
  constructor(public children: (JsxWholeText | JsxExpression)[]) {
    super()
  }

  toString({ deep = 0, pre = false, salt = '' } = {}): string {
    const childs = this.children
      .map((v) => v.toString({ pre, salt }))
      .filter((v) => v)

    const res = childs.join(', ')
    if (!res) return ''
    return `${offset(deep)}[2, [${res}]]`
  }
}

export class JsxText extends __NodeDirty__ {
  constructor(public children: (JsxWholeText | JsxExpression)[]) {
    super()
  }

  toString({ deep = 0, pre = false, salt = '' } = {}): string {
    const childs = fixArrayValues(
      this.children.map((v) => v.toString({ pre, salt }))
    )

    const res = childs.join(', ')
    if (!res) return ''
    return `${offset(deep)}[1, [${res}]]`
  }
}

export class JsxWholeText extends __NodeDirty__ {
  tokens: [TypeToken]
  constructor(tokens: [TypeToken]) {
    super()
    this.tokens = tokens
  }

  toString({ pre = false } = {}): string {
    let value = this.tokens[0].value
    if (!pre) {
      if (/^\s*\n/.test(value)) value = trimLeft(value)
      if (/\n\s*$/.test(value)) value = trimRight(value)
    }
    if (value) value = jsonStringify(value)
    return value
  }
}

declare type TypeEnv = 'client' | 'server' | null
// export declare type TypeRastreeTemplateOptions = {
//   env?: TypeEnv
// }

export class RastreeTemplate extends __NodeDirty__ {
  salt: string
  children: (JsxTag | JsxText | JsxComment | JsxHtml)[]
  constructor(public source = '') {
    super()
    this.salt = getDelimeter(source, '_')
    // console.log(source)
    const tokens = jsx2tokens(source, true).tokens
    fixTagScriptAndStyle(tokens)
    this.children = createTemplateTree(tokens)
    console.log(this)
  }

  toString({
    pre = false,
    env = null
  }: { pre?: boolean; env?: TypeEnv } = {}): string {
    let deep = 2
    const salt = this.salt
    const tagId: [number] = [9]

    const OFFSET = offset(deep++)

    let res = this.source
      .split(/\n/)
      .map((v) => OFFSET + '// ' + v + '\n')
      .join('')

    res += OFFSET + '// prettier-ignore\n'
    res += OFFSET + ''
    res += '(' + STOREFY + salt + ') => ['
    let childs = fixChildren(
      this.children.map((v) => v.toString({ deep, salt, pre, env, tagId })),
      deep
    )
    if (childs) childs += '\n' + OFFSET
    res += childs + ']'

    return res
  }
}
