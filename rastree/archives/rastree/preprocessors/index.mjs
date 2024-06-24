/* eslint-disable */
/*
dester builds:
preprocessors/index.ts
*/
import { trycatch } from '@wareset-utilites/trycatch';
import { throwError } from '@wareset-utilites/error';
import { pugMixins } from './pug-mixins';
/* filename: preprocessors/index.ts
  timestamp: 2022-01-22T03:48:00.157Z */
// export type TypeFn = ((content: string) => string) | null

var error = (...a) => _content => throwError("Please install " + a.join(' or ') + " (npm i " + a[0] + ").");

var __sucrase__ = trycatch(() => {
  var compiler = require('sucrase');

  return content => {
    content = compiler.transform(content, {
      transforms: ['typescript']
    }).code; // console.log('sucrase', content)

    return content;
  };
});

var __typescript__ = trycatch(() => {
  var compiler = require('typescript');

  return content => {
    content = compiler.transpileModule(content, {
      compilerOptions: {
        module: compiler.ModuleKind.Latest,
        target: compiler.ScriptTarget.ESNext
      }
    }).outputText;
    content = content.replace(/export\s+\{\};?\s?/g, ''); // console.log('typescript', content)

    return content;
  };
});

var ts = __typescript__ || __sucrase__ || error('typescript', 'sucrase');

var __pug__ = trycatch(() => {
  var compiler = require('pug');

  return content => {
    content = compiler.render(pugMixins(content), {
      pretty: true,
      debug: false
    }); // console.log(['pug', content])

    return content;
  };
});

var pug = __pug__ || error('pug');

var __less__ = trycatch(() => {
  var compiler = require('less');

  return content => {
    compiler.render(content, {
      sync: true
    }, (_, res) => content = res.css); // console.log('less', content)

    return content;
  };
});

var less = __less__ || error('less');

var __stylus__ = trycatch(() => {
  var compiler = require('stylus');

  return content => {
    content = compiler(content).render(); // console.log('stylus', content)

    return content;
  };
});

var stylus = __stylus__ || error('stylus');

var __sass__ = trycatch(() => {
  var compiler = require('sass');

  return content => {
    content = compiler.renderSync({
      data: content
    }).css.toString(); // console.log('sass', content)

    return content;
  };
});

var sass = __sass__ || error('sass');

var scss = __sass__ || error('sass');

export { __sucrase__, __typescript__, less, pug, sass, scss, stylus, ts };
