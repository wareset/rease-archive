export const { random: randomDefault, round, ceil, floor, max, min } = Math

export const random = (): number => randomDefault() || random()
export const randomTo = (min: number, max: number): number =>
  round(random() * (max - min) + min)

export const clamp = (
  value: number,
  minValue: number = value,
  maxValue: number = value
): number => max(minValue, min(maxValue, value))
  
export const nearly = (number: number, rem: number, sign: number): number => {
  let s = 1
  if (rem < 0) rem = -rem
  if (number < 0) s = -1, number = -number, sign = -sign
  const q = (number + rem) % rem
  
  number += rem * sign
  if (q) number += rem - q + (q > rem / 2 ? sign > 0 ? -rem : 0 : sign < 0 ? 0 : -rem)
  return number * s
}
  
// const abs = (n: number): number => n < 0 ? -n : n
// const nearnumFrom = (list: number[], rem: number): number => {
//   let res = rem
//   if (list.length) {
//     res = list[0]
//     for (let i = list.length; i-- > 1;) {
//       if (abs(list[i] - rem) < abs(res - rem)) res = list[i]
//     }
//   }
//   return res
// }
  
// /* function closestNumber(arr, num) {
//     return arr.reduce((prev, curr) => (Math.abs(curr - num) < Math.abs(prev - num)) ? curr : prev);
//   } */
  
// console.log(nearnumFrom([1, 2, 3.5, 4, 5, 6, 7, 8], 3))
// console.log(nearnumFrom([1, 2, 3.5, 4, 5, 6, 7, 8], 3.3))
// console.log(nearnumFrom([1, 2, 3.5, 4, 5, 6, 7, 8], 3.5))
// console.log(nearnumFrom([1, 2, 3.5, 4, 5, 6, 7, 8], 3.7))
// console.log(nearnumFrom([1, 2, 3.5, 4, 5, 6, 7, 8], 4))
