import {
  spaceSplit, stringsMap,
  SIZES_LIST
} from './lib'

const [_, CONTAINER, _FLUID, ROW, COL, OFFSET] =
  spaceSplit('- container -fluid row col offset')

// https://getbootstrap.com/docs/5.2/layout/containers/
// https://getbootstrap.com/docs/5.2/layout/grid/
// https://getbootstrap.com/docs/5.2/layout/columns/

export { CONTAINER, ROW, COL }
export const CONTAINER_FLUID = CONTAINER + _FLUID

export const [
  CONTAINER_SM,
  CONTAINER_MD,
  CONTAINER_LG,
  CONTAINER_XL,
  CONTAINER_XXL,
] = stringsMap(SIZES_LIST, (v) => CONTAINER + _ + v)

const NUMS_AUTO_6 = spaceSplit('-auto -1 -2 -3 -4 -5 -6')
const NUMS__AUTO_12 = [''].concat(NUMS_AUTO_6, spaceSplit('-7 -8 -9 -10 -11 -12'))
const NUMS_0_11 = ['-0'].concat(NUMS__AUTO_12.slice(2, -1))

const ROW_COLS = ROW + _ + COL + 's'
export const [
  ROW_COLS_auto,
  ROW_COLS_1,
  ROW_COLS_2,
  ROW_COLS_3,
  ROW_COLS_4,
  ROW_COLS_5,
  ROW_COLS_6,
] = stringsMap(NUMS_AUTO_6, (_v) => ROW_COLS + _v)
export const [
  ROW_COLS_SM_auto,
  ROW_COLS_SM_1,
  ROW_COLS_SM_2,
  ROW_COLS_SM_3,
  ROW_COLS_SM_4,
  ROW_COLS_SM_5,
  ROW_COLS_SM_6,
] = stringsMap(NUMS_AUTO_6, (_v) => ROW_COLS + _ + SIZES_LIST[0] + _v)
export const [
  ROW_COLS_MD_auto,
  ROW_COLS_MD_1,
  ROW_COLS_MD_2,
  ROW_COLS_MD_3,
  ROW_COLS_MD_4,
  ROW_COLS_MD_5,
  ROW_COLS_MD_6,
] = stringsMap(NUMS_AUTO_6, (_v) => ROW_COLS + _ + SIZES_LIST[1] + _v)
export const [
  ROW_COLS_LG_auto,
  ROW_COLS_LG_1,
  ROW_COLS_LG_2,
  ROW_COLS_LG_3,
  ROW_COLS_LG_4,
  ROW_COLS_LG_5,
  ROW_COLS_LG_6,
] = stringsMap(NUMS_AUTO_6, (_v) => ROW_COLS + _ + SIZES_LIST[2] + _v)
export const [
  ROW_COLS_XL_auto,
  ROW_COLS_XL_1,
  ROW_COLS_XL_2,
  ROW_COLS_XL_3,
  ROW_COLS_XL_4,
  ROW_COLS_XL_5,
  ROW_COLS_XL_6,
] = stringsMap(NUMS_AUTO_6, (_v) => ROW_COLS + _ + SIZES_LIST[3] + _v)
export const [
  ROW_COLS_XXL_auto,
  ROW_COLS_XXL_1,
  ROW_COLS_XXL_2,
  ROW_COLS_XXL_3,
  ROW_COLS_XXL_4,
  ROW_COLS_XXL_5,
  ROW_COLS_XXL_6,
] = stringsMap(NUMS_AUTO_6, (_v) => ROW_COLS + _ + SIZES_LIST[4] + _v)

export const [
  ,
  COL_auto,
  COL_1,
  COL_2,
  COL_3,
  COL_4,
  COL_5,
  COL_6,
  COL_7,
  COL_8,
  COL_9,
  COL_10,
  COL_11,
  COL_12,
] = stringsMap(NUMS__AUTO_12, (_v) => COL + _v)
export const [
  COL_SM,
  COL_SM_auto,
  COL_SM_1,
  COL_SM_2,
  COL_SM_3,
  COL_SM_4,
  COL_SM_5,
  COL_SM_6,
  COL_SM_7,
  COL_SM_8,
  COL_SM_9,
  COL_SM_10,
  COL_SM_11,
  COL_SM_12,
] = stringsMap(NUMS__AUTO_12, (_v) => COL + _ + SIZES_LIST[0] + _v)
export const [
  COL_MD,
  COL_MD_auto,
  COL_MD_1,
  COL_MD_2,
  COL_MD_3,
  COL_MD_4,
  COL_MD_5,
  COL_MD_6,
  COL_MD_7,
  COL_MD_8,
  COL_MD_9,
  COL_MD_10,
  COL_MD_11,
  COL_MD_12,
] = stringsMap(NUMS__AUTO_12, (_v) => COL + _ + SIZES_LIST[1] + _v)
export const [
  COL_LG,
  COL_LG_auto,
  COL_LG_1,
  COL_LG_2,
  COL_LG_3,
  COL_LG_4,
  COL_LG_5,
  COL_LG_6,
  COL_LG_7,
  COL_LG_8,
  COL_LG_9,
  COL_LG_10,
  COL_LG_11,
  COL_LG_12,
] = stringsMap(NUMS__AUTO_12, (_v) => COL + _ + SIZES_LIST[2] + _v)
export const [
  COL_XL,
  COL_XL_auto,
  COL_XL_1,
  COL_XL_2,
  COL_XL_3,
  COL_XL_4,
  COL_XL_5,
  COL_XL_6,
  COL_XL_7,
  COL_XL_8,
  COL_XL_9,
  COL_XL_10,
  COL_XL_11,
  COL_XL_12,
] = stringsMap(NUMS__AUTO_12, (_v) => COL + _ + SIZES_LIST[3] + _v)
export const [
  COL_XXL,
  COL_XXL_auto,
  COL_XXL_1,
  COL_XXL_2,
  COL_XXL_3,
  COL_XXL_4,
  COL_XXL_5,
  COL_XXL_6,
  COL_XXL_7,
  COL_XXL_8,
  COL_XXL_9,
  COL_XXL_10,
  COL_XXL_11,
  COL_XXL_12,
] = stringsMap(NUMS__AUTO_12, (_v) => COL + _ + SIZES_LIST[4] + _v)

export const [
  ,
  OFFSET_1,
  OFFSET_2,
  OFFSET_3,
  OFFSET_4,
  OFFSET_5,
  OFFSET_6,
  OFFSET_7,
  OFFSET_8,
  OFFSET_9,
  OFFSET_10,
  OFFSET_11,
] = stringsMap(NUMS_0_11, (_v) => OFFSET + _v)
export const [
  OFFSET_SM_0,
  OFFSET_SM_1,
  OFFSET_SM_2,
  OFFSET_SM_3,
  OFFSET_SM_4,
  OFFSET_SM_5,
  OFFSET_SM_6,
  OFFSET_SM_7,
  OFFSET_SM_8,
  OFFSET_SM_9,
  OFFSET_SM_10,
  OFFSET_SM_11,
] = stringsMap(NUMS_0_11, (_v) => OFFSET + _ + SIZES_LIST[0] + _v)
export const [
  OFFSET_MD_0,
  OFFSET_MD_1,
  OFFSET_MD_2,
  OFFSET_MD_3,
  OFFSET_MD_4,
  OFFSET_MD_5,
  OFFSET_MD_6,
  OFFSET_MD_7,
  OFFSET_MD_8,
  OFFSET_MD_9,
  OFFSET_MD_10,
  OFFSET_MD_11,
] = stringsMap(NUMS_0_11, (_v) => OFFSET + _ + SIZES_LIST[1] + _v)
export const [
  OFFSET_LG_0,
  OFFSET_LG_1,
  OFFSET_LG_2,
  OFFSET_LG_3,
  OFFSET_LG_4,
  OFFSET_LG_5,
  OFFSET_LG_6,
  OFFSET_LG_7,
  OFFSET_LG_8,
  OFFSET_LG_9,
  OFFSET_LG_10,
  OFFSET_LG_11,
] = stringsMap(NUMS_0_11, (_v) => OFFSET + _ + SIZES_LIST[2] + _v)
export const [
  OFFSET_XL_0,
  OFFSET_XL_1,
  OFFSET_XL_2,
  OFFSET_XL_3,
  OFFSET_XL_4,
  OFFSET_XL_5,
  OFFSET_XL_6,
  OFFSET_XL_7,
  OFFSET_XL_8,
  OFFSET_XL_9,
  OFFSET_XL_10,
  OFFSET_XL_11,
] = stringsMap(NUMS_0_11, (_v) => OFFSET + _ + SIZES_LIST[3] + _v)
export const [
  OFFSET_XXL_0,
  OFFSET_XXL_1,
  OFFSET_XXL_2,
  OFFSET_XXL_3,
  OFFSET_XXL_4,
  OFFSET_XXL_5,
  OFFSET_XXL_6,
  OFFSET_XXL_7,
  OFFSET_XXL_8,
  OFFSET_XXL_9,
  OFFSET_XXL_10,
  OFFSET_XXL_11,
] = stringsMap(NUMS_0_11, (_v) => OFFSET + _ + SIZES_LIST[4] + _v)
