/* eslint-disable */
/*
dester builds:
core/utils/clone.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');

var jsonParse = require('@wareset-utilites/lang/jsonParse');
/* filename: core/utils/clone.ts
  timestamp: 2022-01-22T03:47:49.633Z */


var clone = any => jsonParse.jsonParse(jsonStringify.jsonStringify(any));

exports.clone = clone;
