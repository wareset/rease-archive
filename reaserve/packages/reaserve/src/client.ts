import { createReaseApp, subjectGlobal } from 'rease'

// import Root from './routes/_root.rease'
// import routes from '../tmp/client'

import { ceateObject } from './core'
import { __setPageClient__ } from './core'
import { KEY_PAGE, KEY_CHUNK } from './core'
import { unpack as cyclepack_unpack } from './core'

export default (Root: any) => (
  routes:
    { [key: string]: [RegExp, Function][] } &
    { '-1': { [key: string]: [RegExp, Function][] } },
  errors: { [key: string]: Function },
  errorFn?: Function
): void => {
  window.addEventListener('load', () => {
    // @ts-ignore
    const reaserve = cyclepack_unpack(__reaserve__), page = reaserve[KEY_PAGE]
    const params = ceateObject() as any
    for (const k in page.params) params[k] = page.params[k]
    __setPageClient__(page.params = params, page.code)
  
    const $isLoading = subjectGlobal<boolean>(true)

    // @ts-ignore
    import('./' + reaserve[KEY_CHUNK] + '.js')
      .then((cmp) => {
        const $component = subjectGlobal<any>(cmp.default)

        createReaseApp(Root, {
          clearTarget: true,
          target     : document.body,
          props      : { $component, $isLoading },
          rootPub    : { reaserve }
        })

        const changeState = (e: any, href: string, isClick?: boolean): void => {
          if (href && href.indexOf(location.origin) === 0) {
            let path = href.slice(location.origin.length) as string
            const idx = path.indexOf('?')
            if (idx > -1) path = path.slice(0, idx)
      
            path = path.replace(/^[/\s]+|[/\s]+$/g, '')
            const count = path.length ? path.split('/').length : 0
            let matches: any, slug: any
      
            SEARCH_ROUTE: {
              if (count in routes) {
                for (let a = routes[count], i = 0, l = a.length; i < l; i++) {
                  if ((matches = path.match((slug = a[i])[0])) != null) {
                    break SEARCH_ROUTE
                  }
                }
              }
              for (let j = count; j >= 0; j--) {
                if (j in routes[-1]) {
                  for (let a = routes[-1][j], i = 0, l = a.length; i < l; i++) {
                    if ((matches = path.match((slug = a[i])[0])) != null) {
                      break SEARCH_ROUTE
                    }
                  }
                }
              }
            }
      
            const awaitFn = matches ? slug[1] : errors[404] || errorFn
            if (awaitFn) {
              e.preventDefault()
              $isLoading.set(true)
              awaitFn().then((cmp: any) => {
                $component.set(null)
                if (isClick) history.pushState(null, '', href)
                if (matches) page.params = matches.group || ceateObject(), page.code = 200
                else page.code = 404

                __setPageClient__(page.params, page.code)
                $component.set(cmp.default)
              })
            }
          }
        }

        window.addEventListener('popstate', (e) => {
          changeState(e, location.href)
        })

        document.body.addEventListener('click', (e) => {
          if (!e.defaultPrevented && e.button === 0 &&
          !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)) {
            let target = e.target as any
            while (target && target.localName !== 'a') target = target.parentNode
            if (target && !target.target) changeState(e, target.href, true)
          }
        })
      })
  })
}

// run(Root, routes as any)
