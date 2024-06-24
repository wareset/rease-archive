export const removeComments = (source: string): string =>
  source.replace(
    /((`|'|")(?:[^\\]|\\\2|\\(?!\2).)*?(?:\2|$))|(\/\/[^\r\n\u2028\u2029]*|\/\*[^]*?(?:\*\/|$))|([^])/g,
    (_full, _string, _2, _comment, _other) => _comment ? '' : _full
  )
