import { spaceSplit, stringsMap } from './lib'

// https://getbootstrap.com/docs/5.2/utilities/overflow/

export const [
  OVERFLOW_AUTO,
  OVERFLOW_HIDDEN,
  OVERFLOW_VISIBLE,
  OVERFLOW_SCROLL,
] = stringsMap(spaceSplit('auto hidden visible scroll'), (v) => 'overflow-' + v)
