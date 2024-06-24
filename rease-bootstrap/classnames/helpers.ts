import {
  spaceSplit, stringsMap,
  DIRECTIONS_LIST, SIZES_LIST,
  VARIANTS_LIST, DARK_AND_LIGHT_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/helpers/clearfix/

export const [CLEARFIX, RATIO] = spaceSplit('clearfix ratio')

// https://getbootstrap.com/docs/5.2/helpers/color-background/

const [TEXT_BG_, LINK_] = spaceSplit('text-bg- link-')
export const [
  TEXT_BG_PRIMARY,
  TEXT_BG_SECONDARY,
  TEXT_BG_SUCCESS,
  TEXT_BG_WARNING,
  TEXT_BG_DANGER,
  TEXT_BG_INFO,
] = stringsMap(VARIANTS_LIST, (v) => TEXT_BG_ + v)
export const [
  TEXT_BG_DARK,
  TEXT_BG_LIGHT,
] = stringsMap(DARK_AND_LIGHT_LIST, (v) => TEXT_BG_ + v)

// https://getbootstrap.com/docs/5.2/helpers/colored-links/

export const [
  LINK_PRIMARY,
  LINK_SECONDARY,
  LINK_SUCCESS,
  LINK_WARNING,
  LINK_DANGER,
  LINK_INFO,
] = stringsMap(VARIANTS_LIST, (v) => LINK_ + v)
export const [
  LINK_DARK,
  LINK_LIGHT,
] = stringsMap(DARK_AND_LIGHT_LIST, (v) => LINK_ + v)

// https://getbootstrap.com/docs/5.2/utilities/position/

const TOP_AND_BOTTOM_LIST = DIRECTIONS_LIST.slice(0, 2)
export const [
  FIXED_TOP,
  FIXED_BOTTOM,
] = stringsMap(TOP_AND_BOTTOM_LIST, (v) => 'fixed-' + v)

const [_, STICKY_] = spaceSplit('- sticky-')
export const [
  STICKY_TOP,
  STICKY_BOTTOM,
] = stringsMap(TOP_AND_BOTTOM_LIST, (v) => STICKY_ + v)
export const [
  STICKY_SM_TOP,
  STICKY_SM_BOTTOM,
] = stringsMap(TOP_AND_BOTTOM_LIST, (v) => STICKY_ + SIZES_LIST[0] + _ + v)
export const [
  STICKY_MD_TOP,
  STICKY_MD_BOTTOM,
] = stringsMap(TOP_AND_BOTTOM_LIST, (v) => STICKY_ + SIZES_LIST[1] + _ + v)
export const [
  STICKY_LG_TOP,
  STICKY_LG_BOTTOM,
] = stringsMap(TOP_AND_BOTTOM_LIST, (v) => STICKY_ + SIZES_LIST[2] + _ + v)
export const [
  STICKY_XL_TOP,
  STICKY_XL_BOTTOM,
] = stringsMap(TOP_AND_BOTTOM_LIST, (v) => STICKY_ + SIZES_LIST[3] + _ + v)
export const [
  STICKY_XXL_TOP,
  STICKY_XXL_BOTTOM,
] = stringsMap(TOP_AND_BOTTOM_LIST, (v) => STICKY_ + SIZES_LIST[4] + _ + v)

// https://getbootstrap.com/docs/5.2/helpers/ratio/

export const RATIO_1X1 = RATIO + '-1x1'
export const RATIO_4X3 = RATIO + '-4x3'
export const RATIO_16X9 = RATIO + '-16x9'
export const RATIO_21X9 = RATIO + '-21x9'

// https://getbootstrap.com/docs/5.2/helpers/stacks/
export const [
  VSTACK,
  HSTACK,
] = spaceSplit('vstack hstack')

// https://getbootstrap.com/docs/5.2/helpers/stretched-link/
// https://getbootstrap.com/docs/5.2/helpers/vertical-rule/
// https://getbootstrap.com/docs/5.2/helpers/visually-hidden/
export const [
  VR,
  STRETCHED_LINK,
  VISUALLY_HIDDEN,
] = spaceSplit('vr stretched-link visually-hidden')
export const VISUALLY_HIDDEN_FOCUSABLE = VISUALLY_HIDDEN + '-focusable'
