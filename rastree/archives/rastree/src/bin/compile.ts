// import toCodePascalcase from '@wareset-utilites/string/toCodePascalcase'
import { toCodeSnakecase } from '@wareset-utilites/string/toCodeSnakecase'
import { toCapitalize } from '@wareset-utilites/string/toCapitalize'
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { isObject } from '@wareset-utilites/is/isObject'
import { trycatch } from '@wareset-utilites/trycatch'
import { keys } from '@wareset-utilites/object/keys'
// import { hash } from '@wareset-utilites/hash'

// import { throwError } from '@wareset-utilites/error'

import { red, bgRed, white, bold } from 'kleur'

import {
  statSync as fsStatSync,
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync,
  // readdirSync as fsReaddirSync,
  // rmdirSync as fsRmdirSync,
  unlinkSync as fsUnlinkSync,
  mkdirSync as fsMkdirSync
} from 'fs'
import {
  resolve as pathResolve,
  parse as pathParse,
  dirname as pathDirname,
  extname as pathExtname,
  join as pathJoin
} from 'path'

import rastree from '..'
import { parseComponent } from '../lib/parseComponent'
import { isValidVariable, validateCid } from '../lib/utils'

import * as preprocessors from '../preprocessors'

let undef: undefined
const messageError = (...a: any[]): never => {
  let res = a
    .map((v) => isObject(v) ? jsonStringify(v, undef, 2) : v)
    .join('\n')
    .split('\n')
    .map((v) => bgRed(white(' ' + v + ' ')))
    .join('\n')

  res = bold(red(' ERROR: \n')) + res
  throw res
}

const fnFalse = (): false => false
const fakeStat = (file: string): ReturnType<typeof fsStatSync> | any =>
  trycatch(() => fsStatSync(file), {
    isFile     : fnFalse,
    isDirectory: fnFalse
  })

export const compile = ({
  code,
  input,
  output,
  css = true,
  debug
}: {
  code?: string
  input: string
  output?: string
  css?: boolean
  debug?: boolean
}): ReturnType<typeof rastree> => {
  if (!input && !code) messageError('Please specify the "Input" file')
  if (input) {
    input = pathResolve(input)
    if (!fakeStat(input).isFile()) messageError('"Input" is not a file:', input)
  }
  // console.log(args)
  // console.log({ input, output })

  const component = parseComponent(code || fsReadFileSync(input).toString())
  const { options, sections } = component

  options.cid = validateCid(options.cid, input)

  options.name = ((name?: string): string => {
    if (!name || !isValidVariable(name)) {
      const inputParse = pathParse(input)
      name = toCodeSnakecase(inputParse.name)
      if (!isValidVariable(name)) {
        const inputArr = inputParse.dir.split(/[/\\]+/)
        while (inputArr.length && !isValidVariable(name)) {
          name = toCodeSnakecase(inputArr.pop() + ' ' + name)
        }
        if (!isValidVariable(name)) {
          name = 'Rease_' + name
          if (!isValidVariable(name)) name = 'Rease_'
        }
      }
    }
    name = toCapitalize(name) + '_' + options.cid
    return name
  })(options.name)

  forEachLeft(keys(sections), (sectionName) => {
    const section = sections[sectionName]
    forEachLeft(section, ({ attributes }, k) => {
      const src = attributes.src
      if (src) {
        section[k].code = fsReadFileSync(
          pathResolve(pathDirname(input || __filename), src)
        ).toString()
      }

      const lang = attributes.lang || src && pathExtname(src).slice(1)
      if (lang) {
        if (lang === attributes.lang && !(lang in preprocessors)) {
          messageError(`Lang "${lang}" not support`)
        }
        if (lang in preprocessors) {
          section[k].code = (preprocessors as any)[lang](section[k].code)
        }
        // console.log(section[k].code)
        // console.log(attributes)
      }
    })
  })

  // console.log(options)
  // console.log(jsonStringify(sections, undefined, 2))

  const res = rastree(component, { externalCss: !css })

  if (debug) {
    if (!output) {
      output = input || (messageError('Please specify the "Output" file') as '')
    } else output = pathResolve(output)
    if (fakeStat(output).isDirectory()) {
      output = pathJoin(output, pathParse(input).base)
    }

    const { cssExternal, codeClient /* , codeServer */ } = res
    fsMkdirSync(pathDirname(output), { recursive: true })
    fsWriteFileSync(output + '.client.js', codeClient)
    // fsWriteFileSync(output + '.server.js', codeServer)

    if (!css) fsWriteFileSync(output + '.css', cssExternal)
    else trycatch(() => fsUnlinkSync(output + '.css'))
  }

  return res
}
