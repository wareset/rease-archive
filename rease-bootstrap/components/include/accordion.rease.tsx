import 'rease/jsx'
import { TypeReaseContext, TypeReaseProp, TypeReaseSubject, TypeEventListener } from 'rease'
import {
  subject, onDestroy,
  subscribe, subscribeSafeAll
} from 'rease'

import { random_string, getHighComponent, onewayBindPropSafe, reflow, noop } from '../lib'

import type { Optional } from 'utility-types'

export function Accordion(
  this: TypeReaseContext,
  {
    flush,
    alwaysOpen,

    ...attrs
  } : {
    flush?: TypeReaseProp<boolean>
    alwaysOpen?: TypeReaseProp<boolean>

    [key: string]: any
  } & Optional<HTMLDivElement>
): void {
  this.pub.alwaysOpen$$ = alwaysOpen
  this.pub.items = {} as { [key: string]: TypeReaseSubject<boolean> }

  ;(
    <div
      {...attrs}
      class={[attrs.class!!, 'accordion', flush!! && 'accordion-flush']}
      r-use={this.use}
    >
      <r-slot/>
    </div>
  )
}

export function AccordionItem(
  this: TypeReaseContext,
  {
    show,

    ...attrs
  } : {
    show?: TypeReaseProp<boolean>

    id?: never
    [key: string]: any
  } & Optional<HTMLDivElement>
): void {
  const highAccordion = getHighComponent(this, Accordion)
  const alwaysOpen$$ = highAccordion.pub.alwaysOpen$$
  const items = highAccordion.pub.items as { [key: string]: TypeReaseSubject<boolean> }

  this.pub.headingId = random_string()
  const id = this.pub.collapseId = random_string()
  const show$ = items[id] = this.pub.show$ = subject<boolean>(false)
  onDestroy(() => { delete items[id] })
  onewayBindPropSafe(show, show$)

  subscribeSafeAll([show$, alwaysOpen$$],
    ([show, alwaysOpen], [items, id]) => {
      if (!alwaysOpen && show) {
        for (const k in items) if (k !== id && items[k].$) items[k].$ = false
      }
    },
    [items, id])

  ;(
    <div
      {...attrs}
      class={[attrs.class!!, 'accordion-item']}
      r-use={this.use}
    >
      <r-slot/>
    </div>
  )
}

const __toggleCollapse: TypeEventListener<TypeReaseContext> =
  (_e, ctx): void => { ctx.home.pub.show$.$ = !ctx.home.pub.show$.$ }

export function AccordionHeader(
  this: TypeReaseContext,
  {
    tag,

    ...attrs
  } : {
    tag?: TypeReaseProp<string>

    id?: never
    [key: string]: any
  }
): void {
  const highAccordionItem = getHighComponent(this, AccordionItem)
  const show$ = this.pub.show$ = highAccordionItem.pub.show$ as TypeReaseSubject<boolean>

  ;(
    <h4 r-is={tag!!}
      {...attrs}
      class={'accordion-header'}
      id={highAccordionItem.pub.headingId as string}
    >
      <button
        class={[attrs.class!!, 'accordion-button']}
        class-collapsed={!show$!!}
        type="button"
        aria-expanded={show$!!}
        aria-controls={highAccordionItem.pub.collapseId as string}
        r-on-click={__toggleCollapse}
        r-use={this.use}
      >
        <r-slot/>
      </button>
    </h4>
  )
}

export function AccordionBody(
  this: TypeReaseContext,
  { ...attrs } : {
    
    id?: never
    [key: string]: any
  } & Optional<HTMLDivElement>
): void {
  const highAccordionItem = getHighComponent(this, AccordionItem)

  const showC: [boolean] = [false]
  const show$ = highAccordionItem.pub.show$ as TypeReaseSubject<boolean>
  
  subscribe(show$, (show, [ctx, showC, completeC]) => {
    const node = ctx.pub.node as HTMLElement
    if (showC[0] !== (showC[0] = show) && node) {
      let complete: Function
      const style = node.style, classList = node.classList

      if (!show) {
        style.height = `${node.getBoundingClientRect().height}px`, reflow(node)
        classList.add('collapsing'), classList.remove('collapse', 'show')
        complete = (): void => {
          if (completeC[0] === complete && ctx.on) {
            classList.remove('collapsing'), classList.add('collapse')
          }
        }
        style.height = ''
      } else {
        classList.remove('collapse'), classList.add('collapsing')
        style.height = '0'
        complete = (): void => {
          if (completeC[0] === complete && ctx.on) {
            classList.remove('collapsing'), classList.add('collapse', 'show')
            style.height = ''
          }
        }
        style.height = `${node.scrollHeight}px`
      }

      setTimeout(completeC[0] = complete, 500)
    }
  }, [this, showC, [noop] as [Function]])

  ;(
    <div
      class={['accordion-collapse collapse', showC[0] && 'show']}
      id={highAccordionItem.pub.collapseId}
      aria-labelledby={highAccordionItem.pub.headingId as string}
      r-use={[(ctx): void => { ctx.home.pub.node = ctx.node }]}
    >
      <div
        {...attrs}
        class={[attrs.class!!, 'accordion-body']}
        r-use={this.use}
      >
        <r-slot/>
      </div>
    </div>
  )
}

// const content = `
// <strong>This is the first item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions.
// `

// export const Cheatsheet = (): void => {
//   <article class="my-3" id="accordion">
//     <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
//       <h3>Accordion</h3>
//       <a class="d-flex align-items-center" href="/docs/5.1/components/accordion/">Documentation</a>
//     </div>

//     <div>
//       <div class="bd-example">
//         <Accordion flush>
//           <AccordionItem show>
//             <AccordionHeader>Accordion Item #1</AccordionHeader>
//             <AccordionBody>{content}</AccordionBody>
//           </AccordionItem>
//           <AccordionItem show>
//             <AccordionHeader>Accordion Item #2</AccordionHeader>
//             <AccordionBody>{content}</AccordionBody>
//           </AccordionItem>
//           <AccordionItem>
//             <AccordionHeader>Accordion Item #3</AccordionHeader>
//             <AccordionBody>{content}</AccordionBody>
//           </AccordionItem>
//         </Accordion>
//       </div>
//     </div>
    
//     <br/>

//     <div>
//       <div class="bd-example">
//         <div class="accordion" id="accordionExample">
//           <div class="accordion-item">
//             <h4 class="accordion-header" id="headingOne">
//               <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
//                 Accordion Item #1
//               </button>
//             </h4>
//             <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
//               <div class="accordion-body">
//                 <strong>This is the first item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
//               </div>
//             </div>
//           </div>
//           <div class="accordion-item">
//             <h4 class="accordion-header" id="headingTwo">
//               <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
//                 Accordion Item #2
//               </button>
//             </h4>
//             <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
//               <div class="accordion-body">
//                 <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
//               </div>
//             </div>
//           </div>
//           <div class="accordion-item">
//             <h4 class="accordion-header" id="headingThree">
//               <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
//                 Accordion Item #3
//               </button>
//             </h4>
//             <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
//               <div class="accordion-body">
//                 <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </article>
// }
