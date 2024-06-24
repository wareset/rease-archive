import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import { TypeIconName } from '../types/icons'

export function Icon(
  this: TypeReaseContext,
  {
    name,

    ...attrs
  } : {
    name: TypeIconName | TypeReaseProp<string>

    class?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <i
    aria-label={name!!}
    role="img"
    {...attrs}
    class={[attrs.class!!, `bi-${name!!}`]}
  />
}
