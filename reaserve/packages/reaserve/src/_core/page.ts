import type { TypeReaseContext } from 'rease'
import type { TypeIncomingMessage, TypeServerResponse } from 'like-file-router'

import { ceateObject } from '.'
import { KEY_PAGE, KEY_REQ_AND_RES } from '.'
import { parse as cookieParse } from 'cookie'
export { cookieParse }
import { queryParse } from '.'

type TypeParams = { [key: string]: string }
type TypeCookie = { [key: string]: string }
type TypeQuery = { [key: string]: string | string[] | undefined }
export type TypePage = Readonly<{
  code: number

  params: TypeParams
  cookie: TypeCookie
  query: TypeQuery

  protocol: string
  hostname: string
  port: string
  host: string
  pathname: string
}>

const pageServer = (req: any, res: any): any => {
  if (req[KEY_PAGE]) return req[KEY_PAGE]

  if (!res) {
    const server = (req as TypeReaseContext).root.pub[KEY_REQ_AND_RES]
    req = server.req, res = server.res
  }

  let cookie: any, query: any
  const parsedUrl = (req as TypeIncomingMessage).parsedUrl
  return req[KEY_PAGE] || (req[KEY_PAGE] = {
    get code(): number {
      return +res.statusCode || 200
    },

    get params(): TypeParams {
      return req.params
    },
    get cookie(): TypeCookie {
      return cookie || (cookie =
        req.headers.cookie ? cookieParse(req.headers.cookie!) : ceateObject())
    },
    get query(): TypeQuery {
      return query || (query =
        parsedUrl.query ? queryParse(parsedUrl.query) : ceateObject())
    },

    get protocol(): string {
      return parsedUrl.protocol
    },
    get hostname(): string {
      return parsedUrl.hostname
    },
    get port(): string {
      return parsedUrl.port
    },
    get host(): string {
      return parsedUrl.host
    },
    get pathname(): string {
      return parsedUrl.pathname
    },
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const [pageClient, __setPageClient__] = (() => {
  let code: number

  let params: TypeParams | null
  let cookie: TypeCookie | null
  let search: string
  let query: TypeQuery | null

  const PAGE_GETS = {
    get code(): number {
      return +code || 200
    },

    get params(): TypeParams {
      return params || (params = ceateObject())
    },
    get cookie(): TypeCookie {
      return cookie || (cookie =
        document.cookie ? cookieParse(document.cookie) : ceateObject())
    },
    get query(): TypeQuery {
      return query || (query =
        (search = location.search.slice(1)) ? queryParse(search) : ceateObject())
    },

    get protocol(): string {
      return location.protocol
    },
    get hostname(): string {
      return location.hostname
    },
    get port(): string {
      return location.port
    },
    get host(): string {
      return location.host
    },
    get pathname(): string {
      return location.pathname
    },
  }

  const pageClient = (): any => PAGE_GETS
  const setPageClient = (_params: any, _code: any): void => {
    params = _params, code = _code, cookie = query = null
  }

  return [pageClient, setPageClient]
})()

export const page = (typeof window === 'undefined' ? pageServer : pageClient) as
((req: TypeIncomingMessage, res: TypeServerResponse) => TypePage) &
((ctx: TypeReaseContext) => TypePage)
