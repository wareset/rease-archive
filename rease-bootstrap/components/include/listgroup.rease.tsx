import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import { VARIANTS_LIST } from '../../classnames/lib'

export function ListGroup(
  this: TypeReaseContext,
  {
    tag,

    flush,
    numbered,
    horizontal,

    small,
    large,

    ...attrs
  } : {
    tag?: TypeReaseProp<keyof HTMLElementTagNameMap>

    flush?: TypeReaseProp<boolean>
    numbered?: TypeReaseProp<boolean>
    horizontal?: TypeReaseProp<boolean>

    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <ul r-is={tag!!}
    {...attrs}
    class={[
      attrs.class!!,
      'list-group',
      horizontal!! && `list-group-horizontal${
        small!! || large!! ? '-' + small!! ? 'sm' : 'lg' : ''}`,
      numbered!! && 'list-group-numbered',
      flush!! && 'list-group-flush'
    ]}

    r-use={this.use}
  >
    <r-slot/>
  </ul>
}

export function ListGroupItem(
  this: TypeReaseContext,
  {
    tag,

    variant,
    active,
    disabled,
    action,
    
    ...attrs
  } : {
    tag?: TypeReaseProp<keyof HTMLElementTagNameMap>

    variant?: TypeReaseProp<typeof VARIANTS_LIST[number]>
    active?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>
    action?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <li r-is={attrs.href!! ? 'a' : tag!!}
    aria-current={active!!}
    {...attrs}
    class={[
      attrs.class!!,
      'list-group-item',
      variant!! && `list-group-item-${variant!!}`,
      action!! && 'list-group-item-action'
    ]}
    class-active={active!!}
    class-disabled={disabled!!}
    
    aria-disabled={disabled!!}

    r-use={this.use}
  >
    <r-slot/>
  </li>
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="list-group">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>List group</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/list-group/">Documentation</a>
//     </div>

//     <div>
//       <div class="bd-example">
        
//         <ListGroup numbered>
//           <ListGroupItem disabled>A disabled item</ListGroupItem>
//           <ListGroupItem active>A second item</ListGroupItem>
//           <ListGroupItem action>A third item</ListGroupItem>
//         </ListGroup>

//         <ListGroup horizontal>
//           <ListGroupItem disabled>A disabled item</ListGroupItem>
//           <ListGroupItem active>A second item</ListGroupItem>
//           <ListGroupItem action variant={'info'}>A third item</ListGroupItem>
//         </ListGroup>
      
//       </div>

//       <div class="bd-example">
//         <ul class="list-group">
//           <li class="list-group-item disabled" aria-disabled="true">A disabled item</li>
//           <li class="list-group-item">A second item</li>
//           <li class="list-group-item">A third item</li>
//           <li class="list-group-item">A fourth item</li>
//           <li class="list-group-item">And a fifth one</li>
//         </ul>
//       </div>

//       <div class="bd-example">
//         <ul class="list-group list-group-flush">
//           <li class="list-group-item">An item</li>
//           <li class="list-group-item">A second item</li>
//           <li class="list-group-item">A third item</li>
//           <li class="list-group-item">A fourth item</li>
//           <li class="list-group-item">And a fifth one</li>
//         </ul>
//       </div>

//       <div class="bd-example">
//         <div class="list-group">
//           <a href="#" class="list-group-item list-group-item-action">A simple default list group item</a>
          
//           <a href="#" class="list-group-item list-group-item-action list-group-item-primary">A simple primary list group item</a>
//           <a href="#" class="list-group-item list-group-item-action list-group-item-secondary">A simple secondary list group item</a>
//           <a href="#" class="list-group-item list-group-item-action list-group-item-success">A simple success list group item</a>
//           <a href="#" class="list-group-item list-group-item-action list-group-item-danger">A simple danger list group item</a>
//           <a href="#" class="list-group-item list-group-item-action list-group-item-warning">A simple warning list group item</a>
//           <a href="#" class="list-group-item list-group-item-action list-group-item-info">A simple info list group item</a>
//           <a href="#" class="list-group-item list-group-item-action list-group-item-light">A simple light list group item</a>
//           <a href="#" class="list-group-item list-group-item-action list-group-item-dark">A simple dark list group item</a>
//         </div>
//       </div>
//     </div>
//   </article>
// }
