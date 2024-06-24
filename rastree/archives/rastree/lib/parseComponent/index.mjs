/* eslint-disable */
/*
dester builds:
lib/parseComponent.ts
*/
import { toLowercase } from '@wareset-utilites/string/toLowercase';
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { jsonParse } from '@wareset-utilites/lang/jsonParse';
import { isString } from '@wareset-utilites/is/isString';
import { trim } from '@wareset-utilites/string/trim';
import { last } from '@wareset-utilites/array/last';
import { jsx2tokens } from '@rastree/jsx2tokens';
import { splitComponent } from '../splitComponent';
import { validateAttributes } from '../validateAttributes';
import { parseAttributes } from '../../core/template/lib/parseAttributes';
import { replaceQuotes } from '../../core/utils/replaceQuotes';
import { warn } from '../utils';
/* filename: lib/parseComponent.ts
  timestamp: 2022-01-22T03:47:55.572Z */

var tryJsonParse = v => {
  try {
    v = jsonParse(replaceQuotes(v));
  } catch (e) {//
  }

  return isString(v) ? trim(v) : v;
};

var fixAttributes = arr => {
  var res = [];
  forEachLeft(arr, _v => {
    var v = _v.map(v => tryJsonParse(toLowercase(v)));

    if (v.length < 2) v[1] = true;
    if (v[0][0] === '(' && last(v[0]) === ')') v[0] = v[0].slice(1, -1);
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
  forEachLeft(splitComponent(source), v => {
    var sectionName = v[0];

    if (!(sectionName in sections)) {
      warn("The section \"" + sectionName + "\" not supports in Rease.");
    } else {
      var attrs = fixAttributes(parseAttributes(jsx2tokens(v[1]).tokens));

      if (sectionName !== __OPTIONS__) {
        sections[sectionName].push({
          attributes: validateAttributes(sectionName, attrs),
          code: v[2]
        });
      } else if (!sections[sectionName]) {
        sections[sectionName] = attrs;
      } else {
        sections[sectionName] = [...sections[sectionName], ...attrs];
        warn("The section \"" + sectionName + "\" must be declared once.", 'It will be connected to the forward section.');
      }
    }
  });
  var options = validateAttributes(__OPTIONS__, sections[__OPTIONS__] || []);
  delete sections[__OPTIONS__];
  return {
    options,
    sections
  };
};

export { parseComponent };
