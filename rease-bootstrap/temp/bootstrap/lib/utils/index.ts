import { TypeReaseContext, TypeUnsubscriber, ReaseStore } from 'rease'
import { subscribe, subscribeSafe } from 'rease'

import { random } from './math'

export const noop = ((): void => {}) as (...a: any) => any

export const random_number = random
export const random_string = (): string => 's' + random_number().toString(36).slice(2, 8)

// export const listen = (
//   E: Element, type: string, listener: EventListener | EventListener[], options?: boolean | AddEventListenerOptions
// ): (() => void) => {
//   listener = Array.isArray(listener) ? [...listener] : [listener]
//   const wrapper = (e: any): void => { for (let i = 0; i < listener.length; i++) listener[i](e) }
//   E.addEventListener(type, wrapper, options)
//   return () => { E.removeEventListener(type, wrapper, options) }
// }

export const getHighComponent = (ctx: TypeReaseContext, Cmp: Function): TypeReaseContext => {
  do { ctx = ctx.high } while (ctx.is !== Cmp)
  return ctx
}

export const reflow = (element: HTMLElement): any => element.offsetHeight

export const setSafe = (some$$: any, value: any): void => {
  if (some$$ != null && typeof some$$.set == 'function') some$$.set(value)
}

export const bindPropSafe = (
  prop$$: any, store$: ReaseStore<any>
): TypeUnsubscriber => {
  const isStart: [boolean] = [false]
  const unsubs = [
    subscribe(store$, (v, [isStart, prop$$]) => {
      isStart[0] && setSafe(prop$$, v)
    }, [isStart, prop$$]),
    subscribeSafe(prop$$, (v, [isStart, store$]) => {
      store$.$ = v, isStart[0] = true
    }, [isStart, store$])
  ] as const
  return () => { unsubs[0](), unsubs[1]() }
}
