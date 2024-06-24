// export {
//   Array,
//   Boolean,
//   decodeURI,
//   decodeURIComponent,
//   encodeURI,
//   encodeURIComponent,
//   Function,
//   isFinite,
//   isNaN,
//   Number,
//   Object,
//   parseFloat,
//   parseInt,
//   RegExp,
//   String
// } from '@wareset-utilites/lang'

// eslint-disable-next-line no-eval
const __eval__ = eval
export { __eval__ as eval }
export { default as isFinite } from '@wareset-utilites/lang/isFinite'
export { default as isNaN } from '@wareset-utilites/is/isNaN'
export { default as parseFloat } from '@wareset-utilites/lang/parseFloat'
export { default as parseInt } from '@wareset-utilites/lang/parseInt'
export { default as decodeURI } from '@wareset-utilites/lang/decodeURI'
export { default as decodeURIComponent } from '@wareset-utilites/lang/decodeURIComponent'
export { default as encodeURI } from '@wareset-utilites/lang/encodeURI'
export { default as encodeURIComponent } from '@wareset-utilites/lang/encodeURIComponent'

export { default as Object } from '@wareset-utilites/object/Object'
export { default as Function } from '@wareset-utilites/lang/Function'
export { default as Boolean } from '@wareset-utilites/lang/Boolean'
const __Symbol__ = Symbol
export { __Symbol__ as Symbol }
export {
  ErrorClass as Error,
  EvalErrorClass as EvalError,
  RangeErrorClass as RangeError,
  ReferenceErrorClass as ReferenceError,
  SyntaxErrorClass as SyntaxError,
  TypeErrorClass as TypeError,
  URIErrorClass as URIError
} from '@wareset-utilites/error'

const __setTimeout__ = setTimeout
export { __setTimeout__ as setTimeout }
const __setInterval__ = setInterval
export { __setInterval__ as setInterval }

const __Infinity__ = Infinity
export { __Infinity__ as Infinity }
const __NaN__ = NaN
export { __NaN__ as NaN }
// const __null__ = null
// export { __null__ as null }
let __undefined__: undefined
export { __undefined__ as undefined }

export { default as Number } from '@wareset-utilites/number/Number'
// export { default as Math } from '@wareset-utilites/math/Math'
const __Math__ = Math
export { __Math__ as Math }
const __Date__ = Date
export { __Date__ as Date }

export { default as String } from '@wareset-utilites/string/String'
export { default as RegExp } from '@wareset-utilites/lang/RegExp'

export { default as Array } from '@wareset-utilites/array/Array'
const __Int8Array__ = Int8Array
export { __Int8Array__ as Int8Array }
const __Uint8Array__ = Uint8Array
export { __Uint8Array__ as Uint8Array }
const __Uint8ClampedArray__ = Uint8ClampedArray
export { __Uint8ClampedArray__ as Uint8ClampedArray }
const __Int16Array__ = Int16Array
export { __Int16Array__ as Int16Array }
const __Uint16Array__ = Uint16Array
export { __Uint16Array__ as Uint16Array }
const __Int32Array__ = Int32Array
export { __Int32Array__ as Int32Array }
const __Uint32Array__ = Uint32Array
export { __Uint32Array__ as Uint32Array }
const __Float32Array__ = Float32Array
export { __Float32Array__ as Float32Array }
const __Float64Array__ = Float64Array
export { __Float64Array__ as Float64Array }

const __Map__ = Map
export { __Map__ as Map }
const __Set__ = Set
export { __Set__ as Set }
const __WeakMap__ = WeakMap
export { __WeakMap__ as WeakMap }
const __WeakSet__ = WeakSet
export { __WeakSet__ as WeakSet }

const __ArrayBuffer__ = ArrayBuffer
export { __ArrayBuffer__ as ArrayBuffer }
const __DataView__ = DataView
export { __DataView__ as DataView }
const __JSON__ = JSON
export { __JSON__ as JSON }
