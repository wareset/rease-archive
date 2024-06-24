/* eslint-disable */
const e=require("../_includes/dester-inject-JSON.js"),n=require("../utilites/hash/index.js"),s=require("../utilites/index.js"),r=require("../jsx2tokens/index.js"),t=require("jsx2tokens");require("../_includes/dester-inject-Math.js");var i={BRACE:"Brace",AT_RULE_LINE:"AtRuleLine",AT_RULE_BLOCK:"AtRuleBlock",SELECTOR:"Selector",KEYFRAME:"Keyframe",ATTRIBUTE:"Attribute"};function a(n){return e.v(n).slice(1,-1)}function l(e){for(var n,s=e.length;s-- >0&&void 0===(n=e[s]););return n}function u(e){return e.replace(/\s$/,"")}function c(e){for(var n,s,r=[],t="",i=-1;++i<e.length;)(s=e[i])&&("@"!==s[0]?t=s:(/^@media\b/.test(s)&&(null!=n&&r.splice(n,1),n=r.length),r.push(s)));return t&&r.push(t),r}function o(e,n,s){e.push([n,s])}function h(n,r,h){if("`"!==(n=n.trim())[0])throw n;for(var f={},E=t.jsx2tokens(n,{useJSX:!1,proxy:function(e){e.type===t.TOKEN_TYPES.IDENTIFIER&&(f[e.value]=!0)}}),p=0,v="_s";v+p in f;)p++;v+=p;for(var g="_p";g+p in f;)p++;g+=p;var R=0,T=E[0].deep,d={},A=null;n="";for(var k,b=E.length;b-- >0;)(k=E[b]).deep===T?(A=null,n=(k.value=s.safeRemoveQuotes(k.value))+n):null==A?(k.type=t.TOKEN_TYPES.MODIFIER,d[A="%REASE%PROP%"+R+++"%"]=k.value,n=(k.value=A)+n):(E.splice(b,1),d[A]=k.value+d[A]);var L=[],_=[],j=[],S=[],O={},B=[];!function(e,n){var s,r,t,a,l=[],c=e.length,o=!0,h=o,f=0,E="",p=0,v=[],g=-1,R=!1;function T(e){var s;((E=u(E))&&v.push(E)||v.length)&&("@"===v[0][0]?(E=v.shift(),(t=E.match(/@[\w-]+/)[0].length)<E.length-1&&v.unshift(E.slice(" "===E[t]?t+1:t)),v.unshift(E.slice(0,t)),e=e===i.SELECTOR?(!R&&"@keyframes"===v[0]&&(R=!0,g=p),i.AT_RULE_BLOCK):i.AT_RULE_LINE):R&&(e===i.BRACE&&"}"===v[0]&&p<=g?R=!1:e===i.SELECTOR&&(e=i.KEYFRAME)),e===i.ATTRIBUTE&&(s=v).unshift.apply(s,v.shift().split(/(:)/)),l.push({deep:p,type:e,data:v}),E="",v=[],n&&n(l[l.length-1],l.length,l))}for(var d=-1;++d<c;)if((h=o)!==(o=!(s=e[d]).trim()&&(s=" ",!0))||!o)switch(s){case"{":E=u(E),o=!0,f?E+=s:(T(i.SELECTOR),E=s,T(i.BRACE),p++);break;case"}":E=u(E),o=!0,f?E+=s:(T(i.ATTRIBUTE),p>0&&p--,E=s,T(i.BRACE));break;case";":E=u(E),o=!0,f?E+=s:T(i.ATTRIBUTE);break;case"(":f++;case"[":o=!0,f<2&&(E&&v.push(E),E=""),E+=s;break;case")":f--;case"]":E=u(E)+s,f||(v.push(E),E="");break;case",":o=!0,E=u(E),f?E+=s:(E&&v.push(E),v.push(s),E="");break;case":":case"=":o=!0,E=u(E)+s;break;case"`":case"'":case'"':for(E+=s,a=!1;++d<c&&(E+=e[d],a||e[d]!==s);a=!a&&"\\"===e[d]);break;case"/":if("*"===(r=e[d+1])){for(r=E,E=s,o=h;++d<c&&!((E+=e[d]).length>3&&"/"===e[d]&&"*"===e[d-1]););E=r}else if("/"===r){for(r=E,E=s,o=h;++d<c&&(E+=e[d],/[^\r\n\u2028\u2029]/.test(e[d])););E=r}else s&&(E+=s);break;default:E+=s}T(i.ATTRIBUTE)}(n,(function(e){var n=e.deep,s=e.type,r=e.data;switch(s){case i.BRACE:"}"===r[0]&&(L.length=_.length=j.length=n,L[n]=_[n]=j[n]=void 0);break;case i.SELECTOR:L[n]=void 0,L[n]=function(e,n){for(var s,r,t=[],i=[],a=!1,l=e.length,u=-1;u++<l;)if(u===l||","===(r=e[u])){a||(i[0]&&!/^[|>+~\s]/.test(i[0])&&i.unshift(" "),i.unshift("&"));for(var c=-1;++c<n.length;)(s=i.map((function(e){return"&"===e?this[0]:e}),[n[c]]).join("").replace(/^[\s,&|>+~]+|[\s,&|>+~]+$/g,""))&&t.push(s);a=!1,i=[]}else if("("===r[0]||"["===r[0])i.push(r);else for(var o=r.split(/(&)|\s*([|>+~\s])\s*/),h=-1;++h<o.length;)o[h]&&("&"===(r=o[h])?a=!0:r=r.replace(/\._(\w+)/g,"%REASE%SELECTOR%$1"),i.push(r));return t}(r,l(L)||[""]),j[n]=l(L).join(",");break;case i.KEYFRAME:j[n]=r.join("");break;case i.AT_RULE_BLOCK:if("@media"===r[0])_[n]=void 0,_[n]=function(e,n){for(var s,r,t=[],i=[],a=e.length,l=-1;l++<a;)if(l===a||","===(r=e[l])){if(s=i.join(""))for(var u=-1;++u<n.length;)t.push(n[u]?n[u]+" and "+s:s);i=[]}else i.push(r);return t}(r.slice(1),l(_)||[""]),j[n]=r[0]+" "+l(_).join(",");else j[n]=r[0]+(r.length>1?" "+r.slice(1).join(""):"");break;case i.AT_RULE_LINE:o(S,c(j),a(r[0]+(r.length>1?" "+r.slice(1).join(""):"")));break;case i.ATTRIBUTE:o(S,c(j),a(r.join("")).replace(/^\s*(\w[\w-]*)\s*:/,(function(e,n){return n in O||(O[n]=B.length,B.push(n)),'"+'+g+"["+O[n]+']+"'})))}}));var m='"'+function(e){for(var n,s,r="",t=[],i=0,l=-1;l++<e.length;){var u=e[l]||[[],""];for(n=u[0],s=u[1],i=t.length;i>0&&""+t.slice(0,i)!=""+n.slice(0,i);)";"===r[r.length-1]&&(r=r.slice(0,-1)),r+="}",i--;for(;i<n.length;i++)r+=a(n[i])+"{";s&&(r+=s+";"),t=n}return r}(S)+'"',C={},I=[];return m=function(e,n){return e.replace(/(%REASE%PROP%\d+%)/g,(function(e,s){return s in n?'"+('+n[s]+')+"':s})).trim()}(m=(m=m.replace(/%REASE%SELECTOR%(\w+)/g,(function(e,n){return n in C||(C[n]=I.length,I.push(n)),'"+'+v+'+"'+C[n]}))).replace(/""\s*\+\s*/g,""),d),'{\n    id: "'+r+'",\n    _: ('+g+(I.length?", "+v:"")+") => ("+m+"),\n    init() {\n      return "+h+".i(\n        this,\n        "+e.v(I)+",\n        "+e.v(B)+"\n      )\n    }\n  }"}exports.css=function(e,s){for(var i,a,l=void 0===s?{}:s,u=l.salt,c=void 0===u?"":u,o=l.useJSX,f=void 0!==o&&o,E=l.importPath,p=void 0===E?"rease/css":E,v=n.hash(e,0,!0),g=/\bimport\b\s*(?:(?:\/\*.*?\*\/)?\s*(?:\/\/[^\n]*)?\s*)*([^]+?)(?:(?:\/\*.*?\*\/)?\s*(?:\/\/[^\n]*)?\s*)*\bfrom\b\s*(?:(?:\/\*.*?\*\/)?\s*(?:\/\/[^\n]*)?\s*)*['"`]([^'"`]+)['"`]/g;a=g.exec(e);)if(a[2]===p){i=a[1],e=e.replace(a[0],"import { "+("css"===i?i:"css as "+i)+" } from 'rease'");break}if(i)for(var R=0,T="",d="";(R=e.indexOf(i+"`",R))>-1;)d=h(T=r.stringifyTokens(t.jsx2tokens(e.slice(R+i.length),{useJSX:f,proxy:function(e){return 0===e.deep&&"`"===e.value[e.value.length-1]}})),v=n.hash(v+c),i),e=e.slice(0,R)+d+e.slice(R+T.length+i.length),R+=d.length;return e};