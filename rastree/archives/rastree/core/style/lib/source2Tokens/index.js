/* eslint-disable */
/*
dester builds:
core/style/lib/source2Tokens.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var trim = require('@wareset-utilites/string/trim');

var replaceQuotes = require('../../../utils/replaceQuotes');
/* filename: core/style/lib/source2Tokens.ts
  timestamp: 2022-01-22T03:47:40.798Z */


var setTokenType = (token, deepNext) => {
  if (token) {
    // eslint-disable-next-line prefer-const
    var [deep, type, raw] = token;
    type = 2
    /* SELECTOR */
    ;
    if (raw[0] === '@') type = 1
    /* ATRULE */
    ;else if (deep >= deepNext) type = 4
    /* ATTRIBUTE */
    ;else if (/^\s*(from|to|\d+(\.\d*)?%?)\s*$/.test(raw)) type = 3
    /* KEYFRAME */
    ;
    token[1] = type;
  }
};
/*
FOR NEW VERSION

const CSS_VALUE_REGEX = /[{}]|\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$)|((?:(`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$)|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*(?:\)|$))*(?:\)|$))*(?:\)|$)|[^{};:/\r\n]|\/(?![/*]))+)/g
const q = 'zxc: "zxcc\\\\\\"c";qqq: (3px); calc(33 + (var(23)) s;df)  + sf; '.match(
  CSS_VALUE_REGEX
)
console.log(q)
*/


var source2Tokens = source => {
  var res = [];
  var token;
  var deep = 0;
  var other = '';
  var trimed;
  source.replace(/((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))|([{};])|(\s+)|(\burl\([^'"`][^]*?(?<!\\)\))|([^])|$/g, (_full, _string, _2, _comment, _punct, _space, _urlDirty, _other) => {
    // console.log([_full, _string, _comment, _punct, _space, _other])
    if (_urlDirty) {
      _urlDirty = 'url("' + _urlDirty.slice(4, -1).replace(/\s+/g, '') + '")';
      _full = _urlDirty;
    }

    if (_comment) {
      res.push([deep, 0
      /* COMMENT */
      , _comment]);
    } else {
      if (_space) _full = ' ';else if (_punct) _full = '';else if (_string) _full = replaceQuotes.replaceQuotes(_full);
      if (_full) other += _full;else if (trimed = trim.trim(other)) {
        setTokenType(token, deep);
        res.push(token = [deep, 0
        /* COMMENT */
        , trimed]), other = '';
      }

      if (_punct) {
        if (_punct === '}') deep--;else if (_punct === '{') deep++;
        setTokenType(token, deep), token = null;
      }
    }

    return '';
  });
  setTokenType(token, -1); // console.log(res)

  return res;
};

exports.source2Tokens = source2Tokens;
