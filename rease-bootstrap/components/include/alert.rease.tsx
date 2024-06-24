import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'
import { subject, onDestroy } from 'rease'

// import { ButtonClose } from '../components/Button.rease'

import { VARIANTS_LIST } from '../../classnames/lib'
import { onewayBindPropSafe } from '../lib'
// import { VARIANTS } from './lib/constants'
// export { VARIANTS } from './lib/constants'

// const ALERT = 'alert'

export function AlertLink(
  this: TypeReaseContext,
  { ...attrs } : {
    href?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <span r-is={attrs.href!! && 'a'}
    {...attrs}
    class={[attrs.class!!, 'alert-link']}
    r-use={this.use}
  >
    <r-slot/>
  </span>
}

export function AlertHeading(
  this: TypeReaseContext,
  {
    tag,

    ...attrs
  } : {
    tag?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <h4 r-is={tag!!}
    {...attrs}
    class={[attrs.class!!, 'alert-heading']}
    r-use={this.use}
  >
    <r-slot/>
  </h4>
}

export function Alert(
  this: TypeReaseContext,
  {
    variant,

    dismissible,
    timer,
    show,

    ...attrs
  } : {
    variant: TypeReaseProp<typeof VARIANTS_LIST[number]>
    dismissible?: TypeReaseProp<boolean>
    timer?: TypeReaseProp<number>
    show?: TypeReaseProp<boolean>
    fade?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  const show$ = subject<boolean>(false)
  onewayBindPropSafe(show, show$)

  ;(
    <r-if r-is={show$!!} r-children={(): void => {
      const showFade$ = subject<boolean>(false)
      setTimeout(() => { showFade$.$ = true }, 25)

      const onClose = (): void => {
        showFade$.$ && (showFade$.$ = false, setTimeout(() => { show$.$ && (show$.$ = false) }, 250))
      }

    ;(
        <div
          role={'alert'}
          {...attrs}
          class={[
            attrs.class!!,
            `alert alert-${variant!!} fade position-relative`,
            dismissible!! && 'alert-dismissible'
          ]}
          class-show={showFade$!!}
          r-use={this.use}
        >
          <r-slot/>

          <r-if r-is={dismissible!!}>
            {/* <ButtonClose r-use={[useListen('click', onClose)]} /> */}
            <button type="button" class="btn-close" aria-label="Close"
              r-on-click-once={onClose}
            />
          </r-if>
          <r-watch r-is={timer!!} r-children={(timer: number): void => {
            (<r-if r-is={timer > 0} r-children={(): void => {
              const timer$ = subject(timer)
              const clearCSI = (): void => { clearInterval(csi) }
              
              const csi = setInterval(() => {
                if (timer$.$ > 0) timer$.$ -= 0.25
                else clearCSI(), onClose()
              }, 250)

              onDestroy(clearCSI)
                
              ;(<div
                class="progress position-absolute w-100"
                style="height:5px;left:0;bottom:0"
              >
                <div
                  role="progressbar"
                  aria-valuemin="0" aria-valuemax={timer} aria-valuenow={timer$!!}
                  class={`progress-bar bg-${variant!!}`}
                  style-width={`${timer$!! / timer * 100}%`}
                />
              </div>)
            }}/>)
          }}/>

        </div>
      )
    }}/>
  )
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="alerts">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Alerts</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/alerts/">Documentation</a>
//     </div>

//     <div>
//       <div class="bd-example">
//         <Alert variant={'primary'} show>
//           <AlertHeading>Heading</AlertHeading>
//           AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.
//         A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//         </Alert>

//         <Alert variant={'secondary'} dismissible show>
//           AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.
//         A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//         </Alert>

//         <Alert variant={'danger'} dismissible show timer={25}>
//           AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.
//         A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//         </Alert>

//         <div role="alert" aria-live="polite" aria-atomic="true" class="alert alert-dismissible alert-warning">
//           <p>This alert will dismiss after 4 seconds...</p>
//           <div class="progress" style="height: 4px;">
//             <div role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="4" class="progress-bar bg-warning" style="width: 40%;">
//             </div>
//           </div>
//         </div>

//         <div class="alert alert-success alert-dismissible fade show position-relative" role="alert">
//           A simple success alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//           <div class="progress position-absolute w-100" style="height:5px;left:0;bottom:0">
//             <div role="progressbar" aria-valuemin="0" aria-valuemax="10" aria-valuenow="4" class="progress-bar bg-success" style="width: 40%;">
//             </div>
//           </div>
//         </div>
//         <div class="alert alert-danger alert-dismissible fade show" role="alert">
//           A simple danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         </div>
//         <div class="alert alert-warning alert-dismissible fade show" role="alert">
//           A simple warning alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         </div>
//         <div class="alert alert-info alert-dismissible fade show" role="alert">
//           A simple info alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         </div>
//         <div class="alert alert-light alert-dismissible fade show" role="alert">
//           A simple light alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         </div>
//         <div class="alert alert-dark alert-dismissible fade show" role="alert">
//           A simple dark alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
//           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         </div>
//       </div>

//       <div class="bd-example">
//         <div class="alert alert-success" role="alert">
//           <h4 class="alert-heading">Well done!</h4>
//           <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
//           <hr/>
//           <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
//         </div>
//       </div>
//     </div>
//   </article>
// }
