export function hash(s?: any, salt?: number, isBruteSkip?: boolean): string {
  let z1 = 0.9973
  if (s == null) z1 = Math.random() || z1
  else {
    s += ''
    salt = +salt! || 0, salt < 0 && (salt = -salt), salt > 0 && (salt = z1 / salt)
    const r = 1 / z1
    for (let c: number, l = s.length,
      n = isBruteSkip ? l / 99 >>> 1 || 1 : 1,
      i = 0; i < l; i += n) {
      if ((c = s.charCodeAt(i)) === 13) i -= n - 1
      else z1 += (c * z1 * 997.3 + salt) / (c + z1) + r, z1 > 0 && (z1 -= z1 | 0)
    }
  }
  let res = z1.toString(36).replace(/0?\./, '')
  FIX: if (!res || +res[0] > -1) {
    for (let i = res.length; i-- > 0;) {
      if (!(+res[i] > -1)) { res = res[i] + res; break FIX }
    }
    res = 'h' + res
  }
  for (;res.length < 10;) res += res
  return res.slice(0, 10)
}
