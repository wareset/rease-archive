import {
  spaceSplit, stringsMap,
  SIZES_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/layout/gutters/

const NUMS = spaceSplit('0 1 2 3 4 5')
const [_, G_, GX_, GY_] = spaceSplit('- g- gx- gy-')

export const [
  G_0,
  G_1,
  G_2,
  G_3,
  G_4,
  G_5,
] = stringsMap(NUMS, (v) => G_ + v)
export const [
  G_SM_0,
  G_SM_1,
  G_SM_2,
  G_SM_3,
  G_SM_4,
  G_SM_5,
] = stringsMap(NUMS, (v) => G_ + SIZES_LIST[0] + _ + v)
export const [
  G_MD_0,
  G_MD_1,
  G_MD_2,
  G_MD_3,
  G_MD_4,
  G_MD_5,
] = stringsMap(NUMS, (v) => G_ + SIZES_LIST[1] + _ + v)
export const [
  G_LG_0,
  G_LG_1,
  G_LG_2,
  G_LG_3,
  G_LG_4,
  G_LG_5,
] = stringsMap(NUMS, (v) => G_ + SIZES_LIST[2] + _ + v)
export const [
  G_XL_0,
  G_XL_1,
  G_XL_2,
  G_XL_3,
  G_XL_4,
  G_XL_5,
] = stringsMap(NUMS, (v) => G_ + SIZES_LIST[3] + _ + v)
export const [
  G_XXL_0,
  G_XXL_1,
  G_XXL_2,
  G_XXL_3,
  G_XXL_4,
  G_XXL_5,
] = stringsMap(NUMS, (v) => G_ + SIZES_LIST[4] + _ + v)

export const [
  GX_0,
  GX_1,
  GX_2,
  GX_3,
  GX_4,
  GX_5,
] = stringsMap(NUMS, (v) => GX_ + v)
export const [
  GX_SM_0,
  GX_SM_1,
  GX_SM_2,
  GX_SM_3,
  GX_SM_4,
  GX_SM_5,
] = stringsMap(NUMS, (v) => GX_ + SIZES_LIST[0] + _ + v)
export const [
  GX_MD_0,
  GX_MD_1,
  GX_MD_2,
  GX_MD_3,
  GX_MD_4,
  GX_MD_5,
] = stringsMap(NUMS, (v) => GX_ + SIZES_LIST[1] + _ + v)
export const [
  GX_LG_0,
  GX_LG_1,
  GX_LG_2,
  GX_LG_3,
  GX_LG_4,
  GX_LG_5,
] = stringsMap(NUMS, (v) => GX_ + SIZES_LIST[2] + _ + v)
export const [
  GX_XL_0,
  GX_XL_1,
  GX_XL_2,
  GX_XL_3,
  GX_XL_4,
  GX_XL_5,
] = stringsMap(NUMS, (v) => GX_ + SIZES_LIST[3] + _ + v)
export const [
  GX_XXL_0,
  GX_XXL_1,
  GX_XXL_2,
  GX_XXL_3,
  GX_XXL_4,
  GX_XXL_5,
] = stringsMap(NUMS, (v) => GX_ + SIZES_LIST[4] + _ + v)

export const [
  GY_0,
  GY_1,
  GY_2,
  GY_3,
  GY_4,
  GY_5,
] = stringsMap(NUMS, (v) => GY_ + v)
export const [
  GY_SM_0,
  GY_SM_1,
  GY_SM_2,
  GY_SM_3,
  GY_SM_4,
  GY_SM_5,
] = stringsMap(NUMS, (v) => GY_ + SIZES_LIST[0] + _ + v)
export const [
  GY_MD_0,
  GY_MD_1,
  GY_MD_2,
  GY_MD_3,
  GY_MD_4,
  GY_MD_5,
] = stringsMap(NUMS, (v) => GY_ + SIZES_LIST[1] + _ + v)
export const [
  GY_LG_0,
  GY_LG_1,
  GY_LG_2,
  GY_LG_3,
  GY_LG_4,
  GY_LG_5,
] = stringsMap(NUMS, (v) => GY_ + SIZES_LIST[2] + _ + v)
export const [
  GY_XL_0,
  GY_XL_1,
  GY_XL_2,
  GY_XL_3,
  GY_XL_4,
  GY_XL_5,
] = stringsMap(NUMS, (v) => GY_ + SIZES_LIST[3] + _ + v)
export const [
  GY_XXL_0,
  GY_XXL_1,
  GY_XXL_2,
  GY_XXL_3,
  GY_XXL_4,
  GY_XXL_5,
] = stringsMap(NUMS, (v) => GY_ + SIZES_LIST[4] + _ + v)
