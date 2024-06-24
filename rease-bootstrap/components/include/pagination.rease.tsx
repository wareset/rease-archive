import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

export function Pagination(
  this: TypeReaseContext,
  {
    'aria-label': ariaLabel,

    small,
    large,

    ...attrs
  } : {
    'aria-label'?: TypeReaseProp<string>

    small?: TypeReaseProp<boolean>
    large?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <nav
    aria-label={ariaLabel!!}
  >
    <ul
      {...attrs}
      class={[
        attrs.class!!,
        'pagination',
        (small!! || large!!) && `pagination-${small!! ? 'sm' : 'lg'}`
      ]}
      
      r-use={this.use}
    >
      <r-slot/>
    </ul>
  </nav>
}

export function PaginationItem(
  this: TypeReaseContext,
  {
    text,

    active,
    disabled,
    
    ...attrs
  } : {
    text: TypeReaseProp<string>
    href?: TypeReaseProp<string>

    active?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <li
    class={'page-item'}
    class-active={active!!}
    class-disabled={disabled!!}
    aria-disabled={disabled!!}

    r-use={this.use}
  >
    <span r-is={attrs.href!! && 'a'}
      aria-current={active!! && 'page'}
      {...attrs}
      class={[attrs.class!!, 'page-link']}
    >
      {text!!}
    </span>
  </li>
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="pagination">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Pagination</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/pagination/">Documentation</a>
//     </div>

//     <div>

//       <div class="bd-example">

//         <Pagination>
//           <PaginationItem aria-label="Previous" text={'«'} />

//           <PaginationItem text={'1'} />
//           <PaginationItem active text={'2'} />

//           <PaginationItem disabled text={'...'} />
//           <PaginationItem text={'3'} />

//           <PaginationItem aria-label="Next" text={'»'} />
//         </Pagination>

//         <Pagination size={'lg'}>
//           <PaginationItem aria-label="Previous" text={'prev'} />

//           <PaginationItem text={'1'} />
//           <PaginationItem active text={'2'} />

//           <PaginationItem disabled text={'...'} />
//           <PaginationItem text={'3'} />

//           <PaginationItem aria-label="Next" text={'next'} />
//         </Pagination>

//       </div>

//       <div class="bd-example">
//         <nav aria-label="Pagination example">
//           <ul class="pagination pagination-sm">
//             <li class="page-item"><a class="page-link" href="#">1</a></li>
//             <li class="page-item active" aria-current="page">
//               <a class="page-link" href="#">2</a>
//             </li>
//             <li class="page-item"><a class="page-link" href="#">3</a></li>
//           </ul>
//         </nav>
//       </div>

//       <div class="bd-example">
//         <nav aria-label="Standard pagination example">
//           <ul class="pagination">
//             <li class="page-item">
//               <a class="page-link" href="#" aria-label="Previous">
//                 <span aria-hidden="true">«</span>
//               </a>
//             </li>
//             <li class="page-item"><a class="page-link" href="#">1</a></li>
//             <li class="page-item"><a class="page-link" href="#">2</a></li>
//             <li class="page-item"><a class="page-link" href="#">3</a></li>
//             <li class="page-item">
//               <a class="page-link" href="#" aria-label="Next">
//                 <span aria-hidden="true">»</span>
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       <div class="bd-example">
//         <nav aria-label="Another pagination example">
//           <ul class="pagination pagination-lg flex-wrap">
//             <li class="page-item disabled">
//               <a class="page-link">Previous</a>
//             </li>
//             <li class="page-item"><a class="page-link" href="#">1</a></li>
//             <li class="page-item active" aria-current="page">
//               <a class="page-link" href="#">2</a>
//             </li>
//             <li class="page-item"><a class="page-link" href="#">3</a></li>
//             <li class="page-item">
//               <a class="page-link" href="#">Next</a>
//             </li>
//           </ul>
//         </nav>
//       </div>

//     </div>
//   </article>
// }
