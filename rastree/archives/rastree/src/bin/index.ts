import minimist from 'minimist'

import { forEachLeft } from '@wareset-utilites/array/forEachLeft'
import { keys } from '@wareset-utilites/object/keys'

import { compile } from './compile'
import { logo as LOGO } from './logo'

const run = (): void => {
  const args = minimist(process.argv.slice(2), {
    default: { help: false, silent: false, css: false },
    string : ['input', 'output'],
    boolean: ['help', 'silent', 'css'],
    alias  : { h: 'help', i: 'input', o: 'output', s: 'silent' }
  })
  let input: string, output: string
  input = args.input || args._[0] || ''
  output = args.output || args._[1] || args._[0] !== input && args._[0] || ''
  input += '', output += ''
  // prettier-ignore
  forEachLeft(keys(args), (k) => {
    if (!k[1]) delete args[k]
  })

  if (args.help || !args.silent) console.log(LOGO)

  if (args.help) {
    console.log('TODO')
  } else {
    compile({ input, output, css: !args.css, debug: true })
  }
}

run()
