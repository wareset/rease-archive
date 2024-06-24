import {
  TypeToken,
  jsx2tokens,
  prevRealTokenIndex, nextRealTokenIndex,
  TYPES
} from 'rastree/jsx2tokens'

/*
export { name1, name2, …, nameN };
export { variable1 as name1, variable2 as name2, …, nameN };
export let name1, name2, …, nameN; // или var
export let name1 = …, name2 = …, …, nameN; // или var, const

export default выражение;
export default function (…) { … } // или class, function*
export default function name1(…) { … } // или class, function*
export { name1 as default, … };

export * from …;
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
*/

const isRealToken = (token: TypeToken): boolean =>
  !(token.type === TYPES.SPACE ||
    token.type === TYPES.COMMENT_LINE || token.type === TYPES.COMMENT_BLOCK)

// TODO: export let name1, name2, …, nameN; // или var
export const getExports = (s: string, file: string, useJSX: boolean): any => {
  const tokens = jsx2tokens(s, { useJSX })
  // console.log(tokens)

  const imports: { [key: string]: any } = {}

  let j: number
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.value === 'export' &&
    ((j = prevRealTokenIndex(tokens, i)) < 0 || tokens[j].value !== '.') &&
    (j = nextRealTokenIndex(tokens, i)) > -1) {
      const token2 = tokens[j]
      if (token2.value === 'default') {
        imports.default = true
      } else if (/^(?:var|let|const|function|class)$/.test(token2.value)) {
        imports[tokens[nextRealTokenIndex(tokens, j)].value] = true
      } else if (token2.value === '*') {
        console.warn('export * from routes in \'' + file + '\' not support')
      } else if (token2.value === '{') {
        let inside = ''
        for (i = j + 1; i < tokens.length; i++) {
          if (tokens[i].value === '}') break
          else if (isRealToken(tokens[i])) inside += tokens[i].value + ' '
        }
        const insideArr = inside.trim().split(/\s*,\s*/).map((v) => v.split(/\s+as\s+/).pop())
        for (let k = insideArr.length; k--;) imports[insideArr[k]!] = true
      }
    }
  }

  // console.log(imports)
  return imports
}
