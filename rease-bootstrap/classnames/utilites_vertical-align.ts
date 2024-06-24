import { spaceSplit, stringsMap } from './lib'

// https://getbootstrap.com/docs/5.2/utilities/vertical-align/
export const [
  ALIGN_BASELINE,
  ALIGN_TOP,
  ALIGN_MIDDLE,
  ALIGN_BOTTOM,
  ALIGN_TEXT_TOP,
  ALIGN_TEXT_BOTTOM
] = stringsMap(spaceSplit('baseline top middle bottom text-top text-bottom'), (v) => 'align-' + v)
