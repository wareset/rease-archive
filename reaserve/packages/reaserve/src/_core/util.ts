const create = Object.create
export const ceateObject = (): {} => create(null)

export const isArray = Array.isArray

export const noop = (() => {}) as ((..._a: any[]) => any)
