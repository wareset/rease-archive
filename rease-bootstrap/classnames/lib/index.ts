export const spaceSplit = (s: string): string[] => s.split(/\s+/)

export const stringsMap = (
  s: string[], fn: (v: string, k: number) => string
): string[] => s.map(fn)

export const SIZES_LIST = spaceSplit('sm md lg xl xxl') as ['sm', 'md', 'lg', 'xl', 'xxl']

export const VARIANTS_LIST = spaceSplit('primary secondary success warning danger info') as ['primary', 'secondary', 'success', 'warning', 'danger', 'info']

export const BLACK_AND_WHITE_LIST = spaceSplit('black white') as ['black', 'white']

export const DARK_AND_LIGHT_LIST = spaceSplit('dark light') as ['dark', 'light']

export const DIRECTIONS_LIST = spaceSplit('top bottom start end') as ['top', 'bottom', 'start', 'end']
