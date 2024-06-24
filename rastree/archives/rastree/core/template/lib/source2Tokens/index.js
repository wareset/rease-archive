/* eslint-disable */
/*
dester builds:
core/template/lib/source2Tokens.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* filename: core/template/lib/source2Tokens.ts
  timestamp: 2022-01-21T22:47:30.756Z */

/* eslint-disable new-cap */

var TOKEN_BOOLEAN = 'Boolean';
var TOKEN_IDENTIFIER = 'Identifier';
var TOKEN_KEYWORD = 'Keyword';
var TOKEN_NULL = 'Null';
var TOKEN_NUMERIC = 'Numeric';
var TOKEN_PUCNTUATOR = 'Punctuator';
var TOKEN_REGULAR_EXPRESSION = 'RegularExpression';
var TOKEN_STRING = 'String';
var TOKEN_TEMPLATE = 'Template';
var TOKEN_COMMENT_BLOCK = 'CommentBlock';
var TOKEN_COMMENT_LINE = 'CommentLine';
var TOKEN_SPACE = 'Space';
var TOKEN_MODIFIER = 'Modifier';
var TOKEN_JSX_TAG_OPENER_START = 'JSXTagOpenerStart';
var TOKEN_JSX_TAG_OPENER_END = 'JSXTagOpenerEnd';
var TOKEN_JSX_TAG_CLOSER_START = 'JSXTagCloserStart';
var TOKEN_JSX_TAG_CLOSER_END = 'JSXTagCloserEnd';
var TOKEN_JSX_EXPRESSION_START = 'JSXExpressionStart';
var TOKEN_JSX_EXPRESSION_END = 'JSXExpressionEnd';
var TOKEN_JSX_TEXT = 'JSXText';
var TOKEN_JSX_COMMENT = 'JSXComment'; // const NUMBER = '0123456789'.split('')
// const LETTER_LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('')
// const LETTER_UPPER = LETTER_LOWER.map((v) => v.toUpperCase())
// const ALPHANUM = [...NUMBER, ...LETTER_LOWER, ...LETTER_UPPER]
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type

var source2Tokens = (() => {
  var isMaybeRegexp = token => !token || token.type === TOKEN_KEYWORD || token.type === TOKEN_MODIFIER || token.type === TOKEN_JSX_EXPRESSION_START || token.type === TOKEN_PUCNTUATOR && '.})]'.indexOf(token.value) < 0;

  var isMaybeTag = token => !token || token.type === TOKEN_KEYWORD || token.type === TOKEN_MODIFIER || token.type === TOKEN_JSX_EXPRESSION_START || token.type === TOKEN_PUCNTUATOR && /[^:.})\]]$/.test(token.value);

  var isChildlessTag = v => /^(?:img|area|base|br|col|embed|hr|input|link|meta|param|source|track|wbr)$/.test(v);

  var ERROR = (...a) => {
    throw new Error(a.join(' '));
  }; // ---------------------------------------------------------------------------


  var source;
  var tokens;
  var comments;
  var block;
  var tokenLast;
  var tagNameLast;
  var deep;
  var idx;
  var line;
  var rangeStart, lineStart, columnStart;
  var columnDiff;

  var char = offset => source.charAt(idx + offset);

  var plusLine = () => {
    line++, columnDiff = idx + 1;
  }; // ---------------------------------------------------------------------------


  var ENV;

  var __env__;

  var env = _type => {
    if (_type === null) __env__.pop();else _type && __env__.push(_type);
    return ENV = __env__[__env__.length - 1] || '';
  }; // ---------------------------------------------------------------------------


  var saveToken = _type => {
    tokenLast = {
      deep,
      type: _type,
      value: source.slice(rangeStart, idx + 1),
      range: [rangeStart, rangeStart = idx + 1],
      loc: {
        start: {
          line: lineStart,
          column: columnStart
        },
        end: {
          line,
          column: columnStart = idx - columnDiff + 1
        }
      }
    };
    block.push(tokenLast);
  };

  var initToken = () => {
    if (rangeStart < idx) {
      idx--;
      var tokenLastTmp = tokenLast;
      saveToken(TOKEN_SPACE);

      if (tokenLastTmp && tokenLastTmp.deep > tokenLast.deep) {
        tokenLast.deep = tokenLastTmp.deep;
      }

      tokenLast = tokenLastTmp;
      idx++;
    }

    rangeStart = idx;
    lineStart = line;
    columnStart = idx - columnDiff;
  };

  var createPunctuator = offset => {
    initToken();
    if (offset) idx += offset;
    saveToken(TOKEN_PUCNTUATOR);
  }; // ---------------------------------------------------------------------------


  var CASE_IDENTIFIER = () => {
    // let char0: string
    initToken();

    LOOP: for (;;) {
      idx++;

      switch (char(0)) {
        case '':
        case '\u000D':
        case '\u000A':
        case '\u2028':
        case '\u2029': // case '\u200C':
        // case '\u200D':
        // eslint-disable-next-line no-fallthrough

        case '\u0009':
        case '\u000B':
        case '\u000C':
        case '\u0020':
        case '\u00A0':
        case '\uFEFF':
        case '\u1680':
        case '\u180e':
        case '\u2000':
        case '\u2001':
        case '\u2002':
        case '\u2003':
        case '\u2004':
        case '\u2005':
        case '\u2006':
        case '\u2007':
        case '\u2008':
        case '\u2009':
        case '\u200A':
        case '\u202F':
        case '\u205F':
        case '\u3000':
        case '-':
        case '+':
        case '"':
        case "'":
        case '`':
        case '{':
        case '}':
        case '(':
        case ')':
        case '[':
        case ']':
        case ';':
        case ',':
        case '~':
        case ':':
        case '?':
        case '<':
        case '=':
        case '>':
        case '^':
        case '%':
        case '!':
        case '*':
        case '&':
        case '|':
        case '.':
        case '/':
          idx--;
          break LOOP;
      }
    }

    var tokenLastTemp = tokenLast;
    saveToken(TOKEN_IDENTIFIER);
    var token = tokenLast;

    if (tokenLastTemp && tokenLastTemp.type === TOKEN_JSX_TAG_OPENER_START) {
      tagNameLast = token.value;
    }

    if (!tokenLastTemp || tokenLastTemp.value !== '.') {
      switch (token.value) {
        case 'null':
          token.type = TOKEN_NULL;
          break;

        case 'true':
        case 'false':
          token.type = TOKEN_BOOLEAN;
          break;

        case 'let':
        case 'static':
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public': // eslint-disable-next-line no-fallthrough

        case 'await':
        case 'break':
        case 'case':
        case 'catch':
        case 'class':
        case 'const':
        case 'continue':
        case 'debugger':
        case 'default':
        case 'delete':
        case 'do':
        case 'else':
        case 'enum':
        case 'export':
        case 'extends':
        case 'finally':
        case 'for':
        case 'function':
        case 'if':
        case 'import':
        case 'in':
        case 'instanceof':
        case 'new':
        case 'return':
        case 'super':
        case 'switch':
        case 'this':
        case 'throw':
        case 'try':
        case 'typeof':
        case 'var':
        case 'void':
        case 'while':
        case 'with':
        case 'yield':
          token.type = TOKEN_KEYWORD;
          break;

        default:
          if (token.value.indexOf('@') > -1) {
            token.type = TOKEN_MODIFIER;
          }

      }
    }
  };

  var CASE_COMMENT_LINE = () => {
    // let char0: string
    initToken();
    idx++;

    LOOP: for (;;) {
      idx++;

      switch (char(0)) {
        case '':
        case '\u000D'
        /* \r */
        :
        case '\u000A'
        /* \n */
        :
        case '\u2028':
        case '\u2029':
          idx--;
          break LOOP;
      }
    }

    block = comments;
    var tokenLastTmp = tokenLast;
    saveToken(TOKEN_COMMENT_LINE);
    tokenLast = tokenLastTmp;
    block = tokens;
  };

  var CASE_COMMENT_BLOCK = () => {
    // let char0: string
    initToken();
    idx++;

    LOOP: for (;;) {
      idx++;

      switch (char(0)) {
        case '':
          ERROR(TOKEN_COMMENT_BLOCK);
          break;

        case '\u000D'
        /* \r */
        :
          if (char(1) !== '\u000A') plusLine();
          break;

        case '\u000A'
        /* \n */
        :
        case '\u2028':
        case '\u2029':
          plusLine();
          break;

        case '*':
          if (char(1) === '/') {
            idx++;
            break LOOP;
          }

          break;
      }
    }

    block = comments;
    var tokenLastTmp = tokenLast;
    saveToken(TOKEN_COMMENT_BLOCK);
    tokenLast = tokenLastTmp;
    block = tokens;
  };

  var CASE_STRING = () => {
    var char0;
    var slashed = 0;
    initToken();

    LOOP: for (;;) {
      if (slashed) slashed--;
      idx++;

      switch (char0 = char(0)) {
        case '':
          // case '\u000D' /* \r */:
          // case '\u000A' /* \n */:
          // case '\u2028':
          // case '\u2029':
          ERROR(TOKEN_STRING);
          break;

        case '\\':
          if (!slashed) slashed = 2;
          break;

        case '"':
        case "'":
          if (!slashed && char0 === source[rangeStart]) break LOOP;
          break;
      }
    }

    saveToken(TOKEN_STRING);
  };

  var CASE_TEMPLATE = () => {
    // let char0: string
    var slashed = 0;
    initToken();

    LOOP: for (;;) {
      if (slashed) slashed--;
      idx++;

      switch (char(0)) {
        case '':
          ERROR(TOKEN_TEMPLATE);
          break;

        case '\u000D'
        /* \r */
        :
          if (char(1) !== '\u000A') plusLine();
          break;

        case '\u000A'
        /* \n */
        :
        case '\u2028':
        case '\u2029':
          plusLine();
          break;

        case '\\':
          if (!slashed) slashed = 2;
          break;

        case '`':
          if (!slashed) {
            env(null);
            break LOOP;
          }

          break;

        case '$':
          if (!slashed && char(1) === '{') {
            idx++;
            break LOOP;
          }

          break;
      }
    }

    saveToken(TOKEN_TEMPLATE);
  };

  var CASE_REGULAR_EXPRESSION = () => {
    var rxD = 0; // let char0: string

    var slashed = 0;
    initToken();

    LOOP: for (;;) {
      if (slashed) slashed--;
      idx++;

      switch (char(0)) {
        case '':
        case '\u000D'
        /* \r */
        :
        case '\u000A'
        /* \n */
        :
        case '\u2028':
        case '\u2029':
          ERROR(TOKEN_REGULAR_EXPRESSION);
          break;

        case '\\':
          if (!slashed) slashed = 2;
          break;

        case '[':
          if (!slashed) rxD = 1;
          break;

        case ']':
          if (!slashed) rxD = 0;
          break;

        case '/':
          if (!slashed && !rxD) {
            for (;;) {
              idx++;

              if (!/\w/.test(char(0))) {
                idx--;
                break LOOP;
              }
            }
          }

          break;
      }
    }

    saveToken(TOKEN_REGULAR_EXPRESSION);
  };

  var CASE_NUMERIC = (nD, nE) => {
    var nS = nD || nE || 0;
    var char0;
    initToken();
    idx += nS;

    LOOP: for (;;) {
      idx++;

      switch (char0 = char(0)) {
        case '_':
          if (nS) ERROR(TOKEN_NUMERIC);
          nS = 1;
          break;

        case '.':
          if (nS) ERROR(TOKEN_NUMERIC);

          if (nD) {
            idx--;
            break LOOP;
          }

          nD = 1;
          nS = 1;
          break;

        case 'e':
        case 'E':
          if (nE) ERROR(TOKEN_NUMERIC);
          nE = 1;
          nS = 1;
          break;

        case '+':
        case '-':
          if (nE !== 1) {
            if (nS) ERROR(TOKEN_NUMERIC);
            idx--;
            break LOOP;
          }

          nE = 2;
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (nE === 1) nE = 2;
          nS = 0;
          break;

        default:
          if (char0 !== 'n') idx--;else if (nS) ERROR(TOKEN_NUMERIC);
          break LOOP;
      }
    }

    saveToken(TOKEN_NUMERIC);
  };

  var CASE_NUMERIC_B = () => {
    var nS = 1;
    var char0;
    initToken();
    idx++;

    LOOP: for (;;) {
      idx++;

      switch (char0 = char(0)) {
        case '_':
          if (nS) ERROR(TOKEN_NUMERIC);
          nS = 1;
          break;

        case '0':
        case '1':
          nS = 0;
          break;

        default:
          if (char0 !== 'n') idx--;else if (nS) ERROR(TOKEN_NUMERIC);
          break LOOP;
      }
    }

    saveToken(TOKEN_NUMERIC);
  };

  var CASE_NUMERIC_O = () => {
    var nS = 1;
    var char0;
    initToken();
    idx++;

    LOOP: for (;;) {
      idx++;

      switch (char0 = char(0)) {
        case '_':
          if (nS) ERROR(TOKEN_NUMERIC);
          nS = 1;
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          nS = 0;
          break;

        default:
          if (char0 !== 'n') idx--;else if (nS) ERROR(TOKEN_NUMERIC);
          break LOOP;
      }
    }

    saveToken(TOKEN_NUMERIC);
  };

  var CASE_NUMERIC_X = () => {
    var nS = 1;
    var char0;
    initToken();
    idx++;

    LOOP: for (;;) {
      idx++;

      switch (char0 = char(0)) {
        case '_':
          if (nS) ERROR(TOKEN_NUMERIC);
          nS = 1;
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case 'a':
        case 'A':
        case 'b':
        case 'B':
        case 'c':
        case 'C':
        case 'd':
        case 'D':
        case 'e':
        case 'E':
        case 'f':
        case 'F':
          nS = 0;
          break;

        default:
          if (char0 !== 'n') idx--;else if (nS) ERROR(TOKEN_NUMERIC);
          break LOOP;
      }
    }

    saveToken(TOKEN_NUMERIC);
  };

  var CASE_JSX_TEXT = () => {
    // let char0: string
    var slashed = 0;
    initToken();

    LOOP: for (;;) {
      if (slashed) slashed--;
      idx++;

      switch (char(0)) {
        case '':
          break LOOP;

        case '\u000D'
        /* \r */
        :
          if (char(1) !== '\u000A') plusLine();
          break;

        case '\u000A'
        /* \n */
        :
        case '\u2028':
        case '\u2029':
          plusLine();
          break;

        case '\\':
          if (!slashed) slashed = 2;
          break;

        case '{':
          if (!slashed) {
            idx--;
            break LOOP;
          }

          break;

        case '<':
          if (char(1).trim()) {
            idx--;
            break LOOP;
          }

          break;
      }
    }

    saveToken(TOKEN_JSX_TEXT);
  };

  var CASE_JSX_COMMENT = () => {
    // let char0: string
    initToken();
    idx++;

    LOOP: for (;;) {
      idx++;

      switch (char(0)) {
        case '':
          break LOOP;

        case '\u000D'
        /* \r */
        :
          if (char(1) !== '\u000A') plusLine();
          break;

        case '\u000A'
        /* \n */
        :
        case '\u2028':
        case '\u2029':
          plusLine();
          break;

        case '-':
          if (char(1) === '-' && char(2) === '>') {
            idx += 2;
            break LOOP;
          }

          break;
      }
    }

    var tokenLastTmp = tokenLast;
    saveToken(TOKEN_JSX_COMMENT);
    tokenLast = tokenLastTmp;
  };

  var DEFAULT_LOOP = () => {
    var char0;
    var char1;
    var char2;

    LOOP: for (;;) {
      idx++;
      char0 = char(0);

      switch (ENV) {
        case '><':
          switch (char0) {
            case '':
              break LOOP;

            case '{':
              env('%%');
              createPunctuator(0);
              tokenLast.type = TOKEN_JSX_EXPRESSION_START;
              deep++;
              break;

            case '<':
              if (char(1).trim()) idx--, env('%tag%');else CASE_JSX_TEXT();
              break;

            default:
              CASE_JSX_TEXT();
          }

          break;

        default:
          switch (char0) {
            case '':
              break LOOP;
            // Line Terminator Code Points
            // https://tc39.es/ecma262/#sec-line-terminators

            case '\u000D'
            /* \r */
            :
              if (char(1) !== '\u000A') plusLine();
              break;

            case '\u000A'
            /* \n */
            :
            case '\u2028':
            case '\u2029':
              plusLine();
              break;
            // Format-Control Code Point Usage
            // https://tc39.es/ecma262/#sec-unicode-format-control-characters
            // case '\u200C':
            // case '\u200D':
            // case '\uFEFF':
            // White Space Code Points
            // https://tc39.es/ecma262/#sec-white-space

            case '\u0009'
            /* '\t' */
            :
            case '\u000B'
            /* '\v' */
            :
            case '\u000C'
            /* '\f' */
            :
            case '\u0020'
            /*   */
            :
            case '\u00A0':
            case '\uFEFF':
            case '\u1680':
            case '\u180e':
            case '\u2000':
            case '\u2001':
            case '\u2002':
            case '\u2003':
            case '\u2004':
            case '\u2005':
            case '\u2006':
            case '\u2007':
            case '\u2008':
            case '\u2009':
            case '\u200A':
            case '\u202F':
            case '\u205F':
            case '\u3000':
              break;
            // String Literals
            // https://tc39.es/ecma262/#sec-literals-string-literals

            case '"':
            case "'":
              CASE_STRING();
              break;
            // Template Literal Lexical Components
            // https://tc39.es/ecma262/#sec-template-literal-lexical-components

            case '`':
              env('``');
              CASE_TEMPLATE();
              break;
            // Numeric Literals
            // https://tc39.es/ecma262/#sec-literals-numeric-literals

            case '0':
              switch (char(1)) {
                case 'b':
                case 'B':
                  CASE_NUMERIC_B();
                  break;

                case 'o':
                case 'O':
                  CASE_NUMERIC_O();
                  break;

                case 'x':
                case 'X':
                  CASE_NUMERIC_X();
                  break;

                case '.':
                  CASE_NUMERIC(1, 0);
                  break;

                case 'e':
                case 'E':
                  CASE_NUMERIC(0, 1);
                  break;

                default:
                  CASE_NUMERIC(0, 0);
              }

              break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
              CASE_NUMERIC(0, 0);
              break;
            // Punctuators
            // https://tc39.es/ecma262/#sec-punctuators

            case '.'
            /* . ... */
            :
              switch (char1 = char(1)) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                  CASE_NUMERIC(1, 0);
                  break;

                default:
                  createPunctuator(char1 === char0 && char(2) === char0 ? 2 : 0);
              }

              break;

            case '{':
              env('{}');
              createPunctuator(0);
              deep++;
              break;

            case '}':
              switch (ENV) {
                case '``':
                  CASE_TEMPLATE();
                  break;

                case '{}':
                  deep--;
                  env(null);
                  createPunctuator(0);
                  break;

                case '%%':
                  deep--;
                  env(null);
                  createPunctuator(0);
                  tokenLast.type = TOKEN_JSX_EXPRESSION_END;
                  break;

                default:
                  ERROR('}');
              }

              break;

            case '(':
              env('()');
              createPunctuator(0);
              deep++;
              break;

            case ')':
              switch (ENV) {
                case '()':
                  deep--;
                  env(null);
                  createPunctuator(0);
                  break;

                default:
                  ERROR(')');
              }

              break;

            case '[':
              env('[]');
              createPunctuator(0);
              deep++;
              break;

            case ']':
              switch (ENV) {
                case '[]':
                  deep--;
                  env(null);
                  createPunctuator(0);
                  break;

                default:
                  ERROR(']');
              }

              break;

            case ';':
            case ',':
            case '~':
            case ':':
              createPunctuator(0);
              break;

            case '^'
            /* ^ ^= */
            :
            case '%'
            /* % %= */
            :
              createPunctuator(char(1) !== '=' ? 0 : 1);
              break;

            case '!'
            /* ! != !== */
            :
              createPunctuator(char(1) !== '=' ? 0 : char(2) !== '=' ? 1 : 2);
              break;

            case '+'
            /* + += ++ */
            :
            case '-'
            /* - -= -- */
            :
              createPunctuator((char1 = char(1)) === '=' || char1 === char0 ? 1 : 0);
              break;

            case '?'
            /* ? ?. ?? ??= */
            :
              createPunctuator((char1 = char(1)) === '.' ? 1 : char1 !== char0 ? 0 : char(2) !== '=' ? 1 : 2);
              break;

            case '*'
            /* * *= ** **= */
            :
            case '&'
            /* & &= && &&= */
            :
            case '|'
            /* | |= || ||= */
            :
              createPunctuator((char1 = char(1)) === '=' ? 1 : char1 !== char0 ? 0 : char(2) !== '=' ? 1 : 2);
              break;

            case '='
            /* = => == === */
            :
              createPunctuator((char1 = char(1)) === '>' ? 1 : char1 !== char0 ? 0 : char(2) !== char0 ? 1 : 2);
              break;

            case '<'
            /* < <= << <<= */
            :
              char1 = char(1);

              if (ENV === '%tag%' && ~env(null) || char1 === '/' && ENV[0] === '%script%' && (char(2) === '>' || source.slice(idx + 2, idx + 2 + ENV[1].length) === ENV[1]) || isMaybeTag(tokenLast)) {
                if (!char1.trim()) createPunctuator(0);else if (char1 === '!' && char(2) === '-' && char(3) === '-') {
                  CASE_JSX_COMMENT();
                } else if (char1 === '/' && !/[/*]/.test(char(2))) {
                  if (ENV === '><' || ENV[0] === '%script%') env(null), deep--;
                  createPunctuator(1);
                  tokenLast.type = TOKEN_JSX_TAG_CLOSER_START;
                  env('</>'); // deep++
                } else {
                  createPunctuator(0);
                  tokenLast.type = TOKEN_JSX_TAG_OPENER_START;
                  tagNameLast = '';
                  env('<>');
                  deep++;
                }
              } else {
                createPunctuator((char1 = char(1)) === '=' ? 1 : char1 !== char0 ? 0 : char(2) !== '=' ? 1 : 2);
              }

              break;

            case '>'
            /* > >= >> >>= >>> >>>= */
            :
              switch (ENV) {
                case '<>':
                  // deep--
                  env(null);
                  createPunctuator(0);
                  tokenLast.type = TOKEN_JSX_TAG_OPENER_END;

                  if (tagNameLast === 'script' || tagNameLast === 'style') {
                    deep++;
                    env(['%script%', tagNameLast]);
                  } else if (!(/^[!?%]/.test(tagNameLast) || isChildlessTag(tagNameLast))) {
                    deep++;
                    env('><');
                  }

                  break;

                case '</>':
                  deep--;
                  env(null);
                  createPunctuator(0);
                  tokenLast.type = TOKEN_JSX_TAG_CLOSER_END;
                  break;

                default:
                  createPunctuator((char1 = char(1)) === '=' ? 1 : char1 !== char0 ? 0 : (char2 = char(2)) === '=' ? 2 : char2 !== char0 ? 1 : char(3) !== '=' ? 2 : 3);
              }

              break;

            case '/'
            /* /* // / /= */
            :
              switch (char1 = char(1)) {
                // Comments
                // https://tc39.es/ecma262/#sec-comments
                // https://tc39.es/ecma262/#prod-SingleLineComment
                case '/'
                /* // */
                :
                  CASE_COMMENT_LINE();
                  break;
                // https://tc39.es/ecma262/#prod-MultiLineComment

                case '*'
                /* /* */
                :
                  CASE_COMMENT_BLOCK();
                  break;

                default:
                  if (ENV[0] === '<' && char1 === '>') {
                    deep--;
                    env(null);
                    createPunctuator(1);
                    tokenLast.type = ENV[1] === '/' ? TOKEN_JSX_TAG_CLOSER_END : TOKEN_JSX_TAG_OPENER_END;
                  } else if (isMaybeRegexp(tokenLast)) {
                    CASE_REGULAR_EXPRESSION();
                  } else {
                    createPunctuator(char1 === '=' ? 1 : 0);
                  }

              }

              break;

            default:
              CASE_IDENTIFIER();
          }

          break;
      }
    }
  }; // ---------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type


  return (_source, insideJSX) => {
    source = _source;
    tokens = [];
    comments = [];
    block = tokens;
    tokenLast = null;
    idx = -1;
    line = lineStart = 1;
    deep = columnDiff = rangeStart = columnStart = 0;
    console.log(tokens);
    __env__ = [ENV = insideJSX ? '><' : ''];
    DEFAULT_LOOP();
    var range = [0, 0];
    var len = tokens.length;

    if (len) {
      range[0] = tokens[0].range[0];
      range[1] = tokens[len - 1].range[1];
    }

    return {
      tokens,
      comments,
      range
    };
  };
})();

exports.TOKEN_BOOLEAN = TOKEN_BOOLEAN;
exports.TOKEN_COMMENT_BLOCK = TOKEN_COMMENT_BLOCK;
exports.TOKEN_COMMENT_LINE = TOKEN_COMMENT_LINE;
exports.TOKEN_IDENTIFIER = TOKEN_IDENTIFIER;
exports.TOKEN_JSX_COMMENT = TOKEN_JSX_COMMENT;
exports.TOKEN_JSX_EXPRESSION_END = TOKEN_JSX_EXPRESSION_END;
exports.TOKEN_JSX_EXPRESSION_START = TOKEN_JSX_EXPRESSION_START;
exports.TOKEN_JSX_TAG_CLOSER_END = TOKEN_JSX_TAG_CLOSER_END;
exports.TOKEN_JSX_TAG_CLOSER_START = TOKEN_JSX_TAG_CLOSER_START;
exports.TOKEN_JSX_TAG_OPENER_END = TOKEN_JSX_TAG_OPENER_END;
exports.TOKEN_JSX_TAG_OPENER_START = TOKEN_JSX_TAG_OPENER_START;
exports.TOKEN_JSX_TEXT = TOKEN_JSX_TEXT;
exports.TOKEN_KEYWORD = TOKEN_KEYWORD;
exports.TOKEN_MODIFIER = TOKEN_MODIFIER;
exports.TOKEN_NULL = TOKEN_NULL;
exports.TOKEN_NUMERIC = TOKEN_NUMERIC;
exports.TOKEN_PUCNTUATOR = TOKEN_PUCNTUATOR;
exports.TOKEN_REGULAR_EXPRESSION = TOKEN_REGULAR_EXPRESSION;
exports.TOKEN_SPACE = TOKEN_SPACE;
exports.TOKEN_STRING = TOKEN_STRING;
exports.TOKEN_TEMPLATE = TOKEN_TEMPLATE;
exports.source2Tokens = source2Tokens;
