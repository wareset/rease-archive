/* eslint-disable */
/*
dester builds:
lib/utils.ts
*/
import { toUppercase } from '@wareset-utilites/string/toUppercase';
import { toLowercase } from '@wareset-utilites/string/toLowercase';
import { random } from '@wareset-utilites/math/random';
import { trim } from '@wareset-utilites/string/trim';
import { hash } from '@wareset-utilites/hash';
/* filename: lib/utils.ts
  timestamp: 2022-01-22T03:47:57.768Z */

var warn = (...a) => {
  console.warn('WARNING:\n' + a.join('\n'));
};

var isValidVariable = variable => !!variable && [...(variable + '')].every((v, k) => /[$_]/.test(v) || k && /[$\w]/.test(v) || toLowercase(v) !== toUppercase(v));

var isValidCid = cid => !!cid && [...(cid + '')].every(v => /[$-\w]/.test(v) || toLowercase(v) !== toUppercase(v));

var __fixCidString__ = v => {
  v = (v || '') + '';
  var v2 = [...trim(v, '-\\s').replace(/^data-|\s+/gi, '')].filter(v => /[$-\w]/.test(v) || toLowercase(v) !== toUppercase(v)).join('');
  return v.length === v2.length ? v2 : __fixCidString__(v2);
};

var validateCid = (cid, salt) => {
  cid = (cid || 'r' + hash(salt || random())) + '';
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

export { createScoper, isValidCid, isValidVariable, validateCid, warn };
