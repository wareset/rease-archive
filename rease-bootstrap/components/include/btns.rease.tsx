import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import type { Optional } from 'utility-types'

import { random_string } from '../lib'
import { VARIANTS_LIST, DARK_AND_LIGHT_LIST } from '../../classnames/lib'

export function Button(
  this: TypeReaseContext,
  {
    variant,

    tag,
    type,

    link,
    outline,

    small,
    large,

    pill,
    squared,

    disabled,
    active,

    ...attrs
  } : {
    variant?: TypeReaseProp<'link' | typeof VARIANTS_LIST[number] | typeof DARK_AND_LIGHT_LIST[number]>
    
    tag?: TypeReaseProp<keyof HTMLElementTagNameMap>
    type? : TypeReaseProp<'button' | 'submit' | 'reset'>

    link?: TypeReaseProp<boolean>
    outline?: TypeReaseProp<boolean>

    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    pill?: TypeReaseProp<boolean>
    squared?: TypeReaseProp<boolean>

    disabled?: TypeReaseProp<boolean>
    active?: TypeReaseProp<boolean>

    [key: string]: any
  } & Optional<HTMLButtonElement> & Optional<HTMLLinkElement>
): void {
  <button r-is={attrs.href!! ? 'a' : tag!!}
    {...attrs}
    class={[
      attrs.class!!,
      'btn',
      (link!! || variant!!) &&
        'btn-' + (link!! ? 'link' : (outline!! ? 'outline-' : '') + variant!!),
      (pill!! || squared!!) && 'rounded-' + (pill!! ? 'pill' : '0'),
      (small!! || large!!) && `btn-${small!! ? 'sm' : 'lg'}`
    ]}
    class-disabled={disabled!!}
    class-active={active!!}

    aria-disabled={disabled!!}
    disabled={disabled!!}
    type={type!! || 'button'}
    role={attrs.role!! || type!! || 'button'}
    r-use={this.use}
  >
    <r-slot/>
  </button>
}

export function ButtonClose(
  this: TypeReaseContext,
  {
    white,
    disabled,

    ...attrs
  } : {
    white?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>

    [key: string]: any
  } & Optional<HTMLButtonElement>
): void {
  <button
    aria-label="Close"
    {...attrs}
    class={[
      attrs.class!!,
      'btn-close',
      white!! && 'btn-close-white'
    ]}
    class-disabled={disabled!!}
    aria-disabled={disabled!!}
    disabled={disabled!!}
    r-use={this.use}
  />
}

export function ButtonCheck(
  this: TypeReaseContext,
  {
    type,
    name,
    checked,
    disabled,

    ...attrs
  } : {
    type: TypeReaseProp<'checkbox' | 'radio'>
    name?: TypeReaseProp<string>
    checked?: TypeReaseProp<boolean | null | undefined>
    disabled?: TypeReaseProp<boolean>

    [key: string]: any
  } & Optional<HTMLLabelElement>
): void {
  const id = random_string()
  ;(
    <input
      id={id}
      class="btn-check"
      type={type}
      name={name}
      checked={checked}
      disabled={disabled}
      autocomplete="off"
      r-use={this.use}
    />
  )
  ;(
    <Button {...attrs} tag="label" for={id}>
      <r-slot />
    </Button>
  )
}

export function ButtonGroup(
  this: TypeReaseContext,
  {
    vertical,

    small,
    large,

    ...attrs
  } : {
    vertical?: TypeReaseProp<boolean>

    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <div
    role={'group'}
    {...attrs}
    class={[
      attrs.class!!,
      'btn-group',
      (small!! || large!!) && `btn-group-${small!! ? 'sm' : 'lg'}`,
      vertical!! && 'btn-group-vertical'
    ]}
    r-use={this.use}
  >
    <r-slot/>
    <r-slot r-is="dropdown-menu"/>
  </div>
}

export function ButtonToolbar(
  this: TypeReaseContext,
  { ...attrs } : {
    class?: TypeReaseProp<string>
    [key: string]: any
  }
): void {
  <div
    role={'toolbar'}
    {...attrs}
    class={[attrs.class!!, 'btn-toolbar']}
    r-use={this.use}
  >
    <r-slot/>
  </div>
}
