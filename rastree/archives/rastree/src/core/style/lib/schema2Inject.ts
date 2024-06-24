import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { regexp } from '@wareset-utilites/regexp'

import { jsx2tokens } from '@rastree/jsx2tokens'

import { clone } from '../../utils/clone'
import { calcVariables } from './calcVariables'
import { CssProgram, TypeSchema } from '../classes/CssProgram'
import { storefyExpression, STOREFY } from '../../template/classes/storefyExpression'

export const schema2Inject = (
  schema: TypeSchema,
  salt: string,
  jsVars: [number, string][],
  {
    calc = true,
    global = true
  }: { calc?: boolean | 'all'; global?: boolean } = {}
): string => {
  schema = clone(schema)

  const jsattr = salt + 'A'
  const jsscoper = salt + 'S'
  const jsinject = salt + 'I'

  let res = ''
  if (schema.length) {
    forEachLeft(schema, (v) => {
      v[2][0] = jsattr + '%' + v[2][0] + '%' + jsattr
      if (calc) {
        v[2][1] = calcVariables(v[2][1], calc !== 'all')
      }
    })

    const isJsVars = jsVars && jsVars.length > 0

    let isScoper!: boolean // = isJsVars
    res += jsonStringify(
      CssProgram.toCode(schema, { minify: true, scoper: jsscoper, global })
    ).replace(
      regexp(
        `(${jsscoper})|${jsattr}%([^]*?)%${jsattr}\\s*:?|${salt}(\\d+)${salt}`,
        'g'
      ),
      (_full, _jsscoper, _jsattr, _jsinject) => {
        if (_jsscoper) _full = `" + _${jsscoper} + "`, isScoper = true
        else if (_jsattr) _full = `" + _${jsattr}("${_jsattr}") + "`
        else if (_jsinject) _full = `" + _${jsinject}[${_jsinject}] + "`
        return _full
      }
    )

    if (isJsVars) {
      res = `[[${jsVars!
        .map((v) => storefyExpression(jsx2tokens(v[1]), salt))
        .join(', ')}], (_${jsinject}) => (${res})]`
    }

    let fn = `_${jsattr}`
    if (isScoper) fn += `, _${jsscoper}`
    if (isJsVars) fn += `, ${STOREFY + salt}`
    res = `(${fn}) => (${res})`
  }

  return res
}
