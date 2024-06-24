/* eslint-disable */
/*
dester builds:
lib/utils.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var toUppercase = require('@wareset-utilites/string/toUppercase');

var toLowercase = require('@wareset-utilites/string/toLowercase');

var random = require('@wareset-utilites/math/random');

var trim = require('@wareset-utilites/string/trim');

var hash = require('@wareset-utilites/hash');
/* filename: lib/utils.ts
  timestamp: 2022-01-22T03:47:57.768Z */


var warn = (...a) => {
  console.warn('WARNING:\n' + a.join('\n'));
};

var isValidVariable = variable => !!variable && [...(variable + '')].every((v, k) => /[$_]/.test(v) || k && /[$\w]/.test(v) || toLowercase.toLowercase(v) !== toUppercase.toUppercase(v));

var isValidCid = cid => !!cid && [...(cid + '')].every(v => /[$-\w]/.test(v) || toLowercase.toLowercase(v) !== toUppercase.toUppercase(v));

var __fixCidString__ = v => {
  v = (v || '') + '';
  var v2 = [...trim.trim(v, '-\\s').replace(/^data-|\s+/gi, '')].filter(v => /[$-\w]/.test(v) || toLowercase.toLowercase(v) !== toUppercase.toUppercase(v)).join('');
  return v.length === v2.length ? v2 : __fixCidString__(v2);
};

var validateCid = (cid, salt) => {
  cid = (cid || 'r' + hash.hash(salt || random.random())) + '';
  cid = __fixCidString__(cid) || validateCid(cid, salt);
  if (/\d/.test(cid[0])) cid = 'r' + cid;
  return cid;
};

var createScoper = (cid, type) => {
  cid = validateCid(cid);
  var res;
  if (type === 'class') res = ['.' + cid, "[\"class\", \"" + cid + "\"]"];else if (!type || type === 'attribute') {
    res = ["[data-" + cid + "]", "[\"data\", \"" + cid + "\"]"];
  } else {
    var data = "data-" + (__fixCidString__(type) || 'cid');
    res = ["[" + data + "=" + cid + "]", "[\"" + data + "\", \"" + cid + "\"]"];
  }
  return res;
};

exports.createScoper = createScoper;
exports.isValidCid = isValidCid;
exports.isValidVariable = isValidVariable;
exports.validateCid = validateCid;
exports.warn = warn;
