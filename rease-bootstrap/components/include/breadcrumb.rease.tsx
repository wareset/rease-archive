import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

export function Breadcrumb(
  this: TypeReaseContext,
  {
    'aria-label': ariaLabel,
    divider,

    ...attrs
  } : {
    'aria-label'?: TypeReaseProp<string>
    divider?: TypeReaseProp<string>

    [key: string]: any
  }
): void {
  <nav
    aria-label={ariaLabel!! || 'breadcrumb'}
    style---bs-breadcrumb-divider={divider!! || '/'}
  >
    <ol
      {...attrs}
      class={[attrs.class!!, 'breadcrumb']}

      r-use={this.use}
    >
      <r-slot/>
    </ol>
  </nav>
}

export function BreadcrumbItem(
  this: TypeReaseContext,
  {
    active,

    ...attrs
  } : {
    href?: TypeReaseProp<string>

    active?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <li
    class={'breadcrumb-item'}
    class-active={active!!}
  >
    <span r-is={attrs.href!! && 'a'}
      {...attrs}

      r-use={this.use}
    >
      <r-slot/>
    </span>
  </li>
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="breadcrumb">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Breadcrumb</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/breadcrumb/">Documentation</a>
//     </div>

//     <div>
//       <div class="bd-example">
//         <Breadcrumb>
//           <BreadcrumbItem href={'#'}>Home</BreadcrumbItem>
//           <BreadcrumbItem href={'#'}>Item 1</BreadcrumbItem>
//           <BreadcrumbItem href={'#'}>Item 2</BreadcrumbItem>
//           <BreadcrumbItem>Item 3</BreadcrumbItem>
//         </Breadcrumb>
//       </div>
      
//       <div class="bd-example">
//         <nav aria-label="breadcrumb">
//           <ol class="breadcrumb">
//             <li class="breadcrumb-item"><a href="#">Home</a></li>
//             <li class="breadcrumb-item"><a href="#">Library</a></li>
//             <li class="breadcrumb-item active" aria-current="page">Data</li>
//           </ol>
//         </nav>
//       </div>
//     </div>
//   </article>
// }
