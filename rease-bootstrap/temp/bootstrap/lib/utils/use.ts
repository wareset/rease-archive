import { TypeReaseContext, TypeReaseUse } from 'rease'
import { TypeReaseContextElement, ReaseStore } from 'rease'
import { listenGlobal } from 'rease'

export const useGetNodeBeforeCreated = (
  storeForNode: ReaseStore<any>
) => (ctx: TypeReaseContext) =>
  (storeForNode.$ = ctx.node,
  { destroy: (): void => { storeForNode.$ = null } })

export const useGetNodeAfterCreated = (
  storeForNode: ReaseStore<any>
): TypeReaseUse => () => ({
  created: (ctx): void => { storeForNode.$ = ctx.node },
  destroy: (): void => { storeForNode.$ = null },
})

export const useOnPan = <C extends readonly [] | {} | undefined = undefined>(
  cb: (pan: {
    event: PointerEvent
    type: 'start' | 'move' | 'end'
    delta: { x: number, y: number }
    offset: { x: number, y: number }
    detail: C
  }, ctx: TypeReaseContextElement) => void,
  detail?: C
): TypeReaseUse => (ctx) => {
    const node = ctx.node as HTMLElement
    const context = { ctx, is: false, dx: 0, dy: 0, ox: 0, oy: 0 }
    const unlisteners = [
      listenGlobal(node, 'pointerdown', (e: PointerEvent, c) => {
        c.is = true
        c.ox = c.oy = 0
        c.dx = e.clientX, c.dy = e.clientY
        cb({
          type  : 'start',
          event : e,
          detail: detail!,
          delta : { x: 0, y: 0 },
          offset: { x: 0, y: 0 }
        }, c.ctx)
      }, context),
      listenGlobal(document, 'pointermove', (e: PointerEvent, c) => {
        if (c.is) {
          const cx = e.clientX, cy = e.clientY
          const dx = cx - c.dx, dy = cy - c.dy
          c.ox += dx, c.oy += dy
          cb({
            type  : 'move',
            event : e,
            detail: detail!,
            delta : { x: dx, y: dy },
            offset: { x: c.ox, y: c.oy }
          }, c.ctx)
          c.dx = cx, c.dy = cy
        }
      }, context),
      listenGlobal(document, 'pointerup', (e: PointerEvent, c) => {
        if (c.is) {
          c.is = false
          cb({
            type  : 'end',
            event : e,
            detail: detail!,
            delta : { x: 0, y: 0 },
            offset: { x: c.ox, y: c.oy }
          }, c.ctx)
        }
      }, context)
    ]

    return (): void => { for (let i = unlisteners.length; i--;) unlisteners[i]() }
  }
