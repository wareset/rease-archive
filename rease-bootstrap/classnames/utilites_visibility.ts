import { spaceSplit } from './lib'

// https://getbootstrap.com/docs/5.2/utilities/visibility/
export const [VISIBLE] = spaceSplit('visible')
export const INVISIBLE = 'in' + VISIBLE as 'invisible'
