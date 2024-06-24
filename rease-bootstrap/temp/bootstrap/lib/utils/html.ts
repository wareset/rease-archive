export const dataset = (
  E: HTMLElement | SVGElement, key: string, value?: null | string | boolean | number
): void => {
  if (value == null || !(value += '')) E.removeAttribute('data-' + key)
  else E.setAttribute('data-' + key, value as string)
}

export const dataget = (
  E: HTMLElement | SVGElement, key: string
): null | string | boolean | number => {
  let v = E.getAttribute('data-' + key) as any
  if (v) {
    if (v === 'true' || v === 'false') v = v === 'true'
    else if (v === '' + +v) v = +v
  }
  return v
}

export const datahas = (
  E: HTMLElement | SVGElement, key: string
): boolean => E.hasAttribute('data-' + key)
