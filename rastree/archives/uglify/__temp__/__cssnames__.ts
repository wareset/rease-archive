// import { values, forEach } from 'wareset-utilites'

// import * as cssnames from 'rease/samples/cssnames'
// const csses = values(cssnames)
// console.log(csses)

// const cssvar = {}
// cssvar.$DASH = "'-'"
// cssvar.WEBKIT = "'webkit'"
// cssvar.MS = "'ms'"
// cssvar.O = "'o'"
// const cssobj = {}

// forEach(csses, (v) => {
//   const arr = v.split('-').filter((v) => v)
//   if (arr[0] === 'webkit' || arr[0] === 'ms' || arr[0] === 'o') arr.shift()
//   if (arr.length) {
//     const GEN_NAME = arr.join('_').toUpperCase()
//     cssobj[GEN_NAME] = arr.join(' + $DASH + ').toUpperCase()

//     cssobj['_WEBKIT_' + GEN_NAME] = '$DASH + WEBKIT + $DASH + ' + GEN_NAME
//     cssobj['_MS_' + GEN_NAME] = '$DASH + MS + $DASH + ' + GEN_NAME
//     cssobj['_O_' + GEN_NAME] = '$DASH + O + $DASH + ' + GEN_NAME

//     forEach(arr, (v) => {
//       delete cssobj[v.toUpperCase()]
//       cssvar[v.toUpperCase()] = "'" + v + "'"
//     })
//   }
// })

// console.log(cssvar)
// console.log(cssobj)

// let res = ''
// for (const k in cssvar) {
//   res += 'export const ' + k + ' = ' + cssvar[k] + '\n'
// }

// for (const k in cssobj) {
//   res += 'export const ' + k + ' = ' + cssobj[k] + '\n'
// }

// console.log(res)
