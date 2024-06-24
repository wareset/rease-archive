import { spaceSplit, stringsMap } from './lib'

// https://getbootstrap.com/docs/5.2/utilities/interactions/

export const [
  USER_SELECT_ALL,
  USER_SELECT_AUTO,
  USER_SELECT_NONE,
] = stringsMap(spaceSplit('all auto none'), (v) => 'user-select-' + v)

export const [
  PE_AUTO,
  PE_NONE,
] = stringsMap(spaceSplit('auto none'), (v) => 'pe-' + v)
