import {
  spaceSplit, stringsMap,
  SIZES_LIST, DIRECTIONS_LIST, VARIANTS_LIST, DARK_AND_LIGHT_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/content/typography/
const NUMS = spaceSplit('1 2 3 4 5 6')
export const [
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
] = stringsMap(NUMS, (v) => 'h' + v)

export const [
  DISPLAY_1,
  DISPLAY_2,
  DISPLAY_3,
  DISPLAY_4,
  DISPLAY_5,
  DISPLAY_6,
] = stringsMap(NUMS, (v) => 'display-' + v)

export const [LEAD, SMALL, MARK, INITIALISM, BLOCKQUOTE] =
  spaceSplit('lead small mark initialism blockquote')
export const BLOCKQUOTE_FOOTER = BLOCKQUOTE + '-footer'

const [LIST] = spaceSplit('list')
export const LIST_UNSTYLED = LIST + '-unstyled'
export const LIST_INLINE = LIST + '-inline'
export const LIST_INLINE_ITEM = LIST_INLINE + '-item'

// https://getbootstrap.com/docs/5.2/content/images/
export const [
  IMG_FLUID,
  IMG_THUMBNAIL,
] = stringsMap(spaceSplit('fluid thumbnail'), (v) => 'img-' + v)

// https://getbootstrap.com/docs/5.2/content/tables/

const [_, TABLE, RESPONSIVE] = spaceSplit('- table responsive')
export { TABLE }
const TABLE_ = TABLE + _
export const [
  TABLE_PRIMARY,
  TABLE_SECONDARY,
  TABLE_SUCCESS,
  TABLE_WARNING,
  TABLE_DANGER,
  TABLE_INFO,
] = stringsMap(VARIANTS_LIST, (v) => TABLE_ + v)
export const [
  TABLE_DARK,
  TABLE_LIGHT,
] = stringsMap(DARK_AND_LIGHT_LIST, (v) => TABLE_ + v)

export const TABLE_RESPONSIVE = TABLE_ + RESPONSIVE
export const [
  TABLE_RESPONSIVE_SM,
  TABLE_RESPONSIVE_MD,
  TABLE_RESPONSIVE_LG,
  TABLE_RESPONSIVE_XL,
  TABLE_RESPONSIVE_XXL,
] = stringsMap(SIZES_LIST, (v) => TABLE_RESPONSIVE + _ + v)

export const TABLE_SM = TABLE_ + SIZES_LIST[0]
export const CAPTION_TOP = 'caption-' + DIRECTIONS_LIST[0]
export const TABLE_GROUP_DIVIDER = TABLE_ + 'group-divider'
export const TABLE_BORDERED = TABLE_ + 'bordered'
export const TABLE_BORDERLESS = TABLE_ + 'borderless'
export const TABLE_STRIPED = TABLE_ + 'striped'
export const TABLE_STRIPED_COLUMNS = TABLE_STRIPED + '-columns'
export const TABLE_ACTIVE = TABLE_ + 'active'
export const TABLE_HOVER = TABLE_ + 'hover'

// https://getbootstrap.com/docs/5.2/content/figures/

export const [FIGURE] = spaceSplit('figure')
export const FIGURE_IMG = FIGURE + '-img'
export const FIGURE_CAPTION = FIGURE + '-caption'
