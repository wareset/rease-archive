import {
  spaceSplit, stringsMap,
  SIZES_LIST, VARIANTS_LIST,
  BLACK_AND_WHITE_LIST, DARK_AND_LIGHT_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/utilities/text/

const [TEXT_, _50] = spaceSplit('text- -50')
const SIZES_LIST_0_3 = SIZES_LIST.slice(0, -2)

export const [
  FONT_MONOSPACE,
] = stringsMap(spaceSplit('monospace'), (v) => 'font-' + v)

export const [
  FS_1,
  FS_2,
  FS_3,
  FS_4,
  FS_5,
  FS_6,
] = stringsMap(spaceSplit('1 2 3 4 5 6'), (v) => 'fs-' + v)

export const [
  FST_ITALIC,
  FST_NORMAL,
] = stringsMap(spaceSplit('italic normal'), (v) => 'fst-' + v)

export const [
  FW_LIGHT,
  FW_LIGHTER,
  FW_NORMAL,
  FW_BOLD,
  FW_SEMIBOLD,
  FW_BOLDER,
] = stringsMap(spaceSplit('light lighter normal bold semibold bolder'), (v) => 'fw-' + v)

export const [
  LH_1,
  LH_SM,
  LH_BASE,
  LH_LG,
] = stringsMap(spaceSplit('1 sm base lg'), (v) => 'lh-' + v)

export const [
  TEXT_START,
  TEXT_CENTER,
  TEXT_END,
] = stringsMap(spaceSplit('start center end'), (v) => TEXT_ + v)

export const [
  TEXT_SM_START,
  TEXT_MD_START,
  TEXT_LG_START,
] = stringsMap(SIZES_LIST_0_3, (v) => TEXT_ + v + '-start')

export const [
  TEXT_SM_CENTER,
  TEXT_MD_CENTER,
  TEXT_LG_CENTER,
] = stringsMap(SIZES_LIST_0_3, (v) => TEXT_ + v + '-center')

export const [
  TEXT_SM_END,
  TEXT_MD_END,
  TEXT_LG_END,
] = stringsMap(SIZES_LIST_0_3, (v) => TEXT_ + v + '-end')

export const [
  TEXT_DECORATION_NONE,
  TEXT_DECORATION_UNDERLINE,
  TEXT_DECORATION_LINE_THROUGH,
] = stringsMap(spaceSplit('none underline line-through'), (v) => TEXT_ + 'decoration-' + v)

export const [
  TEXT_LOWERCASE,
  TEXT_UPPERCASE,
  TEXT_CAPITALIZE,
] = stringsMap(spaceSplit('lowercase uppercase capitalize'), (v) => TEXT_ + v)

export const [
  TEXT_WRAP,
  TEXT_NOWRAP,
  TEXT_BREAK,
] = stringsMap(spaceSplit('wrap nowrap break'), (v) => TEXT_ + v)

// https://getbootstrap.com/docs/5.2/utilities/colors/ 

export const [
  TEXT_OPACITY_25,
  TEXT_OPACITY_50,
  TEXT_OPACITY_75,
  TEXT_OPACITY_100,
] = stringsMap(spaceSplit('25 50 75 100'), (v) => TEXT_ + 'opacity-' + v)

export const [
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_SUCCESS,
  TEXT_WARNING,
  TEXT_DANGER,
  TEXT_INFO,
] = stringsMap(VARIANTS_LIST, (v) => TEXT_ + v)

export const [
  TEXT_BODY,
  TEXT_MUTED,
  TEXT_RESET,
  TEXT_TRUNCATE,
] = stringsMap(spaceSplit('body muted reset truncate'), (v) => TEXT_ + v)

export const [
  TEXT_DARK,
  TEXT_LIGHT,
] = stringsMap(DARK_AND_LIGHT_LIST, (v) => TEXT_ + v)

export const [
  TEXT_BLACK,
  TEXT_WHITE,
] = stringsMap(BLACK_AND_WHITE_LIST, (v) => TEXT_ + v)
export const TEXT_BLACK_50 = TEXT_BLACK + _50
export const TEXT_WHITE_50 = TEXT_WHITE + _50
