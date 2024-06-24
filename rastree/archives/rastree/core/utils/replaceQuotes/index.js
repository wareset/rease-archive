/* eslint-disable */
/*
dester builds:
core/utils/replaceQuotes.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');

var error = require('@wareset-utilites/error');

var last = require('@wareset-utilites/array/last');
/* filename: core/utils/replaceQuotes.ts
  timestamp: 2022-01-22T03:47:53.271Z */


var replaceQuotes = string => {
  var first = string[0];

  if (!/^['"`]/.test(string) || last.last(string) !== first) {
    error.throwSyntaxError(replaceQuotes.name);
  }

  string = string.slice(1, -1) // .replace(/(\r\n?|\n|\u2028|\u2029)/g, '\\n')
  .replace(/\\[^]/g, r => r[1] === first ? first : r);
  string = jsonStringify.jsonStringify(string).replace(/\\\\/g, '\\');
  return string;
};

exports.replaceQuotes = replaceQuotes;
