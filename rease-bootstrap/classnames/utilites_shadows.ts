import { spaceSplit, stringsMap } from './lib'

// https://getbootstrap.com/docs/5.2/utilities/shadows/
export const [
  SHADOW,
  SHADOW_SM,
  SHADOW_LG,
  SHADOW_NONE,
] = stringsMap(spaceSplit(' -sm -lg -none'), (v) => 'shadow' + v)
