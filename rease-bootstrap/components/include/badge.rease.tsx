import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import { VARIANTS_LIST } from '../../classnames/lib'

export function Badge(
  this: TypeReaseContext,
  {
    variant,
    text,
    textHidden,

    pill,
    squared,

    ...attrs
  } : {
    variant: TypeReaseProp<typeof VARIANTS_LIST[number]>

    text: TypeReaseProp<string>
    textHidden?: TypeReaseProp<string>

    pill?: TypeReaseProp<boolean>
    squared?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <span r-is={attrs.href!! && 'a'}
    {...attrs}
    class={[
      attrs.class!!,
      `badge bg-${variant!!}`,
      (pill!! || squared!!) && 'rounded-' + (pill!! ? 'pill' : '0')
    ]}
    r-use={this.use}
  >
    {text!!}
    <r-if r-is={textHidden!!}>
      <span class="visually-hidden">{textHidden!!}</span>
    </r-if>
  </span>
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="badge">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Badge</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/badge/">Documentation</a>
//     </div>

//     <div>
//       <div class="bd-example">
//         <p class="h1">Example heading <Badge class="text-light" href={'#'} variant={'primary'} text={'New'}/></p>
//         <p class="h2">Example heading <Badge pill variant={'success'} text={'New'}/></p>
//         <p class="h3">Example heading <Badge squared variant={'danger'} text={'New'}/></p>
//       </div>
      
//       <div class="bd-example">
//         <p class="h1">Example heading <span class="badge bg-primary">New</span></p>
//         <p class="h2">Example heading <span class="badge bg-secondary">New</span></p>
//         <p class="h3">Example heading <span class="badge bg-success">New</span></p>
//         <p class="h4">Example heading <span class="badge bg-danger">New</span></p>
//         <p class="h5">Example heading <span class="badge bg-warning text-dark">New</span></p>
//         <p class="h6">Example heading <span class="badge bg-info text-dark">New</span></p>
//         <p class="h6">Example heading <span class="badge bg-light text-dark">New</span></p>
//         <p class="h6">Example heading <span class="badge bg-dark">New</span></p>
//       </div>
//     </div>
//   </article>
// }
