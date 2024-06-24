import { Component as Component$0 } from 'rease'
import { getComponentProps as getProps$0 } from 'rease'
import { setStandardStyles as setStandardStyles$0 } from 'rease'
import { setReactiveStyles as setReactiveStyles$0 } from 'rease'

export default class Examples02 extends Component$0 {
  static cid = ['data', 'r1iwuflv']
  main() {
    const zzzz = this /* zzzz */
    const self = zzzz /* self */
    const props = getProps$0(self)
    const aaaa = props
    console.log(self, zzzz, props, aaaa)
    const asd = 12

    setStandardStyles$0(self, [
      (_jsaA, _jsaS) => () =>
        'div span' + _jsaS + '{' + _jsaA('color') + 'red;}'
    ])

    setReactiveStyles$0(self, [
      (_jsaA, _jsaI) => () =>
        (_jsaI = _jsaA([asd + 'px', 12], 1)) &&
        'div{' +
          _jsaA('margin') +
          '' +
          _jsaI[0] +
          ' calc(12px + ' +
          _jsaI[1] +
          ');}'
    ])

    return (_$$0, _tg$0, _tx$0) => [
      _tg$0(
        'div',
        [
          ['class', 'qwe ', asd],
          [':on', ['click', asd, 'asd3']],
          [':on', ['click', asd, 'asd4']]
        ],
        (_$$0) => [
          _tg$0('span', 0, (_$$0) => [
            _tx$0(['ttttttt ', asd, ' ', asd + 2, ' ', _$$0(() => asd + 2)])
          ])
        ]
      ),
      _tg$0('section', 0, (_$$0) => [
        _tx$0(['\n  ']),
        _tg$0('div', 0, (_$$0) => [
          _tx$0(['\n    ']),
          _tg$0('h1', 0, (_$$0) => [_tx$0(['Header'])]),
          _tx$0(['\n  '])
        ]),
        _tx$0(['\n'])
      ])
    ]
  }
}
