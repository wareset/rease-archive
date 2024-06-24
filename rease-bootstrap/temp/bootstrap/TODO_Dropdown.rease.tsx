import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'
// import { store, onDestroy } from 'rease'

// import { ButtonClose } from '../components/Button.rease'

import { SIZES } from '../constants'
export { VARIANTS, SIZES } from '../constants'

export const DROPDOWN = 'dropdown'
export const DROPDOWN_MENU = DROPDOWN + '-menu'
export const DROPDOWN_TOGGLE = DROPDOWN + '-toggle'
export const DROPDOWN_TOGGLE_SPLIT = DROPDOWN_TOGGLE + '-split'
export const DROPDOWN_DROP = {
  UP   : 'dropup',
  END  : 'dropend',
  START: 'dropstart'
} as const

export function Dropdown(
  this: TypeReaseContext,
  { ...attrs } : {
    class?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <div
    {...attrs}
    class={[attrs.class!!, DROPDOWN]}

    r-use={this.use}
  >
    <r-slot/>
    <r-slot r-is="dropdown-menu"/>
  </div>
}

export function DropdownMenu(
  this: TypeReaseContext,
  {
    tag,

    dark,
    align,
    alignSize,

    ...attrs
  } : {
    'r-slot': 'dropdown-menu'
    tag?: TypeReaseProp<string>

    dark?: TypeReaseProp<boolean>
    align?: TypeReaseProp<'end' | 'start'>
    alignSize?: TypeReaseProp<typeof SIZES[keyof typeof SIZES]>

    autoClose?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <ul r-is={tag!!}
    {...attrs}
    class={[
      attrs.class!!,
      DROPDOWN_MENU,
      dark!! && `${DROPDOWN_MENU}-dark`,
      align!! && `${DROPDOWN_MENU}${alignSize!! ? `-${alignSize!!}` : ''}-${align!!}`
    ]}
    aria-labelledby="dropdownMenuButton1"

    r-use={this.use}
  >
    <r-slot/>
  </ul>
}

export function DropdownDivider(
  this: TypeReaseContext,
): void { <li><hr class={`${DROPDOWN}-divider`}/></li> }

export function DropdownHeader(
  this: TypeReaseContext,
  {
    tag,

    ...attrs
  } : {
    tag?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <li>
    <h4 r-is={tag!!}
      {...attrs}
      class={`${
        attrs.class!! ? attrs.class!! + ' ' : ''
      }${
        `${DROPDOWN}-header`
      }`}

      r-use={this.use}
    >
      <r-slot/>
    </h4>
  </li>
}

export function DropdownItem(
  this: TypeReaseContext,
  {
    isText,

    active,
    disabled,

    ...attrs
  } : {
    href?: TypeReaseProp<string>
    isText?: TypeReaseProp<boolean>

    active?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <li>
    <span r-is={attrs.href!! && 'a'}
      aria-current={active!!}
      {...attrs}
      class={`${
        attrs.class!! ? attrs.class!! + ' ' : ''
      }${
        `${DROPDOWN}-item${isText!! ? '-text' : ''}`
      }${
          active!! ? ' active' : ''
      }${
        disabled!! ? ' disabled' : ''
      }`}

      r-use={this.use}
    >
      <r-slot/>
    </span>
  </li>
}

export const Cheatsheet = (): void => {
  <div class="dropdown dropend">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown button
    </button>
    <ul class="dropdown-menu show" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
  </div>
}
