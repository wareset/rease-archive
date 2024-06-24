/* eslint-disable */
/*
dester builds:
core/utils/removeComments.ts
*/
/* filename: core/utils/removeComments.ts
  timestamp: 2022-01-22T03:47:52.212Z */
var removeComments = source => source.replace(/((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))|([^])/g, (_full, _string, _2, _comment, _other) => _comment ? '' : _full);

export { removeComments };
