import {
  TypeToken,
  jsx2tokens, TOKEN_TYPES,
  stringifyTokens, trimTokens,
  prevRealTokenIndex, nextRealTokenIndex
} from '../jsx2tokens'

import { chunkifyArrayBy } from '../utilites'

type TypeIMPORTERS = {
  readonly h: {
      need: boolean;
      readonly v: string;
  };
  readonly sys$: {
      need: boolean;
      readonly v: string;
  };
  readonly union: {
      need: boolean;
      readonly v: string;
  };
}

function text_normalize(s: string): string {
  const translate: any = { nbsp: '\xA0', amp: '&', quot: '"', lt: '<', gt: '>' }
  return s.replace(/&(nbsp|amp|quot|lt|gt);/g, function(o, k) { return translate[k] || o })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function chunkifyAttributes(tokens: TypeToken[]) {
  return chunkifyArrayBy(tokens, function(token, k, a) {
    const deep0 = a[0].deep
    const { deep, type, value } = token
    if (deep === deep0) {
      if (type === TOKEN_TYPES.SPACE ||
      /^[,;]$/.test(value)) {
        let j: number
        
        if (((j = prevRealTokenIndex(a, k)) < 0 || a[j].value !== '=') &&
        ((j = nextRealTokenIndex(a, k)) < 0 || a[j].value !== '=')) {
          return true
        }
      }
    }
    return false
  }, void 0, true)
    .map((tokens) =>
      chunkifyArrayBy(trimTokens(tokens), function(token, _k, a) {
        const deep0 = a[0].deep
        const { deep, value } = token
        return deep === deep0 && value === '='
      }, void 0, true).map((v) => stringifyTokens(trimTokens(v))))
    .filter(String)
}

function isNativeTag(s: string): boolean {
  return /^[a-z][a-zA-Z0-9-]*$/.test(s)
}
function fixName(s: string): string {
  return /^[$_a-z][$\w]*$/i.test(s) ? s : JSON.stringify(s)
}

// function needGetter(value: string, $?: string): [string, boolean] {
//   let res = false

//   if ($) {
//     let tokens = trimTokens(jsx2tokens(value, { useJSX: true }))
//     if (
//       tokens[0] && tokens[0].value === $ &&
//       tokens[1] && tokens[1].value === '(' &&
//       tokens[tokens.length - 1].value === ')'
//     ) {
//       tokens = tokens.slice(2, -1)
//       if (res = tokens.every((v) => v.deep > 0)) {
//         value = stringifyTokens(tokens)
//       }
//     }
//   }

//   return [value, res]
// }

function needGetter(value: string): boolean {
  let res = false
  let curlies = 0

  jsx2tokens(value, {
    useJSX: true,
    proxy : (token, k, a) => {
      if (token.type === TOKEN_TYPES.PUCNTUATOR) {
        if (
          curlies === 0 &&
          /^[.([]$/.test(token.value) &&
          (k = prevRealTokenIndex(a, k)) > -1 &&
          (a[k].type !== TOKEN_TYPES.PUCNTUATOR || /^[.})\]!]$/.test(a[k].value))
        ) {
          return res = true
        }

        if (token.value === '(') curlies++
        else if (token.value === ')') curlies--
      }

      return false
    }
  })

  return res
}

function parse(tokens: TypeToken[], IMPORTERS: TypeIMPORTERS): string {
  const isChildless = tokens[tokens.length - 1].type === TOKEN_TYPES.JSX_TAG_OPENER_END_CHILDLESS

  let j = tokens.length
  if (!isChildless) {
    for (;tokens.pop()!.type !== TOKEN_TYPES.JSX_TAG_CLOSER_START && tokens.length;);
    for (j = 0; tokens[j++].type !== TOKEN_TYPES.JSX_TAG_OPENER_END && tokens.length;);
  }

  const chunks = chunkifyAttributes(tokens.splice(0, j).slice(0, -1))
  // console.log(chunks)
  let tag = chunks[0] && chunks[0].length < 2 && chunks.shift()![0] || 'r-fragment'
  if (!tag || tag === 'r-fragment') tag = '""'
  else if (isNativeTag(tag)) tag = '"' + tag + '"'
  let propsAll: string[] = ['{']
  let propsUse: string[] = ['{']
  let propsNow = propsUse
  for (let name: string, value: string, isExp: any, i = 0; i < chunks.length; i++) {
    if (name = chunks[i][0]) {
      if (name[0] === '{') {
        name = stringifyTokens(
          trimTokens(
            jsx2tokens(name.slice(1, -1).trim(), { useJSX: true })
          )
        )
        name = name.replace(/^\.\.\./, '').trim()
        if (name) {
          propsAll[propsAll.length - 1] += '}'
          propsAll.push(name, '{')
        }
      } else {
        value = chunks[i][1] || ''
        if (isExp = value[0] === '{') value = value.slice(1, -1)
        if (!value) {
          if (name[0] !== 'r' || name[1] !== '-') value = 'true'
          else continue
        }

        if (name === 'className') name = 'class'
        name = fixName(name)
        
        // name[0] = '"'
        propsNow =
          name[1] !== 'r' || name[2] !== '-' ||
          name[3] === 'o' && name[4] === 'n' && name[5] === '-'
            ? propsAll
            : propsUse

        propsNow[propsNow.length - 1] +=
          name[0] === 'r' && name[1] === '-' ||
          !isExp || propsNow === propsUse && name !== '"r-is"' || !needGetter(value)
            ? ` ${name}: ${value},`
            : ` get ${name}() { return (${value}) },`
      }
    }
  }
  propsAll[propsAll.length - 1] += '}'
  propsAll = propsAll
    .filter((v) => v !== '{}')
    .map((v) => v.replace(/,\}$/, ' }'))

  propsUse[propsUse.length - 1] += '}'
  propsUse = propsUse
    .filter((v) => v !== '{}')
    .map((v) => v.replace(/,\}$/, ' }'))

  let props = propsAll.join(', ') || 'null'
  if (propsAll.length > 1) {
    IMPORTERS.union.need = true
    props = `${IMPORTERS.union.v}(${props})`
  }

  props += ', ' + (propsUse.join(', ') || 'null')

  // const props = propsAll.length ? `${propsAll.join(', ')}` : 'null'
  const resArr: [string, string][] = [[tag, ''], [props, '']]

  // console.log(tokens)

  let token: TypeToken

  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i]
    switch (token.type) {
      case TOKEN_TYPES.JSX_TEXT: {
        let s1 = '', s2 = '', v = token.value
        let m = v.match(/^\s*\n\s*/)
        if (m) s1 = m[0], v = v.slice(s1.length)
        m = v.match(/\s*\n\s*$/)
        if (m) s2 = m[0], v = v.slice(0, -s2.length)

        if (v) resArr.push([s1 + JSON.stringify(text_normalize(v)), s2])
        else resArr[resArr.length - 1][1] += s1 + v + s2
        break
      }
      case TOKEN_TYPES.JSX_EXPRESSION_START: {
        for (j = i; tokens[++j].type !== TOKEN_TYPES.JSX_EXPRESSION_END;);
        const chunk = tokens.splice(i + 1, j - i).slice(0, -1)
        let v = stringifyTokens(chunk)
        if (needGetter(v)) {
          IMPORTERS.sys$.need = true
          v = `${IMPORTERS.sys$.v}(() => (${v}))`
        }
        if (trimTokens(chunk).length) resArr.push([v, ''])
        else resArr[resArr.length - 1][1] += v
        break
      }
      default:
        resArr.push([token.value, ''])
    }
  }

  let res = ''
  for (let i = 0, v: any; i < resArr.length;) {
    v = resArr[i++]
    res += v[0]
    if (i < resArr.length) res += ', '
    res += v[1]
  }

  return res
}

export function jsx(
  source: string,
  {
    useJSX = true,
    importPath = 'rease'
  } = {}
): any {
  if (!useJSX) return source

  // const import$ = importPath + '/$'
  // let $: string

  const identifiers: any = {}
  const tokens = jsx2tokens(source, {
    useJSX,
    proxy(token) {
      if (token.type === TOKEN_TYPES.IDENTIFIER) identifiers[token.value] = true
      // else if (
      //   !$ &&
      //   token.type === TOKEN_TYPES.STRING &&
      //   token.value.slice(1, -1) === import$
      // ) {
      //   // Выпиливаем import 'rease/$'
      //   const j = prevRealTokenIndex(a, k)
      //   if (j > -1 && a[j].value === 'from') {
      //     const deep = token.deep
      //     let i = k
      //     for (let token2: TypeToken; i-- > 0;) {
      //       if ((token2 = a[i]).deep === deep) {
      //         if (token2.value === 'import') {
      //           a.splice(i, k - i + 1)
      //           break
      //         }
      //         if (token2.type === TOKEN_TYPES.IDENTIFIER) $ = token2.value
      //       }
      //     }
      //   }
      // }
    }
  })

  let n = 0
  let _h = 'h'; while (_h + n in identifiers) n++; _h += n
  let _sys$ = 'sys$'; while (_sys$ + n in identifiers) n++; _sys$ += n
  let _union = 'union'; while (_union + n in identifiers) n++; _union += n

  const IMPORTERS: TypeIMPORTERS = {
    h    : { need: false, v: _h },
    sys$ : { need: false, v: _sys$ },
    union: { need: false, v: _union },
  }

  const openerStartIds: number[] = []
  let token: TypeToken
  for (let i = 0; i < tokens.length; i++) {
    token = tokens[i]
    switch (token.type) {
      case TOKEN_TYPES.JSX_TAG_OPENER_START:
        IMPORTERS.h.need = true
        openerStartIds.push(i)
        break
      case TOKEN_TYPES.JSX_TAG_OPENER_END_CHILDLESS:
      case TOKEN_TYPES.JSX_TAG_CLOSER_END: {
        const openerStartId = openerStartIds.pop()!
        const res = parse(tokens.splice(openerStartId + 1, i - openerStartId), IMPORTERS)
        i = openerStartId
        tokens[i].value = `${IMPORTERS.h.v}(${res})`
        tokens[i].type = TOKEN_TYPES.MODIFIER
        break
      }
      default:
    }
  }

  let importer = ''
  for (const k in IMPORTERS) {
    // @ts-ignore
    if (IMPORTERS[k].need) {
      // @ts-ignore
      importer += `import { ${k} as ${IMPORTERS[k].v} } from "${importPath}";\n`
    }
  }

  const res = importer + stringifyTokens(tokens)

  return res
}

// console.log(jsx(`
// () => {
//   <>
//     <App qqq={asdf as any} aa="33" 
//     // rgr
//     {...aaa} tt={<tt r=345>!!! {sd} aa</tt>}> 
//       <e/>
//       sometext &nbsp; &amp;

//       <a>
//         {
//           // 54645
//           123213 + 444 /*  */
//         }
//         {/* yt */ <ww>as</ww>}
//       </a>
      
//       <r-slot/>

//       {dgf}y
//       ffrer
//     </App>
//   </>
// }

// ;(
//   <yyy/>
// )
// `))
