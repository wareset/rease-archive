import {
  jsx2tokens, TypeToken,
  stringifyTokens, trimTokens, prevRealTokenIndex, nextRealTokenIndex,
  TOKEN_TYPES as TYPES
} from '../jsx2tokens'

import { chunkifyArrayBy } from '../utilites'
// import { less2css } from '../less2css'
import { styles } from '../styles'

import { storefy as storefyDefault, isStorefy, isStorefyForExpo } from '../storefy'

// const last = <T>(v: T[] | string): T | string => v[v.length - 1]

function findTokenIndexBy(
  tokens: TypeToken[], start: number, cb: (token: TypeToken) => boolean | void
): number {
  for (let i = start + 1; i < tokens.length; i++) if (cb(tokens[i])) return i
  return -1
}

// function findTokenIndexByLeft(
//   tokens: TypeToken[], start: number, cb: (token: TypeToken) => boolean | void
// ): number {
//   for (let i = start; i-- > 0;) if (cb(tokens[i])) return i
//   return -1
// }

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function chunkifyAttributes(tokens: TypeToken[]) {
  return chunkifyArrayBy(tokens, function(token, k, a) {
    const deep0 = a[0].deep
    const { deep, type, value } = token
    if (deep === deep0) {
      if (type === TYPES.SPACE ||
      /^[,;]$/.test(value)) {
        let j: number
        if (((j = prevRealTokenIndex(a, k)) < 0 || a[j].value !== '=') &&
        ((j = nextRealTokenIndex(a, k)) < 0 || a[j].value !== '=')) {
          return true
        }
      }
    }
    return false
  }, void 0, true)
    .map((tokens) =>
      chunkifyArrayBy(trimTokens(tokens), function(token, _k, a) {
        const deep0 = a[0].deep
        const { deep, value } = token
        return deep === deep0 && value === '='
      }, void 0, true).map((v) => stringifyTokens(trimTokens(v))))
    .filter(String)
}

function fixName(s: string): string {
  return /^[$_a-z][$\w]*$/i.test(s) ? s : JSON.stringify(s)
}

function joinAttrs(...a: string[]): string {
  return a.join(', ').replace(/[,\s]+$/, '')
}

function isNativeTag(s: string): boolean {
  return s.indexOf('r-') !== 0 && /^[a-z][a-zA-Z0-9-]*$/.test(s)
}
function isReaseFragment(s: string): boolean {
  return s === 'r-fragment'
}
const ELEMENT_OR_FRAGMENT = 'ELEMENT_OR_FRAGMENT'

function isReaseRule(s: string): boolean {
  return /^r-(if|elif|else-if|else|for|watch|await|then)$/.test(s)
}
function isReaseSlot(s: string): boolean {
  return s === 'r-slot'
}
const RULE_OR_SLOT = 'RULE_OR_SLOT'

const R_COMPONENT = 'r-component'
function isReaseTag(s: string): boolean {
  return s === 'r-tag'
}
function isComponent(s: string): boolean {
  return s === R_COMPONENT || s.indexOf('r-') !== 0 && !isNativeTag(s)
}
const COMPONENT_OR_TAG = 'COMPONENT_OR_TAG'

// const HTML_OR_TEXT_OR_COMMENT = 'HTML_OR_TEXT_OR_COMMENT'

const __im__ = 0xffff
function imul(a: number, b: number): number {
  const ah = a >>> 16 & __im__
  const al = a & __im__
  const bh = b >>> 16 & __im__
  const bl = b & __im__

  return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0
}
const __rf2__ = Math.pow(2, 31)
const __rf1__ = __rf2__ - 1
function randomGenerator(seed: number) {
  return function(): number {
    return ((seed = imul(16807, seed) | 0 % __rf1__) & __rf1__) / __rf2__
  }
}

function hashNum(t: string, e?: any): number {
  let r = 1
  for (let h = (t = ((e || '') + t).replace(/\r/g, '')).length; h--;) {
    r *= (9e4 - r) / (r + t.charCodeAt(h))
  }
  return +('' + r).replace(/[-.]/g, '')
}

export function compiler(
  source: string, {
    env = 'client' as 'client' | 'server',
    salt = '',
    useJSX = true,
    
    jsxImportName = 'rease/jsx',
    envImportName = 'rease/env',
    cssImportName = 'rease/css',
    tsNocheck = true
  } = {}
): string {
  let res = ''
  if (tsNocheck) {
    res += '// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck\n'
    // '/* eslint-disable @typescript-eslint/explicit-function-return-type */\n'
  }
  // console.log(source)

  const IS_CLIENT = !(env === 'server')
  let SUGAR!: string, SUGAR_CSS!: string, JSX!: string
  const sugar1 = `^['"\`]${envImportName}`,
    sugarCSS1 = `^['"\`]${cssImportName}`,
    jsx1 = `^['"\`]${jsxImportName}`
  const identifiers: any = {}
  const tokens = jsx2tokens(source, {
    useJSX,
    considerChildlessTags: false,
    
    proxy(token, k, a) {
      if (token.type === TYPES.IDENTIFIER) {
        identifiers[token.value] = true
      } else if (!SUGAR && token.value.match(sugar1)) {
        // Выпиливаем import 'rease/sugar'
        const j = prevRealTokenIndex(a, k)
        if (j > -1 && a[j].value === 'from') {
          const deep = token.deep
          let i = k
          for (let token2: TypeToken; i-- > 0;) {
            if ((token2 = a[i]).deep === deep) {
              if (token2.value === 'import') {
                a.splice(i, k - i + 1)
                break
              }
              if (token2.type === TYPES.IDENTIFIER) SUGAR = token2.value
            }
          }
        }
      } else if (!SUGAR_CSS && token.value.match(sugarCSS1)) {
        // Выпиливаем import 'rease/css'
        const j = prevRealTokenIndex(a, k)
        if (j > -1 && a[j].value === 'from') {
          const deep = token.deep
          let i = k
          for (let token2: TypeToken; i-- > 0;) {
            if ((token2 = a[i]).deep === deep) {
              if (token2.value === 'import') {
                a.splice(i, k - i + 1)
                break
              }
              if (token2.type === TYPES.IDENTIFIER) SUGAR_CSS = token2.value
            }
          }
        }
      } else if (!JSX && token.value.match(jsx1)) {
        // Выпиливаем import 'rease/jsx'
        const j = prevRealTokenIndex(a, k)
        if (j > -1 && /^(import|type|from)$/.test(a[j].value)) {
          const deep = token.deep
          let i = k + 1
          for (let token2: TypeToken; i-- > 0;) {
            if ((token2 = a[i]).deep === deep) {
              if (token2.value === 'import') {
                JSX = 'OK'
                a.splice(i, k - i + 1)
                break
              }
            }
          }
        }
      }
    }
  })

  // console.log(SUGAR)
  // console.log(tokens)
  // throw 12
  // console.log(1212, SUGAR_CSS)

  let n = 0
  function alias(s: string): { origin: string, alias: string } {
    let a = s
    while (a + ++n in identifiers);
    a += n
    return { origin: s, alias: a }
  }

  const REASE = {
    _$   : alias('_$'),
    _expo: alias('_x'),
    
    _text   : alias('_t'),
    _comment: alias('_c'),
    // _commentX: alias('_d'),
    _html   : alias('_h'),

    _tag       : alias('_X'),
    _component : alias('_C'),
    _componentX: alias('_D'),

    _element : alias('_E'),
    _elementX: alias('_R'),

    _slot    : alias('_S'),
    _fragment: alias('_F'),
    
    _if  : alias('_i'),
    _elif: alias('_o'),
    _else: alias('_e'),
    
    _watch: alias('_w'),
    _await: alias('_a'),
    _then : alias('_n'),

    _for: alias('_f'),

    _func_call: alias('_z'),
    
    _use_listen: alias('_l'),

    _css: alias('_s'),
  } as const

  const RIMPORTS: { -readonly [K in keyof typeof REASE]?: true } = {}

  function tokenEnd(token: TypeToken, isOpener?: boolean): void {
    if (isOpener) token.value += '\n'
    else {
      // eslint-disable-next-line no-lonely-if
      if (ENV[0][0] === RULE_OR_SLOT) token.value += ';\n'
      else token.value += ENV[0][1] ? ',\n' : '\n'
    }

    if (ENV.length > 1 && ENV[0][0]) ENV[0][1] = true
    token.value = '  '.repeat(ENV.length) + token.value
  }

  function tokenInsiceTagChildless(token: TypeToken, slot: string = ''): void {
    if (ENV[0][0] === COMPONENT_OR_TAG) {
      const tokenLastStart = ENV[0][2]
      // const tokenLastEnd = ENV[0][3]
      ENV[0][2] = ENV[0][3] = token
      token.value = `[${slot}, () => { ${token.value} }]`
      if (tokenLastStart) {
        // console.log(11, [token.value, tokenLastStart.value, tokenLastEnd.value])
        const search = `[${slot}, () => { `
        const idx = tokenLastStart.value.indexOf(search)
        if (idx === ENV.length * 2) {
          token.value = token.value.slice(0, -3)
          tokenLastStart.value = '  '.repeat(ENV.length + 1) +
          tokenLastStart.value.slice(idx + search.length)
        }
      }
    }
  }
  function tokenInsiceTagOpener(token: TypeToken, slot: string = ''): void {
    if (ENV[0][0] === COMPONENT_OR_TAG) {
      const tokenLastStart = ENV[0][2]
      const tokenLastEnd = ENV[0][3]
      ENV[0][2] = token
      token.value = `[${slot}, () => { ${token.value}`
      if (tokenLastStart) {
        // console.log(22, [token.value, tokenLastStart.value, tokenLastEnd.value])
        const search = `[${slot}, () => { `
        const idx = tokenLastStart.value.indexOf(search)
        if (idx === ENV.length * 2) {
          tokenLastEnd.value = tokenLastEnd.value.replace(/[}\],\s\n]+$/, '') + ',\n'
          tokenLastStart.value = '  '.repeat(ENV.length + 1) +
          tokenLastStart.value.slice(idx + search.length)
        }
      }
    }
  }
  function tokenInsiceTagCloser(token: TypeToken): void {
    if (ENV[0][0] === COMPONENT_OR_TAG) {
      ENV[0][3] = token
      token.value = `${token.value} }]`
    }
  }

  function storefy(s: string): string {
    const res = storefyDefault(s, REASE._$.alias, useJSX)
    if (isStorefy(res)) RIMPORTS._$ = true
    return res
  }

  let random!: Function
  function createRandomFn(): void {
    if (!random) random = randomGenerator(hashNum(salt + source))
  }
  function createSugarUUID(s?: string): string {
    return createRandomFn(), JSON.stringify((s || '') + hashNum('', random())
      .toString(36).slice(0, 8))
  }
  function createSugarRAND(): string {
    return createRandomFn(), ('' + random()).slice(0, 8)
  }
  
  let j: number, j2: number
  const ENV: [any, boolean, any?, any?][] = [['', false]]
  if (SUGAR) {
    for (let token: TypeToken, i = 0; i < tokens.length; i++) {
      token = tokens[i]
      if (token.value !== SUGAR) continue
      if (i > 0 && (tokens[i - 1].value === ']' || tokens[i - 1].value === '.')) {
        continue
      }
      if (token.value === SUGAR && (j = nextRealTokenIndex(tokens, i)) > -1 &&
        tokens[j].value === '.' && (j = nextRealTokenIndex(tokens, j)) > -1) {
        const sugarMethod = tokens[j].value
        // console.log(sugarMethod)
        switch (sugarMethod) {
          case '$':
            break
          case 'isClient':
          case 'isServer':
          case 'is_client':
          case 'is_server':
          case 'IS_CLIENT':
          case 'IS_SERVER': {
            let isClient = IS_CLIENT
            tokens.splice(i + 1, j - i)
            while ((j = i - 1) > -1 && tokens[j].value === '!') {
              tokens.splice(i = j, 1)
              isClient = !isClient
            }
            token.type = TYPES.BOOLEAN
            token.value = '' + (isClient === /CLIENT/i.test(sugarMethod))
            if (token.value === 'false') {
              if (
                (j = nextRealTokenIndex(tokens, i)) > -1 && tokens[j].value === ')' &&
                (j = nextRealTokenIndex(tokens, j)) > -1 && tokens[j].value === '{' &&
                (j = prevRealTokenIndex(tokens, i)) > -1 && tokens[j].value === '(' &&
                (j = prevRealTokenIndex(tokens, j)) > -1 && tokens[j].value === 'if'
              ) {
                let isElseBefore = false
                if ((j2 = prevRealTokenIndex(tokens, j)) > -1 && tokens[j2].value === 'else') {
                  isElseBefore = true
                  j = j2
                }
                token.deep--
                j2 = findTokenIndexBy(tokens, i, (token2) =>
                  token.deep === token2.deep && token2.value === '}')
                tokens.splice(i = j, j2 - j + 1)

                if (!isElseBefore &&
                  (j = nextRealTokenIndex(tokens, i)) > -1 && tokens[j].value === 'else') {
                  // token[j].value
                  if ((j2 = nextRealTokenIndex(tokens, j)) > -1 && tokens[j2].value === 'if') {
                    tokens.splice(j, 1)
                  } else {
                    tokens.splice(j, 1, ...jsx2tokens('if (true)'))
                  }
                }
              }
            }
            break
          }
          case 'randomString':
          case 'random_string':
          case 'RANDOM_STRING':
            tokens.splice(i + 1, j - i)
            token.type = TYPES.STRING
            token.value = createSugarUUID()
            break
          case 'randomNumber':
          case 'random_number':
          case 'RANDOM_NUMBER':
            tokens.splice(i + 1, j - i)
            token.type = TYPES.NUMERIC
            token.value = createSugarRAND()
            break
          case 'requireIfClient':
          case 'requireIfServer':
          case 'require_if_client':
          case 'require_if_server':
          case 'REQUIRE_IF_CLIENT':
          case 'REQUIRE_IF_SERVER': {
            let importPath = ''
            j2 = findTokenIndexBy(tokens, i, function(token2) {
              if (!importPath && token2.type === TYPES.STRING) importPath = token2.value
              return token.deep === token2.deep && token2.value === ')'
            })
            if (importPath) {
              let importValue = 'default'
              if (
                (j = nextRealTokenIndex(tokens, j2)) > -1 && tokens[j].value === '.' &&
                (j = nextRealTokenIndex(tokens, j)) > -1
              ) {
                importValue = tokens[j].value
                j2 = j
              }
              // console.log(importValue, importPath)
              tokens.splice(i + 1, j2 - i)
              if (IS_CLIENT === /CLIENT/i.test(sugarMethod)) {
                const importAlias = alias(importValue).alias
                res += `import { ${importValue} as ${importAlias} } from ${importPath};\n`
                token.type = TYPES.IDENTIFIER
                token.value = importAlias
              } else {
                token.type = TYPES.NULL
                token.value = 'null'
              }
            } else {
              console.error('ENV ' + sugarMethod + ' is incorrectly')
              throw stringifyTokens(tokens.splice(i + 1, j2 - i))
            }
            break
          }
          default:
            throw 'rease/env: ' + sugarMethod + ' not support'
        }
      }
    }
  }

  // let tokenJSXModPrev!: TypeToken
  for (let token: TypeToken, i = tokens.length; i-- > 0;) {
    token = tokens[i]

    if (SUGAR_CSS && token.value === SUGAR_CSS &&
      (!i || tokens[i - 1].value !== ']' && tokens[i - 1].value !== '.')) {
      if ((j = nextRealTokenIndex(tokens, i)) > -1 && tokens[j].value[0] === '`') {
        const start = j
        const end = findTokenIndexBy(tokens, i, (token2) =>
          token.deep === token2.deep && /`$/.test(token2.value))

        const template = stringifyTokens(tokens.splice(j, 1 + end - start))
        // console.log(template)

        RIMPORTS._css = true
        const res = styles(template, createSugarUUID('c'), REASE._css.alias, storefy)
        // console.log(res)

        token.type = TYPES.MODIFIER
        token.value = res
        
        continue
      }
    }

    if (SUGAR && token.value === SUGAR &&
      (!i || tokens[i - 1].value !== ']' && tokens[i - 1].value !== '.')) {
      if ((j = nextRealTokenIndex(tokens, i)) > -1 &&
      tokens[j].value === '.' && (j = nextRealTokenIndex(tokens, j)) > -1) {
        const sugarMethod = tokens[j].value
        if (sugarMethod === '$') {
          tokens.splice(i + 1, j - i)
          j = nextRealTokenIndex(tokens, i)
          j2 = findTokenIndexBy(tokens, i + 1, (token2) =>
            token.deep === token2.deep && token2.value === ')')
          RIMPORTS._$ = true
          let store = storefyDefault(
            stringifyTokens(tokens.splice(j, j2 - j + 1).slice(1, -1)), REASE._$.alias
          )
          if (!isStorefy(store)) store = `${REASE._$.alias}([${store}], (a) => a[0])`
          token.type = TYPES.MODIFIER
          token.value = store
        }
        continue
      }
    }

    switch (token.type) {
      case TYPES.JSX_EXPRESSION_END: {
        ENV.unshift([, false])
        break
      }
      case TYPES.JSX_EXPRESSION_START: {
        ENV.shift()
        const j = findTokenIndexBy(tokens, i, (token2) =>
          token.deep === token2.deep && token2.type === TYPES.JSX_EXPRESSION_END)
        const exp = stringifyTokens(tokens.splice(i + 1, j - i).slice(0, -1))
        const store = storefy(exp)
        if (!store) tokens.splice(i, 1)
        else {
          token.type = TYPES.MODIFIER
          // if (isStorefyForExpo(store)) {
          RIMPORTS._expo = true
          token.value = `${REASE._expo.alias}(${store})`
          // } else {
          //   RIMPORTS._text = true
          //   token.value = `${REASE._text.alias}(${store})`
          // }
          
          tokenInsiceTagChildless(token), tokenEnd(token)
          // tokenJSXModPrev = token
        }
        break
      }

      case TYPES.JSX_TEXT: {
        token.type = TYPES.MODIFIER
        const text =
          token.value.replace(/^\s*\n\s*|\s*\n\s*$/g, '')
            .replace(/\s+/g, ' ')
        
        if (!text) tokens.splice(i, 1)
        else {
          RIMPORTS._text = true
          token.value = `${REASE._text.alias}(${JSON.stringify(text)
            .replace(/\\\\u/gi, '\\u')
          })`
          tokenInsiceTagChildless(token), tokenEnd(token)
          // tokenJSXModPrev = token
        }
        break
      }

      case TYPES.JSX_TAG_CLOSER_START: {
        const j = findTokenIndexBy(tokens, i, (token2) =>
          token2.type === TYPES.JSX_TAG_CLOSER_END)
        const chunks = chunkifyAttributes(tokens.splice(i + 1, j - i).slice(0, -1))
        token.type = TYPES.MODIFIER
        const tag = chunks[0] && chunks[0][0] || 'r-fragment'

        // STYLE
        /*
        if (tag === 'style') {
          const ie = findTokenIndexByLeft(tokens, i, (token2) => token2.value === '}')
          const is = findTokenIndexByLeft(tokens, ie, (token2) =>
            token2.value === '{' && tokens[ie].deep === token2.deep)
          
          const exp = stringifyTokens(tokens.splice(is, ie - is + 1).slice(1, -1))

          i = findTokenIndexByLeft(tokens, is, (token2) =>
            token2.type === TYPES.JSX_TAG_OPENER_START && token.deep === token2.deep)

          // TODO: Доделать аттрибуты для тега style (r-slot?, global?, ...)
          const opener = tokens.splice(i, is - i)
          const j = findTokenIndexBy(opener, 0, (token2) =>
            token2.type === TYPES.JSX_TAG_OPENER_END)
          const chunks = chunkifyAttributes(opener.splice(1, j).slice(0, -1))
          // console.log(chunks)

          const global = chunks.some((v) => v[0] === 'global')
          const cid = createSugarUUID('c')
          const cido = JSON.parse(cid)
          let $css$ = storefy(less2css(exp, cido, global))
          $css$ = (global ? '() => ' : `(_${cido}) => `) + $css$
        
          token.value = `[${joinAttrs($css$, cid, '' + (global || ''))}]`
          tokenInsiceTagChildless(token), tokenEnd(token)
          // tokenJSXModPrev = token
          // throw 12
          break
        }
        */
        
        if (isNativeTag(tag) || isReaseFragment(tag)) {
          token.value = ')'
        } else if (isReaseRule(tag) || isReaseSlot(tag)) {
          token.value = '})'
        } else if (isComponent(tag) || isReaseTag(tag)) {
          token.value = '])'
        } else {
          throw 'Tag ' + tag + ' not support'
        }

        tokenInsiceTagCloser(token), tokenEnd(token)

        if (isNativeTag(tag) || isReaseFragment(tag)) {
          ENV.unshift([ELEMENT_OR_FRAGMENT, false])
        } else if (isReaseRule(tag) || isReaseSlot(tag)) {
          ENV.unshift([RULE_OR_SLOT, false])
        } else if (isComponent(tag) || isReaseTag(tag)) {
          ENV.unshift([COMPONENT_OR_TAG, false])
        }
        break
      }

      case TYPES.JSX_TAG_OPENER_END_CHILDLESS:
      case TYPES.JSX_TAG_OPENER_END: {
        ENV.unshift([, false])
        break
      }
      case TYPES.JSX_TAG_OPENER_START: {
        /* const lastENV = */ ENV.shift()
        const j = findTokenIndexBy(tokens, i, (token2) =>
          token2.type === TYPES.JSX_TAG_OPENER_END ||
          token2.type === TYPES.JSX_TAG_OPENER_END_CHILDLESS)
        
        const isChildless = tokens[j].type === TYPES.JSX_TAG_OPENER_END_CHILDLESS
        
        const chunks = chunkifyAttributes(tokens.splice(i + 1, j - i).slice(0, -1))
        const tag = chunks[0] && chunks[0].length < 2 && chunks.shift()![0] || 'r-fragment'

        let is = ''
        const propsArr: string[] = []
        let props = ''
        let use = ''
        let useClient = ''
        let useServer = ''
        let rtag = ''
        let slot = ''
        let slotname = ''
        let children = ''
        let ons = ''
        let trustedTypesPolicy = ''
        for (let name: string, value: string, i = 0; i < chunks.length; i++) {
          if (name = chunks[i][0]) {
            if (name[0] === '{') {
              propsArr.push(name.slice(1, -1))
            } else {
              value = chunks[i][1] || ''
              if (value[0] === '{') value = storefy(value.slice(1, -1))
              switch (name) {
                case 'r-is': {
                  is = value
                  break
                }
                case 'r-use': {
                  use = value
                  break
                }
                case 'r-use-client': {
                  useClient = value
                  break
                }
                case 'r-use-server': {
                  useServer = value
                  break
                }
                case 'r-tag': {
                  rtag = value
                  break
                }
                case 'r-slot': {
                  slot = value
                  break
                }
                case 'r-name': {
                  slotname = value
                  break
                }
                case 'r-children': {
                  children = value
                  break
                }
                case 'r-policy': {
                  trustedTypesPolicy = value
                  break
                }
                default: {
                  if (name.startsWith('r-on-')) {
                    if (IS_CLIENT) {
                      name = name.slice(5) //.replace(/^[^a-zA-Z\d]+|[^a-zA-Z\d]+$/g, '')
                      if (name) {
                        RIMPORTS._use_listen = true
                        ons += `${REASE._use_listen.alias}('${name}', ${value}), `
                      }
                    }
                  } else {
                    if (name.startsWith('r-')) throw 'System attribute ' + name + ' not support'
                    if (name === 'className') name = 'class'
                    name = fixName(name)
                    value = value || 'true'
                    propsArr.push(`${name}: ${value}`)
                  }
                }
              }
            }
          }
        }

        if (IS_CLIENT) {
          if (ons) {
            if (!use) use = `[${ons.slice(0, -2)}]`
            else if (use[0] === '[') use = `[${ons}${use.slice(1, -1)}]`
            else use = `[${ons}...(${use}) || []]`
          }
          if (useClient) {
            if (use && useClient[0] !== '[') useClient = `(${useClient}) || []`
            if (!use) use = useClient
            else if (use[0] === '[') use = `[${use.slice(1, -1)}, ...${useClient}]`
            else use = `[...(${use}) || [], ...${useClient}]`
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (useServer) {
            if (use && useServer[0] !== '[') useServer = `(${useServer}) || []`
            if (!use) use = useServer
            else if (use[0] === '[') use = `[${use.slice(1, -1)}, ...${useServer}]`
            else use = `[...(${use}) || [], ...${useServer}]`
          }
        }

        if (propsArr.length) props = `{ ${propsArr.join(', ')} }`
        // if (use) {
        //   props = props || '{}'
        //   is = is || 'void 0'
        // }
        
        // if (!IS_CLIENT) use = ''

        let value = ''
        switch (tag) {
          case 'r-void': {
            if (isStorefyForExpo(is)) {
              throw 'System tag ' + tag + ' does not accept reactive values'
            } else {
              value = joinAttrs(is)
            }
            break
          }
          case 'r-text': {
            // if (isStorefyForExpo(is)) {
            RIMPORTS._expo = true
            value = `${REASE._expo.alias}(${joinAttrs(is)})`
            // } else {
            //   RIMPORTS._text = true
            //   value = `${REASE._text.alias}(${joinAttrs(is)})`
            // }
            break
          }
          case 'r-comment': {
            // if (isStorefyForExpo(is)) {
            // RIMPORTS._commentX = true // _commentX
            // value = `${REASE._commentX.alias}(${joinAttrs(is)})`
            // } else {
            RIMPORTS._comment = true
            value = `${REASE._comment.alias}(${joinAttrs(is)})`
            // }
            break
          }
          case 'r-html': {
            RIMPORTS._html = true
            value = `${REASE._html.alias}(${joinAttrs(is, trustedTypesPolicy)})`
            break
          }
          case 'r-fragment': {
            RIMPORTS._fragment = true

            if (use) props = props || '{}'

            value = `${REASE._fragment.alias}(${joinAttrs(props, use)})(`
            break
          }
          case 'r-slot': {
            RIMPORTS._slot = true
            
            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._slot.alias}(${joinAttrs(slotname || is, props, use)})(`
            break
          }
          case 'r-tag': {
            RIMPORTS._tag = true

            if (slotname) use = use || 'void 0'
            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._tag.alias}(${joinAttrs(is, props, use, slotname)})(`
            break
          }
          case 'r-if': {
            RIMPORTS._if = true

            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._if.alias}(${joinAttrs(is, props, use)})(`
            break
          }
          case 'r-elif':
          case 'r-elseif':
          case 'r-else-if': {
            RIMPORTS._elif = true

            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._elif.alias}(${joinAttrs(is, props, use)})(`
            break
          }
          case 'r-else': {
            RIMPORTS._else = true

            if (use) props = props || '{}'

            value = `${REASE._else.alias}(${joinAttrs(props, use)})(`
            break
          }
          case 'r-for': {
            RIMPORTS._for = true

            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._for.alias}(${joinAttrs(is, props, use)})(`
            break
          }
          case 'r-watch': {
            RIMPORTS._watch = true

            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._watch.alias}(${joinAttrs(is, props, use)})(`
            break
          }
          case 'r-await': {
            RIMPORTS._await = true

            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._await.alias}(${joinAttrs(is, props, use)})(`
            break
          }
          case 'r-then': {
            RIMPORTS._then = true

            if (use) props = props || '{}'

            value = `${REASE._then.alias}(${joinAttrs(props, use)})(`
            break
          }
          default: {
            if (isComponent(tag)) {
              if (!is && tag !== R_COMPONENT) {
                RIMPORTS._component = true

                if (use) props = props || '{}'
                // if (props) is = is || 'void 0'

                value = `${REASE._component.alias}(${
                  joinAttrs(tag, props, use)})(`
              } else {
                RIMPORTS._componentX = true

                if (is) {
                  use = use || 'void 0'
                  props = props || '{}'
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (use) props = props || '{}'
                }

                value = `${REASE._componentX.alias}(${
                  joinAttrs(tag !== R_COMPONENT ? tag : 'null', props, use, is)})(`
              }
            } else {
              if (tag.startsWith('r-')) throw 'System tag ' + tag + ' not support'
              // eslint-disable-next-line no-lonely-if
              if (!rtag && !is) {
                RIMPORTS._element = true

                if (use) props = props || '{}'

                value = `${REASE._element.alias}(${
                  joinAttrs(JSON.stringify(tag), props, use)})(`
              } else {
                RIMPORTS._elementX = true

                use = use || 'void 0'
                props = props || '{}'

                value = `${REASE._elementX.alias}(${
                  joinAttrs(JSON.stringify(tag), props, use, rtag || is)})(`
              }
            }
          }
        }

        if (isNativeTag(tag) || isReaseFragment(tag)) {
          if (isChildless) {
            if (children) {
              RIMPORTS._func_call = true
              value += `${REASE._func_call.alias}(${children})`
            }
            value += ')'
          } else if (children) throw 'System tag ' + tag + ' must be childless'
        } else if (isReaseRule(tag) || isReaseSlot(tag)) {
          if (!isChildless) {
            value += '() => {'
            if (children) throw 'System tag ' + tag + ' must be childless if contains r-children'
          } else if (children) {
            value += `${children})`
          } else value += ')'
        } else if (isComponent(tag) || isReaseTag(tag)) {
          // console.log(children, value)
          // if (children) throw 'System tag ' + tag + ' not support r-children'
          // eslint-disable-next-line no-lonely-if
          // if (!isChildless) value += '['
          // else value += '[])'
          if (isChildless) {
            if (children) {
              value += `[[,${children}]]`
            } else {
              value += '[]'
            }
            value += ')'
          } else {
            value += '['
            if (children) throw 'Component or r-tag ' + tag + ' must be childless'
          }
        } else if (!value) {
          throw 'Tag ' + tag + ' not found'
        }

        token.type = TYPES.MODIFIER
        token.value = value
        if (!isChildless) ENV.shift()
        else tokenInsiceTagCloser(token)

        tokenInsiceTagOpener(token, slot)
        // if (lastENV) ENV.unshift(lastENV)
        tokenEnd(token, !isChildless)
        token.value = token.value.replace(/\s*,\s*,\s*$/, ',\n')
        // if (lastENV) ENV.shift()

        // console.log(token.value)
        break
      }

      default:
    }
  }

  const imports: string[] = []
  for (const k in RIMPORTS) {
    // @ts-ignore
    // res += `import { ${k} as ${REASE[k]} } from 'rease';\n`
    imports.push(`  ${REASE[k].origin} as ${REASE[k].alias}`)
  }
  if (imports.length) {
    res += `import {\n${imports.join(',\n')}\n} from 'rease';\n`
  }
  
  res += stringifyTokens(tokens)
  // console.log(res)
  return res
}
