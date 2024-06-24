/* eslint-disable */
/*
dester builds:
lib/splitComponent.ts
*/
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
/* filename: lib/splitComponent.ts
  timestamp: 2022-01-22T03:47:56.675Z */

var splitComponent = source => {
  var arr1 = [];
  var i, indexEnd;
  source.replace(/(<((?:rease-)?(?:script|style|template|options)\b)((?:\s(?:[^>`'"]+|(?:(`|'|")(?:[^\\]|\\\4|\\(?!\4).)*?(?:\4|$)))*)*?))(?:\/>|>(?:<\2[^]*?<\/\2|[^])*?(<\/\2[^]*?>))|<\/((?:rease-)?(?:script|style|template|options)\b)[^]*?>|(<!--[^]*?(?:-->|$))/g, (_full, _tagOp, _tagName, _attrs, _4, _tagCl, _tagFix, _cmt, _idx) => {
    // prettier-ignore
    // console.log([_full, _tagOp, _tagName, _attrs, _tagCl, _tagFix, _cmt, _idx])
    if (!_cmt) {
      if (!_tagFix) {
        indexEnd = _idx + _full.length - (_tagCl || ' ').length;
        arr1.push([_tagOp, _tagName, _attrs, _idx, indexEnd]);
      } else if ((i = arr1.length) && arr1.some(v => _tagFix === v[1])) {
        while (i-- && arr1[i][1] !== _tagFix) {
          arr1.pop();
        }

        if (arr1[i]) arr1[i][4] = _idx;
      }
    }

    return '';
  }); // console.table(arr1)

  var res = [];
  forEachLeft(arr1, v => {
    var tagArr = v[1].split('-');
    var i = v[0].length + v[3] + 1;
    res.push([tagArr[1] || tagArr[0], v[2], source.slice(i, v[4]), i]);
  });
  return res;
};

export { splitComponent };
