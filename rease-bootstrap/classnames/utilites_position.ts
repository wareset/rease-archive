import {
  spaceSplit, stringsMap,
  DIRECTIONS_LIST
} from './lib'

export const [
  POSITION_STATIC,
  POSITION_RELATIVE,
  POSITION_ABSOLUTE,
  POSITION_FIXED,
  POSITION_STICKY,
] = stringsMap(spaceSplit('static relative absolute fixed sticky'), (v) => 'position-' + v)

export const [
  TOP_0,
  BOTTOM_0,
  START_0,
  END_0,
] = stringsMap(DIRECTIONS_LIST, (v) => v + '-0')

export const [
  TOP_50,
  BOTTOM_50,
  START_50,
  END_50,
] = stringsMap(DIRECTIONS_LIST, (v) => v + '-50')

export const [
  TOP_100,
  BOTTOM_100,
  START_100,
  END_100,
] = stringsMap(DIRECTIONS_LIST, (v) => v + '-100')

export const [
  TRANSLATE_MIDDLE,
  TRANSLATE_MIDDLE_X,
  TRANSLATE_MIDDLE_Y,
] = stringsMap(spaceSplit(' -x -y'), (v) => 'translate-middle' + v)
