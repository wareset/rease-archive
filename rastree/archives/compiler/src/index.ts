import {
  jsx2tokens, TypeToken,
  stringifyTokens, trimTokens, prevRealTokenIndex, nextRealTokenIndex,
  TOKEN_IDENTIFIER,
  TOKEN_SPACE, // TOKEN_COMMENT_LINE, TOKEN_COMMENT_BLOCK,
  TOKEN_MODIFIER,
  TOKEN_JSX_TEXT,
  TOKEN_JSX_EXPRESSION_START, TOKEN_JSX_EXPRESSION_END,
  TOKEN_JSX_TAG_OPENER_START, TOKEN_JSX_TAG_OPENER_END,
  TOKEN_JSX_TAG_CLOSER_START, TOKEN_JSX_TAG_CLOSER_END,
  TOKEN_BOOLEAN, TOKEN_STRING, TOKEN_NUMERIC, TOKEN_NULL
} from '@rastree/jsx2tokens'

import { chunkifyArrayBy } from '@rastree/utilites'
import { less2css } from '@rastree/less2css'

import { storefy as storefyDefault, isStorefy, isStorefyForExpo } from '@rastree/storefy'

const findTokenIndexBy = (
  tokens: TypeToken[], start: number, cb: (token: TypeToken) => boolean | void
): number => {
  for (let i = start + 1; i < tokens.length; i++) if (cb(tokens[i])) return i
  return -1
}

const findTokenIndexByLeft = (
  tokens: TypeToken[], start: number, cb: (token: TypeToken) => boolean | void
): number => {
  for (let i = start; i-- > 0;) if (cb(tokens[i])) return i
  return -1
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const chunkifyAttributes = (tokens: TypeToken[]) =>
  chunkifyArrayBy(tokens, (token, k, a) => {
    const deep0 = a[0].deep
    const { deep, type, value } = token
    if (deep === deep0) {
      if (type === TOKEN_SPACE ||
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
      chunkifyArrayBy(trimTokens(tokens), (token, _k, a) => {
        const deep0 = a[0].deep
        const { deep, value } = token
        return deep === deep0 && value === '='
      }, void 0, true).map((v) => stringifyTokens(trimTokens(v))))
    .filter(String)

const fixName = (s: string): string =>
  /^[$_a-z][$\w]*$/i.test(s) ? s : JSON.stringify(s)

const joinAttrs = (...a: string[]): string => a.join(', ').replace(/[,\s]+$/, '')

const isNativeTag = (s: string): boolean =>
  s.indexOf('r-') !== 0 && /^[a-z][a-zA-Z0-9-]*$/.test(s)
const isReaseFragment = (s: string): boolean => s === 'r-fragment'
const ELEMENT_OR_FRAGMENT = 'ELEMENT_OR_FRAGMENT'

const isReaseRule = (s: string): boolean =>
  s.indexOf('r-') === 0 && !isReaseTag(s) && !isReaseSlot(s) && !isReaseFragment(s) &&
  s !== 'r-comment' && s !== 'r-html'
const isReaseSlot = (s: string): boolean => s === 'r-slot'
const RULE_OR_SLOT = 'RULE_OR_SLOT'

const isReaseTag = (s: string): boolean => s === 'r-tag'
const isComponent = (s: string): boolean =>
  s.indexOf('r-') !== 0 &&
  !(isReaseTag(s) || isReaseSlot(s) || isReaseFragment(s) || isReaseRule(s) || isNativeTag(s))
const COMPONENT_OR_TAG = 'COMPONENT_OR_TAG'

// const HTML_OR_TEXT_OR_COMMENT = 'HTML_OR_TEXT_OR_COMMENT'

const __im__ = 0xffff
const imul = (a: number, b: number): number => {
  const ah = a >>> 16 & __im__
  const al = a & __im__
  const bh = b >>> 16 & __im__
  const bl = b & __im__

  return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0
}
const __rf2__ = Math.pow(2, 31)
const __rf1__ = __rf2__ - 1
const randomGenerator = (seed: number) => (): number =>
  ((seed = imul(16807, seed) | 0 % __rf1__) & __rf1__) / __rf2__

const hashNum = (t: string, e?: any): number => {
  let r = 1
  for (let h = (t = ((e || '') + t).replace(/\r/g, '')).length; h--;) {
    r *= (9e4 - r) / (r + t.charCodeAt(h))
  }
  return +('' + r).replace(/[-.]/g, '')
}

export const compiler = (
  source: string, {
    sugar = 'rease/sugar',
    env = 'client' as 'client' | 'server',
    salt = ''
  } = {}
): string => {
  let res = '/* eslint-disable @typescript-eslint/explicit-function-return-type */\n'
  // console.log(source)

  const IS_CLIENT = !(env === 'server')
  let SUGAR!: string
  const sugar1 = `^['"\`]${sugar}`
  const identifiers: any = {}
  const tokens = jsx2tokens(source, false, (token, k, a) => {
    if (token.type === TOKEN_IDENTIFIER) identifiers[token.value] = true
    else if (!SUGAR && token.value.match(sugar1)) {
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
            if (token2.type === TOKEN_IDENTIFIER) SUGAR = token2.value
          }
        }
      }
    }
  })

  // console.log(SUGAR)
  // console.log(tokens)
  // throw 12

  let n = 0
  const alias = (s: string): { origin: string, alias: string } => {
    let a = s
    while (a + ++n in identifiers);
    a += n
    return { origin: s, alias: a }
  }

  const REASE = {
    _$   : alias('_$'),
    _expo: alias('_x'),
    
    _text   : alias('_t'),
    _comment: alias('_n'),
    _html   : alias('_h'),

    _rule_tag : alias('_rc'),
    _component: alias('_c'),

    _element : alias('_e'),
    _elementX: alias('_r'),

    _slot    : alias('_s'),
    _fragment: alias('_f'),
    
    _if  : alias('_ri'),
    _elif: alias('_rl'),
    _else: alias('_re'),
    
    _watch: alias('_rw'),
    _await: alias('_ra'),
    _then : alias('_rt'),

    _for: alias('_rf'),

    _css: alias('_css'),
    _fc : alias('_fc'),
    
    _use_listen: alias('_ul'),
    _use_resize: alias('_ur'),
  } as const

  const RIMPORTS: { -readonly [K in keyof typeof REASE]?: true } = {}

  const tokenEnd = (token: TypeToken, isOpener?: boolean): void => {
    if (isOpener) token.value += '\n'
    else {
      // eslint-disable-next-line no-lonely-if
      if (ENV[0][0] === RULE_OR_SLOT) token.value += ';\n'
      else token.value += ENV[0][1] ? ',\n' : '\n'
    }

    if (ENV.length > 1 && ENV[0][0]) ENV[0][1] = true
    token.value = '  '.repeat(ENV.length) + token.value
  }

  const tokenInsiceTagChildless = (token: TypeToken, slot: string = ''): void => {
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
  const tokenInsiceTagOpener = (token: TypeToken, slot: string = ''): void => {
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
  const tokenInsiceTagCloser = (token: TypeToken): void => {
    if (ENV[0][0] === COMPONENT_OR_TAG) {
      ENV[0][3] = token
      token.value = `${token.value} }]`
    }
  }

  const storefy = (s: string): string => {
    const res = storefyDefault(s, REASE._$.alias)
    if (isStorefy(res)) RIMPORTS._$ = true
    return res
  }

  let random!: Function
  const createRandomFn = (): void => {
    if (!random) random = randomGenerator(hashNum(salt + source))
  }
  const createSugarUUID = (s?: string): string =>
    (createRandomFn(), JSON.stringify((s || '') + hashNum('', random())
      .toString(36).slice(0, 8)))
  const createSugarRAND = (): string => (createRandomFn(), ('' + random()).slice(0, 8))

  let j: number, j2: number
  const ENV: [any, boolean, any?, any?][] = [['', false]]
  if (SUGAR) {
    for (let token: TypeToken, i = 0; i < tokens.length; i++) {
      token = tokens[i]
      if (token.value === SUGAR && (j = nextRealTokenIndex(tokens, i)) > -1 &&
        tokens[j].value === '.' && (j = nextRealTokenIndex(tokens, j)) > -1) {
        const sugarMethod = tokens[j].value
        // console.log(sugarMethod)
        switch (sugarMethod) {
          case '$':
            break
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
            token.type = TOKEN_BOOLEAN
            token.value = '' + (isClient === (sugarMethod.toUpperCase() === 'IS_CLIENT'))
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
          case 'random_string':
          case 'RANDOM_STRING':
            tokens.splice(i + 1, j - i)
            token.type = TOKEN_STRING
            token.value = createSugarUUID()
            break
          case 'random_number':
          case 'RANDOM_NUMBER':
            tokens.splice(i + 1, j - i)
            token.type = TOKEN_NUMERIC
            token.value = createSugarRAND()
            break
          case 'import_client':
          case 'import_server':
          case 'IMPORT_CLIENT':
          case 'IMPORT_SERVER': {
            let importPath = ''
            j2 = findTokenIndexBy(tokens, i, (token2) => {
              if (!importPath && token2.type === TOKEN_STRING) importPath = token2.value
              return token.deep === token2.deep && token2.value === ')'
            })
            if (importPath) {
              let importValue = 'default'
              if (
                (j = nextRealTokenIndex(tokens, j2)) > -1 && tokens[j].value === '.' &&
                (j = nextRealTokenIndex(tokens, j)) > -1 && tokens[j].type === TOKEN_IDENTIFIER
              ) {
                importValue = tokens[j].value
                j2 = j
              }
              // console.log(importValue, importPath)
              tokens.splice(i + 1, j2 - i)
              if (IS_CLIENT === (sugarMethod.toUpperCase() === 'IMPORT_CLIENT')) {
                const importAlias = alias(importValue).alias
                res += `import { ${importValue} as ${importAlias} } from ${importPath};\n`
                token.type = TOKEN_IDENTIFIER
                token.value = importAlias
              } else {
                token.type = TOKEN_NULL
                token.value = 'null'
              }
            } else {
              throw stringifyTokens(tokens.splice(i + 1, j2 - i))
            }
            break
          }
          default:
            throw sugarMethod
        }
      }
    }
  }

  // let tokenJSXModPrev!: TypeToken
  for (let token: TypeToken, i = tokens.length; i-- > 0;) {
    token = tokens[i]

    if (SUGAR && token.value === SUGAR && (j = nextRealTokenIndex(tokens, i)) > -1 &&
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
        token.type = TOKEN_MODIFIER
        token.value = store
      }
      continue
    }

    switch (token.type) {
      case TOKEN_JSX_EXPRESSION_END: {
        ENV.unshift([, false])
        break
      }
      case TOKEN_JSX_EXPRESSION_START: {
        ENV.shift()
        const j = findTokenIndexBy(tokens, i, (token2) =>
          token.deep === token2.deep && token2.type === TOKEN_JSX_EXPRESSION_END)
        const exp = stringifyTokens(tokens.splice(i + 1, j - i).slice(0, -1))
        const store = storefy(exp)
        if (!store) tokens.splice(i, 1)
        else {
          token.type = TOKEN_MODIFIER
          if (isStorefyForExpo(store)) {
            RIMPORTS._expo = true
            token.value = `${REASE._expo.alias}(${store})`
          } else {
            RIMPORTS._text = true
            token.value = `${REASE._text.alias}(${store})`
          }
          
          tokenInsiceTagChildless(token), tokenEnd(token)
          // tokenJSXModPrev = token
        }
        break
      }

      case TOKEN_JSX_TEXT: {
        token.type = TOKEN_MODIFIER
        const text = token.value.replace(/^\s*\n\s*|\s*\n\s*$/g, '').replace(/\s+/g, ' ')
        if (!text) tokens.splice(i, 1)
        else {
          RIMPORTS._text = true
          token.value = `${REASE._text.alias}(${JSON.stringify(text)})`
          tokenInsiceTagChildless(token), tokenEnd(token)
          // tokenJSXModPrev = token
        }
        break
      }

      case TOKEN_JSX_TAG_CLOSER_START: {
        const j = findTokenIndexBy(tokens, i, (token2) =>
          token2.type === TOKEN_JSX_TAG_CLOSER_END)
        const chunks = chunkifyAttributes(tokens.splice(i + 1, j - i).slice(0, -1))
        token.type = TOKEN_MODIFIER
        const tag = chunks[0] && chunks[0][0] || 'r-fragment'

        // STYLE
        if (tag === 'style') {
          const ie = findTokenIndexByLeft(tokens, i, (token2) => token2.value === '}')
          const is = findTokenIndexByLeft(tokens, ie, (token2) =>
            token2.value === '{' && tokens[ie].deep === token2.deep)
          
          const exp = stringifyTokens(tokens.splice(is, ie - is + 1).slice(1, -1))
          const store = storefy(less2css(exp))

          i = findTokenIndexByLeft(tokens, is, (token2) =>
            token2.type === TOKEN_JSX_TAG_OPENER_START && token.deep === token2.deep + 1)

          // TODO: Доделать аттрибуты для тега style (r-slot?, global?, ...)
          const opener = tokens.splice(i, is - i)
          const j = findTokenIndexBy(opener, 0, (token2) =>
            token2.type === TOKEN_JSX_TAG_OPENER_END)
          const chunks = chunkifyAttributes(opener.splice(1, j).slice(0, -1))
          // console.log(chunks)

          const global = chunks.some((v) => v[0] === 'global')
          const cid = createSugarUUID('c')
        
          RIMPORTS._css = true
          token.value = `${REASE._css.alias}(${joinAttrs(store, cid, '' + global)})`
          tokenInsiceTagChildless(token), tokenEnd(token)
          // tokenJSXModPrev = token
          // throw 12
          break
        }
        
        if (isNativeTag(tag) || isReaseFragment(tag)) {
          token.value = ')'
        } else if (isReaseRule(tag) || isReaseSlot(tag)) {
          token.value = '})'
        } else if (isComponent(tag) || isReaseTag(tag)) {
          token.value = '])'
        } else {
          throw tag
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

      case TOKEN_JSX_TAG_OPENER_END: {
        ENV.unshift([, false])
        break
      }
      case TOKEN_JSX_TAG_OPENER_START: {
        // @ts-ignore
        const lastENV = ENV.shift()
        const j = findTokenIndexBy(tokens, i, (token2) =>
          token2.type === TOKEN_JSX_TAG_OPENER_END)
        const isChildless = tokens[j].value[0] === '/'
        const chunks = chunkifyAttributes(tokens.splice(i + 1, j - i).slice(0, -1))
        const tag = chunks[0] && chunks[0].length < 2 && chunks.shift()![0] || 'r-fragment'

        let is = ''
        const propsArr: string[] = []
        let props = ''
        let use = ''
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
                  if (name.startsWith('r-on')) {
                    if (name.startsWith('r-on-resize')) {
                      RIMPORTS._use_resize = true
                      ons += `${REASE._use_resize.alias}(${value}), `
                    } else {
                      name = name.slice(4).replace(/^[^a-zA-Z\d]+|[^a-zA-Z\d]+$/g, '')
                      if (name) {
                        RIMPORTS._use_listen = true
                        ons += `${REASE._use_listen.alias}('${name}', ${value}), `
                      }
                    }
                  } else {
                    name = fixName(name)
                    value = value || 'true'
                    propsArr.push(`${name}: ${value}`)
                  }
                }
              }
            }
          }
        }

        if (ons) {
          if (!use) use = `[${ons.slice(0, -2)}]`
          else if (use[0] === '[') use = `[${ons}${use.slice(1)}`
          else use = `[${ons}...(${use}) || []]`
        }

        if (propsArr.length) props = `{ ${propsArr.join(', ')} }`
        // if (use) {
        //   props = props || '{}'
        //   is = is || 'void 0'
        // }
        
        if (!IS_CLIENT) use = ''

        let value = ''
        switch (tag) {
          // TODO
          case 'r-text': {
            RIMPORTS._text = true
            throw tag
          }
          case 'r-comment': {
            RIMPORTS._comment = true
            value = `${REASE._comment.alias}(${joinAttrs(is)})`
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
            RIMPORTS._rule_tag = true

            if (slotname) use = use || 'void 0'
            if (use) props = props || '{}'
            if (props) is = is || 'void 0'

            value = `${REASE._rule_tag.alias}(${joinAttrs(is, props, use, slotname)})(`
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
              RIMPORTS._component = true

              if (use) props = props || '{}'
              if (props) is = is || 'void 0'

              value = `${REASE._component.alias}(${
                joinAttrs(tag, props, use)})(`
            } else if (!rtag && !is) {
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

        if (isNativeTag(tag) || isReaseFragment(tag)) {
          if (isChildless) {
            if (children) {
              RIMPORTS._fc = true
              value += `${REASE._fc.alias}(${children})`
            }
            value += ')'
          } else if (children) throw tag
        } else if (isReaseRule(tag) || isReaseSlot(tag)) {
          if (!isChildless) {
            value += '() => {'
            if (children) throw tag
          } else if (children) {
            value += `${children})`
          } else value += ')'
        } else if (isComponent(tag) || isReaseTag(tag)) {
          if (children) throw tag
          // eslint-disable-next-line no-lonely-if
          if (!isChildless) value += '['
          else value += '[])'
        } else {
          // throw tag
        }

        token.type = TOKEN_MODIFIER
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

export default compiler
