/* eslint-disable */
/*
dester builds:
core/template/lib/utils.ts
*/
import { isArray } from '@wareset-utilites/is/isArray';
import { source2Tokens } from '../source2Tokens';
import { clone } from '../../../utils/clone';
/* filename: core/template/lib/utils.ts
  timestamp: 2022-01-21T16:28:06.650Z */

var getTokens = (tokensOrString, isClone) => isArray(tokensOrString = tokensOrString || []) ? isClone ? clone(tokensOrString) : tokensOrString : source2Tokens(tokensOrString).tokens;

export { getTokens };
