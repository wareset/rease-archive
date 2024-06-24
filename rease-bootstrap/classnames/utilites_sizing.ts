import { spaceSplit, stringsMap } from './lib'

// https://getbootstrap.com/docs/5.2/utilities/sizing/

const DIMS = spaceSplit('25 50 75 100 auto')

export const [
  W_25,
  W_50,
  W_75,
  W_100,
  W_AUTO,
] = stringsMap(DIMS, (v) => 'w-' + v)

export const [
  H_25,
  H_50,
  H_75,
  H_100,
  H_AUTO,
] = stringsMap(DIMS, (v) => 'h-' + v)

export const [
  MW_100,
  VW_100,
  MIN_VW_100,

  MH_100,
  VH_100,
  MIN_VH_100,
] = stringsMap(spaceSplit('mw vw min-vw mh vh min-vh'), (v) => v + '-100')
