/* eslint-disable camelcase */
/* eslint-disable guard-for-in */

import { keys } from '@wareset-utilites/object/keys'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'

import * as a_reasenames from './a_reasenames'
import * as attrnames from './attrnames'
import * as cssnames from './cssnames'
import * as eventnames from './eventnames'
import * as tagnames from './tagnames'

const samples: any = {}

const DATA: any = { a_reasenames, attrnames, cssnames, eventnames, tagnames }
for (const filename in DATA) {
  forEachLeft(keys(DATA[filename]), (k) => {
    const v = DATA[filename][k]
    if (!(v in samples))
      samples[v] = [
        filename,
        k,
        v,
        `export { ${k} as %${v}% } from "rease/samples/${filename}"`
      ]
  })
}

export default samples
export { samples }
