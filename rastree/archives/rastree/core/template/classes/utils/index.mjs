/* eslint-disable */
/*
dester builds:
core/template/classes/utils.ts
*/
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { jsonParse } from '@wareset-utilites/lang/jsonParse';
import { repeat } from '@wareset-utilites/string/repeat';
import { trim } from '@wareset-utilites/string/trim';
/* filename: core/template/classes/utils.ts
  timestamp: 2022-01-22T03:47:46.316Z */
// import { getDelimeter } from '../../utils/getDelimeter'
// export const VAL_STORE = '_$'
// export const VAL_TAG = '_tg'
// export const VAL_TEXT = '_tx'

var offset = count => repeat('  ', count); // prettier-ignore


var normalizeDeep = (tokens, deep) => (tokens[0] && (deep = tokens[0].deep) && forEachLeft(tokens, token => {
  token.deep -= deep;
}), tokens);

var isLiteral = v => {
  try {
    jsonParse(v);
    return true;
  } catch (e) {
    /* */
  }

  return false;
}; // prettier-ignore


var __jsonParseTry__ = v => {
  try {
    v = jsonParse(v);
  } catch (e) {
    v = v.slice(1, -1);
  }

  return v;
}; // prettier-ignore


var fixArgsValue = v => (v = trim(v, '\\s+'))[0] === '"' ? fixArgsValue(__jsonParseTry__(v)) : v[0] === '(' ? fixArgsValue(v.slice(1, -1)) : v;

export { fixArgsValue, isLiteral, normalizeDeep, offset };
