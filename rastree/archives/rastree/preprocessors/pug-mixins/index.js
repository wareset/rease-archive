/* eslint-disable */
/*
dester builds:
preprocessors/pug-mixins.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* filename: preprocessors/pug-mixins.ts
  timestamp: 2022-01-22T03:48:01.268Z */
// const MIXINS = `
// mixin if(condition)
// %_| {#if !{condition}}
// %_block
// %_| {/if}
// mixin else
// %_| {:else}
// %_block
// mixin elseif(condition)
// %_| {:else if !{condition}}
// %_block
// mixin key(expression)
// %_| {#key !{expression}}
// %_block
// %_| {/key}
// mixin each(loop)
// %_| {#each !{loop}}
// %_block
// %_| {/each}
// mixin await(promise)
// %_| {#await !{promise}}
// %_block
// %_| {/await}
// mixin then(answer)
// %_| {:then !{answer}}
// %_block
// mixin catch(error)
// %_| {:catch !{error}}
// %_block
// mixin html(expression)
// %_| {@html !{expression}}
// mixin debug(variables)
// %_| {@debug !{variables}}
// `;

var MIXINS = "\n\nmixin tag(condition)\n%_- var attrs = ''\n%_- for (attr in attributes) {\n%_-   attrs += ' ' + attr + '=' + JSON.stringify(attributes[attr])\n%_- }\n%_| <!{condition}!{attrs}>\n%_block\n%_| </>\n\nmixin if(condition)\n%_| {#if !{condition}}\n%_block\n%_| {/if}\n\nmixin else\n%_| {:else}\n%_block\n\nmixin elseif(condition)\n%_| {:else if !{condition}}\n%_block\n\nmixin each(loop)\n%_| {#each !{loop}}\n%_block\n%_| {/each}\n\nmixin __content__\n";

var getIndent = str => /\n\t/.test(str) ? '\t' : '  '; // export const pugMixins = (str: string): string =>
//   MIXINS.replace(/%_/g, getIndent(str)) + str + '\n+__content__'


var pugMixins = str => {
  var indent = getIndent(str);
  var res = MIXINS.replace(/%_/g, indent);
  var match1 = ((str.match(/^(\s+)/) || [])[1] || '') + 'a';
  var match2 = match1.match(/([^\n]+)\S/);
  res += (match2 ? match2[1] : indent) + '|\n';
  res += str + '\n+__content__\n';
  return res;
};

exports.pugMixins = pugMixins;
