/* eslint-disable */
/*
dester builds:
index.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');

var forEachLeft = require('@wareset-utilites/array/forEachLeft');

var endsWith = require('@wareset-utilites/string/endsWith');

var trimLeft = require('@wareset-utilites/string/trimLeft');

var isString = require('@wareset-utilites/is/isString');

var trim = require('@wareset-utilites/string/trim');

var keys = require('@wareset-utilites/object/keys');

var parseComponent = require('./lib/parseComponent');

var utils = require('./lib/utils');

var style = require('./core/style');

var template = require('./core/template');

var extractImports = require('./core/script/lib/extractImports');

var getDelimeter = require('./core/utils/getDelimeter');
/* filename: index.ts
  timestamp: 2022-01-22T03:47:54.335Z */
// const sections = rastreeParseComponent(rease)
// applyAllAttributes(sections)


var __createComponent__ = ({
  name = '',
  cid = '',
  imports = {},
  code = '',
  module = '',
  template = '',
  // needScoper,
  // scoper = ``,
  cssJsVars,
  cssNoVars
} = {}) => {
  var __d__ = getDelimeter.getDelimeter(code + module + name);

  var res = '/* eslint-disable */\n'; // res +=
  //   '/* eslint-disable @typescript-eslint/explicit-function-return-type */\n'
  // res += `import { RComponent as ReaseComponent${__d__} } from "rease";\n`
  // let cid = ``
  // if (needScoper && scoper) {
  //   cid = `  static cid = ${scoper}\n`
  // }

  var reaseThis = '';
  var reaseThisName = 'this';
  var reaseProps = ''; // imports
  // console.log(imports)

  forEachLeft.forEachLeft(keys.keys(imports), srcName => {
    var src = imports[srcName];
    var props = []; // console.log(src)

    if (srcName !== extractImports.__REASE_COMPONENT__) {
      forEachLeft.forEachLeft(keys.keys(src), iName => {
        // console.log(iName)
        if (iName === '*') {
          forEachLeft.forEachLeft(src[iName], v => {
            res += "import * as " + v + " from " + jsonStringify.jsonStringify(srcName) + ";\n";
          });
        } else if (iName === '@') res += "import " + jsonStringify.jsonStringify(srcName) + ";\n";else {
          // prettier-ignore
          props.push(...src[iName].map(v => v === iName ? v : iName + ' as ' + v));
        }
      });
    } else {
      srcName = 'rease';
      forEachLeft.forEachLeft(keys.keys(src), iName => {
        if (iName === 'default') {
          reaseThis += src[iName].map(v => "    const " + v + " = " + reaseThisName + "; /* " + (reaseThisName = v) + " */\n").join('');
        } else if (iName === 'props') {
          var propsArr = [...src[iName]];
          var props0 = propsArr.shift();
          props.push('getProperty as getProps' + __d__);
          reaseProps += "    const " + props0 + " = getProps" + __d__ + "(" + reaseThisName + ");\n";
          reaseProps += propsArr.map(v => "    const " + v + " = " + props0 + ";\n").join('');
        }
      });
    } // console.log(props)


    if (props.length) {
      res += "import { " + props.join(', ') + " } from " + jsonStringify.jsonStringify(srcName) + ";\n";
    }
  });
  var ordinaryStyles = (cssNoVars || []).join(', ');
  var reactiveStyles = (cssJsVars || []).join(', '); // prettier-ignore

  if (ordinaryStyles) {
    // res += `import { ordinaryStyles as ordinaryStyles${__d__} } from "rease";\n`
    // ordinaryStyles = `\nordinaryStyles${__d__}(${name}, [${ordinaryStyles}]);\n`
    ordinaryStyles = name + ".css = " + ordinaryStyles;
  } // prettier-ignore


  if (reactiveStyles) {
    // res += `import { reactiveStyles as reactiveStyles${__d__} } from "rease";\n`
    // reactiveStyles = `  reactiveStyles${__d__}(${name}, [${reactiveStyles}]);\n`
    reactiveStyles = "    ," + reactiveStyles;
  }

  if (res) res += '\n';
  if (module = trim.trim(module)) res += module + '\n';
  if (res) res += '\n'; // prettier-ignore

  res += "export default function " + name + "() {\n" + reaseThis + reaseProps + trimLeft.trimLeft(code) + "\n  return [\n" + template + "\n" + reactiveStyles + "\n  ]\n}\n" + name + ".cid = " + jsonStringify.jsonStringify(cid) + "\n" + ordinaryStyles + "\n" + name + ".nid = 0\n"; // console.log(res)

  return res;
};

var rastree = (source, {
  externalCss = false
} = {}) => {
  var {
    options,
    sections
  } = isString.isString(source) ? parseComponent.parseComponent(source) : source;
  var {
    script,
    style: style$1,
    template: template$1
  } = sections; // console.log('options', options)

  var cid = options.cid = utils.validateCid(options.cid);
  var [scoper] = utils.createScoper(cid, options['css-scope-type']); // console.log('scoper', [cid, scoper, scoperInject])
  // console.log(style)
  // const styles = []
  // let needScoper = false

  var cssExternal = '';
  var cssJsVars = [];
  var cssNoVars = [];
  forEachLeft.forEachLeft(style$1, ({
    attributes,
    code
  }) => {
    if (trim.trim(code)) {
      // console.log(attributes)
      // console.log(code)
      var css = style.style(code, {
        global: !attributes.scoped || attributes.global,
        calc: attributes['--calc'],
        js: attributes['--js'],
        externalCss,
        scoper
      }); // console.log(css)
      // if (css.needScoper) needScoper = true

      if (css.cssExternal) cssExternal += '\n' + css.cssExternal;
      if (css.cssJsVars) cssJsVars.push(css.cssJsVars);
      if (css.cssNoVars) cssNoVars.push(css.cssNoVars); // styles.push(css)
      // console.log(css)
      // console.log(css.cssExternal)
    }
  });
  cssExternal = trimLeft.trimLeft(cssExternal); // console.log(styles)
  // console.log(template)

  var templateClientCodeDirty = ''; // let templateServerCodeDirty = ''

  forEachLeft.forEachLeft(template$1, ({
    attributes,
    code
  }) => {
    if (code = trimLeft.trimLeft(code)) {
      if (attributes.client) templateClientCodeDirty += code; // if (attributes.server) templateServerCodeDirty += code
    }
  });
  templateClientCodeDirty = trim.trim(templateClientCodeDirty); // templateServerCodeDirty = trim(templateServerCodeDirty)

  console.log('templateClientCodeDirty\n', [templateClientCodeDirty]);
  var templateClientCode = template.template(templateClientCodeDirty).toString();
  var templateServerCode = templateClientCode; // console.log(`templateClientCode\n`, [templateClientCode])
  // console.log(`templateServerCode`, templateServerCode)

  var scriptClient = {
    imports: {},
    module: '',
    code: ''
  };
  var scriptServer = {
    imports: {},
    module: '',
    code: ''
  }; // console.log(script)

  forEachLeft.forEachLeft(script, ({
    attributes,
    code: codeDirty
  }) => {
    var {
      client,
      server,
      module
    } = attributes;
    var {
      imports,
      code
    } = extractImports.extractImports(codeDirty); // console.log({ imports, code })

    if (client) {
      scriptClient[module ? 'module' : 'code'] += code;
      extractImports.mergeImports(scriptClient.imports, imports);
    }

    if (server) {
      scriptServer[module ? 'module' : 'code'] += code;
      extractImports.mergeImports(scriptServer.imports, imports);
    }
  });
  options.name = utils.isValidVariable(options.name) ? options.name : 'Rease';
  if (!endsWith.endsWith(options.name, options.cid)) options.name += '_' + options.cid;
  var name = options.name; // console.log(`cssJsVars`, cssJsVars)
  // console.log(`cssNoVars`, cssNoVars)

  var codeClient = __createComponent__({
    name,
    cid,
    // needScoper,
    // scoper: scoperInject,
    cssJsVars,
    cssNoVars,
    ...scriptClient,
    template: templateClientCode
  });

  var codeServer = __createComponent__({
    name,
    cid,
    // needScoper,
    // scoper: scoperInject,
    ...scriptServer,
    template: templateServerCode
  }); // console.log(codeClient)
  // console.log(codeServer)


  return {
    cssExternal,
    codeClient,
    codeServer
  };
};

exports["default"] = rastree;
