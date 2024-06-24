/* eslint-disable */
/*
dester builds:
core/template/index.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var classes = require('./classes');
/* filename: core/template/index.ts
  timestamp: 2022-01-22T03:47:47.428Z */


var template = source => new classes.RastreeTemplate(source);

exports.template = template;
