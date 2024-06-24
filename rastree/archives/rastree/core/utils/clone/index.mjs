/* eslint-disable */
/*
dester builds:
core/utils/clone.ts
*/
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify';
import { jsonParse } from '@wareset-utilites/lang/jsonParse';
/* filename: core/utils/clone.ts
  timestamp: 2022-01-22T03:47:49.633Z */

var clone = any => jsonParse(jsonStringify(any));

export { clone };
