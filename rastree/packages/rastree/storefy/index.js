/* eslint-disable */
const e=require("../jsx2tokens/index.js"),r=require("jsx2tokens");function t(t,n,o,i){for(var s,T=t[n].deep,E=n++,p=T;E-- >0&&!(T>(s=t[E]).deep)&&(T!==p||s.type!==r.TOKEN_TYPES.PUCNTUATOR||/^[.})\]!]$/.test(s.value));)p=s.deep;for(E++;t[E]&&("!"===t[E].value||t[E].type===r.TOKEN_TYPES.SPACE||t[E].type===r.TOKEN_TYPES.COMMENT_LINE||t[E].type===r.TOKEN_TYPES.COMMENT_BLOCK);)E++;var u=e.stringifyTokens(t.splice(E,n-E-1))+t[E].value,f=o.indexOf(u);return f<0&&(f=o.length,o.push(u)),t[E].value=i+"["+f+"]",E}function n(n,o,i){void 0===i&&(i=!0);for(var s={},T=e.trimTokens(r.jsx2tokens(n,{useJSX:i,proxy:function(e){e.type===r.TOKEN_TYPES.IDENTIFIER&&(s[e.value]=!0)}})),E=0,p="_$";p+E in s;)E++;p+=E;for(var u,f,v,a=[],l=T.length;l-- >0;)l&&"!"===T[l].value&&(u=e.prevRealTokenIndex(T,l))>-1&&"!"===T[u].value&&(u=e.prevRealTokenIndex(T,u))>-1&&T[u].deep===T[l].deep&&((f=T[u])&&(f.type!==r.TOKEN_TYPES.PUCNTUATOR||!/[^.})\]!]$/.test(f.value)))&&(T.splice(u+1,l-u),l=t(T,u,a,p));var x=0;if(a.length){x++;var O=e.stringifyTokens(e.trimCircleBrackets(T)).trim();1===a.length&&p+"[0]"===O?v=a[0]:(v=o+"(["+a.join(", ")+"], ("+p+") => ("+O+"))",x++)}else v=e.stringifyTokens(T).trim();return[v,x]}require("../utilites/index.js");var o="/*r2.$*/",i="/*r1.$*/";function s(e){return 0===(e+="").indexOf(o)}exports.STOREFY_COMMENT_MARKER_MAYBE=i,exports.STOREFY_COMMENT_MARKER_STRICT=o,exports.isStorefy=s,exports.isStorefyForExpo=function(e){return 0===(e+="").indexOf(i)||s(e)},exports.storefy=function(e,r,t){void 0===r&&(r="_$"),void 0===t&&(t=!0);for(var s=1,T=0,E=[e,T];(E=n(E[0],r,t))[1]&&s++<99;)T=T>E[1]?T:E[1];return T&&(E[0]=(T>1?o:i)+E[0]),E[0]},exports.storefyExpression=n;