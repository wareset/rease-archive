import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp } from 'rease'

export function Nav(
  this: TypeReaseContext,
  {
    tag,

    tabs,
    pills,
    fill,
    justified,
    
    ...attrs
  } : {
    tag?: TypeReaseProp<keyof HTMLElementTagNameMap>

    tabs?: TypeReaseProp<boolean>
    pills?: TypeReaseProp<boolean>
    fill?: TypeReaseProp<boolean>
    justified?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <ul r-is={tag!!}
    {...attrs}
    class={[
      attrs.class!!,
      'nav',
      tabs!! && 'nav-tabs',
      pills!! && 'nav-pills',
      fill!! && 'nav-fill',
      justified!! && 'nav-justified'
    ]}

    r-use={this.use}
  >
    <r-slot/>
  </ul>
}

export function NavItem(
  this: TypeReaseContext,
  {
    tag,

    active,
    disabled,

    dropdown,

    ...attrs
  } : {
    tag?: TypeReaseProp<keyof HTMLElementTagNameMap>

    href?: TypeReaseProp<string>

    active?: TypeReaseProp<boolean>
    disabled?: TypeReaseProp<boolean>

    dropdown?: TypeReaseProp<boolean>

    [key: string]: any
  }
): void {
  <li r-is={tag!!}
    class={['nav-item', dropdown!! && 'dropdown']}
  >
    <span r-is={attrs.href!! && 'a'}
      aria-current={active!! && 'page'}
      {...attrs}
      class={[
        attrs.class!!,
        'nav-link',
        dropdown!! && 'dropdown-toggle'
      ]}
      class-active={active!!}
      class-disabled={disabled!!}

      aria-expanded={dropdown!!}
      // id="dropdownMenuButton1"

      r-use={this.use}
    >
      <r-slot/>
    </span>
    <r-slot r-is="dropdown-menu"/>
  </li>
}

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="navs">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Navs</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/navs-tabs/"
//       >Documentation</a>
//     </div>

//     <div>
//       <div class="bd-example">
//         <nav class="nav">
//           <a class="nav-link active" aria-current="page" href="#"
//             r-on-click={(e, ctx): void => { console.log(e, ctx) }}
//           >Active</a>
//           <a
//             class="nav-link"
//             href="#"
//           >
//             Link
//           </a>
//         </nav>
//       </div>
      
//       <div class="bd-example">
//         <nav class="nav">
//           <a class="nav-link active" aria-current="page" href="#">Active</a>
//           <a class="nav-link" href="#">Link</a>
//           <a class="nav-link" href="#">Link</a>
//           <a class="nav-link disabled">Disabled</a>
//         </nav>
//       </div>

//       <div class="bd-example">
//         <nav>
//           <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
//             <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
//             <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>
//             <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</button>
//           </div>
//         </nav>
//         <div class="tab-content" id="nav-tabContent">
//           <div class="tab-pane fade active show" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
//             <p><strong>This is some placeholder content the Home tab's associated content.</strong> Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other <code>.nav</code>-powered navigation.</p>
//           </div>
//           <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
//             <p><strong>This is some placeholder content the Profile tab's associated content.</strong> Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other <code>.nav</code>-powered navigation.</p>
//           </div>
//           <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
//             <p><strong>This is some placeholder content the Contact tab's associated content.</strong> Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other <code>.nav</code>-powered navigation.</p>
//           </div>
//         </div>
//       </div>

//       <div class="bd-example">
//         <ul class="nav nav-pills">
//           <li class="nav-item">
//             <a class="nav-link active" aria-current="page" href="#">Active</a>
//           </li>
//           <li class="nav-item">
//             <a class="nav-link" href="#">Link</a>
//           </li>
//           <li class="nav-item">
//             <a class="nav-link" href="#">Link</a>
//           </li>
//           <li class="nav-item">
//             <a class="nav-link disabled">Disabled</a>
//           </li>
//         </ul>
//       </div>
//     </div>
//   </article>
// }
