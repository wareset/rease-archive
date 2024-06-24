/* eslint-disable */
/*
dester builds:
core/template/classes/index.ts
*/
import { findIndexRight } from '@wareset-utilites/array/findIndexRight';
import { findIndexLeft } from '@wareset-utilites/array/findIndexLeft';
import { jsonStringify } from '@wareset-utilites/lang/jsonStringify';
import { trimRight } from '@wareset-utilites/string/trimRight';
import { trimLeft } from '@wareset-utilites/string/trimLeft';
import { repeat } from '@wareset-utilites/string/repeat';
import { trim } from '@wareset-utilites/string/trim';
import { last } from '@wareset-utilites/array/last';
import { throwTypeError } from '@wareset-utilites/error';
import { normalizeDeep, offset } from './utils';
import { replaceQuotes } from '../../utils/replaceQuotes';
import { getDelimeter } from '../../utils/getDelimeter';
import { storefyExpression, STOREFY } from './storefyExpression';
import { parseTagAttributes, createTag, fixArrayValues } from './createTag';
import { jsx2tokens, TOKEN_JSX_TAG_OPENER_START, TOKEN_JSX_TAG_OPENER_END, TOKEN_JSX_TAG_CLOSER_START, TOKEN_JSX_TEXT, TOKEN_JSX_TAG_CLOSER_END, TOKEN_JSX_EXPRESSION_END, TOKEN_JSX_COMMENT, TOKEN_STRING, TOKEN_TEMPLATE } from '@rastree/jsx2tokens';
/* filename: core/template/classes/index.ts
  timestamp: 2022-01-22T03:47:43.783Z */

var fixStringAndTemplate = tokens => {
  var token;

  for (var i = 0; i < tokens.length; ++i) {
    if ((token = tokens[i]).type === TOKEN_STRING || token.type === TOKEN_TEMPLATE) {
      try {
        token.value = replaceQuotes(token.value);
      } catch (e) {
        /* */
      }
    }
  }
};

var fixTagScriptAndStyle = tokens => {
  var token;

  for (var i = 0; i < tokens.length; ++i) {
    if ((token = tokens[i]).type === TOKEN_JSX_TAG_OPENER_START && /^(style|script)$/.test(tokens[++i].value)) {
      var start = i = findIndexLeft(tokens, // eslint-disable-next-line no-loop-func
      v => v.deep === token.deep && v.type === TOKEN_JSX_TAG_OPENER_END, i) + 1;
      var end = findIndexLeft(tokens, // eslint-disable-next-line no-loop-func
      v => v.deep === token.deep && v.type === TOKEN_JSX_TAG_CLOSER_START, i); // console.log(11, start, end, tokens[i + 1])

      if (end > start) {
        var tokenJsxText = tokens[start++];
        tokenJsxText.type = TOKEN_JSX_TEXT;
        tokenJsxText.deep++;

        for (var j = 0, a = tokens.splice(start, end - start); j < a.length; ++j) {
          tokenJsxText.value += a[j].value;
          if (tokenJsxText.range) tokenJsxText.range[1] = a[j].range[1];
          if (tokenJsxText.loc) tokenJsxText.loc.end = a[j].loc.end;
        }
      }
    }
  }

  fixStringAndTemplate(tokens);
};

var fixChildren = (list, deep) => {
  var count = 0;

  for (var i = 0; i < list.length; ++i) {
    if (list[i]) {
      if (list[i][0] === '.') {
        count++;
        list[i] = '\n' + offset(deep) + list[i];
      } else list[i] = '\n' + list[i] + ',';
    } else {
      list.splice(i--, 1);
    }
  }

  var res = trim(list.join(''), ',');

  if (count) {
    if (count < list.length) res += '\n' + offset(deep);
    res += repeat(']})()', count);
  }

  return res;
};

var createTemplateTree = tokens => {
  // console.log(tokens)
  // @ts-ignore
  // console.log(ERR)
  var res = [];
  var token, type, deep; // prettier-ignore

  var set = tmp => (tmp = tokens.splice(findIndexRight(tokens, v => v.deep === deep) + 1, tokens.length), tokens.pop(), tmp);

  var node, tmp, textNode;

  while (tokens.length) {
    token = tokens.pop(), ({
      type,
      deep
    } = token);

    if ((tmp = type === TOKEN_JSX_TAG_OPENER_END) || type === TOKEN_JSX_TAG_CLOSER_END) {
      textNode = null; // prettier-ignore

      node = tmp ? new JsxTag(set()) : new JsxTag(...[set(), createTemplateTree(set()), set()].reverse());
      res.unshift(node);
    } else if ((tmp = type === TOKEN_JSX_TEXT) || type === TOKEN_JSX_EXPRESSION_END) {
      node = tmp ? new JsxWholeText([token]) : new JsxExpression(set());

      if (!tmp && node.tokens[0] && node.tokens[0].value === '%') {
        var _tokens = node.tokens;

        if (_tokens.length > 1 && last(_tokens).value === '%') {
          _tokens.pop();
        }

        _tokens.shift();

        textNode = null;
        res.unshift(new JsxHtml(_tokens));
      } else if (textNode) textNode.children.unshift(node);else res.unshift(textNode = new JsxText([node]));
    } else if (type === TOKEN_JSX_COMMENT) {
      textNode = null;
      var jsxtext = createTemplateTree(jsx2tokens(token.value.slice(4, -3), true).tokens)[0];

      if (jsxtext) {
        node = new JsxComment(jsxtext.children);
        res.unshift(node);
      }
    } else {
      console.error(tokens);
      console.error(token);
      throwTypeError(type);
    }
  }

  return res;
};

class __NodeDirty__ {
  // toString(): string {
  //   return ''
  // }
  get __toString__() {
    return this.toString();
  }

}

class JsxTag extends __NodeDirty__ {
  // opener?: string[][]
  // closer?: string[][]
  constructor(opener, children = [], _closer) {
    super();
    this.children = void 0;
    this.tokens = void 0;
    this.children = children;
    this.tokens = normalizeDeep(opener);
  }

  toString({
    deep = 0,
    salt = '',
    pre = false,
    env = null,
    tagId = [9]
  } = {}) {
    var attrs = parseTagAttributes(this.tokens, salt); // console.log(env, attrs)

    var deepOrigin = deep; // console.log(attrs)

    var res = '';

    if (attrs.flags.rease && attrs.sys.tag === '"script"') {
      try {
        var ctx = this.children[0].children[0].tokens[0].value;

        if (trim(ctx)) {
          res = '...(() => {\n' + ctx + ("\n" + offset(deepOrigin) + "return [");
        }
      } catch (e) {
        /* */
      }
    } else {
      var data = createTag(attrs, salt, deep, env, tagId);
      pre = pre || attrs.flags.pre || attrs.sys.tag === '"pre"';
      deep = data[2]++;
      var childs = fixChildren(this.children.map(v => v.toString({
        deep,
        salt,
        pre,
        env,
        tagId
      })), deep);
      if (childs) childs += '\n' + offset(deep - 1);
      res = data[0] + childs + data[1];
    }

    return res;
  }

}

class JsxExpression extends __NodeDirty__ {
  constructor(tokens) {
    super();
    this.tokens = void 0;
    this.tokens = normalizeDeep(tokens);
  }

  toString({
    salt = ''
  } = {}) {
    return storefyExpression(this.tokens, salt);
  }

}

class JsxHtml extends __NodeDirty__ {
  constructor(tokens) {
    super();
    this.tokens = void 0;
    this.tokens = normalizeDeep(tokens);
  }

  toString({
    deep = 0,
    salt = ''
  } = {}) {
    var res = storefyExpression(this.tokens, salt);
    return offset(deep) + ("[3, " + res + "]");
  }

}

class JsxComment extends __NodeDirty__ {
  constructor(children) {
    super();
    this.children = void 0;
    this.children = children;
  }

  toString({
    deep = 0,
    pre = false,
    salt = ''
  } = {}) {
    var childs = this.children.map(v => v.toString({
      pre,
      salt
    })).filter(v => v);
    var res = childs.join(', ');
    if (!res) return '';
    return offset(deep) + "[2, [" + res + "]]";
  }

}

class JsxText extends __NodeDirty__ {
  constructor(children) {
    super();
    this.children = void 0;
    this.children = children;
  }

  toString({
    deep = 0,
    pre = false,
    salt = ''
  } = {}) {
    var childs = fixArrayValues(this.children.map(v => v.toString({
      pre,
      salt
    })));
    var res = childs.join(', ');
    if (!res) return '';
    return offset(deep) + "[1, [" + res + "]]";
  }

}

class JsxWholeText extends __NodeDirty__ {
  constructor(tokens) {
    super();
    this.tokens = void 0;
    this.tokens = tokens;
  }

  toString({
    pre = false
  } = {}) {
    var value = this.tokens[0].value;

    if (!pre) {
      if (/^\s*\n/.test(value)) value = trimLeft(value);
      if (/\n\s*$/.test(value)) value = trimRight(value);
    }

    if (value) value = jsonStringify(value);
    return value;
  }

} // export declare type TypeRastreeTemplateOptions = {
//   env?: TypeEnv
// }


class RastreeTemplate extends __NodeDirty__ {
  constructor(source = '') {
    super();
    this.source = void 0;
    this.salt = void 0;
    this.children = void 0;
    this.source = source;
    this.salt = getDelimeter(source, '_'); // console.log(source)

    var tokens = jsx2tokens(source, true).tokens;
    fixTagScriptAndStyle(tokens);
    this.children = createTemplateTree(tokens);
    console.log(this);
  }

  toString({
    pre = false,
    env = null
  } = {}) {
    var deep = 2;
    var salt = this.salt;
    var tagId = [9];
    var OFFSET = offset(deep++);
    var res = this.source.split(/\n/).map(v => OFFSET + '// ' + v + '\n').join('');
    res += OFFSET + '// prettier-ignore\n';
    res += OFFSET + '';
    res += '(' + STOREFY + salt + ') => [';
    var childs = fixChildren(this.children.map(v => v.toString({
      deep,
      salt,
      pre,
      env,
      tagId
    })), deep);
    if (childs) childs += '\n' + OFFSET;
    res += childs + ']';
    return res;
  }

}

export { JsxComment, JsxExpression, JsxHtml, JsxTag, JsxText, JsxWholeText, RastreeTemplate };
