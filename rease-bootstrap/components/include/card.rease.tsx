import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import type { Optional } from 'utility-types'

export function Card(
  this: TypeReaseContext,
  { ...attrs } : {
    [key: string]: any
  }
): void {
  <div
    {...attrs}
    class={[attrs.class!!, 'card']}
    r-use={this.use}
  >
    <r-slot/>
  </div>
}
export function CardHeader(
  this: TypeReaseContext,
  { ...attrs } : {
    [key: string]: any
  }
): void {
  <div
    {...attrs}
    class={[attrs.class!!, 'card-header']}
    r-use={this.use}
  >
    <r-slot/>
  </div>
}
export function CardBody(
  this: TypeReaseContext,
  { ...attrs } : {
    [key: string]: any
  }
): void {
  <div
    {...attrs}
    class={[attrs.class!!, 'card-body']}
    r-use={this.use}
  >
    <r-slot/>
  </div>
}
export function CardFooter(
  this: TypeReaseContext,
  { ...attrs } : {
    [key: string]: any
  }
): void {
  <div
    {...attrs}
    class={[attrs.class!!, 'card-footer']}
    r-use={this.use}
  >
    <r-slot/>
  </div>
}

export function CardImg(
  this: TypeReaseContext,
  {
    top,
    bottom,
    
    ...attrs
  } : {
    src: TypeReaseProp<string>
    alt?: TypeReaseProp<string>

    top?: TypeReaseProp<boolean>
    bottom?: TypeReaseProp<boolean>

    [key: string]: any
  } & Optional<HTMLImageElement>
): void {
  <img
    {...attrs}
    class={[
      attrs.class!!,
      'card-img' + (top!! || bottom!! ? top ? '-top' : '-bottom' : '')
    ]}
    alt={attrs.alt!! || ''}
    r-use={this.use}
  />
}

export function CardTitle(
  this: TypeReaseContext,
  {
    tag,
    
    ...attrs
  } : {
    tag?: TypeReaseProp<keyof HTMLElementTagNameMap>

    [key: string]: any
  }
): void {
  <h5 r-is={attrs.href!! ? 'a' : tag!!}
    {...attrs}
    class={[attrs.class!!, 'card-title']}
    r-use={this.use}
  >
    <r-slot/>
  </h5>
}

export function CardText(
  this: TypeReaseContext,
  {
    tag,
    
    ...attrs
  } : {
    tag?: TypeReaseProp<keyof HTMLElementTagNameMap>

    [key: string]: any
  }
): void {
  <p r-is={attrs.href!! ? 'a' : tag!!}
    {...attrs}
    class={[attrs.class!!, 'card-text']}
    r-use={this.use}
  >
    <r-slot/>
  </p>
}

export function CardLink(
  this: TypeReaseContext,
  { ...attrs } : {
    [key: string]: any
  }
): void {
  <span r-is={attrs.href!! && 'a'}
    {...attrs}
    class={[attrs.class!!, 'card-link']}
    r-use={this.use}
  >
    <r-slot/>
  </span>
}
