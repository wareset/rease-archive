import {
  spaceSplit, stringsMap,
  DIRECTIONS_LIST, VARIANTS_LIST, DARK_AND_LIGHT_LIST, BLACK_AND_WHITE_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/utilities/borders/
const [BORDER_] = spaceSplit('border-')
export const BORDER = BORDER_.slice(0, -1)
export const BORDER_0 = BORDER_ + '0'

export const [
  BORDER_TOP,
  BORDER_BOTTOM,
  BORDER_START,
  BORDER_END,
] = stringsMap(DIRECTIONS_LIST, (v) => BORDER_ + v)

export const [
  BORDER_TOP_0,
  BORDER_BOTTOM_0,
  BORDER_START_0,
  BORDER_END_0,
] = stringsMap(DIRECTIONS_LIST, (v) => BORDER_ + v + '-0')

export const [
  BORDER_PRIMARY,
  BORDER_SECONDARY,
  BORDER_SUCCESS,
  BORDER_WARNING,
  BORDER_DANGER,
  BORDER_INFO,
] = stringsMap(VARIANTS_LIST, (v) => BORDER_ + v)

export const [
  BORDER_DARK,
  BORDER_LIGHT,
] = stringsMap(DARK_AND_LIGHT_LIST, (v) => BORDER_ + v)

export const [
  , // BORDER_BLACK,
  BORDER_WHITE,
] = stringsMap(BLACK_AND_WHITE_LIST, (v) => BORDER_ + v)

export const [
  BORDER_1,
  BORDER_2,
  BORDER_3,
  BORDER_4,
  BORDER_5,
] = stringsMap(spaceSplit('1 2 3 4 5'), (v) => BORDER_ + v)

export const [
  BORDER_OPACITY_10,
  BORDER_OPACITY_25,
  BORDER_OPACITY_50,
  BORDER_OPACITY_75,
  BORDER_OPACITY_100,
] = stringsMap(spaceSplit('10 25 50 75 100'), (v) => BORDER_ + 'opacity-' + v)
