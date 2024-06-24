export const hash = (s: string, e?: any): string => {
  let r = 1
  for (let h = (s = ((e || '') + s).replace(/\r/g, '')).length; h--;) {
    r *= (9e4 - r) / (r + s.charCodeAt(h))
  }
  return 'h' + r.toString(36).replace(/\./, '')
}

export const slashes2posix = (s: string): string =>
  s.replace(/[\\/]+/g, '/')

export const stringify = JSON.stringify
export const trimTsx = (s: string): string => s.replace(/\.tsx?$/, '')
