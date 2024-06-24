import { createReaseApp, destroy } from 'rease'
import { toString as reaseToString } from 'rease/toString'

export * from 'like-file-router'
import type { TypeHandler } from 'like-file-router'
import { createRouter, METHODS, Router } from 'like-file-router'

import { isArray, noop } from './core'
import { KEY_REQ_AND_RES } from './core'
import { KEY_PAGE, KEY_CHUNK } from './core'
import { pack as cyclepack_pack } from './core'

export type TypeServerRoute =
  TypeHandler | (TypeHandler | boolean)[] | [string, ...(TypeHandler | boolean)[]][]

type TypeTemplateFactoryObject = {
  head: string
  body: string
  nonce: string
  styles: string
  scripts: string
}

type TypeTemplateFactory = (obj: TypeTemplateFactoryObject) => string

const clientReaseRenderer = (
  router: Router,
  path: string, clientJs: string, component: any,
  templateFactory: TypeTemplateFactory
): void => {
  const fn: TypeHandler = (req, res) => {
    createReaseApp(component, {
      onInitial: (root) => {
        root.pub.reaserve = {
          [KEY_CHUNK]: clientJs,
          [KEY_PAGE] : { params: req.params, code: +res.statusCode },
        }
        root.pub[KEY_REQ_AND_RES] = { req, res }
      },
      onCreated: (root) => {
        const nonce = res.locals && res.locals.nonce ? ` nonce="${res.locals.nonce}"` : ''
        
        const head = ''

        const body = reaseToString(root)

        let styles = ''
        const css = root.is.css
        for (const id in css) styles += `<style${nonce} id="${id}">${css[id]}</style>`

        const scripts = `
  <script${nonce}>
    window.__reaserve__ = ${cyclepack_pack(root.pub.reaserve, null, true)}
  </script>
        `

        destroy(root)
        // console.log(root)
        // console.log(body)
        res.writeHead(+res.statusCode || 200, { 'Content-Type': 'text/html' })
        res.end(templateFactory({ head, body, styles, scripts, nonce }))
      }
    })
  }

  if (/^\+?\d+$/.test(path)) {
    router._errors[path] = (req, res) => {
      res.statusCode = +path || 500, fn(req, res, noop)
    }
  } else if (/^\+Err/i.test(path)) {
    router._errorsFactory = (code) => (req, res) => {
      res.statusCode = +code || 500, fn(req, res, noop)
    }
  } else {
    router.get(path, fn)
  }
}

const setServerRoute = (
  router: Router, method: string, path: string, fns: any
): void => {
  if (!isArray(fns)) fns = [fns]

  if (!isArray(fns[0])) {
    if (typeof fns[0] === 'string') path += '/' + fns.shift()
    router.add(method, path, fns)
  } else {
    for (let i = 0; i < fns.length; i++) {
      setServerRoute(router, method, path, fns[i])
    }
  }
}

const __reaserve__ = (router: Router) => (
  path: string, clientJs: string, routes: { [key: string]: any },
  templateFactory: TypeTemplateFactory
): void => {
  // console.log(path, clientJs, routes, templateFactory)
  for (const k in routes) {
    if (routes[k]) {
      if (k === 'default') {
        clientReaseRenderer(router, path, clientJs, routes[k], templateFactory)
      } else if (METHODS.indexOf(k) > -1) {
        setServerRoute(router, k, path, routes[k])
      }
    }
  }
}

export default (
  ...a: Parameters<typeof createRouter>
): Router & { __reaserve__: ReturnType<typeof __reaserve__> } => {
  const router = createRouter(...a)
  // @ts-ignore
  router.__reaserve__ = __reaserve__(router)
  // @ts-ignore
  return router
}
