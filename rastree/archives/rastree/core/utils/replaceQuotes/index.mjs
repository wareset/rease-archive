/* eslint-disable */
/*
dester builds:
core/utils/replaceQuotes.ts
*/
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify';
import { throwSyntaxError } from '@wareset-utilites/error';
import { last } from '@wareset-utilites/array/last';
/* filename: core/utils/replaceQuotes.ts
  timestamp: 2022-01-22T03:47:53.271Z */

var replaceQuotes = string => {
  var first = string[0];

  if (!/^['"`]/.test(string) || last(string) !== first) {
    throwSyntaxError(replaceQuotes.name);
  }

  string = string.slice(1, -1) // .replace(/(\r\n?|\n|\u2028|\u2029)/g, '\\n')
  .replace(/\\[^]/g, r => r[1] === first ? first : r);
  string = jsonStringify(string).replace(/\\\\/g, '\\');
  return string;
};

export { replaceQuotes };
