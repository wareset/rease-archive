/* eslint-disable security/detect-unsafe-regex */

import { forEachRight } from '@wareset-utilites/array/forEachRight'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { startsWith } from '@wareset-utilites/string/startsWith'
import { jsonParse } from '@wareset-utilites/lang/jsonParse'
import { trim } from '@wareset-utilites/string/trim'
import { keys } from '@wareset-utilites/object/keys'
import { unique } from '@wareset-utilites/unique'

import { replaceQuotes } from '../../utils/replaceQuotes'
import { removeComments } from '../../utils/removeComments'

type TypeImportsItem = { [key: string]: string[] }
export type TypeImports = { [key: string]: TypeImportsItem }

type TypeExtractImports = {
  code: string
  imports: TypeImports
}

export const __REASE_COMPONENT__ = 'rease/component'
export const fixReaseImportName = (v: string): string =>
  startsWith(v, __REASE_COMPONENT__) ? __REASE_COMPONENT__ : v

export const concatImports = (
  obj1: TypeImportsItem,
  obj2?: TypeImportsItem
): TypeImportsItem => {
  obj1 = { ...obj1 }

  obj2 &&
    forEachLeft(keys(obj2), (k) => {
      obj1[k] = [...obj1[k] || [], ...obj2[k]]
    })

  forEachLeft(keys(obj1), (k) => {
    obj1[k] = unique(obj1[k], (v) => !!v)
  })

  return obj1
}

export const mergeImports = (
  importsOrigin: TypeImports,
  imports: TypeImports
): void => {
  forEachLeft(keys(imports), (key) => {
    importsOrigin[key] =
      key in importsOrigin
        ? concatImports(importsOrigin[key], imports[key])
        : concatImports(imports[key])
  })
}

export const splitImports = (source: string): TypeImportsItem => {
  // const arr = source.split(/(?<=\{)|(?=\})|,/g).map((v) => trim(v))
  // console.log(arr)

  const res: TypeImportsItem = {}

  let deep = 0
  let tmp: string[], key: string, value: string
  forEachLeft(source.split(/(?<=\{)|(?=\})|,/g), (v) => {
    v = trim(v)
    if (v === '{') deep++
    else if (v === '}') deep--
    else if (v) {
      value = (tmp = v.split(/\s+/)).pop()!
      key = tmp[0] || (deep ? value : 'default')
      ;(res[key] || (res[key] = [])).push(value)
    }
  })

  if (!keys(res).length) res['@'] = []
  return concatImports(res)
}

// /(?:\bimport\b((?:\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|[^/'"`;()[\]]+)*?)\bfrom\b(?:\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|\s*))?((`|'|")(?:[^\\]|\\\3|\\(?!\3).)*?(?:\3|$))([\s;]*)|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))/g,
export const extractImports = (source: string): TypeExtractImports => {
  const imports: TypeImports = {}

  let arr: (number | string)[] = []
  const mayBeImports: [number, number, string, number][] = []

  source.replace(
    /((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))([\s;]*)|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))|((?<!\.\s*)\bimport\b)|(\bfrom\b)/g,
    (_full, _string, _3, _semi, _comment, _import, _from, _index) => {
      // console.log([_full, _string, _semi, _comment, _import, _from, _index])

      if (_import) arr = [_index]
      else if (_from) arr.length && (arr[1] = _index)
      else if (_string) {
        if (arr.length) {
          if (arr.length < 2) arr[1] = _index
          const lastIndex = (_semi || '').length + _string.length
          arr.push(_string, _index + lastIndex), mayBeImports.push(arr as any)
        }
        arr = []
      }
      return ''
    }
  )

  let code = source
  forEachRight(mayBeImports, ([_import, _from, _string, _last]) => {
    const propsDirty = trim(removeComments(source.slice(_import + 6, _from)))
    if (!propsDirty || /^[^-+/?:'"`;()[\]]+$/.test(propsDirty)) {
      const importObj = splitImports(propsDirty)
      // console.log([propsDirty])
      _string = fixReaseImportName(jsonParse(replaceQuotes(_string)))
      if (!(_string in imports)) imports[_string] = importObj
      else imports[_string] = concatImports(imports[_string], importObj)
      code = code.slice(0, _import) + '\n' + code.slice(_last)
    }
  })

  // console.log(code)
  // console.log(imports)

  return { code, imports }
}
