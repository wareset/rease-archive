import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import { VARIANTS_LIST } from '../../classnames/lib'

export function Spinner(
  this: TypeReaseContext,
  {
    variant,
    label,
    grow,

    small,
    size,

    ...attrs
  } : {
    variant?: TypeReaseProp<typeof VARIANTS_LIST[number]>

    label?: TypeReaseProp<string>
    grow?: TypeReaseProp<boolean>

    small?: TypeReaseProp<boolean>
    size?: TypeReaseProp<number>

    [key: string]: any
  }
): void {
  <span
    role="status"
    {...attrs}
    class={[
      attrs.class!!,
      `spinner-${grow!! ? 'grow' : 'border'}`,
      `text-${variant!!}`,
      small!! && `spinner-${grow!! ? 'grow' : 'border'}-sm`
    ]}
    style-width={+size!! ? `${+size!!}rem` : null}
    style-height={+size!! ? `${+size!!}rem` : null}

    r-use={this.use}
  >
    <r-if r-is={label!!}>
      <span class="visually-hidden">{label!!}</span>
    </r-if>
  </span>
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="spinners">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Spinners</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/spinners/">Documentation</a>
//     </div>

//     <div>
//       <div class="bd-example">
//         <Spinner variant={'primary'}/>
//         <Spinner grow variant={'primary'}/>
//         <Spinner small variant={'primary'}/>
//         <Spinner small grow variant={'primary'}/>
//         <Spinner style="width:3rem;height:3rem;" variant={'primary'}/>
//       </div>

//       <div class="bd-example">
        
//         <div class="spinner-border text-primary" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-secondary" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-success" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-danger" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-warning" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-info" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-light" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-border text-dark" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//       </div>

//       <div class="bd-example">
        
//         <div class="spinner-grow text-primary" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-grow text-secondary" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-grow text-success" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-grow text-danger" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-grow text-warning" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-grow text-info" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-grow text-light" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//         <div class="spinner-grow text-dark" role="status">
//           <span class="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     </div>
//   </article>
// }
