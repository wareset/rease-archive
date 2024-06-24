import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

import { VARIANTS_LIST } from '../../classnames/lib'

export function Progress(
  this: TypeReaseContext,
  { ...attrs } : {
    [key: string]: any
  }
): void {
  <div
    {...attrs}
    class={[attrs.class!!, 'progress']}
    r-use={this.use}
  >
    <r-slot/>
  </div>
}

export function ProgressBar(
  this: TypeReaseContext,
  {
    variant,

    striped,
    animated,

    now,

    ...attrs
  } : {
    variant?: TypeReaseProp<typeof VARIANTS_LIST[number]>

    striped?: TypeReaseProp<boolean>
    animated?: TypeReaseProp<boolean>

    min?: TypeReaseProp<number>
    max?: TypeReaseProp<number>
    now: TypeReaseProp<number>

    small?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <div
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    {...attrs}
    class={[
      attrs.class!!,
      'progress-bar',
      variant!! && `bg-${variant!!}`,
      striped!! && 'progress-bar-striped',
      animated!! && 'progress-bar-animated'
    ]}
    
    aria-valuenow={now!!}
    style-width={`${now!!}%`}

    r-use={this.use}
  >
    <r-slot/>
  </div>
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="progress">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Progress</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/progress/">Documentation</a>
//     </div>

//     <div>
      
//       <div class="bd-example">
//         <Progress>
//           <ProgressBar now={15}/>
//           <ProgressBar now={55} variant={'info'} striped animated>55</ProgressBar>
//         </Progress>
//       </div>

//       <div class="bd-example">
//         <div class="progress mb-3">
//           <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
//         </div>
//         <div class="progress mb-3">
//           <div class="progress-bar bg-success w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
//         </div>
//         <div class="progress mb-3">
//           <div class="progress-bar bg-info text-dark w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
//         </div>
//         <div class="progress mb-3">
//           <div class="progress-bar bg-warning text-dark w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>
//         </div>
//         <div class="progress">
//           <div class="progress-bar bg-danger w-100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>
//         </div>
//       </div>

//       <div class="bd-example">
//         <div class="progress">
//           <div class="progress-bar" role="progressbar" style="width: 15%" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
//           <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
//         </div>
//       </div>
//     </div>
//   </article>
// }
