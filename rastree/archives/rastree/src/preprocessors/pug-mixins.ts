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

const MIXINS = `

mixin tag(condition)
%_- var attrs = ''
%_- for (attr in attributes) {
%_-   attrs += ' ' + attr + '=' + JSON.stringify(attributes[attr])
%_- }
%_| <!{condition}!{attrs}>
%_block
%_| </>

mixin if(condition)
%_| {#if !{condition}}
%_block
%_| {/if}

mixin else
%_| {:else}
%_block

mixin elseif(condition)
%_| {:else if !{condition}}
%_block

mixin each(loop)
%_| {#each !{loop}}
%_block
%_| {/each}

mixin __content__
`

const getIndent = (str: string): string => /\n\t/.test(str) ? '\t' : '  '

// export const pugMixins = (str: string): string =>
//   MIXINS.replace(/%_/g, getIndent(str)) + str + '\n+__content__'

export const pugMixins = (str: string): string => {
  const indent = getIndent(str)
  let res = MIXINS.replace(/%_/g, indent)
  const match1 = ((str.match(/^(\s+)/) || [])[1] || '') + 'a'
  const match2 = match1.match(/([^\n]+)\S/)
  res += (match2 ? match2[1] : indent) + '|\n'
  res += str + '\n+__content__\n'
  return res
}
