import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import type { Optional } from 'utility-types'

import { random_string, noop } from '../lib'

const _label = (
  id: string, label: any,
  floating: any
): void => {
  <r-if r-is={!floating!! && label!!}>
    <label for={id} class="form-label">{label!!}</label>
  </r-if>
}

const _labelFloatingOrFeedback = (
  id: string, id_err: string, label: any,
  invalid:any, invalidMsg: any, validMsg: any,
  floating: any
): void => {
  (
    <r-if r-is={floating!!}>
      <label for={id}>
        {label!!} <r-if r-is={invalid!! != null}>
          <span id={id_err} class={invalid!! ? 'text-danger' : 'text-success'}>
            {invalid!! ? invalidMsg!! : validMsg!!}
          </span>
        </r-if>
      </label>
    </r-if>
  )
  ;(
    <r-else-if r-is={invalid!! != null}>
      <div id={id_err} class={`${invalid!! ? 'in' : ''}valid-feedback`}>
        {invalid!! ? invalidMsg!! : validMsg!!}
      </div>
    </r-else-if>
  )
}

const _isInvalid = (invalid: any): any =>
  invalid != null && `is-${invalid ? 'in' : ''}valid`
const _isFloating = (floating: any): any =>
  floating && 'form-floating'

const _fcClass = (
  small: any, large: any, invalid: any, type: any
): any => [
  'form-control',
  (small || large) && `form-control-${small ? 'sm' : 'lg'}`,
  type === 'color' && 'form-control-color',
  _isInvalid(invalid)
]

const _onChangeValue = (fn?: Function): any => !fn ? noop : (e: any) => fn(e.target.value)
  
/**
 *
 * FormRange
 * 
 */
export function FormRange(
  this: TypeReaseContext,
  {
    label,

    ...attrs
  } : {
    label?: TypeReaseProp<string>

    [key: string]: any
  } & Optional<HTMLInputElement>
): void {
  const id = random_string()

  ;(
    <div class={attrs.class!!}>
      {_label(id, label, false)}
      <input
        {...attrs}
        type="range"
        id={id}
        class="form-range"
        r-use={this.use}
      />
    </div>
  )
}

/**
 * 
 * FormCheck
 * FormRadio
 * FormSwitch
 * 
 */
const _check = (
  type: 'checkbox' | 'radio',
  self: any, attrs: any, inline: any, reverse: any,
  invalid: any, invalidMsg: any, validMsg: any,
  onChange?: Function,
  isSwitch?: boolean
): void => {
  const id = random_string()
  const id_err = random_string()
  const isLabel = self.slots.length
  
  ;(
    <div class={[
    attrs.class!!,
    isLabel && 'form-check',
    isSwitch && 'form-switch',
    inline!! && 'form-check-inline',
    reverse!! && 'form-check-reverse'
    ]}>
      <input
        {...attrs}
        id={id}
        class={['form-check-input', _isInvalid(invalid!!)]}
        type={type!!}
        indeterminate={attrs.checked!! == null}
        aria-errormessage={id_err}
        aria-invalid={invalid!!}
        r-on-change={!onChange ? noop : (e: any) => { onChange(!!e.target.checked) }}
        r-use={self.use}
      />
      {isLabel ? <label class="form-check-label" for={id}><r-slot/></label> : ''}
      {_labelFloatingOrFeedback(id, id_err, '', invalid, invalidMsg, validMsg, false)}
    </div>
  )
}

export function FormCheck(
  this: TypeReaseContext,
  {
    inline,
    reverse,

    invalid,
    invalidMsg,
    validMsg,

    onChange,
    
    ...attrs
  } : {
    checked?: TypeReaseProp<boolean | null | undefined>
    disabled?: TypeReaseProp<boolean>
    required?: TypeReaseProp<boolean>

    inline?: TypeReaseProp<boolean>
    reverse?: TypeReaseProp<boolean>

    invalid?: TypeReaseProp<boolean | null | undefined>
    invalidMsg?: TypeReaseProp<string>
    validMsg?: TypeReaseProp<string>

    onChange?: (value: boolean) => void

    [key: string]: any
  }
): void {
  _check(
    'checkbox', this, attrs, inline, reverse, invalid, invalidMsg, validMsg, onChange
  )
}

export function FormRadio(
  this: TypeReaseContext,
  {
    inline,
    reverse,

    invalid,
    invalidMsg,
    validMsg,

    onChange,

    ...attrs
  } : {
    checked?: TypeReaseProp<boolean | null | undefined>
    disabled?: TypeReaseProp<boolean>
    required?: TypeReaseProp<boolean>
    
    inline?: TypeReaseProp<boolean>
    reverse?: TypeReaseProp<boolean>

    invalid?: TypeReaseProp<boolean | null | undefined>
    invalidMsg?: TypeReaseProp<string>
    validMsg?: TypeReaseProp<string>

    onChange?: (value: boolean) => void

    [key: string]: any
  }
): void {
  _check(
    'radio', this, attrs, inline, reverse, invalid, invalidMsg, validMsg, onChange
  )
}

export function FormSwitch(
  this: TypeReaseContext,
  {
    inline,
    reverse,

    invalid,
    invalidMsg,
    validMsg,

    onChange,
        
    ...attrs
  } : {
    checked?: TypeReaseProp<boolean | null | undefined>
    disabled?: TypeReaseProp<boolean>
    required?: TypeReaseProp<boolean>

    inline?: TypeReaseProp<boolean>
    reverse?: TypeReaseProp<boolean>

    invalid?: TypeReaseProp<boolean | null | undefined>
    invalidMsg?: TypeReaseProp<string>
    validMsg?: TypeReaseProp<string>

    onChange?: (value: boolean) => void

    [key: string]: any
  }
): void {
  _check(
    'checkbox', this, attrs, inline, reverse, invalid, invalidMsg, validMsg, onChange, true
  )
}

/**
 * 
 * FormSelect
 * 
 */
export function FormSelect(
  this: TypeReaseContext,
  {
    label,
    floating,

    small,
    large,

    invalid,
    invalidMsg,
    validMsg,
    
    ...attrs
  } : {
    label?: TypeReaseProp<string>
    floating?: TypeReaseProp<boolean>

    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    invalid?: TypeReaseProp<boolean | null | undefined>
    invalidMsg?: TypeReaseProp<string>
    validMsg?: TypeReaseProp<string>

    readonly?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>
    required?: TypeReaseProp<boolean>

    // TODO: onSelect

    [key: string]: any
  } & Optional<HTMLSelectElement>
): void {
  const id = random_string()
  const id_err = random_string()

  ;(
    <div class={[
    attrs.class!!,
    _isFloating(floating!!)
    ]}>
      {_label(id, label, floating)}
      <select
        {...attrs}
        id={id}
        class={[
          'form-select',
          (small!! || large!!) && `form-select-${small!! ? 'sm' : 'lg'}`,
          _isInvalid(invalid!!)
        ]}
        aria-errormessage={id_err}
        aria-invalid={invalid!!}
        r-use={this.use}
      >
        <r-slot />
      </select>
      {_labelFloatingOrFeedback(id, id_err, label, invalid, invalidMsg, validMsg, floating)}
    </div>
  )
}

/**
 * 
 * FormInput
 * 
 */
export function FormInput(
  this: TypeReaseContext,
  {
    label,
    floating,

    small,
    large,

    invalid,
    invalidMsg,
    validMsg,

    onInput,
    onChange,

    ...attrs
  } : {
    label?: TypeReaseProp<string>
    floating?: TypeReaseProp<boolean>

    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    invalid?: TypeReaseProp<boolean | null | undefined>
    invalidMsg?: TypeReaseProp<string>
    validMsg?: TypeReaseProp<string>

    readonly?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>
    required?: TypeReaseProp<boolean>

    onInput?: (value: string) => void
    onChange?: (value: string) => void

    [key: string]: any
  } & Optional<HTMLInputElement>
): void {
  const id = random_string()
  const id_err = random_string()

  ;(
    <div class={[
    attrs.class!!,
    _isFloating(floating!!)
    ]}>
      {_label(id, label, floating)}
      <input
        placeholder=" "
        {...attrs}
        id={id}
        class={_fcClass(small!!, large!!, invalid!!, attrs.type!!)}
        aria-errormessage={id_err}
        aria-invalid={invalid!!}
        r-on-input={_onChangeValue(onInput)}
        r-on-chnge={_onChangeValue(onChange)}
        r-use={this.use}
      />
      {_labelFloatingOrFeedback(id, id_err, label, invalid, invalidMsg, validMsg, floating)}
    </div>
  )
}

/**
 * 
 * FormTextarea
 * 
 */
export function FormTextarea(
  this: TypeReaseContext,
  {
    label,
    floating,

    small,
    large,

    invalid,
    invalidMsg,
    validMsg,

    onInput,
    onChange,
    
    ...attrs
  } : {
    label?: TypeReaseProp<string>
    floating?: TypeReaseProp<boolean>

    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    invalid?: TypeReaseProp<boolean | null | undefined>
    invalidMsg?: TypeReaseProp<string>
    validMsg?: TypeReaseProp<string>

    readonly?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>
    required?: TypeReaseProp<boolean>

    onInput?: (value: string) => void
    onChange?: (value: string) => void

    [key: string]: any
  } & Optional<HTMLTextAreaElement>
): void {
  const id = random_string()
  const id_err = random_string()

  ;(
    <div class={[
    attrs.class!!,
    _isFloating(floating!!)
    ]}>
      {_label(id, label, floating)}
      <textarea
        placeholder=" "
        {...attrs}
        id={id}
        class={_fcClass(small!!, large!!, invalid!!, attrs.type!!)}
        aria-errormessage={id_err}
        aria-invalid={invalid!!}
        r-on-input={_onChangeValue(onInput)}
        r-on-chnge={_onChangeValue(onChange)}
        r-use={this.use}
      />
      {_labelFloatingOrFeedback(id, id_err, label, invalid, invalidMsg, validMsg, floating)}
    </div>
  )
}
