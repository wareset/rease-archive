import localeCompare from '@wareset-utilites/string/localeCompare'
import jsonStringify from '@wareset-utilites/lang/jsonStringify'
import toUppercase from '@wareset-utilites/string/toUppercase'
import forEachRight from '@wareset-utilites/array/forEachRight'
import forEachLeft from '@wareset-utilites/array/forEachLeft'
import findIndexLeft from '@wareset-utilites/array/findIndexLeft'
import includes from '@wareset-utilites/array/includes'
import isArray from '@wareset-utilites/is/isArray'
import startsWith from '@wareset-utilites/string/startsWith'
import isObjectStrict from '@wareset-utilites/is/isObjectStrict'
import keys from '@wareset-utilites/object/keys'

const isInspect = includes([...process.execArgv, ...process.argv], '--inspect')

if (isInspect) {
  console.clear()
  setTimeout(() => {
    console.log('Inspect close')
  }, 1000 * 60 * 60)
}

import bcd from '@mdn/browser-compat-data'
// console.log(bcd)

// const $_$ = '$_$'
// const $R$ = '$R$'
// const $N$ = '$N$'
// const $RN$ = '$RN$'
// const $DASH$ = '$DASH$'
// const $EMPTY$ = '$EMPTY$'
// const $SPACE$ = '$SPACE$'
// const $COLON$ = '$COLON$'
// const $SLASH$ = '$SLASH$'
// const $BACKSLASH$ = '$BACKSLASH$'
// const $DOLLAR$ = '$DOLLAR$'

const constants = {
  '\r': 'R$',
  '\n': 'N$',

  '': 'EMPTY$',
  ' ': 'SPACE$', // 32
  '!': 'EXCLAMATION$',
  '"': 'DOUBLE_QUOTE$',
  '#': 'SHARP$',
  // eslint-disable-next-line prettier/prettier
  '$': 'DOLLAR$',
  '%': 'PERCENT$',
  '&': 'AMPERSAND$',
  // eslint-disable-next-line prettier/prettier
  '\'': 'SINGLE_QUOTE$',
  '(': 'LEFT_PARENTHSIS$',
  ')': 'RIGTH_PARENTHSIS$',
  '*': 'ASTERISK$',
  '+': 'PLUS$',
  ',': 'COMMA$',
  '-': 'DASH$',
  '.': 'DOT$',
  '/': 'SLASH$',
  ':': 'COLON$', // 58
  ';': 'SEMICOLON$',
  '<': 'LESS_THAN$',
  '=': 'EQUALS_TO$',
  '>': 'GREATER_THAN$',
  '?': 'QUESTION$',
  '@': 'AT$',
  '[': 'LEFT_SQUARE_BRACKET$', // 91
  '\\': 'BACKSLASH$',
  ']': 'RIGHT_SQUARE_BRACKET$',
  '^': 'CARET$',
  // eslint-disable-next-line prettier/prettier
  '_': '_$',
  '`': 'BACK_QUOTE$',
  '{': 'LEFT_CURLY_BRACE$', // 123
  '|': 'VERTICAL_BAR$',
  '}': 'RIGHT_CURLY_BRACE$',
  '~': 'TILDE$'
}
const constantsKeys = keys(constants)

const __COMPAT = '__compat'

const keywords: { [key: string]: any } = {
  ':on': 1,
  ':use': 1,
  ':tag': 1,
  ':type': 1,
  ':tagName': 1,
  ':action': 1,
  ':spread': 1,
  ':args': 1,
  ':arguments': 1,

  '\r\n': 1,
  '\r\n\r\n': 1,
  '\r\n\r\n\r\n': 1,
  '\r\n\r\n\r\n\r\n': 1,
  '\n\n': 1,
  '\n\n\n': 1,
  '\n\n\n\n': 1,
  '  ': 1,
  '   ': 1,
  '    ': 1,
  '--': 1,
  '---': 1,
  '----': 1
}

forEachLeft(constantsKeys, (v) => {
  keywords[v] = 1
})
const alphabet = 'abcdefghijklmnopqrstuvwxyz'
forEachLeft([...('0123456789' + alphabet + toUppercase(alphabet))], (v) => {
  keywords[v] = 1
})

const bcdEach = (obj: { [key: string]: any }): void => {
  forEachLeft(keys(obj), (key) => {
    const objNext = obj[key]
    if (key && key !== __COMPAT && isObjectStrict(objNext)) {
      // if (__COMPAT in objNext)
      bcdEach(objNext)
      if ([...key].every((v) => /^\w$/.test(v) || includes(constantsKeys, v))) {
        keywords[key] = 1
        if (/^on[a-z]+/.test(key)) keywords[key.slice(2)] = 1
        else
          forEachLeft(
            key.split(/\d+|[^a-zA-Z]+|((?:[A-Z]*[a-z]+)(?=[^a-z]))/),
            (v) => {
              if (v && v[1]) keywords[v] = 1
            }
          )
      }
    }
  })
}

// if (!isInspect)
bcdEach(bcd)
// } else {
// bcdEach(bcd.css)
// }

const keywordsArr = keys(keywords).sort(
  (a, b) => b.length - a.length || localeCompare(b, a)
)

// keywordsArr.length = 500
// console.log(keywordsArr)

type TypeConcater = (string | TypeConcater)[]

const getConstName = (v: string): string =>
  '$$' + [...v].map((v) => (constants as any)[v] || v).join('')

const createConcats = (arr: TypeConcater, start: number): void => {
  start += 1
  forEachLeft(arr, (v, k) => {
    if (!isArray(v) && !startsWith(v, '$$')) {
      const k2 = findIndexLeft(keywordsArr, (v2) => includes(v, v2), start)
      if (k2 > -1) {
        const inc = keywordsArr[k2]
        const arr2: TypeConcater = []
        const incConst = getConstName(inc)
        forEachRight(v.split(inc), (v, k) => {
          if (v) arr2.unshift(v)
          if (k) arr2.unshift(incConst)
        })
        arr[k] = arr2
        createConcats(arr2, k2)
      } else if (v[1]) {
        // console.log([v])
      }
    }
  })
}

const resObj: { [key: string]: TypeConcater } = {}
forEachLeft(keywordsArr, (v, k) => {
  const val = [v]
  resObj[v] = val
  createConcats(val, k)
})

// console.log(resObj)

const getAttrVal = (arr: TypeConcater): string => {
  let res = ''
  forEachLeft(arr, (v) => {
    if (isArray(v)) v = getAttrVal(v)
    // else if (v in constants) v = (constants as any)[v]
    else if (!startsWith(v, '$$')) v = jsonStringify(v)

    if (res) res += ' + '
    res += v
  })

  return res
}

let res = `/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable quotes */

`
// res +=
//   constantsKeys
//     .map((v) => `export var ${constants[v]} = ${jsonStringify(v)}\n`)
//     .join('') + '\n'

forEachRight(keywordsArr, (v) => {
  let val = getAttrVal(resObj[v])
  if (resObj[v][1] || (isArray(resObj[v][0]) && resObj[v][0][1]))
    val = '(' + val + ')'

  // prettier-ignore
  res += `export var ${getConstName(v)} = ${val} as ${getAttrVal([v])}\n`
})

// console.log(res)

import { dirname as pathDirname, join as pathJoin } from 'path'
import { mkdirSync as fsMkdirSync, writeFileSync as fsWriteFileSync } from 'fs'

// if (!isInspect) {
// prettier-ignore
const filedata = pathJoin(pathDirname(pathDirname(__dirname)), 'src-data', 'index.ts')
fsMkdirSync(pathDirname(filedata), { recursive: true })
fsWriteFileSync(filedata, res)
// console.log(filedata)
// } else {
//   console.log(res)
// }

console.log('data has been generated')
