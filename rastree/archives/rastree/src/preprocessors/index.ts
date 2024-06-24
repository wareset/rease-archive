import { trycatch } from '@wareset-utilites/trycatch'
import { throwError } from '@wareset-utilites/error'

import { pugMixins } from './pug-mixins'

// export type TypeFn = ((content: string) => string) | null

const error = (...a: string[]) => (_content: string): never =>
  throwError(`Please install ${a.join(' or ')} (npm i ${a[0]}).`)

export const __sucrase__ = trycatch(() => {
  const compiler = require('sucrase')
  return (content: string): string => {
    content = compiler.transform(content, { transforms: ['typescript'] }).code
    // console.log('sucrase', content)
    return content
  }
})
export const __typescript__ = trycatch(() => {
  const compiler = require('typescript')
  return (content: string): string => {
    content = compiler.transpileModule(content, {
      compilerOptions: {
        module: compiler.ModuleKind.Latest, // ESNext CommonJS,
        target: compiler.ScriptTarget.ESNext
      }
    }).outputText
    content = content.replace(/export\s+\{\};?\s?/g, '')
    // console.log('typescript', content)
    return content
  }
})
export const ts =
  __typescript__ || __sucrase__ || error('typescript', 'sucrase')

const __pug__ = trycatch(() => {
  const compiler = require('pug')
  return (content: string): string => {
    content = compiler.render(pugMixins(content), {
      pretty: true,
      debug : false
    })
    // console.log(['pug', content])
    return content
  }
})
export const pug = __pug__ || error('pug')

const __less__ = trycatch(() => {
  const compiler = require('less')
  return (content: string): string => {
    compiler.render(
      content,
      { sync: true },
      (_: any, res: any) => content = res.css
    )
    // console.log('less', content)
    return content
  }
})
export const less = __less__ || error('less')

const __stylus__ = trycatch(() => {
  const compiler = require('stylus')
  return (content: string): string => {
    content = compiler(content).render()
    // console.log('stylus', content)
    return content
  }
})
export const stylus = __stylus__ || error('stylus')

const __sass__ = trycatch(() => {
  const compiler = require('sass')
  return (content: string): string => {
    content = compiler.renderSync({ data: content }).css.toString()
    // console.log('sass', content)
    return content
  }
})
export const sass = __sass__ || error('sass')
export const scss = __sass__ || error('sass')
