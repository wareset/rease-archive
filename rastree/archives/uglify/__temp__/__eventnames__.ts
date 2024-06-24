// import { values, forEach, startsWith, replace, trim } from 'wareset-utilites'

// import * as eventnames from 'rease/samples/eventnames'
// const csses = values(eventnames).filter(
//   (v) => !startsWith(v, 'on') && v.length > 1
// )
// csses.sort((a, b) => b.length - a.length)

// let k = -1
// while (++k < csses.length) {
//   let v = csses[k]
//   // if (!k) {
//   base: for (let v2 of csses) {
//     if (v !== v2) {
//       v2 = replace(v2, /\W+/g).toLowerCase()
//       const idx = v.indexOf(v2)
//       if (idx > -1) {
//         v = csses[k] = replace(
//           trim(replace(v, v2, '+' + v2.toUpperCase() + '+'), '+'),
//           /\++/,
//           '+'
//         )

//         continue base
//       }
//     }
//   }
//   // }

//   let arr = v.split('+').filter((v) => v)
//   if (arr.length > 1) {
//     arr = arr.map((v3, k2, a3) => {
//       const res = v3.toUpperCase()
//       if (res !== v3) {
//         csses.push(v3)
//       }
//       return res
//     })
//   }
//   v = csses[k] = arr.join(' + ')
//   if (arr.length === 1) v = csses[k] = "'" + v + "'"

//   console.log(v)
// }

// csses.sort((a, b) => a.length - b.length || a.localeCompare(b))
// console.log(csses)

// let res = `export const ON = 'on'
// export const $COLON = ':'
// export const ON_$COLON = ON + $COLON

// `
// forEach(csses, (v) => {
//   const k = replace(v, /\W+/g).toUpperCase()
//   if (k !== 'ON') {
//     res += 'export const ' + k + ' = ' + v + '\n'
//     if (k.length > 1) {
//       res += 'export const ON' + k + ' = ON + ' + k + '\n'
//       res += 'export const ON_$COLON_' + k + ' = ON_$COLON + ' + k + '\n'
//     }
//   }
// })

// console.log(res)
