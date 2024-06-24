// import { enumChars } from 'enum-chars'
import { CHILDLESS_TAGS } from 'jsx2tokens'

export function isChildlessTagName(s: string): boolean {
  return (CHILDLESS_TAGS as any)[s] === true
}

export function safeRemoveQuotes(s: string, quote?: '`' | '"' | "'"): string {
  return s = s.replace(/^['"`]|['"`]$/g, function(q: any) { return quote = quote || q, '' }),
  (!quote || quote === '`') && (s = s.replace(/^}|\${$/g, function() { return quote = '`', '' })),
  quote && (s = s.replace(/\\[^]/g, function(r) { return r[1] === quote ? quote : r })),
  s
}

export function chunkifyArrayBy <T, C extends object>(
  a: T[],
  f: (v: T, k: number, a: T[], ctx: C) => boolean,
  ctx?: C,
  splitLike?: boolean
): T[][] {
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

export function trimLeftArrayBy <T>(
  a: T[],
  f: (v: T) => boolean | void
): T[] {
  while (a.length && f(a[0])) a.shift()
  return a
}

export function trimRightArrayBy <T>(
  a: T[],
  f: (v: T) => boolean | void
): T[] {
  while (a.length && f(a[a.length - 1])) a.pop()
  return a
}

export function trimArrayBy <T>(
  a: T[],
  f: (v: T) => boolean | void
): T[] { return trimLeftArrayBy(trimRightArrayBy(a, f), f) }

// export function getDelimeter(
//   content: string,
//   // eslint-disable-next-line default-param-last
//   salt = '_',
//   type?: 'lowers' | 'uppers' | 'numbers' | 'letters'
// ): string {
//   let res: string
//   let rand = ''
//   const fn = type && enumChars[type] ? enumChars[type] : enumChars.letters
//   do rand = fn(rand)
//   while (content.indexOf(res = salt + rand) > -1)
//   return res
// }

export function hash(str: any, salt?: string): string {
  str = ((salt || '') + str).replace(/\r/g, '')
  let h = 0
  let i = str.length
  while (i--) h = (256 * h + str.charCodeAt(i)) % 2147483642 // 0x7ffffffa
  return (-h >>> 0).toString(36)
}
