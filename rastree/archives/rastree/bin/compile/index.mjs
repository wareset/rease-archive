/* eslint-disable */
/*
dester builds:
bin/compile.ts
*/
import { toCodeSnakecase } from '@wareset-utilites/string/toCodeSnakecase';
import { toCapitalize } from '@wareset-utilites/string/toCapitalize';
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify';
import { forEachLeft } from '@wareset-utilites/array/forEachLeft';
import { isObject } from '@wareset-utilites/is/isObject';
import { trycatch } from '@wareset-utilites/trycatch';
import { keys } from '@wareset-utilites/object/keys';
import { bgRed, white, bold, red } from 'kleur';
import { statSync, readFileSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { resolve, parse, dirname, extname, join } from 'path';
import rastree from '../..';
import { parseComponent } from '../../lib/parseComponent';
import { validateCid, isValidVariable } from '../../lib/utils';
import * as preprocessors from '../../preprocessors';
/* filename: bin/compile.ts
  timestamp: 2022-01-22T03:47:19.341Z */

var undef;

var messageError = (...a) => {
  var res = a.map(v => isObject(v) ? jsonStringify(v, undef, 2) : v).join('\n').split('\n').map(v => bgRed(white(' ' + v + ' '))).join('\n');
  res = bold(red(' ERROR: \n')) + res;
  throw res;
};

var fnFalse = () => false;

var fakeStat = file => trycatch(() => statSync(file), {
  isFile: fnFalse,
  isDirectory: fnFalse
});

var compile = ({
  code,
  input,
  output,
  css = true,
  debug
}) => {
  if (!input && !code) messageError('Please specify the "Input" file');

  if (input) {
    input = resolve(input);
    if (!fakeStat(input).isFile()) messageError('"Input" is not a file:', input);
  } // console.log(args)
  // console.log({ input, output })


  var component = parseComponent(code || readFileSync(input).toString());
  var {
    options,
    sections
  } = component;
  options.cid = validateCid(options.cid, input);

  options.name = (name => {
    if (!name || !isValidVariable(name)) {
      var inputParse = parse(input);
      name = toCodeSnakecase(inputParse.name);

      if (!isValidVariable(name)) {
        var inputArr = inputParse.dir.split(/[/\\]+/);

        while (inputArr.length && !isValidVariable(name)) {
          name = toCodeSnakecase(inputArr.pop() + ' ' + name);
        }

        if (!isValidVariable(name)) {
          name = 'Rease_' + name;
          if (!isValidVariable(name)) name = 'Rease_';
        }
      }
    }

    name = toCapitalize(name) + '_' + options.cid;
    return name;
  })(options.name);

  forEachLeft(keys(sections), sectionName => {
    var section = sections[sectionName];
    forEachLeft(section, ({
      attributes
    }, k) => {
      var src = attributes.src;

      if (src) {
        section[k].code = readFileSync(resolve(dirname(input || __filename), src)).toString();
      }

      var lang = attributes.lang || src && extname(src).slice(1);

      if (lang) {
        if (lang === attributes.lang && !(lang in preprocessors)) {
          messageError("Lang \"" + lang + "\" not support");
        }

        if (lang in preprocessors) {
          section[k].code = preprocessors[lang](section[k].code);
        } // console.log(section[k].code)
        // console.log(attributes)

      }
    });
  }); // console.log(options)
  // console.log(jsonStringify(sections, undefined, 2))

  var res = rastree(component, {
    externalCss: !css
  });

  if (debug) {
    if (!output) {
      output = input || messageError('Please specify the "Output" file');
    } else output = resolve(output);

    if (fakeStat(output).isDirectory()) {
      output = join(output, parse(input).base);
    }

    var {
      cssExternal,
      codeClient
      /* , codeServer */

    } = res;
    mkdirSync(dirname(output), {
      recursive: true
    });
    writeFileSync(output + '.client.js', codeClient); // fsWriteFileSync(output + '.server.js', codeServer)

    if (!css) writeFileSync(output + '.css', cssExternal);else trycatch(() => unlinkSync(output + '.css'));
  }

  return res;
};

export { compile };
