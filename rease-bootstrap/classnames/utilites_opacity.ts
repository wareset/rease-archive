import { spaceSplit, stringsMap } from './lib'

// https://getbootstrap.com/docs/5.2/utilities/opacity/

export const [
  OPACITY_0,
  OPACITY_25,
  OPACITY_50,
  OPACITY_75,
  OPACITY_100,
] = stringsMap(spaceSplit('0 25 50 75 100'), (v) => 'opacity-' + v)
