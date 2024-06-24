import { enumChars } from 'enum-chars'

export const isChildlessTagName = (s: string): boolean =>
  /^(?:img|area|base|br|col|embed|hr|input|link|meta|param|source|track|wbr)$/.test(s)

export const safeRemoveQuotes = (s: string, quote?: '`' | '"' | "'"): string =>
  (s = s.replace(/^['"`]|['"`]$/g, (q: any) => (quote = quote || q, '')),
  (!quote || quote === '`') && (s = s.replace(/^}|\${$/g, () => (quote = '`', ''))),
  quote && (s = s.replace(/\\[^]/g, (r) => r[1] === quote ? quote : r)),
  s)

export const chunkifyArrayBy = <T, C extends object>(
  a: T[],
  f: (v: T, k: number, a: T[], ctx: C) => boolean,
  ctx?: C,
  splitLike?: boolean
): T[][] => {
  let cur: T[] = []
  const res: T[][] = []
  
  let v: T
  for (let is: any, i = 0; i < a.length; i++) {
    if ((is = f(v = a[i], i, a, ctx!)) && cur.length) res.push(cur), cur = []
    if (!splitLike || !is) cur.push(v)
  }
  if (cur.length) res.push(cur)
  return res
}

export const trimLeftArrayBy = <T>(
  a: T[],
  f: (v: T) => boolean | void
): T[] => {
  while (a.length && f(a[0])) a.shift()
  return a
}

export const trimRightArrayBy = <T>(
  a: T[],
  f: (v: T) => boolean | void
): T[] => {
  while (a.length && f(a[a.length - 1])) a.pop()
  return a
}

export const trimArrayBy = <T>(
  a: T[],
  f: (v: T) => boolean | void
): T[] => trimLeftArrayBy(trimRightArrayBy(a, f), f)

export const getDelimeter = (
  content: string,
  // eslint-disable-next-line default-param-last
  salt = '_',
  type?: 'lowers' | 'uppers' | 'numbers' | 'letters'
): string => {
  let res: string
  let rand = ''
  const fn = type && enumChars[type] ? enumChars[type] : enumChars.letters
  do rand = fn(rand)
  while (content.indexOf(res = salt + rand) > -1)
  return res
}

export const hash = (str: any, salt?: string): string => {
  str = ((salt || '') + str).replace(/\r/g, '')
  let h = 0
  let i = str.length
  while (i--) h = (256 * h + str.charCodeAt(i)) % 2147483642 // 0x7ffffffa
  return (-h >>> 0).toString(36)
}
