import {
  spaceSplit, stringsMap,
  SIZES_LIST
} from './lib'

// https://getbootstrap.com/docs/5.2/utilities/sizing/

const [_, GAP_, M_, MX_, MY_, MT_, MB_, MS_, ME_, P_, PX_, PY_, PT_, PB_, PS_, PE_] =
  spaceSplit('- gap- m- mx- my- mt- mb- ms- me- p- px- py- pt- pb- ps- pe-')
const DIMS = spaceSplit('0 1 2 3 4 5 auto')

export const [
  GAP_0,
  GAP_1,
  GAP_2,
  GAP_3,
  GAP_4,
  GAP_5,
] = stringsMap(DIMS, (v) => GAP_ + v)
export const [
  GAP_SM_0,
  GAP_SM_1,
  GAP_SM_2,
  GAP_SM_3,
  GAP_SM_4,
  GAP_SM_5,
] = stringsMap(DIMS, (v) => GAP_ + SIZES_LIST[0] + _ + v)
export const [
  GAP_MD_0,
  GAP_MD_1,
  GAP_MD_2,
  GAP_MD_3,
  GAP_MD_4,
  GAP_MD_5,
] = stringsMap(DIMS, (v) => GAP_ + SIZES_LIST[1] + _ + v)
export const [
  GAP_LG_0,
  GAP_LG_1,
  GAP_LG_2,
  GAP_LG_3,
  GAP_LG_4,
  GAP_LG_5,
] = stringsMap(DIMS, (v) => GAP_ + SIZES_LIST[2] + _ + v)
export const [
  GAP_XL_0,
  GAP_XL_1,
  GAP_XL_2,
  GAP_XL_3,
  GAP_XL_4,
  GAP_XL_5,
] = stringsMap(DIMS, (v) => GAP_ + SIZES_LIST[3] + _ + v)
export const [
  GAP_XXL_0,
  GAP_XXL_1,
  GAP_XXL_2,
  GAP_XXL_3,
  GAP_XXL_4,
  GAP_XXL_5,
] = stringsMap(DIMS, (v) => GAP_ + SIZES_LIST[4] + _ + v)

export const [
  M_0,
  M_1,
  M_2,
  M_3,
  M_4,
  M_5,
  M_AUTO,
] = stringsMap(DIMS, (v) => M_ + v)
export const [
  M_SM_0,
  M_SM_1,
  M_SM_2,
  M_SM_3,
  M_SM_4,
  M_SM_5,
  M_SM_AUTO,
] = stringsMap(DIMS, (v) => M_ + SIZES_LIST[0] + _ + v)
export const [
  M_MD_0,
  M_MD_1,
  M_MD_2,
  M_MD_3,
  M_MD_4,
  M_MD_5,
  M_MD_AUTO,
] = stringsMap(DIMS, (v) => M_ + SIZES_LIST[1] + _ + v)
export const [
  M_LG_0,
  M_LG_1,
  M_LG_2,
  M_LG_3,
  M_LG_4,
  M_LG_5,
  M_LG_AUTO,
] = stringsMap(DIMS, (v) => M_ + SIZES_LIST[2] + _ + v)
export const [
  M_XL_0,
  M_XL_1,
  M_XL_2,
  M_XL_3,
  M_XL_4,
  M_XL_5,
  M_XL_AUTO,
] = stringsMap(DIMS, (v) => M_ + SIZES_LIST[3] + _ + v)
export const [
  M_XXL_0,
  M_XXL_1,
  M_XXL_2,
  M_XXL_3,
  M_XXL_4,
  M_XXL_5,
  M_XXL_AUTO,
] = stringsMap(DIMS, (v) => M_ + SIZES_LIST[4] + _ + v)

export const [
  MX_0,
  MX_1,
  MX_2,
  MX_3,
  MX_4,
  MX_5,
  MX_AUTO,
] = stringsMap(DIMS, (v) => MX_ + v)
export const [
  MX_SM_0,
  MX_SM_1,
  MX_SM_2,
  MX_SM_3,
  MX_SM_4,
  MX_SM_5,
  MX_SM_AUTO,
] = stringsMap(DIMS, (v) => MX_ + SIZES_LIST[0] + _ + v)
export const [
  MX_MD_0,
  MX_MD_1,
  MX_MD_2,
  MX_MD_3,
  MX_MD_4,
  MX_MD_5,
  MX_MD_AUTO,
] = stringsMap(DIMS, (v) => MX_ + SIZES_LIST[1] + _ + v)
export const [
  MX_LG_0,
  MX_LG_1,
  MX_LG_2,
  MX_LG_3,
  MX_LG_4,
  MX_LG_5,
  MX_LG_AUTO,
] = stringsMap(DIMS, (v) => MX_ + SIZES_LIST[2] + _ + v)
export const [
  MX_XL_0,
  MX_XL_1,
  MX_XL_2,
  MX_XL_3,
  MX_XL_4,
  MX_XL_5,
  MX_XL_AUTO,
] = stringsMap(DIMS, (v) => MX_ + SIZES_LIST[3] + _ + v)
export const [
  MX_XXL_0,
  MX_XXL_1,
  MX_XXL_2,
  MX_XXL_3,
  MX_XXL_4,
  MX_XXL_5,
  MX_XXL_AUTO,
] = stringsMap(DIMS, (v) => MX_ + SIZES_LIST[4] + _ + v)

export const [
  MY_0,
  MY_1,
  MY_2,
  MY_3,
  MY_4,
  MY_5,
  MY_AUTO,
] = stringsMap(DIMS, (v) => MY_ + v)
export const [
  MY_SM_0,
  MY_SM_1,
  MY_SM_2,
  MY_SM_3,
  MY_SM_4,
  MY_SM_5,
  MY_SM_AUTO,
] = stringsMap(DIMS, (v) => MY_ + SIZES_LIST[0] + _ + v)
export const [
  MY_MD_0,
  MY_MD_1,
  MY_MD_2,
  MY_MD_3,
  MY_MD_4,
  MY_MD_5,
  MY_MD_AUTO,
] = stringsMap(DIMS, (v) => MY_ + SIZES_LIST[1] + _ + v)
export const [
  MY_LG_0,
  MY_LG_1,
  MY_LG_2,
  MY_LG_3,
  MY_LG_4,
  MY_LG_5,
  MY_LG_AUTO,
] = stringsMap(DIMS, (v) => MY_ + SIZES_LIST[2] + _ + v)
export const [
  MY_XL_0,
  MY_XL_1,
  MY_XL_2,
  MY_XL_3,
  MY_XL_4,
  MY_XL_5,
  MY_XL_AUTO,
] = stringsMap(DIMS, (v) => MY_ + SIZES_LIST[3] + _ + v)
export const [
  MY_XXL_0,
  MY_XXL_1,
  MY_XXL_2,
  MY_XXL_3,
  MY_XXL_4,
  MY_XXL_5,
  MY_XXL_AUTO,
] = stringsMap(DIMS, (v) => MY_ + SIZES_LIST[4] + _ + v)

export const [
  MT_0,
  MT_1,
  MT_2,
  MT_3,
  MT_4,
  MT_5,
  MT_AUTO,
] = stringsMap(DIMS, (v) => MT_ + v)
export const [
  MT_SM_0,
  MT_SM_1,
  MT_SM_2,
  MT_SM_3,
  MT_SM_4,
  MT_SM_5,
  MT_SM_AUTO,
] = stringsMap(DIMS, (v) => MT_ + SIZES_LIST[0] + _ + v)
export const [
  MT_MD_0,
  MT_MD_1,
  MT_MD_2,
  MT_MD_3,
  MT_MD_4,
  MT_MD_5,
  MT_MD_AUTO,
] = stringsMap(DIMS, (v) => MT_ + SIZES_LIST[1] + _ + v)
export const [
  MT_LG_0,
  MT_LG_1,
  MT_LG_2,
  MT_LG_3,
  MT_LG_4,
  MT_LG_5,
  MT_LG_AUTO,
] = stringsMap(DIMS, (v) => MT_ + SIZES_LIST[2] + _ + v)
export const [
  MT_XL_0,
  MT_XL_1,
  MT_XL_2,
  MT_XL_3,
  MT_XL_4,
  MT_XL_5,
  MT_XL_AUTO,
] = stringsMap(DIMS, (v) => MT_ + SIZES_LIST[3] + _ + v)
export const [
  MT_XXL_0,
  MT_XXL_1,
  MT_XXL_2,
  MT_XXL_3,
  MT_XXL_4,
  MT_XXL_5,
  MT_XXL_AUTO,
] = stringsMap(DIMS, (v) => MT_ + SIZES_LIST[4] + _ + v)

export const [
  MB_0,
  MB_1,
  MB_2,
  MB_3,
  MB_4,
  MB_5,
  MB_AUTO,
] = stringsMap(DIMS, (v) => MB_ + v)
export const [
  MB_SM_0,
  MB_SM_1,
  MB_SM_2,
  MB_SM_3,
  MB_SM_4,
  MB_SM_5,
  MB_SM_AUTO,
] = stringsMap(DIMS, (v) => MB_ + SIZES_LIST[0] + _ + v)
export const [
  MB_MD_0,
  MB_MD_1,
  MB_MD_2,
  MB_MD_3,
  MB_MD_4,
  MB_MD_5,
  MB_MD_AUTO,
] = stringsMap(DIMS, (v) => MB_ + SIZES_LIST[1] + _ + v)
export const [
  MB_LG_0,
  MB_LG_1,
  MB_LG_2,
  MB_LG_3,
  MB_LG_4,
  MB_LG_5,
  MB_LG_AUTO,
] = stringsMap(DIMS, (v) => MB_ + SIZES_LIST[2] + _ + v)
export const [
  MB_XL_0,
  MB_XL_1,
  MB_XL_2,
  MB_XL_3,
  MB_XL_4,
  MB_XL_5,
  MB_XL_AUTO,
] = stringsMap(DIMS, (v) => MB_ + SIZES_LIST[3] + _ + v)
export const [
  MB_XXL_0,
  MB_XXL_1,
  MB_XXL_2,
  MB_XXL_3,
  MB_XXL_4,
  MB_XXL_5,
  MB_XXL_AUTO,
] = stringsMap(DIMS, (v) => MB_ + SIZES_LIST[4] + _ + v)

export const [
  MS_0,
  MS_1,
  MS_2,
  MS_3,
  MS_4,
  MS_5,
  MS_AUTO,
] = stringsMap(DIMS, (v) => MS_ + v)
export const [
  MS_SM_0,
  MS_SM_1,
  MS_SM_2,
  MS_SM_3,
  MS_SM_4,
  MS_SM_5,
  MS_SM_AUTO,
] = stringsMap(DIMS, (v) => MS_ + SIZES_LIST[0] + _ + v)
export const [
  MS_MD_0,
  MS_MD_1,
  MS_MD_2,
  MS_MD_3,
  MS_MD_4,
  MS_MD_5,
  MS_MD_AUTO,
] = stringsMap(DIMS, (v) => MS_ + SIZES_LIST[1] + _ + v)
export const [
  MS_LG_0,
  MS_LG_1,
  MS_LG_2,
  MS_LG_3,
  MS_LG_4,
  MS_LG_5,
  MS_LG_AUTO,
] = stringsMap(DIMS, (v) => MS_ + SIZES_LIST[2] + _ + v)
export const [
  MS_XL_0,
  MS_XL_1,
  MS_XL_2,
  MS_XL_3,
  MS_XL_4,
  MS_XL_5,
  MS_XL_AUTO,
] = stringsMap(DIMS, (v) => MS_ + SIZES_LIST[3] + _ + v)
export const [
  MS_XXL_0,
  MS_XXL_1,
  MS_XXL_2,
  MS_XXL_3,
  MS_XXL_4,
  MS_XXL_5,
  MS_XXL_AUTO,
] = stringsMap(DIMS, (v) => MS_ + SIZES_LIST[4] + _ + v)

export const [
  ME_0,
  ME_1,
  ME_2,
  ME_3,
  ME_4,
  ME_5,
  ME_AUTO,
] = stringsMap(DIMS, (v) => ME_ + v)
export const [
  ME_SM_0,
  ME_SM_1,
  ME_SM_2,
  ME_SM_3,
  ME_SM_4,
  ME_SM_5,
  ME_SM_AUTO,
] = stringsMap(DIMS, (v) => ME_ + SIZES_LIST[0] + _ + v)
export const [
  ME_MD_0,
  ME_MD_1,
  ME_MD_2,
  ME_MD_3,
  ME_MD_4,
  ME_MD_5,
  ME_MD_AUTO,
] = stringsMap(DIMS, (v) => ME_ + SIZES_LIST[1] + _ + v)
export const [
  ME_LG_0,
  ME_LG_1,
  ME_LG_2,
  ME_LG_3,
  ME_LG_4,
  ME_LG_5,
  ME_LG_AUTO,
] = stringsMap(DIMS, (v) => ME_ + SIZES_LIST[2] + _ + v)
export const [
  ME_XL_0,
  ME_XL_1,
  ME_XL_2,
  ME_XL_3,
  ME_XL_4,
  ME_XL_5,
  ME_XL_AUTO,
] = stringsMap(DIMS, (v) => ME_ + SIZES_LIST[3] + _ + v)
export const [
  ME_XXL_0,
  ME_XXL_1,
  ME_XXL_2,
  ME_XXL_3,
  ME_XXL_4,
  ME_XXL_5,
  ME_XXL_AUTO,
] = stringsMap(DIMS, (v) => ME_ + SIZES_LIST[4] + _ + v)

export const [
  P_0,
  P_1,
  P_2,
  P_3,
  P_4,
  P_5,
] = stringsMap(DIMS, (v) => P_ + v)
export const [
  P_SM_0,
  P_SM_1,
  P_SM_2,
  P_SM_3,
  P_SM_4,
  P_SM_5,
] = stringsMap(DIMS, (v) => P_ + SIZES_LIST[0] + _ + v)
export const [
  P_MD_0,
  P_MD_1,
  P_MD_2,
  P_MD_3,
  P_MD_4,
  P_MD_5,
] = stringsMap(DIMS, (v) => P_ + SIZES_LIST[1] + _ + v)
export const [
  P_LG_0,
  P_LG_1,
  P_LG_2,
  P_LG_3,
  P_LG_4,
  P_LG_5,
] = stringsMap(DIMS, (v) => P_ + SIZES_LIST[2] + _ + v)
export const [
  P_XL_0,
  P_XL_1,
  P_XL_2,
  P_XL_3,
  P_XL_4,
  P_XL_5,
] = stringsMap(DIMS, (v) => P_ + SIZES_LIST[3] + _ + v)
export const [
  P_XXL_0,
  P_XXL_1,
  P_XXL_2,
  P_XXL_3,
  P_XXL_4,
  P_XXL_5,
] = stringsMap(DIMS, (v) => P_ + SIZES_LIST[4] + _ + v)

export const [
  PX_0,
  PX_1,
  PX_2,
  PX_3,
  PX_4,
  PX_5,
] = stringsMap(DIMS, (v) => PX_ + v)
export const [
  PX_SM_0,
  PX_SM_1,
  PX_SM_2,
  PX_SM_3,
  PX_SM_4,
  PX_SM_5,
] = stringsMap(DIMS, (v) => PX_ + SIZES_LIST[0] + _ + v)
export const [
  PX_MD_0,
  PX_MD_1,
  PX_MD_2,
  PX_MD_3,
  PX_MD_4,
  PX_MD_5,
] = stringsMap(DIMS, (v) => PX_ + SIZES_LIST[1] + _ + v)
export const [
  PX_LG_0,
  PX_LG_1,
  PX_LG_2,
  PX_LG_3,
  PX_LG_4,
  PX_LG_5,
] = stringsMap(DIMS, (v) => PX_ + SIZES_LIST[2] + _ + v)
export const [
  PX_XL_0,
  PX_XL_1,
  PX_XL_2,
  PX_XL_3,
  PX_XL_4,
  PX_XL_5,
] = stringsMap(DIMS, (v) => PX_ + SIZES_LIST[3] + _ + v)
export const [
  PX_XXL_0,
  PX_XXL_1,
  PX_XXL_2,
  PX_XXL_3,
  PX_XXL_4,
  PX_XXL_5,
] = stringsMap(DIMS, (v) => PX_ + SIZES_LIST[4] + _ + v)

export const [
  PY_0,
  PY_1,
  PY_2,
  PY_3,
  PY_4,
  PY_5,
] = stringsMap(DIMS, (v) => PY_ + v)
export const [
  PY_SM_0,
  PY_SM_1,
  PY_SM_2,
  PY_SM_3,
  PY_SM_4,
  PY_SM_5,
] = stringsMap(DIMS, (v) => PY_ + SIZES_LIST[0] + _ + v)
export const [
  PY_MD_0,
  PY_MD_1,
  PY_MD_2,
  PY_MD_3,
  PY_MD_4,
  PY_MD_5,
] = stringsMap(DIMS, (v) => PY_ + SIZES_LIST[1] + _ + v)
export const [
  PY_LG_0,
  PY_LG_1,
  PY_LG_2,
  PY_LG_3,
  PY_LG_4,
  PY_LG_5,
] = stringsMap(DIMS, (v) => PY_ + SIZES_LIST[2] + _ + v)
export const [
  PY_XL_0,
  PY_XL_1,
  PY_XL_2,
  PY_XL_3,
  PY_XL_4,
  PY_XL_5,
  PY_XL_AUTO,
] = stringsMap(DIMS, (v) => PY_ + SIZES_LIST[3] + _ + v)
export const [
  PY_XXL_0,
  PY_XXL_1,
  PY_XXL_2,
  PY_XXL_3,
  PY_XXL_4,
  PY_XXL_5,
] = stringsMap(DIMS, (v) => PY_ + SIZES_LIST[4] + _ + v)

export const [
  PT_0,
  PT_1,
  PT_2,
  PT_3,
  PT_4,
  PT_5,
] = stringsMap(DIMS, (v) => PT_ + v)
export const [
  PT_SM_0,
  PT_SM_1,
  PT_SM_2,
  PT_SM_3,
  PT_SM_4,
  PT_SM_5,
] = stringsMap(DIMS, (v) => PT_ + SIZES_LIST[0] + _ + v)
export const [
  PT_MD_0,
  PT_MD_1,
  PT_MD_2,
  PT_MD_3,
  PT_MD_4,
  PT_MD_5,
] = stringsMap(DIMS, (v) => PT_ + SIZES_LIST[1] + _ + v)
export const [
  PT_LG_0,
  PT_LG_1,
  PT_LG_2,
  PT_LG_3,
  PT_LG_4,
  PT_LG_5,
] = stringsMap(DIMS, (v) => PT_ + SIZES_LIST[2] + _ + v)
export const [
  PT_XL_0,
  PT_XL_1,
  PT_XL_2,
  PT_XL_3,
  PT_XL_4,
  PT_XL_5,
] = stringsMap(DIMS, (v) => PT_ + SIZES_LIST[3] + _ + v)
export const [
  PT_XXL_0,
  PT_XXL_1,
  PT_XXL_2,
  PT_XXL_3,
  PT_XXL_4,
  PT_XXL_5,
] = stringsMap(DIMS, (v) => PT_ + SIZES_LIST[4] + _ + v)

export const [
  PB_0,
  PB_1,
  PB_2,
  PB_3,
  PB_4,
  PB_5,
] = stringsMap(DIMS, (v) => PB_ + v)
export const [
  PB_SM_0,
  PB_SM_1,
  PB_SM_2,
  PB_SM_3,
  PB_SM_4,
  PB_SM_5,
] = stringsMap(DIMS, (v) => PB_ + SIZES_LIST[0] + _ + v)
export const [
  PB_MD_0,
  PB_MD_1,
  PB_MD_2,
  PB_MD_3,
  PB_MD_4,
  PB_MD_5,
] = stringsMap(DIMS, (v) => PB_ + SIZES_LIST[1] + _ + v)
export const [
  PB_LG_0,
  PB_LG_1,
  PB_LG_2,
  PB_LG_3,
  PB_LG_4,
  PB_LG_5,
] = stringsMap(DIMS, (v) => PB_ + SIZES_LIST[2] + _ + v)
export const [
  PB_XL_0,
  PB_XL_1,
  PB_XL_2,
  PB_XL_3,
  PB_XL_4,
  PB_XL_5,
] = stringsMap(DIMS, (v) => PB_ + SIZES_LIST[3] + _ + v)
export const [
  PB_XXL_0,
  PB_XXL_1,
  PB_XXL_2,
  PB_XXL_3,
  PB_XXL_4,
  PB_XXL_5,
] = stringsMap(DIMS, (v) => PB_ + SIZES_LIST[4] + _ + v)

export const [
  PS_0,
  PS_1,
  PS_2,
  PS_3,
  PS_4,
  PS_5,
] = stringsMap(DIMS, (v) => PS_ + v)
export const [
  PS_SM_0,
  PS_SM_1,
  PS_SM_2,
  PS_SM_3,
  PS_SM_4,
  PS_SM_5,
] = stringsMap(DIMS, (v) => PS_ + SIZES_LIST[0] + _ + v)
export const [
  PS_MD_0,
  PS_MD_1,
  PS_MD_2,
  PS_MD_3,
  PS_MD_4,
  PS_MD_5,
] = stringsMap(DIMS, (v) => PS_ + SIZES_LIST[1] + _ + v)
export const [
  PS_LG_0,
  PS_LG_1,
  PS_LG_2,
  PS_LG_3,
  PS_LG_4,
  PS_LG_5,
] = stringsMap(DIMS, (v) => PS_ + SIZES_LIST[2] + _ + v)
export const [
  PS_XL_0,
  PS_XL_1,
  PS_XL_2,
  PS_XL_3,
  PS_XL_4,
  PS_XL_5,
] = stringsMap(DIMS, (v) => PS_ + SIZES_LIST[3] + _ + v)
export const [
  PS_XXL_0,
  PS_XXL_1,
  PS_XXL_2,
  PS_XXL_3,
  PS_XXL_4,
  PS_XXL_5,
] = stringsMap(DIMS, (v) => PS_ + SIZES_LIST[4] + _ + v)

export const [
  PE_0,
  PE_1,
  PE_2,
  PE_3,
  PE_4,
  PE_5,
] = stringsMap(DIMS, (v) => PE_ + v)
export const [
  PE_SM_0,
  PE_SM_1,
  PE_SM_2,
  PE_SM_3,
  PE_SM_4,
  PE_SM_5,
] = stringsMap(DIMS, (v) => PE_ + SIZES_LIST[0] + _ + v)
export const [
  PE_MD_0,
  PE_MD_1,
  PE_MD_2,
  PE_MD_3,
  PE_MD_4,
  PE_MD_5,
] = stringsMap(DIMS, (v) => PE_ + SIZES_LIST[1] + _ + v)
export const [
  PE_LG_0,
  PE_LG_1,
  PE_LG_2,
  PE_LG_3,
  PE_LG_4,
  PE_LG_5,
] = stringsMap(DIMS, (v) => PE_ + SIZES_LIST[2] + _ + v)
export const [
  PE_XL_0,
  PE_XL_1,
  PE_XL_2,
  PE_XL_3,
  PE_XL_4,
  PE_XL_5,
] = stringsMap(DIMS, (v) => PE_ + SIZES_LIST[3] + _ + v)
export const [
  PE_XXL_0,
  PE_XXL_1,
  PE_XXL_2,
  PE_XXL_3,
  PE_XXL_4,
  PE_XXL_5,
] = stringsMap(DIMS, (v) => PE_ + SIZES_LIST[4] + _ + v)
