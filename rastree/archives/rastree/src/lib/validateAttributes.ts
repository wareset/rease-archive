import { toUppercase } from '@wareset-utilites/string/toUppercase'
import { toLowercase } from '@wareset-utilites/string/toLowercase'
import { isBoolean } from '@wareset-utilites/is/isBoolean'
import { isString } from '@wareset-utilites/is/isString'

import { isValidVariable, isValidCid } from './utils'

const FAKE_TRUE = {}
const FAKE_FALSE = {}

type TypeSchemaSection = {
  [key: string]: {
    types: any[]
    check?: (v?: any) => boolean
    apply: (res: { [key: string]: any }, v?: any) => void
  }
}

// prettier-ignore
const __env__: TypeSchemaSection = {
  env: {
    types: ['server', ['client', 'browser'], 'all'],
    apply: (res, v): void => {
      let ctrue = FAKE_TRUE, cfalse = FAKE_FALSE
      let strue = FAKE_TRUE, sfalse = FAKE_FALSE
      if (isBoolean(res.client)) ctrue = true, cfalse = false
      if (isBoolean(res.server)) strue = true, sfalse = false
      res.client = v === 'all' || v === 'client' || v === 'browser'
        ? ctrue : v === 'server' ? cfalse : res.client
      res.server = v === 'all' || v === 'server'
        ? strue : v === 'client' || v === 'browser' ? sfalse : res.server
    }
  },
  server: {
    types: [Boolean],
    apply: (res, v): void => {
      res.server = isBoolean(v) ? v : isBoolean(res.client)
        ? !res.client : res.server || FAKE_TRUE
    }
  },
  client: {
    types: [Boolean],
    apply: (res, v): void => {
      res.client = isBoolean(v) ? v : isBoolean(res.server)
        ? !res.server : res.client || FAKE_TRUE
    }
  },
  browser: {
    types: [Boolean],
    apply: (res, v = res.client): void => {
      res.client = isBoolean(v) ? v : isBoolean(res.server)
        ? !res.server : res.client || FAKE_TRUE
    }
  }
}

// prettier-ignore
const __module__: TypeSchemaSection = {
  context: {
    types: ['module'],
    apply: (res, v): void => {
      res.module = v === 'module' || res.module
    }
  },
  module: {
    types: [Boolean],
    apply: (res, v): void => {
      res.module = v
    }
  }
}

const __src__: TypeSchemaSection = {
  src: {
    types: [String],
    apply: (res, v): void => {
      res.src = v
    }
  }
}

const __stylescope__: TypeSchemaSection = {
  global: {
    types: [Boolean],
    apply: (res, v): void => {
      if (isBoolean(v)) res.global = v, res.scoped = !res.global
      else if (isBoolean(res.scoped)) res.global = !res.scoped
      else res.global = FAKE_FALSE, res.scoped = FAKE_TRUE
    }
  },
  scoped: {
    types: [Boolean],
    apply: (res, v): void => {
      if (isBoolean(v)) res.scoped = v, res.global = !res.scoped
      else if (isBoolean(res.global)) res.scoped = !res.global
      else res.global = FAKE_FALSE, res.scoped = FAKE_TRUE
    }
  }
}

// prettier-ignore
const SECTION_ATTRIBUTES: { [key: string]: TypeSchemaSection } = {
  options: {
    'name': {
      types: [String],
      check: isValidVariable,
      apply: (res, v): void => {
        res.name = v
      }
    },
    'cid': {
      types: [String],
      check: isValidCid,
      apply: (res, v): void => {
        res.cid = v
      }
    },
    'css-scope-type': {
      types: ['class', 'attribute', String],
      check: (v): boolean => v !== 'data' && [...v + ''].every((v, k, a) =>
        toLowercase(v) !== toUppercase(v) || /[\w]/.test(v) ||
        v === '-' && k && k < a.length - 1),
      apply: (res, v): void => {
        res['css-scope-type'] = v
      }
    }
  },
  script: {
    ...__src__,
    lang: {
      types: [['ts', 'typescript']],
      apply: (res, v): void => {
        if (v === 'typescript' || v === 'ts') res.lang = 'ts'
        else res.lang = v
      }
    },
    ...__module__,
    ...__env__
  },
  template: {
    ...__src__,
    lang: {
      types: [['pug', 'jade']],
      apply: (res, v): void => {
        if (v === 'pug' || v === 'jade') res.lang = 'pug'
        else res.lang = v
      }
    },
    ...__env__
  },
  style: {
    ...__src__,
    'lang': {
      types: ['less', 'scss', 'sass', 'stylus'],
      apply: (res, v): void => {
        res.lang = v
      }
    },
    // ...__module__,
    ...__stylescope__,
    '--calc': {
      types: [Boolean, 'all'],
      apply: (res, v): void => {
        res['--calc'] = v === 'all' ? v : v === true ? v : res['--calc']
      }
    },
    '--js': {
      types: [Boolean, String],
      check: (v): boolean => v === !!v || v && /^[$a-z]+[$\w]*$/i.test(v + ''),
      apply: (res, v): void => {
        res['--js'] = isString(v) ? v : v === true ? 'var' : res['--js']
      }
    }
  }
}

import jsonStringify from '@wareset-utilites/lang/jsonStringify'
import forEachLeft from '@wareset-utilites/array/forEachLeft'
import concat from '@wareset-utilites/array/concat'

import isFunction from '@wareset-utilites/is/isFunction'

import keys from '@wareset-utilites/object/keys'
import is from '@wareset-utilites/object/is'

import unique from '@wareset-utilites/unique'
import typed from '@wareset-utilites/typed'

import { warn } from './utils'

let undef: undefined
export const validateAttributes = (
  sectionName: string,
  attrsArr: any[][]
): { [key: string]: any } => {
  const attrs: any = {}
  let attrKeys: string[] = []
  // prettier-ignore
  forEachLeft(attrsArr, ([n, v]) => {
    attrKeys.unshift(n), attrs[n] = v
  })
  attrKeys = unique(attrKeys).reverse()
  let val: any, tmp: any
  const res: { [key: string]: any } = {}
  const section = SECTION_ATTRIBUTES[sectionName]
  forEachLeft(unique([...attrKeys, ...keys(section)]), (attrName) => {
    if (!(attrName in section)) {
      warn(`Attribute "${attrName}" not support in section "${sectionName}".`)
    } else {
      val = undef
      const options = section[attrName]

      if (attrName in attrs) {
        val = attrs[attrName]

        const types = concat(...options.types)
        if (!types.some((v) => isFunction(v) ? typed(val, v) : is(val, v))) {
          warn(
            `The attribute "${attrName}" must be: ${types
              .map((v) => '' + (v && v.name || jsonStringify(v)))
              .join(', ')}.`
          )
          val = undef
        } else if ((tmp = options.check) && !tmp(val)) {
          console.warn(`The attribute "${attrName}" cannot be value: "${val}".`)
          val = undef
        }
      }

      options.apply(res, val)
    }
  })

  forEachLeft(keys(res), (attrName) => {
    const v = res[attrName]
    if (v === FAKE_TRUE || v === FAKE_FALSE) res[attrName] = v === FAKE_TRUE
  })

  // console.log(sectionName, res)
  return res
}
