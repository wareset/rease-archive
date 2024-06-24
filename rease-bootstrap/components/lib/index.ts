import { TypeReaseContext, TypeUnsubscriber, TypeReaseSubject } from 'rease'
import { subscribeSafe } from 'rease'

export const { random } = Math

export const random_string = (): string => {
  const res = random().toString(36).slice(2)
  return res.length < 5 ? random_string() : ('b' + res + res).slice(0, 10)
}

export const noop = ((): void => {}) as (...a: any) => any

export const reflow = (element: HTMLElement): any => element.offsetHeight

export const getHighComponent = (ctx: TypeReaseContext, Cmp: Function): TypeReaseContext => {
  do { ctx = ctx.high } while (ctx.is !== Cmp)
  return ctx
}

export const onewayBindPropSafe = (
  prop$$: any, store$: TypeReaseSubject<any>
): TypeUnsubscriber =>
  subscribeSafe(prop$$, (v, [store$]) => { store$.$ = v }, [store$])

// export const setSafe = (some$$: any, value: any): void => {
//   if (some$$ != null && typeof some$$.set == 'function') some$$.set(value)
// }
  
// export const bindPropSafe = (
//   prop$$: any, store$: ReaseSubject<any>
// ): TypeUnsubscriber => {
//   const isStart: [boolean] = [false]
//   const unsubs = [
//     subscribe(store$, (v, [isStart, prop$$]) => {
//       isStart[0] && setSafe(prop$$, v)
//     }, [isStart, prop$$]),
//     subscribeSafe(prop$$, (v, [isStart, store$]) => {
//       store$.$ = v, isStart[0] = true
//     }, [isStart, store$])
//   ] as const
//   return () => { unsubs[0](), unsubs[1]() }
// }
