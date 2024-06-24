import { isArray, ceateObject } from '.'

export const queryParse = (s: string): { [key: string]: string | string[] | undefined } => {
  const res: any = ceateObject()
  const decode = s.indexOf('%') > -1
  for (let a = s.split('&'), k: string, v: string, i = 0; i < a.length; i++) {
    [k, v] = decode ? a[i].split('=').map(decodeURIComponent) : a[i].split('=')
    if (k) {
      v = v || ''
      if (k in res) isArray(res[k]) ? res[k].push(v) : res[k] = [res[k], v]
      else res[k] = v
    }
  }

  return res
}
