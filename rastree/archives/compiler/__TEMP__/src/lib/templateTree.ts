/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  TypeToken,
  jsx2tokens,
  trimTokens, stringifyTokens,
  trimCircleBrackets, trimCurlyBrackets,
  prevRealTokenIndex, nextRealTokenIndex,
  TOKEN_SPACE, TOKEN_KEYWORD, TOKEN_PUCNTUATOR,
  TOKEN_JSX_TEXT, TOKEN_JSX_COMMENT,
  TOKEN_JSX_EXPRESSION_START, TOKEN_JSX_EXPRESSION_END,
  TOKEN_JSX_TAG_OPENER_START, TOKEN_JSX_TAG_OPENER_END,
  TOKEN_JSX_TAG_CLOSER_START, TOKEN_JSX_TAG_CLOSER_END
} from '@rastree/jsx2tokens'

import { chunkifyArrayBy, safeRemoveQuotes, isChildlessTagName } from '@rastree/utilites'

import { storefy } from '@rastree/storefy'

/*
r - reactive store autogen

t - text or static expression
o - reactive expression
h - comment

e - element
c - component
s - slot
f - fragment

if - if
el - else
ei - elseif
for - for
*/

const ENVS = {
  c: 'client',
  s: 'server'
}

const jsonStringify = JSON.stringify
const __offset__ = (n: number): string => '  '.repeat(n)

const isNativeTag = (v: any): boolean => /^[-a-z\d]+$/.test(v)

const createTag = (tag: string, rease = 'rease'): string => {
  if (isNativeTag(tag)) tag = jsonStringify(tag)
  else if (tag[0] === '{') tag = storefy(tag.slice(1, -1), rease)
  return tag
}

const trimAllBrackets = (tokens: TypeToken[]): TypeToken[] =>
  trimCircleBrackets(trimCurlyBrackets(trimCircleBrackets(tokens)))

const needCircleBrackets = (tokens: TypeToken[]) : boolean =>
  tokens.some((v, _k, a) => v.deep === a[0].deep && v.type === TOKEN_PUCNTUATOR)

const createProp = (value: string, rease: string): string => {
  let cur = ''
  const arr: string[] = []
  for (let char: string, i = 0; i <= value.length; i++) {
    char = value[i]
    if (char && char !== '{') cur += char
    else {
      if (cur) arr.push(jsonStringify(cur))
      if (char) {
        const ctx: [number] = [i]
        const tokens = jsx2tokens(value.slice(i), false, (v, _k, a, ctx) => {
          const deep0 = a[0].deep

          if (v.deep === deep0 && v.value === '}') {
            ctx[0] += v.range[1] - 1
          
            return true
          }

          return false
        }, ctx).slice(1, -1)
        i = ctx[0]
        cur = stringifyTokens(trimTokens(tokens))
        if (needCircleBrackets(tokens)) cur = `(${cur})`
        arr.push(cur)
        cur = ''
      }
    }
  }

  cur = arr.join(' + ')
  if (arr.length > 1) cur = `(${cur})`
  return storefy(cur, rease) || 'void 0'
}

const createProps =
(props: { [key: string]: string }, rease: string): string => {
  let res = ''

  for (const name in props) {
    res += jsonStringify(name) + ': ' + createProp(props[name], rease) + ', '
  }

  if (res) res = '{' + res.slice(0, -2) + '}'
  return res
}

const chunkifyAttributes = (tokens: TypeToken[]): string[][] =>
  chunkifyArrayBy(tokens, (token, k, a) => {
    const deep0 = a[0].deep
    const { deep, type, value } = token
    if (deep === deep0) {
      if (type === TOKEN_SPACE || /^[,;]$/.test(value)) {
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

const matchFLAG = (v:string): RegExpExecArray | null =>
  /^--(\w+)/.exec(v)
const matchTAG = (v:string): RegExpExecArray | null =>
  /^r?\Wtag$/i.exec(v)
const matchSLOT = (v:string): RegExpExecArray | null =>
  /^r?\Wslot$/i.exec(v)
const matchNAME = (v:string): RegExpExecArray | null =>
  /^r?\Wname$/i.exec(v)
const matchVARS = (v:string): RegExpExecArray | null =>
  /^r?\W(?:var|let)s?(?:\W|$)/i.exec(v)

const matchELSEIF = (v:string): RegExpExecArray | null =>
  /^r?\Wel(?:se)?.?if(?:\W|$)/i.exec(v)
const matchELSE = (v:string): RegExpExecArray | null =>
  /^r?\Welse(?:\W|$)/i.exec(v)
const matchIF = (v:string): RegExpExecArray | null =>
  /^r?\Wif(?:\W|$)/i.exec(v)
const matchFOR = (v:string): RegExpExecArray | null =>
  /^r?\W(?:for(?:each)?|each)(?:\W|$)/i.exec(v)
const matchKEY = (v:string): RegExpExecArray | null =>
  /^r?\Wkey(?:\W|$)/i.exec(v)

const matchSWITCH = (v:string): RegExpExecArray | null =>
  /^r?\Wswitch(?:\W|$)/i.exec(v)
const matchCASE = (v:string): RegExpExecArray | null =>
  /^r?\Wcase(?:\W|$)/i.exec(v)
const matchCASE_DEFAULT = (v:string): RegExpExecArray | null =>
  /^r?\Wdefault(?:\W|$)/i.exec(v)

const matchUSES = (v:string): RegExpExecArray | null =>
  /^(?:(r|c|s|client|server))?\W+use(?:\W|$)/i.exec(v)
const matchPROP = (v:string): RegExpExecArray | null =>
  /^(?:(r|c|s|client|server)\W+)?(.+)$/i.exec(v)

const isNotTag = (v: string): boolean =>
  !!(matchFLAG(v) || matchTAG(v) || matchSLOT(v) || matchNAME(v) || matchVARS(v) ||
  matchELSEIF(v) || matchELSE(v) || matchIF(v) || matchFOR(v) || matchKEY(v) ||
  matchSWITCH(v) || matchCASE(v) || matchCASE_DEFAULT(v) ||
  matchUSES(v))

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const parseAttributes = (tokens: TypeToken[]) => {
  // console.log(...tokens)

  const data = chunkifyAttributes(tokens)
    .map((v) => v.map((v) => safeRemoveQuotes(v).trim()))

  const flags: {[key: string]: boolean} = {}
  const rules: [string, any][] = []
  const uses: [string, string][] = []
  const props: {
    client: {[key: string]: string},
    server: {[key: string]: string}
   } = { client: {}, server: {} }

  const sys = {
    tag : data[0] && !data[0][1] && !isNotTag(data[0][0]) ? data.shift()![0] : 'fragment',
    slot: '',
    name: '',

    switch      : '',
    case        : '',
    case_default: '',
    
    flags,
    rules,
    props,
    uses
  }

  let matches: RegExpExecArray | null
  for (let name: string, value: string, i = 0; i < data.length; i++) {
    [name, value] = data[i]
    if (name[0] === '{') value = name, name = name.replace(/^[\W]+|[\W][^]*$/gi, '')
    if (!value) value = ''
    data[i] = [name, value]

    // --FLAG
    if (matches = matchFLAG(name)) {
      // console.log('FLAG: ', matches)
      flags[matches[1]] = true
      continue
    }
  
    // TAG
    if (matches = matchTAG(name)) {
      // console.log('TAG: ', matches)
      sys.tag = value
      continue
    }
            
    // SLOT
    if (matches = matchSLOT(name)) {
      // console.log('SLOT: ', matches)
      sys.slot = value || '{void 0}'
      continue
    }
    
    // NAME
    if (matches = matchNAME(name)) {
      // console.log('NAME: ', matches)
      sys.name = value || '{void 0}'
      continue
    }
    
    // VARS
    if (matches = matchVARS(name)) {
      // console.log('VARS: ', value)
      const args: string[] = []
      const vals: string[] = []
      chunkifyAttributes(trimAllBrackets(jsx2tokens(value))).forEach((v) => {
        args.push(v[0])
        vals.push(v[1] || 'void 0')
      })
      rules.push(['VARS', { args: args.join(', '), vals: vals.join(', ') }])
      continue
    }

    // SWITCH
    if (matches = matchSWITCH(name)) {
      sys.switch = stringifyTokens(trimCurlyBrackets(jsx2tokens(value)))
      continue
    }
    // CASE
    if (matches = matchCASE(name)) {
      sys.case = stringifyTokens(trimCurlyBrackets(jsx2tokens(value)))
      continue
    }
    // DEFAULT
    if (matches = matchCASE_DEFAULT(name)) {
      sys.case_default = 'true'
      continue
    }
    
    // ELSEIF
    if (matches = matchELSEIF(name)) {
      // console.log('ELSEIF: ', matches)
      rules.push(['ELSEIF', stringifyTokens(trimCurlyBrackets(jsx2tokens(value)))])
      continue
    }
    // ELSE
    if (matches = matchELSE(name)) {
      // console.log('ELSE: ', matches)
      rules.push(['ELSE', 'true'])
      continue
    }
    // IF
    if (matches = matchIF(name)) {
      // console.log('IF: ', matches)
      rules.push(['IF', stringifyTokens(trimCurlyBrackets(jsx2tokens(value)))])
      continue
    }

    // FOR
    if (matches = matchFOR(name)) {
      // console.log('FOR: ', [value])
      const chunks = chunkifyArrayBy(
        trimAllBrackets(jsx2tokens(value)), (v, _k, a) => {
          const deep0 = a[0].deep
          return v.value === 'in' && v.type === TOKEN_KEYWORD && v.deep === deep0
        }, void 0, true
      ).map((v) => stringifyTokens(trimTokens(v)))

      const args = chunks[1] ? chunks[0] : ''
      const each = chunks[1] || chunks[0] || ''
      if (each) rules.push(['FOR', { args, each }])
      continue
    }

    // KEY
    if (matches = matchKEY(name)) {
      rules.push(['KEY', stringifyTokens(trimCurlyBrackets(jsx2tokens(value)))])
      continue
    }

    // USES
    if (matches = matchUSES(name)) {
      // @ts-ignore
      const env = ENVS[(matches[1] || '').toLowerCase()[0]] as 'client'
      // console.log('USES: ', env, matches)
      uses.push([env, stringifyTokens(trimCurlyBrackets(jsx2tokens(value)))])
      continue
    }
      
    // PROP
    if (matches = matchPROP(name)) {
      // @ts-ignore
      const env = ENVS[(matches[1] || '').toLowerCase()[0]] as 'client'
      // console.log('PROP: ', matches)
      if (!env) {
        if (name in props.client) props.client[name] += ' ' + value
        else props.client[name] = value
        if (name in props.server) props.server[name] += ' ' + value
        else props.server[name] = value
      } else {
        // eslint-disable-next-line no-lonely-if
        if (name in props[env]) props[env][name] += ' ' + value
        else props[env][name] = value
      }
      continue
    }
  }

  return sys
}

export declare type TypeToCodeOptions = {
  env: 'client' | 'server'
  pre?: boolean
  deep?: number
  rease: string
  tagId?: [number]
  needSlot?: boolean
  needCase?: boolean
}

class Expression {
  _tokens: TypeToken[]
  raw = ''
  inner = false
  constructor(tokens: TypeToken[], isInnerHtml?: boolean) {
    this._tokens = trimTokens(tokens)
    this.raw = stringifyTokens(this._tokens)
    this.inner = !!isInnerHtml
  }
  toCode({ rease, needSlot }: TypeToCodeOptions): any {
    const raw = this.raw.slice(1, -1)
    let res = storefy(raw, rease)
    if (res) {
      res = `${rease}.${this.inner ? 'i' : 'o'}(${res})`
      if (needSlot) res = `${rease}.sn(${createProp('', rease)}, () => ${res})`
    }
    // if (!isStorefy(res)) {
    //   if (needCircleBrackets(jsx2tokens(raw))) res = `(${res})`
    // }
    return res
  }
}

class Text {
  _tokens: TypeToken[]
  raw = ''
  constructor(token: TypeToken) {
    this._tokens = [token]
    this.raw = token.value
  }
  toCode({ pre, rease, needSlot }: TypeToCodeOptions): any {
    let res = this.raw
    if (!pre) res = res.replace(/^\s*\n\s*(\S?)|\n\s*$/g, (_f, S) => S ? ' ' + S : '')
    if (res) {
      res = `${rease}.t(${jsonStringify(res)})`
      if (needSlot) res = `${rease}.sn(${createProp('', rease)}, () => ${res})`
    }
    return res
  }
}

class TextsAndExpressions {
  children: (Text | Expression)[] = []
  toCode({ env, pre, deep = 0, rease, needSlot }: TypeToCodeOptions): any {
    let res = this.children.map((v) => v.toCode({ env, pre, rease, needSlot }))
      .filter(Boolean).join(', ')
    if (res) res = `${__offset__(deep)}${res}`
    return res
  }
}

class Comment {
  _tokens: TypeToken[]
  raw = ''
  constructor(token: TypeToken) {
    this._tokens = [token]
    this.raw = token.value.slice(4, -3)
  }
  toCode({ deep = 0, rease, needSlot }: TypeToCodeOptions): any {
    let res = '', end = ''
    if (needSlot) {
      res += `${__offset__(deep)}${rease}.sn(${createProp('', rease)}, () => \n`
      end = `\n${__offset__(deep)})` + end
      deep++
    }
    return `${res}${__offset__(deep)}${rease}.h(${jsonStringify(this.raw)})${end}`
  }
}

class Tag {
  _tokensOpener: TypeToken[]
  _tokensCloser: TypeToken[]
  attrs: ReturnType<typeof parseAttributes>
  children: (Tag | TextsAndExpressions | Comment)[] = []
  constructor(tokensOpener: TypeToken[], tokensCloser: TypeToken[]) {
    this._tokensOpener = tokensOpener
    this._tokensCloser = tokensCloser
    this.attrs = parseAttributes(tokensOpener.slice(1, -1))
  }
  toCode({ env, pre, deep = 0, rease, tagId = [10], needSlot, needCase }: TypeToCodeOptions): any {
    const attrs = this.attrs
    pre = pre || !!attrs.flags.pre || attrs.tag === 'pre'
    const isChildless = isChildlessTagName(attrs.tag)

    let res = ''
    let end = ''

    let tag = createTag(attrs.tag, rease)
    const tagType = !isNativeTag(attrs.tag) ? 'c'
      : tag === '"fragment"' ? 'f' : tag === '"slot"' ? 's' : 'e'
    tag = tagType === 'f' || tagType === 's' ? '' : tag + ', '
    const isElementOrFragment = tagType === 'e' || tagType === 'f'
    const isMayBeComponent = tagType === 'c'

    const props = attrs.props
    const propsStr = createProps(props[env] || props.client, rease)
    let usesStr = '', usesStrTemp = ''
    usesStrTemp = attrs.uses.map((v) => !v[0] || !env || v[0] === env ? v[1] : '')
      .filter(Boolean).join(', ')
    if (usesStrTemp) usesStr = `[${usesStrTemp}]`
  
    if (needSlot) {
      const value = createProp(attrs.slot, rease)
      res += `${__offset__(deep)}${rease}.sn(${value}, () => \n`
      end = `\n${__offset__(deep)})` + end
      deep++
    }

    if (needCase) {
      if (attrs.case) {
        const value = storefy(attrs.case, rease)
        res += `${__offset__(deep)}${rease}.sc(${value}, () => \n`
        end = `\n${__offset__(deep)})` + end
        deep++
      } else if (attrs.case_default) {
        res += `${__offset__(deep)}${rease}.sd(true, () => \n`
        end = `\n${__offset__(deep)})` + end
        deep++
      }
    }

    for (let rule: string, value: any, i = 0; i < attrs.rules.length; i++) {
      [rule, value] = attrs.rules[i]
      if (value) {
        let key: any, each: any
        switch (rule) {
          case 'VARS':
            res += `${__offset__(deep)}((${value.args}) => (\n`
            end = `\n${__offset__(deep)}))(${value.vals})` + end
            deep++
            break
          case 'ELSEIF':
          case 'ELSE':
          case 'IF':
            value = storefy(value, rease)
            key = { ELSEIF: 'ei', ELSE: 'el', IF: 'if' }[rule]
            res += `${__offset__(deep)}${rease}.${key}(${value}, () => \n`
            end = `\n${__offset__(deep)})` + end
            deep++
            break
          case 'FOR':
            each = storefy(value.each, rease)
            res += `${__offset__(deep)}${rease}.fe(${each}, (${value.args}) => \n`
            end = `\n${__offset__(deep)})` + end
            deep++
            break
          case 'KEY':
            value = storefy(value, rease)
            res += `${__offset__(deep)}${rease}.ke(${value}, () => \n`
            end = `\n${__offset__(deep)})` + end
            deep++
            break
          default:
            console.error('Incorrect rule: { ' + rule + ' : ' + value + ' }')
        }
      }
    }

    let nameStr = ''
    if (attrs.name) nameStr = createProp(attrs.name, rease)

    const allprops = [++tagId[0], propsStr, usesStr, nameStr]
      .join(', ').replace(/[,\s]+$/, '')

    let tt = ')('
    if (!isElementOrFragment) tt = ', () => '

    const offset = __offset__(deep++)
    res += `${offset}${rease}.${tagType}(${tag}[${allprops}]${tt}[`

    needSlot = isMayBeComponent
    needCase = !!attrs.switch
    let children = isChildless ? '' : this.children.map((v) =>
      v.toCode({ env, pre, deep, rease, tagId, needSlot, needCase }))
      .filter(Boolean)
      .join(',\n')
    if (children) children = '\n' + children + '\n' + offset

    if (children && attrs.switch) {
      const value = storefy(attrs.switch, rease)
      res += `${rease}.sw(${value})([`
      end = `])${end}`
      deep++
    }
    
    end = `])${end}`

    return res + children + end
  }
}

// ${('\n' + this.source).split(/\r?\n/).join('\n' + offset + '// ')}
class Program {
  source = ''
  children: (Tag | TextsAndExpressions | Comment)[] = []
  toCode({ env, pre = false, deep = 1, rease = 'rease', tagId = [10] }: TypeToCodeOptions): any {
    const offset = __offset__(deep++)

    let children = this.children.map((v) =>
      v.toCode({ env, pre, deep, rease, tagId })).filter(Boolean).join(',\n')
    if (children) children = '\n' + children + '\n' + offset
    return `
  /*
${this.source.replace(/\*\//g, '*\\/').replace(/ /g, '.')}
  */
${offset}return (${rease}) => [${children}]
    `
  }
}

const __createJsxProgram__ = (tokens: TypeToken[], children: any[]): any => {
  const a = chunkifyArrayBy(tokens, (v, _k, _a, ctx) => {
    if (ctx[0] !== ctx[0]) {
      ctx[0] = -1
      if (v.type === TOKEN_JSX_TAG_OPENER_START) {
        ctx[0] = v.deep
      }
      return true
    } else if (ctx[0] < 0) {
      if (v.type === TOKEN_JSX_TAG_OPENER_START) {
        ctx[0] = v.deep
        return true
      }
    } else if (ctx[0] === v.deep) {
      if (v.type === TOKEN_JSX_TAG_OPENER_END || v.type === TOKEN_JSX_TAG_CLOSER_END) {
        ctx[0] = NaN
      }
    }
    return false
  }, [-1])
  // console.log(a)
  // return
  a.forEach((tokens) => {
    if (tokens[0]) {
      let token: TypeToken
      switch (tokens[0].type) {
        case TOKEN_JSX_TAG_OPENER_START: {
          const tokensOpnr: TypeToken[] = []
          const tokensClsr: TypeToken[] = []
          while (tokens.length) {
            tokensOpnr.push(token = tokens.shift()!)
            if (token.type === TOKEN_JSX_TAG_OPENER_END) {
              if (token.deep - 1 === tokensOpnr[0].deep) {
                while (tokens.length) {
                  tokensClsr.unshift(token = tokens.pop()!)
                  if (token.type === TOKEN_JSX_TAG_CLOSER_START &&
                  token.deep - 1 === tokensClsr[tokensClsr.length - 1].deep) {
                    break
                  }
                }
                break
              } else if (token.deep === tokensOpnr[0].deep) {
                break
              }
            }
          }
          const node = new Tag(tokensOpnr, tokensClsr)
          children.push(node)
          __createJsxProgram__(tokens, node.children)
          break
        }
        default: {
          let isInnerHtml = false
          let node!: TextsAndExpressions | null
          while (tokens.length) {
            token = tokens.shift()!
            switch (token.type) {
              case TOKEN_JSX_TEXT: {
                isInnerHtml = false
                if (/@html$/i.test(token.value) && tokens[0] &&
                tokens[0].type === TOKEN_JSX_EXPRESSION_START) {
                  isInnerHtml = true
                  token.value = token.value.slice(0, -5)
                }
                node || children.push(node = new TextsAndExpressions())
                node.children.push(new Text(token))
                break
              }
              case TOKEN_JSX_COMMENT: {
                node = null
                children.push(new Comment(token))
                break
              }
              case TOKEN_JSX_EXPRESSION_START: {
                node || children.push(node = new TextsAndExpressions())
                const tokensExpr: TypeToken[] = [token]
                while (tokens.length) {
                  tokensExpr.push(token = tokens.shift()!)
                  if (token.type === TOKEN_JSX_EXPRESSION_END &&
                  token.deep === tokensExpr[0].deep) {
                    break
                  }
                }
                node.children.push(new Expression(tokensExpr, isInnerHtml))
                isInnerHtml = false
                break
              }
              default:
                throw new Error(token.type)
            }
          }
        }
      }
    }
  })
}

export const createTemplateTree = (source: string): Program => {
  // source = source.replace(/\s+$/, '')
  const tokens = jsx2tokens(source, true)
  // console.log(tokens)
  const program = new Program()
  program.source = source
  __createJsxProgram__(tokens, program.children)
  // console.log(program)
  // console.log(program.toCode({ env: 'client', rease: 'rease' }))
  return program
}
