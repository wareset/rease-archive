import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

export function InputGroup(
  this: TypeReaseContext,
  {
    small,
    large,

    ...attrs
  } : {
    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    class?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <div
    {...attrs}
    class={[
      attrs.class!!,
      'input-group',
      (small!! || large!!) && `input-group-${small!! ? 'sm' : 'lg'}`
    ]}
    r-use={this.use}
  >
    <r-slot/>
  </div>
}

export function InputGroupText(
  this: TypeReaseContext,
  {
    tag,
 
    ...attrs
  } : {
    tag?: TypeReaseProp<string>
    class?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <span r-is={attrs.href!! ? 'a' : tag!!}
    {...attrs}
    class={[
      attrs.class!!,
      'input-group-text',
    ]}
    r-use={this.use}
  >
    <r-slot/>
  </span>
}
