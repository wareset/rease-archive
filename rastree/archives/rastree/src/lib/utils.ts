import { toUppercase } from '@wareset-utilites/string/toUppercase'
import { toLowercase } from '@wareset-utilites/string/toLowercase'
import { random } from '@wareset-utilites/math/random'
import { trim } from '@wareset-utilites/string/trim'
import { hash } from '@wareset-utilites/hash'

export const warn = (...a: any): void => {
  console.warn('WARNING:\n' + a.join('\n'))
}

export const isValidVariable = (variable?: string): boolean =>
  !!variable &&
  [...variable + ''].every(
    (v, k) =>
      /[$_]/.test(v) ||
      k && /[$\w]/.test(v) ||
      toLowercase(v) !== toUppercase(v)
  )

export const isValidCid = (cid?: string): boolean =>
  !!cid &&
  [...cid + ''].every(
    (v) => /[$-\w]/.test(v) || toLowercase(v) !== toUppercase(v)
  )

const __fixCidString__ = (v?: string): string => {
  v = (v || '') + ''
  const v2 = [...trim(v, '-\\s').replace(/^data-|\s+/gi, '')]
    .filter((v) => /[$-\w]/.test(v) || toLowercase(v) !== toUppercase(v))
    .join('')
  return v.length === v2.length ? v2 : __fixCidString__(v2)
}

export const validateCid = (cid?: string, salt?: string): string => {
  cid = (cid || 'r' + hash(salt || random())) + ''
  cid = __fixCidString__(cid) || validateCid(cid, salt)
  if (/\d/.test(cid[0])) cid = 'r' + cid
  return cid
}

export const createScoper = (
  cid?: string,
  type?: 'class' | 'attribute' | string
): [string, string] => {
  cid = validateCid(cid)
  let res: [string, string]
  if (type === 'class') res = ['.' + cid, `["class", "${cid}"]`]
  else if (!type || type === 'attribute') {
    res = [`[data-${cid}]`, `["data", "${cid}"]`]
  } else {
    const data = `data-${__fixCidString__(type) || 'cid'}`
    res = [`[${data}=${cid}]`, `["${data}", "${cid}"]`]
  }
  return res
}
