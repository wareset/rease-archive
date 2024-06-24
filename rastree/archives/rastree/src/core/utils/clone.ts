import { jsonStringify } from '@wareset-utilites/lang/jsonStringify'
import { jsonParse } from '@wareset-utilites/lang/jsonParse'

export const clone = <T>(any: T): T => jsonParse(jsonStringify(any))
