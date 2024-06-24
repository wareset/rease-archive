import {
  spaceSplit, stringsMap,
  SIZES_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/utilities/float/

const [FLOAT_, _START, _END, _NONE] = spaceSplit('float- -start -end -none')

export const [
  FLOAT_START,
  FLOAT_END,
  FLOAT_NONE,
] = stringsMap(spaceSplit('start end none'), (v) => FLOAT_ + v)

export const [
  FLOAT_SM_START,
  FLOAT_MD_START,
  FLOAT_LG_START,
  FLOAT_XL_START,
  FLOAT_XXL_START,
] = stringsMap(SIZES_LIST, (v) => FLOAT_ + v + _START)

export const [
  FLOAT_SM_END,
  FLOAT_MD_END,
  FLOAT_LG_END,
  FLOAT_XL_END,
  FLOAT_XXL_END,
] = stringsMap(SIZES_LIST, (v) => FLOAT_ + v + _END)

export const [
  FLOAT_SM_NONE,
  FLOAT_MD_NONE,
  FLOAT_LG_NONE,
  FLOAT_XL_NONE,
  FLOAT_XXL_NONE,
] = stringsMap(SIZES_LIST, (v) => FLOAT_ + v + _NONE)
