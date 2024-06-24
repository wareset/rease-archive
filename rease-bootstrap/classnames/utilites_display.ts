import {
  spaceSplit, stringsMap,
  SIZES_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/utilities/display/

const [_, D_] = spaceSplit('- d-')
const VALUES = spaceSplit('inline inline-block block grid table table-row table-cell flex inline-flex none')

export const [
  D_INLINE,
  D_INLINE_BLOCK,
  D_BLOCK,
  D_GRID,
  D_TABLE,
  D_TABLE_ROW,
  D_TABLE_CELL,
  D_FLEX,
  D_INLINE_FLEX,
  D_NONE,
] = stringsMap(VALUES, (v) => D_ + v)

export const [
  D_PRINT_INLINE,
  D_PRINT_INLINE_BLOCK,
  D_PRINT_BLOCK,
  D_PRINT_GRID,
  D_PRINT_TABLE,
  D_PRINT_TABLE_ROW,
  D_PRINT_TABLE_CELL,
  D_PRINT_FLEX,
  D_PRINT_INLINE_FLEX,
  D_PRINT_NONE,
] = stringsMap(VALUES, (v) => D_ + 'print-' + v)

export const [
  D_SM_INLINE,
  D_SM_INLINE_BLOCK,
  D_SM_BLOCK,
  D_SM_GRID,
  D_SM_TABLE,
  D_SM_TABLE_ROW,
  D_SM_TABLE_CELL,
  D_SM_FLEX,
  D_SM_INLINE_FLEX,
  D_SM_NONE,
] = stringsMap(VALUES, (v) => D_ + SIZES_LIST[0] + _ + v)

export const [
  D_MD_INLINE,
  D_MD_INLINE_BLOCK,
  D_MD_BLOCK,
  D_MD_GRID,
  D_MD_TABLE,
  D_MD_TABLE_ROW,
  D_MD_TABLE_CELL,
  D_MD_FLEX,
  D_MD_INLINE_FLEX,
  D_MD_NONE,
] = stringsMap(VALUES, (v) => D_ + SIZES_LIST[1] + _ + v)

export const [
  D_LG_INLINE,
  D_LG_INLINE_BLOCK,
  D_LG_BLOCK,
  D_LG_GRID,
  D_LG_TABLE,
  D_LG_TABLE_ROW,
  D_LG_TABLE_CELL,
  D_LG_FLEX,
  D_LG_INLINE_FLEX,
  D_LG_NONE,
] = stringsMap(VALUES, (v) => D_ + SIZES_LIST[2] + _ + v)

export const [
  D_XL_INLINE,
  D_XL_INLINE_BLOCK,
  D_XL_BLOCK,
  D_XL_GRID,
  D_XL_TABLE,
  D_XL_TABLE_ROW,
  D_XL_TABLE_CELL,
  D_XL_FLEX,
  D_XL_INLINE_FLEX,
  D_XL_NONE,
] = stringsMap(VALUES, (v) => D_ + SIZES_LIST[3] + _ + v)

export const [
  D_XXL_INLINE,
  D_XXL_INLINE_BLOCK,
  D_XXL_BLOCK,
  D_XXL_GRID,
  D_XXL_TABLE,
  D_XXL_TABLE_ROW,
  D_XXL_TABLE_CELL,
  D_XXL_FLEX,
  D_XXL_INLINE_FLEX,
  D_XXL_NONE,
] = stringsMap(VALUES, (v) => D_ + SIZES_LIST[4] + _ + v)
