/* eslint-disable */
/*
dester builds:
core/utils/getDelimeter.ts
*/
import { enumChars } from 'enum-chars';
/* filename: core/utils/getDelimeter.ts
  timestamp: 2022-01-22T03:47:50.698Z */

var getDelimeter = (content, // eslint-disable-next-line default-param-last
salt = '_', type) => {
  var res;
  var rand = '';
  var fn = type && enumChars[type] ? enumChars[type] : enumChars.letters;

  do {
    rand = fn(rand);
  } while (content.indexOf(res = salt + rand) > -1);

  return res;
};

export { getDelimeter };
