/* eslint-disable */
/*
dester builds:
lib/parseComponent.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var toLowercase = require('@wareset-utilites/string/toLowercase');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var jsonParse = require('@wareset-utilites/lang/jsonParse');

var isString = require('@wareset-utilites/is/isString');

var trim = require('@wareset-utilites/string/trim');

var last = require('@wareset-utilites/array/last');

var jsx2tokens = require('@rastree/jsx2tokens');

var splitComponent = require('../splitComponent');

var validateAttributes = require('../validateAttributes');

var parseAttributes = require('../../core/template/lib/parseAttributes');

var replaceQuotes = require('../../core/utils/replaceQuotes');

var utils = require('../utils');
/* filename: lib/parseComponent.ts
  timestamp: 2022-01-22T03:47:55.572Z */


var tryJsonParse = v => {
  try {
    v = jsonParse.jsonParse(replaceQuotes.replaceQuotes(v));
  } catch (e) {//
  }

  return isString.isString(v) ? trim.trim(v) : v;
};

var fixAttributes = arr => {
  var res = [];
  forEachLeft.forEachLeft(arr, _v => {
    var v = _v.map(v => tryJsonParse(toLowercase.toLowercase(v)));

    if (v.length < 2) v[1] = true;
    if (v[0][0] === '(' && last.last(v[0]) === ')') v[0] = v[0].slice(1, -1);
    if (v[1] === 'true' || v[1] === 'false') v[1] = v[1] === 'true';
    res.push([v[0], v[1]]);
  }); // console.log(res)

  return res;
};

var __OPTIONS__ = 'options';

var parseComponent = source => {
  var sections = {
    options: null,
    script: [],
    template: [],
    style: []
  };
  forEachLeft.forEachLeft(splitComponent.splitComponent(source), v => {
    var sectionName = v[0];

    if (!(sectionName in sections)) {
      utils.warn("The section \"" + sectionName + "\" not supports in Rease.");
    } else {
      var attrs = fixAttributes(parseAttributes.parseAttributes(jsx2tokens.jsx2tokens(v[1]).tokens));

      if (sectionName !== __OPTIONS__) {
        sections[sectionName].push({
          attributes: validateAttributes.validateAttributes(sectionName, attrs),
          code: v[2]
        });
      } else if (!sections[sectionName]) {
        sections[sectionName] = attrs;
      } else {
        sections[sectionName] = [...sections[sectionName], ...attrs];
        utils.warn("The section \"" + sectionName + "\" must be declared once.", 'It will be connected to the forward section.');
      }
    }
  });
  var options = validateAttributes.validateAttributes(__OPTIONS__, sections[__OPTIONS__] || []);
  delete sections[__OPTIONS__];
  return {
    options,
    sections
  };
};

exports.parseComponent = parseComponent;
