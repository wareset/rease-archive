import { hash } from '../utilites/hash'
import { safeRemoveQuotes } from '../utilites'

import {
  jsx2tokens, TypeToken,
  stringifyTokens,
  TOKEN_TYPES as TYPES
} from '../jsx2tokens'

const STYLE_TYPES = {
  // COMMENT_LINE : 'CommentLine',
  // COMMENT_BLOCK: 'CommentBlock',
  BRACE        : 'Brace',
  AT_RULE_LINE : 'AtRuleLine',
  AT_RULE_BLOCK: 'AtRuleBlock',
  SELECTOR     : 'Selector',
  KEYFRAME     : 'Keyframe',
  ATTRIBUTE    : 'Attribute',
}

type TypeStyleToken = {
  deep: number, type: typeof STYLE_TYPES[keyof typeof STYLE_TYPES], data: string[]
}

function strEscape(s: string): string { return JSON.stringify(s).slice(1, -1) }
function last <T>(list: T[]): T | undefined {
  let res: any
  for (let i = list.length; i-- > 0;) if ((res = list[i]) !== void 0) break
  return res
}
// function removeSpaces(s: string): string { return s.replace(/\s+/g, '') }
// function trimStart(s: string): string { return s.replace(/^\s/, '') }
function trimEnd(s: string): string { return s.replace(/\s+$/, '') }
// function trim(s: string): string { return s.trim() }

function tokenize(
  a: string,
  proxy?: (v: TypeStyleToken, k: number, a: TypeStyleToken[]) => any
): TypeStyleToken[] {
  const res: TypeStyleToken[] = []
  const l = a.length
  let isSpace = true, isSpacePrev = isSpace
  let deepCircle = 0
  let ch0: string, s: string, n: number, b: boolean

  let raw = '', deep = 0, data: string[] = []
  let keyframesDeep = -1
  let isKeyframes = false

  function save(type: typeof STYLE_TYPES[keyof typeof STYLE_TYPES]): void {
    if ((raw = trimEnd(raw)) && data.push(raw) || data.length) {
      // console.log(type, s.replace(/\s/g, '.'))

      if (data[0][0] === '@') {
        raw = data.shift()!, n = raw.match(/@[\w-]+/)![0].length
        if (n < raw.length - 1) data.unshift(raw.slice(raw[n] === ' ' ? n + 1 : n))
        data.unshift(raw.slice(0, n))

        type = type === STYLE_TYPES.SELECTOR
          ? (
            !isKeyframes && data[0] === '@keyframes' &&
            (isKeyframes = true, keyframesDeep = deep),
            STYLE_TYPES.AT_RULE_BLOCK
          )
          : STYLE_TYPES.AT_RULE_LINE
      } else if (isKeyframes) {
        if (type === STYLE_TYPES.BRACE && data[0] === '}' && deep <= keyframesDeep) {
          isKeyframes = false
        } else if (type === STYLE_TYPES.SELECTOR) type = STYLE_TYPES.KEYFRAME
      }

      if (type === STYLE_TYPES.ATTRIBUTE) {
        data.unshift(...data.shift()!.split(/(:)/))
      }

      res.push({ deep, type, data }), raw = '', data = []
      if (proxy) proxy(res[res.length - 1], res.length, res)
    }
  }

  for (let i = -1; ++i < l;) {
    if ((isSpacePrev = isSpace) ===
      (isSpace = (ch0 = a[i]).trim() ? false : (ch0 = ' ', true))) {
      if (isSpace) continue
    }

    switch (ch0) {
      case '{':
        raw = trimEnd(raw), isSpace = true
        deepCircle
          ? raw += ch0
          : (save(STYLE_TYPES.SELECTOR), raw = ch0, save(STYLE_TYPES.BRACE), deep++)
        break
      case '}':
        raw = trimEnd(raw), isSpace = true
        deepCircle
          ? raw += ch0
          : (save(STYLE_TYPES.ATTRIBUTE), deep > 0 && deep--, raw = ch0, save(STYLE_TYPES.BRACE))
        break
      case ';':
        raw = trimEnd(raw), isSpace = true
        deepCircle ? raw += ch0 : save(STYLE_TYPES.ATTRIBUTE)
        break
      case '(':
        deepCircle++
      // eslint-disable-next-line no-fallthrough
      case '[':
        isSpace = true
        deepCircle < 2 && (raw && data.push(raw), raw = '')
        raw += ch0
        break
      case ')':
        deepCircle--
      // eslint-disable-next-line no-fallthrough
      case ']':
        raw = trimEnd(raw) + ch0
        deepCircle || (data.push(raw), raw = '')
        break
      case ',':
        isSpace = true
        raw = trimEnd(raw)
        deepCircle
          ? raw += ch0
          : (raw && data.push(raw), data.push(ch0), raw = '')
        break
      case ':':
      case '=':
        isSpace = true
        raw = trimEnd(raw) + ch0
        break
      case '`':
      case "'":
      case '"':
        raw += ch0
        for (b = !1; ++i < l && (raw += a[i], b || a[i] !== ch0); b = b ? !1 : a[i] === '\\');
        break
      case '/':
        if ((s = a[i + 1]) === '*') {
          s = raw, raw = ch0, isSpace = isSpacePrev
          // for (;++i < l && (raw += a[i], !(raw.length > 3 && /\*\/$/.test(raw)));); raw = s
          for (;++i < l && (raw += a[i],
          !(raw.length > 3 && a[i] === '/' && a[i - 1] === '*'));); raw = s
        } else if (s === '/') {
          s = raw, raw = ch0, isSpace = isSpacePrev
          // for (;++i < l && (raw += a[i], /[^\r\n\u2028\u2029]/.test(a[i]));); raw = s
          for (;++i < l && (raw += a[i],
          /[^\r\n\u2028\u2029]/.test(a[i]));); raw = s
        } else if (ch0) {
          raw += ch0
        }
        break
      default:
        raw += ch0
    }
  }
  save(STYLE_TYPES.ATTRIBUTE)

  return res
}

function getSelectors(a: string[], prev: string[]): string[] {
  const res: string[] = []
  let cur: string[] = []
  let isAmpersand = false, s: string
  for (let c: string, l = a.length, i = -1; i++ < l;) {
    if (i === l || (c = a[i]) === ',') {
      isAmpersand ||
        (cur[0] && !/^[|>+~\s]/.test(cur[0]) && cur.unshift(' '), cur.unshift('&'))

      for (let i = -1; ++i < prev.length;) {
        s = cur.map(function (this: [string], v) {
          return v === '&' ? this[0] : v
        }, [prev[i]])
          .join('')
          .replace(/^[\s,&|>+~]+|[\s,&|>+~]+$/g, '')
        s && res.push(s)
      }

      isAmpersand = false, cur = []
    } else {
      // eslint-disable-next-line no-lonely-if
      if (c[0] === '(' || c[0] === '[') cur.push(c)
      else {
        for (let a = c.split(/(&)|\s*([|>+~\s])\s*/), i = -1; ++i < a.length;) {
          if (a[i]) {
            if ((c = a[i]) === '&') isAmpersand = true
            else c = c.replace(/\._(\w+)/g, '%REASE%SELECTOR%$1') // /\.?\b\$(\w+)/g
            
            cur.push(c)
          }
        }
      }
    }
  }
  // console.log(111, res)

  return res
}

function getMedia(a: string[], prev: string[]): string[] {
  const res: string[] = []
  let cur: string[] = []
  let s: string
  for (let c: string, l = a.length, i = -1; i++ < l;) {
    if (i === l || (c = a[i]) === ',') {
      if (s = cur.join('')) {
        for (let i = -1; ++i < prev.length;) {
          res.push(prev[i] ? `${prev[i]} and ${s}` : s)
        }
      }
      cur = []
    } else {
      cur.push(c)
    }
  }
  // console.log(222, res)

  return res
}

function getBlockParents(
  a: (string | undefined)[]
): string[] {
  const blocks: string[] = []
  // const selectors: string[] = []
  let selector = ''
  let mediaDeep!: number
  for (let c: string | undefined, i = -1; ++i < a.length;) {
    if (c = a[i]) {
      if (c[0] !== '@') selector = c
      else {
        if (/^@media\b/.test(c)) {
          if (mediaDeep != null) blocks.splice(mediaDeep, 1)
          mediaDeep = blocks.length
        }
        blocks.push(c)
        // ;(/^@(?:media|supports|container)\b/.test(c) ? blocks : selectors).push(c)
      }
    }
  }

  if (selector) blocks.push(selector)
  return blocks
}

type TypeSchema = [string[], string][]

// type TypeSchemaItem = { [key: string]: {
//   attrs?: any[]
//   children?: TypeSchemaItem
// } }

function setInSchema(
  schema: TypeSchema,
  blocks: string[],
  attr: string
): void {
  schema.push([blocks, attr])
  // const key = '' + blocks
  // let cur: any = schema[key] || (schema[key] = {})

  // for (let l = blocks.length, i = -1; i++ < l;) {
  //   if (i === l) {
  //     cur = cur.attrs || (cur.attrs = []), cur.push(attr)
  //   } else {
  //     cur = cur.children || (cur.children = {})
  //     cur = cur[blocks[i]] || (cur[blocks[i]] = {})
  //   }
  // }
}

function createStyle(schema: TypeSchema): string {
  // let res = ''
  // for (const k in schema) {
  //   res += strEscape(k) + '{'
  //   if (schema[k].attrs) res += schema[k].attrs!.join(';')
  //   if (schema[k].children) res += createStyle(schema[k].children!)
  //   res += '}'
  // }

  let res = ''
  let last: string[] = [], j = 0
  let blocks: string[], attr: string
  for (let i = -1; i++ < schema.length;) {
    ;[blocks, attr] = schema[i] || [[], '']
    for (j = last.length; j > 0;) {
      if ('' + last.slice(0, j) === '' + blocks.slice(0, j)) break
      if (res[res.length - 1] === ';') res = res.slice(0, -1)
      res += '}', j--
    }
    for (;j < blocks.length; j++) res += strEscape(blocks[j]) + '{'
    if (attr) res += attr + ';'
    last = blocks
  }

  return res
}

function buildCss(s: string, REPLACERS: { [key: string]: string }): string {
  return s.replace(/(%REASE%PROP%\d+%)/g,
    function (_f, replacer) {
      return replacer in REPLACERS ? '"+(' + REPLACERS[replacer] + ')+"' : replacer
    }).trim()
}

function create_css(
  source: string, hash: string, _cssAlias: string
): string {
  source = source.trim()
  if (source[0] !== '`') throw source

  const identifiers: any = {}
  const tokens = jsx2tokens(source, {
    useJSX: false,
    proxy(token) {
      if (token.type === TYPES.IDENTIFIER) identifiers[token.value] = true
    }
  })

  let n = 0
  let _s = '_s'; while (_s + n in identifiers) n++; _s += n
  let _p = '_p'; while (_p + n in identifiers) n++; _p += n

  let counter = 0
  const deep0 = tokens[0].deep

  const REPLACERS: { [key: string]: string } = {}

  let repkey: string | null = null
  source = ''
  for (let token: TypeToken, i = tokens.length; i-- > 0;) {
    token = tokens[i]
    if (token.deep === deep0) {
      repkey = null
      source = (token.value = safeRemoveQuotes(token.value)) + source
    } else if (repkey == null) {
      token.type = TYPES.MODIFIER
      REPLACERS[repkey = `%REASE%PROP%${counter++}%`] = token.value
      source = (token.value = repkey) + source
    } else {
      tokens.splice(i, 1)
      REPLACERS[repkey] = token.value + REPLACERS[repkey]
    }
  }

  // console.log(source)
  // console.log(REPLACERS)

  const SELECTORS: (undefined | string[])[] = []
  const MEDIA: (undefined | string[])[] = []
  const BLOCKS: (undefined | string)[] = []

  const SCHEMA: TypeSchema = []

  const PROPS_CACHE: any = {}
  const PROPS_LIST: string[] = []

  tokenize(source, function ({ deep, type, data }) {
    // console.log({ deep, type }, data)

    switch (type) {
      case STYLE_TYPES.BRACE:
        if (data[0] === '}') {
          // if (SELECTORS.length > deep) SELECTORS.length = deep
          // if (MEDIA.length > deep) MEDIA.length = deep
          // if (BLOCKS.length > deep) BLOCKS.length = deep
          SELECTORS.length = MEDIA.length = BLOCKS.length = deep
          SELECTORS[deep] = MEDIA[deep] = BLOCKS[deep] = void 0
        }
        break
      case STYLE_TYPES.SELECTOR:
        // SELECTORS[deep] = void 0
        SELECTORS[deep] = getSelectors(data, last(SELECTORS) || [''])
        BLOCKS[deep] = last(SELECTORS)!.join(',')
        break
      case STYLE_TYPES.KEYFRAME:
        // console.log({ deep, type }, data)
        BLOCKS[deep] = data.join('')
        break
      case STYLE_TYPES.AT_RULE_BLOCK:
        switch (data[0]) {
          case '@media':
            // MEDIA[deep] = void 0
            MEDIA[deep] = getMedia(data.slice(1), last(MEDIA) || [''])
            BLOCKS[deep] = data[0] + ' ' + last(MEDIA)!.join(',')
            break
          // case '@supports':
          // case '@container':
          default:
            BLOCKS[deep] = data[0] + (data.length > 1 ? ' ' + data.slice(1).join('') : '')
        }
        break
      case STYLE_TYPES.AT_RULE_LINE:
        setInSchema(
          SCHEMA,
          getBlockParents(BLOCKS),
          strEscape(data[0] + (data.length > 1 ? ' ' + data.slice(1).join('') : ''))
        )
        break
      case STYLE_TYPES.ATTRIBUTE:
        setInSchema(
          SCHEMA,
          getBlockParents(BLOCKS),
          strEscape(data.join('')).replace(/^\s*(\w[\w-]*)\s*:/, function (_, prop) {
            if (!(prop in PROPS_CACHE)) {
              PROPS_CACHE[prop] = PROPS_LIST.length, PROPS_LIST.push(prop)
            }
            return `"+${_p}[${PROPS_CACHE[prop]}]+"`
          })
        )
        break
      default:
    }
  })

  // console.log(SCHEMA)

  let code = '"' + createStyle(SCHEMA) + '"'

  // console.log(code)

  const REASE_SELECTORS_CACHE: any = {}
  const REASE_SELECTORS_LIST: string[] = []

  code = code
    .replace(/%REASE%SELECTOR%(\w+)/g, function (_, selector) {
      if (!(selector in REASE_SELECTORS_CACHE)) {
        REASE_SELECTORS_CACHE[selector] = REASE_SELECTORS_LIST.length
        REASE_SELECTORS_LIST.push(selector)
      }
      return `"+${_s}+"${REASE_SELECTORS_CACHE[selector]}`
    })

  // console.log(code)

  code = code.replace(/""\s*\+\s*/g, '')
  code = buildCss(code, REPLACERS)

  // console.log(code)

  const res = `{
    id: "${hash}",
    _: (${_p}${REASE_SELECTORS_LIST.length ? ', ' + _s : ''}) => (${code}),
    init() {
      return ${_cssAlias}.i(
        this,
        ${JSON.stringify(REASE_SELECTORS_LIST)},
        ${JSON.stringify(PROPS_LIST)}
      )
    }
  }`

  return res
}

export function css(
  source: string,
  {
    salt = '',
    useJSX = false,
    importPath = 'rease/css'
  } = {}
): any {
  let HASH = hash(source, 0, true)
  // const reg = new RegExp(`\\bimport\\s+([^\\s{}]+)\\s+from\\s*['"\`]${importPath}['"\`]`)
  // const matches = source.match(reg)

  const reg = /\bimport\b\s*(?:(?:\/\*.*?\*\/)?\s*(?:\/\/[^\n]*)?\s*)*([^]+?)(?:(?:\/\*.*?\*\/)?\s*(?:\/\/[^\n]*)?\s*)*\bfrom\b\s*(?:(?:\/\*.*?\*\/)?\s*(?:\/\/[^\n]*)?\s*)*['"`]([^'"`]+)['"`]/g

  let SUGAR_CSS!: string
  for (let m: any; m = reg.exec(source);) {
    if (m[2] === importPath) {
      SUGAR_CSS = m[1]
      source = source.replace(
        m[0],
        `import { ${SUGAR_CSS === 'css' ? SUGAR_CSS : 'css as ' + SUGAR_CSS} } from 'rease'`
      )
      break
    }
  }

  if (SUGAR_CSS) {
    let offset = 0, css = '', css_new = ''
    for (;(offset = source.indexOf(SUGAR_CSS + '`', offset)) > -1;) {
      css = stringifyTokens(jsx2tokens(source.slice(offset + SUGAR_CSS.length), {
        useJSX,
        proxy(token) {
          return token.deep === 0 && token.value[token.value.length - 1] === '`'
        }
      }))

      css_new = create_css(css, HASH = hash(HASH + salt), SUGAR_CSS)

      source =
        source.slice(0, offset) +
        css_new +
        source.slice(offset + css.length + SUGAR_CSS.length)

      // console.log(offset)
      // console.log(css)
      offset += css_new.length
    }
  }

  // console.log(source)

  return source
}
