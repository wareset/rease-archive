import { findIndexLeft } from '@wareset-utilites/array/findIndexLeft'
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
import { forEachRight } from '@wareset-utilites/array/forEachRight'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { jsonParse } from '@wareset-utilites/lang/jsonParse'
import { includes } from '@wareset-utilites/array/includes'
import { isArray } from '@wareset-utilites/is/isArray'
import { keys } from '@wareset-utilites/object/keys'
import { last } from '@wareset-utilites/array/last'

import { getDelimeter } from 'rastree/core/utils/getDelimeter'
import { getTokens } from 'rastree/core/template/lib/utils'
import { replaceQuotes } from 'rastree/core/utils/replaceQuotes'
import { TypeToken } from 'rastree/core/template/lib/source2Tokens'
import { trimTokens } from 'rastree/core/template/lib/trimTokens'
import { source2Tokens } from 'rastree/core/template/lib/source2Tokens'
import { stringifyTokens } from 'rastree/core/template/lib/stringifyTokens'
import {
  TOKEN_TEMPLATE,
  TOKEN_STRING,
  TOKEN_PUCNTUATOR,
  TOKEN_SPACE,
  TOKEN_IDENTIFIER,
  TOKEN_KEYWORD
} from 'rastree/core/template/lib/source2Tokens'

import * as reaseOptimizeData from '@rastree/uglify/data'
// console.log(reaseOptimizeData)

const data: { [key: string]: string } = {}
forEachLeft(keys(reaseOptimizeData), (key) => {
  data[reaseOptimizeData[key]] = key
})
const dataArr = keys(data).sort((a, b) => b.length - a.length)
// console.log(dataArr)

type TypeEasyToken = { type: string; value: string }

const createEasyToken = (
  value: string,
  type = TOKEN_PUCNTUATOR
): TypeEasyToken => ({ type, value })

const beforeTokens = (): any => [
  createEasyToken(') '),
  createEasyToken(' ', TOKEN_SPACE),
  createEasyToken('+'),
  createEasyToken(' ', TOKEN_SPACE)
]

const afterTokens = (): any => [
  createEasyToken(' ', TOKEN_SPACE),
  createEasyToken('+'),
  createEasyToken(' ', TOKEN_SPACE),
  createEasyToken('(')
]

const tokens2Easy: {
  (tokenOrTokens: TypeToken): TypeEasyToken
  (tokenOrTokens: TypeToken[]): TypeEasyToken[]
  (tokenOrTokens: TypeEasyToken): TypeEasyToken
  (tokenOrTokens: TypeEasyToken[]): TypeEasyToken[]
} = (tokenOrTokens: any) => {
  if (isArray(tokenOrTokens)) forEachLeft(tokenOrTokens, tokens2Easy)
  else {
    delete (tokenOrTokens as any).loc
    delete (tokenOrTokens as any).deep
    delete (tokenOrTokens as any).range
  }

  return tokenOrTokens
}

const fixBrackets = (tokens: TypeEasyToken[], start: number): void => {
  let end = findIndexLeft(tokens, (v) => v.value === ') ', start + 1)
  tokens[end].value = ')'
  const tokensIn = tokens.slice(start + 1, end)
  const beforeLen = tokensIn.length
  trimTokens(tokensIn as TypeToken[])
  // console.log(beforeLen, tokensIn)
  let needRemoveBrakets!: boolean
  if ((needRemoveBrakets = !tokensIn[1]) || tokensIn.length !== beforeLen) {
    if (!tokensIn[0]) end += 3
    if (needRemoveBrakets) start--, end++
    tokens.splice(start + 1, end - start - 1, ...tokensIn)
  }
}

const fixStrings = (tokensOrString: string | TypeToken[]): TypeEasyToken[] => {
  const tokens = getTokens(tokensOrString) as TypeEasyToken[]

  let token: TypeEasyToken, tokenLast!: TypeEasyToken, value: string
  let i = tokens.length
  const tokenLastCompare = (v: any): boolean => v === tokenLast
  while (i-- > 0) {
    if (token = tokens[i]) {
      tokens2Easy(token)
      value = token.value
      if (token.type === TOKEN_TEMPLATE) {
        token.type = TOKEN_STRING
        if (value[0] === '`' && last(value) === value[0]) {
          token.value = replaceQuotes(value)
        } else if (value[0] === '}' && last(value) === '{') {
          tokens.splice(
            i,
            1,
            ...beforeTokens(),
            createEasyToken(
              replaceQuotes('`' + value.slice(1, -2) + '`'),
              TOKEN_STRING
            ),
            ...afterTokens()
          )
          fixBrackets(tokens, i + 8)
        } else if (last(value) === '`') {
          token.value = replaceQuotes('`' + value.slice(1))
          tokens.splice(i, 0, ...beforeTokens())
        } else if (value[0] === '`') {
          token.value = replaceQuotes(value.slice(0, -2) + '`')
          tokens.splice(i + 1, 0, ...afterTokens())
          fixBrackets(tokens, i + 4)
        }
      } else if (token.type === TOKEN_STRING) {
        token.value = replaceQuotes(value)
      } else if (token.value === '.' && token.type === TOKEN_PUCNTUATOR) {
        if (tokenLast && tokenLast.type !== TOKEN_PUCNTUATOR) {
          tokens.splice(
            i,
            findIndexLeft(tokens, tokenLastCompare, i + 1) - i + 1,
            createEasyToken('['),
            createEasyToken(jsonStringify(tokenLast.value), TOKEN_STRING),
            createEasyToken(']')
          )
        }
      }

      if ((token = tokens[i]) && (token.value === '[' || token.value === ']')) {
        if (
          token.value === '[' &&
          (token = tokens[i + 1]) &&
          token.type === TOKEN_SPACE
        ) {
          tokens.splice(i + 1, 1)
        }

        if ((token = tokens[i - 1]) && token.type === TOKEN_SPACE) {
          if (
            (token = tokens[i - 2]) &&
            (token.type !== TOKEN_PUCNTUATOR || token.value === ')')
          ) {
            tokens.splice(i++ - 1, 1)
          }
        }
      }

      if (tokens[i].type !== TOKEN_SPACE) {
        tokenLast = tokens[i]
      }
    }
  }

  return tokens
}

import * as __Function__ from './function'
import * as __FunctionPrototype__ from './functionprototype'
import * as __JSON__ from './json'
import * as __Math__ from './math'
import * as __Number__ from './number'

import * as __lang__ from './lang'

import * as __Object__ from './object'
import * as __ObjectPrototype__ from './objectprototype'

// const proto = 'prototype'

const createSafeAlias = (v1: string, v2: string, salt: string): string =>
  v1 + v2 + salt

const optimize = (
  source: string,
  {
    safeMath = true,
    safeDefaults = true,
    uglifyStrings = true
  }: {
    safeMath?: boolean
    safeDefaults?: boolean
    uglifyStrings?: boolean
  } = {}
): string => {
  const __d__ = getDelimeter(source, '$')
  const tokens = fixStrings(source2Tokens(source).tokens)

  const dataCache: { [key: string]: 1 } = {}

  let globalDefsLang: string[] = []
  const globalDefs: { [key: string]: any } = {}
  if (safeMath) globalDefs.Math = ['math', keys(__Math__)]
  if (safeDefaults) {
    globalDefs.JSON = ['json', keys(__JSON__)]
    globalDefs.Number = ['number', keys(__Number__)]

    // prettier-ignore
    globalDefs.Object = ['object',
      keys(__Object__).filter((v) => !(v in __ObjectPrototype__))]
    // prettier-ignore
    globalDefs[createSafeAlias('object', 'prototype', __d__)] =
      ['objectprototype', keys(__ObjectPrototype__)]

    globalDefs.Function = ['function', keys(__Function__)]
    // prettier-ignore
    globalDefs[createSafeAlias('function', 'prototype', __d__)] =
        ['functionprototype', keys(__FunctionPrototype__)]

    globalDefsLang = keys(__lang__)
  }
  const globalDefsArr = keys(globalDefs)
  // console.log(globalDefs)
  const defs: { [key: string]: [string, string] } = {}
  const defsLang: { [key: string]: 1 } = {}

  let isImport!: boolean
  let isExport!: boolean
  let isFrom!: boolean

  forEachLeft(tokens, (token, k, _a, context) => {
    const { type } = token
    let { value } = token

    if (type === TOKEN_KEYWORD) {
      if (value === 'import') isImport = true
      if (value === 'export') isExport = true
    }

    if (isExport) {
      if (
        !isFrom && type === TOKEN_STRING ||
        isFrom && type === TOKEN_PUCNTUATOR
      ) {
        isExport = false
      }
    }

    if (!isImport && !isExport) {
      if (type === TOKEN_IDENTIFIER) {
        let token2: TypeEasyToken, value2: string
        // console.log(value)
        if (
          includes(globalDefsArr, value) &&
          (token2 = tokens[k + 1]) &&
          token2.value === '[' &&
          (token2 = tokens[k + 3]) &&
          token2.value === ']' &&
          (token2 = tokens[k + 2]) &&
          token2.type === TOKEN_STRING &&
          includes(globalDefs[value][1], value2 = jsonParse(token2.value))
        ) {
          token.value = createSafeAlias(globalDefs[value][0], value2, __d__)
          defs[token.value] = [globalDefs[value][0], value2]
          tokens.splice(k + 1, 3)
          context.index--
          // console.log(value, value2)
        } else if (includes(globalDefsLang, value)) {
          defsLang[value] = 1
        }
      } else if (type === TOKEN_STRING && uglifyStrings) {
        value = jsonParse(value)
        let i: number
        if (value in data) {
          token.type = TOKEN_IDENTIFIER
          token.value = data[value] + __d__
          dataCache[data[value]] = 1
        } else if (
          // value[2] &&
          (i = findIndexLeft(dataArr, (v) => includes(value, v))) > -1
        ) {
          const dataValue = dataArr[i]
          dataCache[data[dataValue]] = 1
          const newTokens: TypeEasyToken[] = []
          newTokens.unshift(createEasyToken(')'))
          const dataInject = data[dataValue] + __d__
          forEachRight(value.split(dataValue), (v, k) => {
            if (v) {
              if (newTokens[1]) newTokens.unshift(createEasyToken('+'))
              newTokens.unshift(createEasyToken(jsonStringify(v), TOKEN_STRING))
            }
            if (k) {
              if (newTokens[1]) newTokens.unshift(createEasyToken('+'))
              newTokens.unshift(createEasyToken(dataInject, TOKEN_IDENTIFIER))
            }
          })
          newTokens.unshift(createEasyToken('('))
          tokens.splice(k, 1, ...newTokens)
          context.index--
        }
      }
    }

    if (isImport || isExport) {
      if (value === 'from') isFrom = true

      if (
        type === TOKEN_STRING ||
        type === TOKEN_PUCNTUATOR && /[^,{}]/.test(value)
      ) {
        isImport = isExport = isFrom = false
      }
    }
  })

  // console.log(tokens)

  const dataCacheArr = keys(dataCache)
  let dataImports = ''
  if (dataCacheArr[0]) {
    dataImports =
      'import { ' +
      dataCacheArr.map((v) => v + ' as ' + v + __d__).join(', ') +
      " } from '@rastree/uglify/data';\n\n"
  }

  const defsLangArr = keys(defsLang)
  let langImports = ''
  if (defsLangArr[0]) {
    langImports =
      'import { ' +
      defsLangArr.join(', ') +
      " } from '@rastree/uglify/lang';\n\n"
  }

  let safeImports = keys(defs)
    .map(
      (v) =>
        `import { ${defs[v][1]} as ${v} } from '@rastree/uglify/${defs[v][0]}';\n`
    )
    .join('')
  if (safeImports) safeImports += '\n'

  // console.log(tokens)

  const res =
    langImports +
    safeImports +
    dataImports +
    stringifyTokens(tokens as TypeToken[])

  // console.log(res)

  return res
}

export default optimize
