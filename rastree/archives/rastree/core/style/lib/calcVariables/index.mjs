/* eslint-disable */
/*
dester builds:
core/style/lib/calcVariables.ts
*/
import { findIndexLeft } from '@wareset-utilites/array/findIndexLeft';
import { findIndexRight } from '@wareset-utilites/array/findIndexRight';
import { includes } from '@wareset-utilites/array/includes';
import { roundTo } from '@wareset-utilites/math/roundTo';
import { trim } from '@wareset-utilites/string/trim';
import { throwError } from '@wareset-utilites/error';
import { isNaN } from '@wareset-utilites/is/isNaN';
import { pow } from '@wareset-utilites/math/pow';
import { replaceQuotes } from '../../../utils/replaceQuotes';
/* filename: core/style/lib/calcVariables.ts
  timestamp: 2022-01-22T03:47:37.126Z */

var getUnit = v => {
  var res;
  if (v && !isNaN(+v)) res = [+v, ''];else {
    // const match = v.match(/(cm|mm|in|px|pt|px|em|ex|rem|vw|vh|vmin|vmax|%)$/)
    var match = v.match(/[.\d](%|[a-z]+)$/);

    if (match) {
      v = v.slice(0, -match[1].length);
      if (v && !isNaN(+v)) res = [+v, match[1]];
    }
  }
  return res;
};

var __math__ = (arr, operators, reverse) => {
  var i = reverse ? arr.length : -1;
  var wcb = reverse ? () => i-- : () => ++i < arr.length;
  var node0, node1, node2;
  var j1, j2;
  var n1, n2;
  var n10, n20, res;

  while (wcb()) {
    if ((node0 = arr[i]) && includes(operators, node0[2])) {
      j1 = findIndexRight(arr, v => v[1] !== 3, arr.length - i);
      j2 = findIndexLeft(arr, v => v[1] !== 3, i + 1);

      if ((node1 = arr[j1]) && (node2 = arr[j2]) && !node1[1] && !node2[1]) {
        n1 = getUnit(node1[2]);
        n2 = getUnit(node2[2]);

        if (n1 && n2 && (n1[1] === n2[1] || !n1[1] !== !n2[1])) {
          n10 = +n1[0];
          n20 = +n2[0];

          switch (node0[2]) {
            case '**':
              res = pow(n10, n20);
              break;

            case '*':
              res = n10 * n20;
              break;

            case '/':
              res = n10 / n20;
              break;

            case '%':
              res = n10 % n20;
              break;

            case '+':
              res = n10 + n20;
              break;

            case '-':
              res = n10 - n20;
              break;

            default:
              throwError(__math__.name);
          }

          res = roundTo(res, 15);
          arr[j1] = [node1[0], 0, res + (n1[1] || n2[1])];
          arr.splice(j1 + 1, j2 - j1);
          return true;
        }
      }
    }
  }

  return false;
};

var mathematics = arr => {
  var i = -1;
  var node0, node1, node2;

  while (++i < arr.length) {
    if ((node0 = arr[i]) && (node1 = arr[i + 1]) && (node2 = arr[i + 2])) {
      if (node0[2] === '(' && node2[2] === ')' && getUnit(node1[2])) {
        node1[0]--, arr[i] = node1, arr.splice(i + 1, 2);
        if ((node0 = arr[i - 1]) && node0[2] === 'calc') arr.splice(--i, 1);
        i -= 2;
      }
    }
  }

  [['**'], ['*', '/', '%'], ['+', '-']].some((v, k) => __math__(arr, v, !k)) && mathematics(arr);
};

var calcVariables = (source, mathCalcOnly) => {
  var arr = [];
  var deep = 0;
  var other = '';
  trim(source).replace(/((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))|(\*{1,2}|(?<=\s)\/|\/(?=\s)|%|(?<=[\w.%]\s*)[-+](?=\s+[-+\w.])|(?<=[\w.%])[-+](?=[-+\w.]))|(\(\s*|\s*\))|(\s+)|([^]%?)|$/g, (_full, _string, _2, _operator, _bracket, _space, _other) => {
    // console.log([_string, _comment, _operator, _bracket, _space, _other])
    var type = 0;

    if (_other === '/' && deep) {
      _operator = _other;
      _other = '';
    }

    if (_other) {
      other += _full;
    } else {
      if (other) {
        var isCalc;
        if (isCalc = /\bcalc$/.test(other)) other = other.slice(0, -4);
        if (other) arr.push([deep, type, other]), other = '';
        if (isCalc) arr.push([deep, type, 'calc']);
      }

      if (_full) {
        if (_operator) type = 1;else if (_space) type = 3, _full = ' ';else if (_bracket) type = 2, _full = trim(_full);else if (_string) type = 4, _full = replaceQuotes(_full);
        if (_full === ')') deep--;
        arr.push([deep, type, _full]);
        if (_full === '(') deep++;
      }
    }

    return '';
  }); // console.log(arr)

  if (mathCalcOnly) {
    var node0, j;
    var i = arr.length;

    var fn = (v, k) => v[2] === 'calc' && v[0] === node0[0] && arr[k + 1][2] === '(';

    while (i--) {
      if (node0 = arr[i]) {
        if (node0[2] === ')' && (j = findIndexRight(arr, fn, // eslint-disable-next-line no-loop-func
        // (v, k) => v[2] === 'calc' && v[0] === node0[0] && arr[k + 1][2] === '(',
        arr.length - i)) > -1) {
          i = j;
        } else node0[1] = 4;
      }
    }
  }

  mathematics(arr);
  return arr.map(v => v[2]).join('');
};

export { calcVariables };
