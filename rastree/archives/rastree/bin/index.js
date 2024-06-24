/* eslint-disable */
/*
dester builds:
bin/index.ts
*/
'use strict';

var minimist = require('minimist');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var keys = require('@wareset-utilites/object/keys');

var compile = require('./compile');

var logo = require('./logo');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var minimist__default = /*#__PURE__*/_interopDefaultLegacy(minimist);
/* filename: bin/index.ts
  timestamp: 2022-01-22T03:47:22.074Z */


var run = () => {
  var args = minimist__default["default"](process.argv.slice(2), {
    default: {
      help: false,
      silent: false,
      css: false
    },
    string: ['input', 'output'],
    boolean: ['help', 'silent', 'css'],
    alias: {
      h: 'help',
      i: 'input',
      o: 'output',
      s: 'silent'
    }
  });
  var input, output;
  input = args.input || args._[0] || '';
  output = args.output || args._[1] || args._[0] !== input && args._[0] || '';
  input += '', output += ''; // prettier-ignore

  forEachLeft.forEachLeft(keys.keys(args), k => {
    if (!k[1]) delete args[k];
  });
  if (args.help || !args.silent) console.log(logo.logo);

  if (args.help) {
    console.log('TODO');
  } else {
    compile.compile({
      input,
      output,
      css: !args.css,
      debug: true
    });
  }
};

run();
