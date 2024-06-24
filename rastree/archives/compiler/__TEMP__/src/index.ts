/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  TypeToken,
  jsx2tokens,
  trimRightTokens,
  trimTokens, stringifyTokens,
  prevRealTokenIndex, nextRealTokenIndex,
  TOKEN_STRING, TOKEN_PUCNTUATOR,
  TOKEN_TEMPLATE, TOKEN_TEMPLATE_HEAD, TOKEN_TEMPLATE_MIDDLE, TOKEN_TEMPLATE_TAIL
} from '@rastree/jsx2tokens'
import {
  hash, getDelimeter,
  safeRemoveQuotes, chunkifyArrayBy,
} from '@rastree/utilites'
import { cjsx2jsx } from '@rastree/cjsx2jsx'

import { createTemplateTree } from './lib/templateTree'

const __isModule__ = (
  a: TypeToken[], k: number
): boolean => a[k] && (
  a[k].value === 'export' && __isModule__(a, nextRealTokenIndex(a, k)) ||
    /^(?:module|namespace)$/.test(a[k].value) &&
    (k = nextRealTokenIndex(a, k)) > -1 && a[k].type !== TOKEN_PUCNTUATOR &&
    (k = nextRealTokenIndex(a, k)) > -1 && a[k].value === '{'
)

declare type TypeNamedChunk = { name: string, isExport: boolean, tokens: TypeToken[] }

const REG_IS_OPTIONS = /options/i
const REG_IS_CLIENT = /client|browser/i
const REG_IS_SERVER = /server/i
const REG_IS_COMPONENT = /component/i
const REG_IS_STYLE = /style/i
const REG_IS_TEMPALTE = /template/i
const REG_IS_CONCISE = /concise/i
const REG_IS_PRE = /pre/i

const __chunkifyByModules__ = (
  tokens: TypeToken[]
): TypeNamedChunk[] => {
  const a = chunkifyArrayBy(tokens, (token, k, a, insideModule) => {
    const deep0 = a[0].deep
    let res = false
    if (token.deep === deep0) {
      if (!insideModule[0]) {
        if (__isModule__(a, k)) res = insideModule[0] = true
      } else {
        const j = prevRealTokenIndex(a, k)
        if (j > -1 && a[j].deep === deep0 && a[j].value === '}') {
          res = !(insideModule[0] = false)
        }
      }
    }
    return res
  }, [false])

  const res: TypeNamedChunk[] = []

  // console.log(a)
  // throw 12
  a.forEach((tokens) => {
    let name = ''
    let isExport = false
    if (__isModule__(tokens, 0)) {
      if (isExport = tokens[0].value === 'export') tokens.shift(), trimTokens(tokens)
      tokens.shift(), trimTokens(tokens)
      name = tokens.shift()!.value
      trimTokens(tokens), tokens.pop(), tokens.shift(), trimRightTokens(tokens)
    } else {
      trimRightTokens(tokens)
    }

    if (tokens.length) res.push({ name, isExport, tokens })
  })

  return res
}

const createTextFromTokens = (
  tokens: TypeToken[], comment: string
): string => `/* begin ${comment} */\n;` + stringifyTokens(tokens) + `;\n/* end ${comment} */\n`

const createTemplate = (template: TypeNamedChunk, rease: string) => {
  let templateStr = ''
  const tokens = template.tokens
  const isConcise = REG_IS_CONCISE.test(template.name)
  const pre = REG_IS_PRE.test(template.name)

  LOOP: for (let token: TypeToken, i = 0; i < tokens.length; i++) {
    switch ((token = tokens[i]).type) {
      case TOKEN_STRING:
      case TOKEN_TEMPLATE:
        templateStr = safeRemoveQuotes(token.value)
        break LOOP
      case TOKEN_TEMPLATE_HEAD: {
        const deepOrigin = token.deep
        for (let deep: number, type: string, value: string;
          i < tokens.length; i++) {
          ({ deep, type, value } = tokens[i])
          if (deep !== deepOrigin) templateStr += value
          else {
            switch (type) {
              case TOKEN_TEMPLATE_HEAD:
                templateStr += safeRemoveQuotes(value) + '{'
                break
              case TOKEN_TEMPLATE_MIDDLE:
                templateStr += '}' + safeRemoveQuotes(value) + '{'
                break
              case TOKEN_TEMPLATE_TAIL:
                templateStr += '}' + safeRemoveQuotes(value)
                break LOOP
              default:
                templateStr += value
            }
          }
        }
        break LOOP
      }
      default:
    }
  }

  // console.log('TEMPALE: \n' + templateStr)
  if (isConcise) templateStr = cjsx2jsx(templateStr, !pre)
  else if (!pre) templateStr = templateStr.trim()
  templateStr = templateStr.replace(/\s+$/, '')

  // console.log('TEMPALE: \n' + templateStr)

  const program = createTemplateTree(templateStr)
  const clientCode = program.toCode({ env: 'client', pre, rease })
  const serverCode = program.toCode({ env: 'server', pre, rease })
  return { clientCode, serverCode }
}

const fixComponentName = (name: string): string => {
  const newname = name.replace(REG_IS_COMPONENT, '')
  return /^\w/.test(newname) ? newname : name
}

const createComponentCode = (
  name: string, isExport: boolean, code: string, cid: string
): string => `
${isExport ? 'export ' : ''}const ${name} = function ${fixComponentName(name)}() {${
  code.replace(/\s+$/, '')}
}
${name}.cid = ${cid}
`

const createComponent =
  (component: TypeNamedChunk, rease: string, salt: string) => {
    let whollyCode = ''
    let clientCode = ''
    let serverCode = ''

    let style!: TypeNamedChunk
    let template!: ReturnType<typeof createTemplate>
    for (let a = __chunkifyByModules__(component.tokens),
      name: string, tokens: TypeToken[], text: string,
      i = 0; i < a.length; i++) {
      ({ name, tokens } = a[i])
      if (!name) {
        text = createTextFromTokens(tokens, 'BASE')
        whollyCode += text
        clientCode += text
        serverCode += text
      } else if (REG_IS_STYLE.test(name)) {
        style = a[i]
      } else if (REG_IS_CLIENT.test(name)) {
        text = createTextFromTokens(tokens, 'CLIENT')
        whollyCode += text
        clientCode += text
      } else if (REG_IS_SERVER.test(name)) {
        text = createTextFromTokens(tokens, 'SERVER')
        whollyCode += text
        serverCode += text
      } else if (REG_IS_TEMPALTE.test(name)) {
        template = createTemplate(a[i], rease)
        clientCode += template.clientCode
        serverCode += template.serverCode
      }
    }

    // TODO: Доделать стили. Это просто заглушка
    ((_a: any): any => _a)(style)

    const { name, isExport } = component

    let hashStr = salt + name + whollyCode
    if (template) {
      hashStr += template.clientCode + template.serverCode
    } else {
      const defaultReturn = '\n  return (_o) => []'
      clientCode += defaultReturn
      serverCode += defaultReturn
    }

    // @ts-ignore
    const cid = '"r' + hash(hashStr) + '"'
    console.log('CID: ', cid, name, isExport)
    clientCode = createComponentCode(name, isExport, clientCode, cid),
    serverCode = createComponentCode(name, isExport, serverCode, cid)

    return { clientCode, serverCode }
  }

export const compiler = (source: string, { salt }: { salt?: string } = {}) => {
  salt = salt + '' || hash(source)
  const delimeter = getDelimeter(source)
  const tokens = trimTokens(jsx2tokens(source))
  // console.log(tokens)

  let clientCode = '/* eslint-disable */\n'
  let serverCode = clientCode

  let options!: TypeNamedChunk
  let component: ReturnType<typeof createComponent>
  const a: TypeNamedChunk[] = __chunkifyByModules__(tokens)
  for (let name: string, tokens: TypeToken[], text: string,
    i = 0; i < a.length; i++) {
    ({ name, tokens } = a[i])
    if (!name) {
      text = createTextFromTokens(tokens, 'BASE')
      clientCode += text
      serverCode += text
    } else if (REG_IS_CLIENT.test(name)) {
      text = createTextFromTokens(tokens, 'CLIENT')
      clientCode += text
    } else if (REG_IS_SERVER.test(name)) {
      text = createTextFromTokens(tokens, 'SERVER')
      serverCode += text
    } else if (REG_IS_OPTIONS.test(name)) {
      options = a[i]
    } else if (REG_IS_COMPONENT.test(name)) {
      component = createComponent(a[i], delimeter, salt)
      clientCode += component.clientCode
      serverCode += component.serverCode
    }
  }

  // TODO: Доделать опции. Это просто заглушка
  ((_a: any): any => _a)(options)

  // console.log(['component'])
  // console.log(component)

  // console.log(['clientCode'])
  // console.log(clientCode)
  // console.log(['serverCode'])
  // console.log(serverCode)

  return { client: clientCode, server: serverCode }
}

export default compiler
