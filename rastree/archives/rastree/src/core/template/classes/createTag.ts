/* eslint-disable security/detect-unsafe-regex */

import { Boolean as __Boolean__ } from '@wareset-utilites/lang/Boolean'
// import { localeCompare } from '@wareset-utilites/string/localeCompare'
import { findIndexLeft } from '@wareset-utilites/array/findIndexLeft'
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
import { trimRight } from '@wareset-utilites/string/trimRight'
import { jsonParse } from '@wareset-utilites/lang/jsonParse'
import { concat } from '@wareset-utilites/array/concat'
import { keys } from '@wareset-utilites/object/keys'
import { trim } from '@wareset-utilites/string/trim'
import { last } from '@wareset-utilites/array/last'
import { isNaN } from '@wareset-utilites/is/isNaN'

import {
  TypeToken, jsx2tokens, TOKEN_KEYWORD,
  stringifyTokens, trimCircleBrackets
} from '@rastree/jsx2tokens'

import { offset, isLiteral } from './utils'
import { storefyExpression, STOREFY } from './storefyExpression'
import { replaceQuotes } from '../../utils/replaceQuotes'

import { parseAttributes as dfltParseAttributes } from '../lib/parseAttributes'

const isExpression = (v: string): boolean => {
  if (v[0] === '{' && last(v) === '}') {
    try {
      return jsx2tokens(v)
        .tokens.slice(1, -1)
        .every((v) => v.deep)
    } catch (e) {
      /* */
    }
  }

  return false
}

export const fixArrayValues = (arr: string[]): string[] => {
  const data: string[] = []
  let islit: boolean
  arr.forEach((v) => {
    if (v) {
      if (!islit) islit = isLiteral(v), data.push(v)
      else {
        (islit = isLiteral(v))
          ? data[data.length - 1] = jsonStringify(
            jsonParse(last(data)!) + jsonParse(v)
          )
          : data.push(v)
      }
    }
  })
  return data
}

const unquoteValue = (value: string): string => {
  try {
    value = trim(jsonParse(replaceQuotes(value)))
  } catch (e) {
    /* */
  }
  return value
}

const safetyKey = (value: string): string => {
  if (/^\d+[^\d]|[^$\w]/.test(value)) value = jsonStringify(value)
  return value
}

const fixIfExpression = (value: string): string =>
  isExpression(value) ? value.slice(1, -1) : value

const normalizeSysValue = (
  value: string,
  salt: string,
): string =>
  storefyExpression(
    jsx2tokens(isExpression(value) ? value.slice(1, -1) : jsonStringify(value)).tokens,
    salt
  )

const normalizeValue = (value: string, salt: string): string[] => {
  let res: string[]
  if (value.indexOf('{') < 0 || value.indexOf('}') < 0) {
    res = [jsonStringify(value)]
  } else if (isExpression(value)) {
    res = [storefyExpression(jsx2tokens(value.slice(1, -1)).tokens, salt)]
  } else {
    const tokens = jsx2tokens(value).tokens
    res = []
    let token: TypeToken
    for (let i = 0; i <= tokens.length; ++i) {
      token = tokens[i]
      if (
        !token ||
        i &&
          !token.deep &&
          (token.value === '{' || token.value === '}' && ++i)
      ) {
        res.push(...normalizeValue(stringifyTokens(tokens.splice(0, i)), salt))
        i = 0
      }
    }
  }
  return res
}

// const splitByTokens = (value: string, spliter: string): string[] => {
//   const tokens = jsx2tokens(value).tokens
//   const res: string[] = []
//   let token: TypeToken
//   for (let i = 0; i <= tokens.length; ++i) {
//     token = tokens[i]
//     if (!token || (i && !token.deep && token.value === spliter)) {
//       res.push(
//         stringifyTokens(tokens.splice(0, i + 1).slice(0, token ? -1 : void 0))
//       )
//       i = 0
//     }
//   }
//   return res
// }

const killquotes = (str: string): string => str.replace(/['"`]+/g, '')

const normalizeAttributes = (
  [name, value]: [string, string],
  _salt: string
): [string, string] => {
  console.log(1, [name, value])
  name = unquoteValue(name)

  if (isExpression(name)) {
    value = name, name = trim(name.slice(1, -1))
  }
  
  if (!value ||
    (name[0] === ':' || name.indexOf('use:') > -1) && killquotes(value) === killquotes(name)) {
    value = ''
  } else {
    value = unquoteValue(value)
  }
  // else if (/^['"`]/.test(value) && isExpression(value.slice(1, -1))) {
  //   value = trim(jsonParse(replaceQuotes(value)))
  // }

  // value = unquoteValue(value)
  // if (name.indexOf(':') > -1) {
  //   if (last(name) === ')') {
  //     const idx = name.indexOf('(')
  //     value = '{' + name.slice(idx + 1, -1) + '}'
  //     name = name.slice(0, idx)
  //   } else if (name === value) {
  //     value = '' // '{}'
  //   }
  // }

  // if (isExpression(value)) {
  //   value = storefyExpression(trim(value.slice(1, -1)), salt)
  // } else if (/^['"`]/.test(value)) {
  //   value = jsonStringify(trim(jsonParse(replaceQuotes(value))))
  // }
  console.log(2, [name, value])
  return [name, value]
}

const ENVS = {
  c      : 'client',
  client : 'client',
  b      : 'client',
  browser: 'client',
  s      : 'server',
  server : 'server'
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const parseTagAttributes = (
  tokens: TypeToken[],
  salt: string
) => {
  const arr = dfltParseAttributes(tokens).map((v) =>
    normalizeAttributes(v as any, salt))

  let tag
  const flags: { [key: string]: any } = {}
  const props: { [key: string]: { [key: string]: any | string[] } } = {
    client: {},
    server: {},
    all   : {}
  }
  // const uses0: [string, any][] = []
  // const refs: { [key: string]: [string, string][] } = {}
  const uses: [string, string][] = []
  const rules: [string, any][] = []
  const sys: { [key: string]: any } = {}

  const tagArr = arr.shift()
  if (tagArr) {
    if (tagArr[1]) tag = tagArr[1]
    else {
      tag = tagArr[0]
      if (tag !== 'this' && /^[-a-z]+[-a-z\d]*$/.test(tag)) {
        tag = jsonStringify(tag)
      }
    }
  }
  sys.tag = tag || '"fragment"'

  arr.forEach(([name, value]) => {
    // --FLAGS
    if (/^--/.test(name)) {
      flags[name.replace(/^-+/, '')] = true
      return
    }
    let matches: any
    // TAG
    if (matches = /^r?:tag.?(?:Name)?(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) sys.tag = storefyExpression(matches[1], salt)
      else if (value) sys.tag = normalizeSysValue(value, salt)
      return
    }
    // SLOT
    if (matches = /^r?:slot(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) sys.slot = storefyExpression(matches[1], salt)
      else if (value) sys.slot = normalizeSysValue(value, salt)
      return
    }
    // NAME
    if (matches = /^r?:name(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) sys.name = storefyExpression(matches[1], salt)
      else if (value) sys.name = normalizeSysValue(value, salt)
      return
    }

    // VARS
    if (matches = /^r?:(?:var|let)s?(?:\(([^]+)\))?$/i.exec(name)) {
      const vars = stringifyTokens(
        trimCircleBrackets(jsx2tokens(fixIfExpression(matches[1] || value)).tokens)
      )
      if (vars) {
        const args: string[] = []
        const vals: string[] = []
        dfltParseAttributes(jsx2tokens(vars).tokens).forEach((v) => {
          args.push(v[0])
          vals.push(v[1] || 'void 0')
        })

        rules.push(['VARS', { args: args.join(', '), vals: vals.join(', ') }])
      }
      return
    }

    // ELSEIF
    if (matches = /^r?:el(?:se)?.?if(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) value = storefyExpression(matches[1], salt)
      else if (value) value = normalizeSysValue(value, salt)
      rules.push(['ELSEIF', value])
      return
    }
    // ELSE
    if (matches = /^r?:else(?:\(([^]+)\))?$/i.exec(name)) {
      rules.push(['ELSE', 'true'])
      return
    }
    // IF
    if (matches = /^r?:if(?:\(([^]+)\))?$/i.exec(name)) {
      if (matches[1]) value = storefyExpression(matches[1], salt)
      else if (value) value = normalizeSysValue(value, salt)
      rules.push(['IF', value])
      return
    }

    // FOR
    if (matches = /^r?:(?:for(?:each)?|each)(?:\(([^]+)\))?$/i.exec(name)) {
      value = matches[1] || (isExpression(value) ? value.slice(1, -1) : jsonStringify(value))
      const tokens = trimCircleBrackets(jsx2tokens(value).tokens)
      if (tokens.length) {
        let args = ''
        const end = findIndexLeft(
          tokens,
          (v) => v.value === 'in' && v.type === TOKEN_KEYWORD
        )

        if (end > -1) {
          args = stringifyTokens(trimCircleBrackets(tokens.splice(0, end)))
        }
        const each = storefyExpression(tokens.slice(1), salt)
        if (each) rules.push(['FOR', { each, args }])
      }
      return
    }

    // todo
    if (matches = /^r?:key$/i.exec(name)) {
      if (matches[1]) value = storefyExpression(matches[1], salt)
      else if (value) value = normalizeSysValue(value, salt)
      if (value) rules.push(['KEY', value])
      return
    }

    // // MIXIN
    // if (/^r?:mixin$/i.test(name)) {
    //   rules.push(['MIXIN', normalizeSysValue(value, salt)])
    //   return
    // }

    // REFS
    // if (
    //   matches = /^(?:(c|s|b|client|server|browser)\W+)?ref(?::([^]*?)(?:[^\w.\]]+(\w+))?)$/i.exec(
    //     name
    //   )
    // ) {
    //   // console.log(444, matches)
    //   let env = (matches[1] || '').toLowerCase()
    //   if (env) env = (ENVS as any)[env] || ''
    //   name = safetyKey(matches[2] || '_')
    //   value = fixIfExpression(value)
    //   if (matches[3]) value = value ? `${matches[3]}, ${value}` : matches[3]
    //   value = `[${value}]`;
    //   (refs[name] || (refs[name] = [])).push([value, env])
    //   return
    // }

    // console.log(9944, name, value, fixIfExpression(value))

    // USES
    if (
      matches = /^(?:(c|s|b|client|server|browser)\W+)?use:(.+)$/i.exec(
        name
      )
    ) {
      // console.log(555, matches)
      let env = (matches[1] || '').toLowerCase()
      if (env) env = (ENVS as any)[env] || ''
      name = matches[2]
      if (value) name += `(${fixIfExpression(value)})`
      uses.push([name, env])
      // console.log(666, env, name)
      return
    }

    // if (
    //   (matches = /^(?:(c|s|client|server)\W+)?use(?::([^]+?)(?:[^\w.\]]+(\w+))?)$/i.exec(
    //     name
    //   ))
    // ) {
    //   let env = (matches[1] || '').toLowerCase()
    //   if (env) env = (ENVS as any)[env] || ''
    //   // const nameArr =
    //   //   matches[2].indexOf(':') < 0
    //   //     ? [matches[2]]
    //   //     : splitByTokens(matches[2], ':')
    //   name = matches[3] ? safetyKey(matches[3]) : ''
    //   value = `[${matches[2]}, [${normalizeSysValue(value, salt, true)}]]`
    //   if (!name) uses0.push([value, env])
    //   else (uses[name] || (uses[name] = [])).push([value, env])
    //   return
    // }

    // PROP
    if (matches = /^(?:(c|s|b|client|server|browser)\W+)?(.+)$/i.exec(name)) {
      let env = (matches[1] || '').toLowerCase()
      if (env) env = (ENVS as any)[env] || ''
      name = matches[2]
      if (name.indexOf(':') > -1) {
        const arr = name.split(':')
        if (!isNaN(+arr[1])) name = trim(arr[0])
      }
      name = safetyKey(name)

      if (env in props) {
        if (!props[env][name]) props[env][name] = [value]
        else props[env][name].push(' ', value)
        if (!props.all[name]) props.all[name] = [value]
        else props.all[name].push(' ', value)
      } else {
        for (const env in props) {
          if (!props[env][name]) props[env][name] = [value]
          else props[env][name].push(' ', value)
        }
      }
      return
    }

    console.error('Incorrect propname: { ' + name + ' : ' + value + ' }')
  })

  // eslint-disable-next-line guard-for-in
  for (const env in props) {
    const propsEnv = props[env]
    for (let a = keys(propsEnv), i = a.length; i-- > 0;) {
      const key = a[i]
      const arr: string[] = fixArrayValues(
        concat(...propsEnv[key].map((v: string) => v ? normalizeValue(v, salt) : 'true'))
      )

      if (!arr.length) delete propsEnv[key]
      else if (arr.length === 1) propsEnv[key] = arr[0]
      else propsEnv[key] = `${STOREFY + salt}.c([${arr.join(', ')}])`
      // если комплексный массив, то добавить к нему ключ '%complex%' например
    }
  }

  // console.log('flags', flags)
  // console.log('props', props)
  // console.log('uses', uses)
  // console.log('sys', sys)
  return { flags, props, uses, rules, sys }
}

export const createTag = (
  { props, uses, rules, sys }: ReturnType<typeof parseTagAttributes>,
  _salt: string,
  deep: number,
  env: 'client' | 'server' | null,
  tagId: [number]
): [string, string, number] => {
  let res = ''
  let end = ''

  let propsStr = ''
  const propsEnv = props[env || ''] || props.all
  // eslint-disable-next-line guard-for-in
  for (const k in propsEnv) propsStr += k + ': ' + propsEnv[k] + ', '
  if (propsStr) propsStr = '{ ' + propsStr.slice(0, -2) + ' }'

  // let uses0Str = uses0
  //   .map((v) => (!v[1] || !env || v[1] === env ? v[0] : ''))
  //   .filter(__Boolean__)
  //   .join(', ')
  // if (uses0Str) uses0Str = `[${uses0Str}]`

  // let refsStr = ''
  // let refsStrTemp = ''
  // // eslint-disable-next-line guard-for-in
  // for (const k in refs) {
  //   refsStrTemp = refs[k]
  //     .map((v) => !v[1] || !env || v[1] === env ? v[0] : '')
  //     .filter(__Boolean__)
  //     .join(', ')
  //   if (refsStrTemp) refsStr += k + `: [${refsStrTemp}], `
  // }
  // if (refsStr) refsStr = '{ ' + refsStr.slice(0, -2) + ' }'

  let usesStr = ''
  let usesStrTemp = ''
  usesStrTemp = uses
    .map((v) => !v[1] || !env || v[1] === env ? v[0] : '')
    .filter(__Boolean__)
    .join(', ')
  if (usesStrTemp) usesStr = `[${usesStrTemp}]`

  let slotStr = ''
  if (sys.slot) {
    slotStr = ', ' + sys.slot
  }

  rules.forEach(([rule, value]) => {
    if (value) {
      let key: any // , args: any
      switch (rule) {
        case 'VARS':
          res += `${offset(deep)}((${value.args}) => (\n`
          end = `\n${offset(deep)}))(${value.vals})` + end
          deep++
          break
        case 'ELSEIF':
        case 'ELSE':
        case 'IF':
          key = { ELSEIF: 8, ELSE: 7, IF: 9 }[rule]
          res += `${offset(deep)}[${key}, ${value}, () => \n`
          end = `\n${offset(deep)}${slotStr}]` + end
          slotStr = ''
          deep++
          break
        case 'FOR':
          res += `${offset(deep)}[6, ${value.each}, (${value.args}) => \n`
          end = `\n${offset(deep)}${slotStr}]` + end
          slotStr = ''
          deep++
          break
        case 'KEY':
          slotStr = (slotStr || ',') + `, ${value}`
          // res += `${offset(deep)}[1, ${value}, () => [\n`
          // end = `\n${offset(deep)}]${slotStr}]` + end
          // slotStr = ''
          // deep++
          break
        // case 'MIXIN':
        //   args = `propsMixin${salt} = {}`
        //   propsStr =
        //     (propsStr ? propsStr.slice(0, -1) + ',' : '{') +
        //     ` ...propsMixin${salt}}`
        //   res += `${offset(deep)}[4, ${value}, (${args}) => [\n`
        //   end = `\n${offset(deep)}]${slotStr}]` + end
        //   slotStr = ''
        //   deep++
        //   break
        default:
          console.error('Incorrect rule: { ' + rule + ' : ' + value + ' }')
      }
    }
  })

  let nameStr = ''
  if (sys.name) {
    nameStr = sys.name
  }

  const attrs = trimRight(
    [sys.tag, propsStr, usesStr, nameStr].join(', '),
    ',\\s'
  )

  res += `${offset(deep)}[${++tagId[0]}, [${attrs}], [`
  end = `]${slotStr}]` + end
  deep++

  // res += end
  // console.log(res)
  return [res, end, deep]
}
