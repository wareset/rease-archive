// const {
//   sucrase,
//   typescript,
//   pug,
//   less,
//   scss,
//   stylus
// } = require('./index').default;
import { __sucrase__, __typescript__, pug, less, scss, stylus } from './index'

const TS = `
export default function hello(): any {}
`

const RES_JS = `
export default function hello() { }
`.trim()

const RES_JS2 = `
"use strict";Object.defineProperty(exports, "__esModule", {value: true});
 function hello() {} exports.default = hello;
`.trim()

const PUG = `
+tag("{href ? 'a' : CustomCmp}").some-class(class="cl2") text
  span spantext
`

const RES_HTML = `
<{href ? 'a' : CustomCmp} class="some-class cl2">text<span>spantext</span></>
`.trim()

const LESS = `
div {
  color: #f00;

  :scoped(span) {
    color: #008000;

    b {
      color: #00f;
    }
  }
}
`

const STYLUS = `
div
  color: #f00

  :scoped(span)
    color: #008000

    b
      color: #00f
`

const RES_CSS = `
div {
  color: #f00;
}
div :scoped(span) {
  color: #008000;
}
div :scoped(span) b {
  color: #00f;
}
`.trim()

test('compile/langs', () => {
  expect(__sucrase__!(TS).trim()).toBe(RES_JS2)
  expect(__typescript__!(TS).trim()).toBe(RES_JS)

  expect(pug(PUG).trim()).toBe(RES_HTML)

  expect(less(LESS).trim()).toBe(RES_CSS)
  expect(scss(LESS).trim()).toBe(RES_CSS)
  expect(stylus(STYLUS).trim()).toBe(RES_CSS)
})
