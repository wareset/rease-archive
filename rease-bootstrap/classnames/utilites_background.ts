import {
  spaceSplit, stringsMap,
  VARIANTS_LIST, DARK_AND_LIGHT_LIST, BLACK_AND_WHITE_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/utilities/background/
const [BG_] = spaceSplit('bg-')

export const [
  BG_PRIMARY,
  BG_SECONDARY,
  BG_SUCCESS,
  BG_WARNING,
  BG_DANGER,
  BG_INFO,
] = stringsMap(VARIANTS_LIST, (v) => BG_ + v)

export const [
  BG_DARK,
  BG_LIGHT,
] = stringsMap(DARK_AND_LIGHT_LIST, (v) => BG_ + v)

export const [
  BG_BLACK,
  BG_WHITE,
] = stringsMap(BLACK_AND_WHITE_LIST, (v) => BG_ + v)

export const [
  BG_BODY,
  BG_TRANSPARENT,
  BG_GRADIENT,
] = stringsMap(spaceSplit('body transparent gradient'), (v) => BG_ + v)

export const [
  BG_OPACITY_10,
  BG_OPACITY_25,
  BG_OPACITY_50,
  BG_OPACITY_75,
  BG_OPACITY_100,
] = stringsMap(spaceSplit('10 25 50 75 100'), (v) => BG_ + 'opacity-' + v)
