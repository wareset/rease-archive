import { findIndexLeft } from '@wareset-utilites/array/findIndexLeft'
import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { isArray } from '@wareset-utilites/is/isArray'
import { trim } from '@wareset-utilites/string/trim'

import { clone } from '../../utils/clone'
import { replaceQuotes } from '../../utils/replaceQuotes'

type TypeNode = [number, number, string, string]

export const GLOBAL = ':global'
export const SCOPED = ':scoped'
export const STATED = ':stated'

const isGlobalOrScopedOrStated = (v: string): boolean =>
  /^:(global|scoped|stated)$/.test(v)

const setScopeType = (
  arr: TypeNode[],
  deepBase?: number,
  scopeBase?: string
): TypeNode[] => {
  deepBase = +deepBase! || 0
  scopeBase = scopeBase || STATED
  const res = []

  let scope = scopeBase
  let deep: number, type, content, node, idx
  let i = -1
  while (++i < arr.length) {
    [deep, type, content] = node = arr[i]
    if (type === 1) {
      if ((node = arr[i + 1]) && node[2] === '(') {
        // eslint-disable-next-line no-loop-func
        idx = findIndexLeft(arr, (v) => v[0] === deep && v[2] === ')', i)
        if (idx < 0) throw new Error('Error css')
        res.push(...setScopeType(
          arr.splice(i, idx - i-- + 1).slice(2, -1), ++deep, content
        ))
      } else {
        scope = content
      }
    } else {
      if (content === ',') scope = scopeBase
      else if (!type && deep === deepBase) node[3] = node[3] || scope
      res.push(node)
    }
  }

  return res
}

const fixList = (arr: TypeNode[]): TypeNode[] => {
  let rtype = ''
  let node0: TypeNode, node1: TypeNode
  let i = -1
  while (++i < arr.length) {
    node0 = arr[i]
    node1 = arr[i + 1]

    if (
      node0 &&
      node0[1] === 2 &&
      (!i ||
        !node1 ||
        node1[1] === 2 &&
          (node1[2] =
            trim((node0[2] === ',' ? ',' : '') + node1[2] + node0[2])[0] ||
            ' '))
    ) {
      arr.splice(i--, 1) // , (i = i || 1)
    } else if (node0 && node1 && (rtype = node0[3]) && node1[2] === '(') {
      node0[3] = ''
      // eslint-disable-next-line no-loop-func
      findIndexLeft(arr, (v) =>
        !!(v[0] === node0[0] && v[2] === ')' && (v[3] = v[3] || rtype)), i)
    } else if (node0 && node1 && !node0[1] && !node1[1]) {
      arr.splice(1 + i--, 1), node0[2] += node1[2]
    }
  }
  return arr
}

export const selector2ListDirty = (source: string): TypeNode[][] => {
  let current: TypeNode[] = []
  const arr: TypeNode[][] = [current]
  let nodeLast: TypeNode

  let type: number
  let rtype = ''
  let other = ''
  let deep = 0
  let sqts = 0
  source.replace(
    /((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))|(&)|\s*([,>+~])\s*|([()])|(\s+)|([^\s,&>+~()[\]`'"]+|\[|\]|$)/g,
    (_full, _string, _2, _ampersand, _punct, _brackets, _space, _other) => {
      // console.log([_full, _string, _punct, _space, _other])

      if (sqts) {
        if (!_other && !_string) _other = _full
        if (_space) _full = ''
      }

      type = 0
      if (_other || _string) {
        if (_other) {
          if (_full === '[') sqts++
          else if (_full === ']') sqts--
          else if (!isGlobalOrScopedOrStated(_full)) {
            _full = _full.replace(
              /:(global|scoped|stated)\b/g, (a) => (rtype = a) && ''
            )
          } else if (nodeLast && nodeLast[2] === ')') nodeLast[3] = _full, _full = ''
        } else {
          _full = replaceQuotes(_full)
        }

        other += _full
      } else {
        if (other) {
          if (isGlobalOrScopedOrStated(other)) type = 1
          current.push(nodeLast = [deep, type, other, rtype])
          other = '', rtype = ''
        }

        if (_space) type = 2, _full = ' '
        else if (_punct) {
          if (deep || _punct !== ',') type = 2, _full = _punct
          else {
            // let d2 = 0,
            //   d3: number
            // const currentLast = current
            // lastCurrents.push(current)
            // if (deep) while (d2++ < deep) current.push([deep - d2, 3, ')', ''])
            // console.log(111, [...current])
            arr.push(current = []), _full = ''
            // if (d2)
            //   while (--d2) {
            //     d3 = deep - d2 + 1
            //     current.push(
            //       clone(
            //         findRight(
            //           currentLast,
            //           (v, k, a) => (v = a[k + 1]) && v[0] === d3 && v[2] === '('
            //         )
            //       )
            //     )
            //     current.push([d3, 3, '(', ''])
            //   }
            // console.log(222, current)
          }
        } else if (_brackets) type = 3, deep += _full === '(' ? 1 : -1

        if (_full) {
          current.push(nodeLast = [deep, type, _full, ''])
        }
      }

      return ''
    }
  )
  // console.log(clone(arr))

  forEachLeft(arr, (_v) => {
    if (!_v.some((v) => v[2] === '&')) {
      _v.unshift([0, 0, '&', ''], [0, 2, ' ', ''])
    }
    // fixList((arr[_k] = setScopeType(_v)))
  })

  // arr = setScopeType(arr)

  // console.log(arr)
  // console.log(JSON.stringify(arr, null, 2))

  // console.log(res)
  return arr
}

const joinListDirtyArr = (arr: TypeNode[][][]): TypeNode[][] => {
  const lastOrigin = arr.pop() || [[]]
  const len = arr.length
  const prev = clone(arr.pop() || [[]])

  let res: TypeNode[][] = []
  let prevNodes: TypeNode[], i: number
  while (prev.length) {
    prevNodes = prev.shift()!
    // eslint-disable-next-line no-loop-func
    forEachLeft(clone(lastOrigin), (last: TypeNode[]) => {
      res.push(last)
      i = last.length
      while (i--) {
        // eslint-disable-next-line no-loop-func
        if (last[i][2] === '&') last.splice(i, 1, ...clone(prevNodes).map((v: any) => (v[0] += last[i][0], v)))
      }
    })
  }

  if (len) res = joinListDirtyArr([...arr, res])
  return res
}

export const listDirty2List = (listDirty: TypeNode[][]): string[] => {
  const res: string[] = []
  let node0: TypeNode
  forEachLeft(listDirty, (_v) => {
    const arr = fixList(setScopeType(_v))
    if (arr.length) {
      if (res.length) res.push(',', '')

      let rtype = ''
      let i = -1
      while (++i < arr.length) {
        node0 = arr[i]
        if (!rtype && res[0]) res[res.length - 1] += node0[2]
        else res.push(node0[2])
        if (rtype = node0[3]) res.push(rtype)
      }
    }
  })

  return res
}

export const selector2List = (
  sourceOrSourceList: string | string[]
): string[] | any => {
  if (!isArray(sourceOrSourceList)) sourceOrSourceList = [sourceOrSourceList]
  return listDirty2List(
    joinListDirtyArr(sourceOrSourceList.map((v) => selector2ListDirty(v)))
  )
}

// TODO
// asd[a = 'aaa']
// пробелы внутри короьки

// const cssclass =
//   '+ ~div:not(.asf:scoped:not(:stated(.a .zxc))):global +,ttt ~ :global(zxc :stated(.dfg) zxxxxxx) a(as) + :scoped + ~ > span:asd[as="ede"] :stated'
// console.log(cssSelector2List(cssclass))
