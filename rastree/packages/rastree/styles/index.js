/* eslint-disable */
const e=require("../_includes/dester-inject-JSON.js"),n=require("jsx2tokens"),r=require("../utilites/index.js"),t=require("../storefy/index.js");require("../jsx2tokens/index.js");var s={BRACE:"Brace",AT_RULE_LINE:"AtRuleLine",AT_RULE_BLOCK:"AtRuleBlock",SELECTOR:"Selector",KEYFRAME:"Keyframe",ATTRIBUTE:"Attribute"};function i(n){return e.v(n).slice(1,-1)}function a(e){for(var n,r=e.length;r-- >0&&void 0===(n=e[r]););return n}function l(e){return e.replace(/\s$/,"")}function u(e){for(var n,r,t=[],s="",i=-1;++i<e.length;)(r=e[i])&&("@"!==r[0]?s=r:(/^@media\b/.test(r)&&(null!=n&&t.splice(n,1),n=t.length),t.push(r)));return s&&t.push(s),t}function c(e,n,r){e.push([n,r])}exports.styles=function(o,f,h,E){if("`"!==(o=o.trim())[0])throw o;for(var p={},R=n.jsx2tokens(o,{useJSX:!1,proxy:function(e){e.type===n.TOKEN_TYPES.IDENTIFIER&&(p[e.value]=!0)}}),v=0,g="_s";g+v in p;)v++;g+=v;for(var T="_p";T+v in p;)v++;T+=v;var A=0,d=R[0].deep,L={},k=null;o="";for(var S,_=R.length;_-- >0;)(S=R[_]).deep===d?(k=null,o=(S.value=r.safeRemoveQuotes(S.value))+o):null==k?(S.type=n.TOKEN_TYPES.MODIFIER,L[k="%REASE%PROP%"+A+++"%"]=S.value,o=(S.value=k)+o):(R.splice(_,1),L[k]=S.value+L[k]);var b=[],j=[],B=[],C=[],O={},I=[];!function(e,n){var r,t,i,a,u=[],c=e.length,o=!0,f=o,h=0,E="",p=0,R=[],v=-1,g=!1;function T(e){var r;((E=l(E))&&R.push(E)||R.length)&&("@"===R[0][0]?(E=R.shift(),(i=E.match(/@[\w-]+/)[0].length)<E.length-1&&R.unshift(E.slice(" "===E[i]?i+1:i)),R.unshift(E.slice(0,i)),e=e===s.SELECTOR?(!g&&"@keyframes"===R[0]&&(g=!0,v=p),s.AT_RULE_BLOCK):s.AT_RULE_LINE):g&&(e===s.BRACE&&"}"===R[0]&&p<=v?g=!1:e===s.SELECTOR&&(e=s.KEYFRAME)),e===s.ATTRIBUTE&&(r=R).unshift.apply(r,R.shift().split(/(:)/)),u.push({deep:p,type:e,data:R}),E="",R=[],n&&n(u[u.length-1],u.length,u))}for(var A=-1;++A<c;)if((f=o)!==(o=!(r=e[A]).trim()&&(r=" ",!0))||!o)switch(r){case"{":E=l(E),o=!0,h?E+=r:(T(s.SELECTOR),E=r,T(s.BRACE),p++);break;case"}":E=l(E),o=!0,h?E+=r:(T(s.ATTRIBUTE),p>0&&p--,E=r,T(s.BRACE));break;case";":E=l(E),o=!0,h?E+=r:T(s.ATTRIBUTE);break;case"(":h++;case"[":o=!0,h<2&&(E&&R.push(E),E=""),E+=r;break;case")":h--;case"]":E=l(E)+r,h||(R.push(E),E="");break;case",":o=!0,E=l(E),h?E+=r:(E&&R.push(E),R.push(r),E="");break;case":":case"=":o=!0,E=l(E)+r;break;case"`":case"'":case'"':for(E+=r,a=!1;++A<c&&(E+=e[A],a||e[A]!==r);a=!a&&"\\"===e[A]);break;case"/":if("*"===(t=e[A+1])){for(t=E,E=r,o=f;++A<c&&!((E+=e[A]).length>3&&"/"===e[A]&&"*"===e[A-1]););E=t}else if("/"===t){for(t=E,E=r,o=f;++A<c&&(E+=e[A],/[^\r\n\u2028\u2029]/.test(e[A])););E=t}else r&&(E+=r);break;default:E+=r}T(s.ATTRIBUTE)}(o,(function(e){var n=e.deep,r=e.type,t=e.data;switch(r){case s.BRACE:"}"===t[0]&&(b.length=j.length=B.length=n,b[n]=j[n]=B[n]=void 0);break;case s.SELECTOR:b[n]=void 0,b[n]=function(e,n){for(var r,t,s=[],i=[],a=!1,l=e.length,u=-1;u++<l;)if(u===l||","===(t=e[u])){a||(i[0]&&!/^[|>+~\s]/.test(i[0])&&i.unshift(" "),i.unshift("&"));for(var c=-1;++c<n.length;)(r=i.map((function(e){return"&"===e?this[0]:e}),[n[c]]).join("").replace(/^[\s,&|>+~]+|[\s,&|>+~]+$/g,""))&&s.push(r);a=!1,i=[]}else if("("===t[0]||"["===t[0])i.push(t);else for(var o=t.split(/(&)|\s*([|>+~\s])\s*/),f=-1;++f<o.length;)o[f]&&("&"===(t=o[f])?a=!0:t=t.replace(/\.?\$(\w+)/g,"%REASE%SELECTOR%$1"),i.push(t));return s}(t,a(b)||[""]),B[n]=a(b).join(",");break;case s.KEYFRAME:B[n]=t.join("");break;case s.AT_RULE_BLOCK:if("@media"===t[0])j[n]=void 0,j[n]=function(e,n){for(var r,t,s=[],i=[],a=e.length,l=-1;l++<a;)if(l===a||","===(t=e[l])){if(r=i.join(""))for(var u=-1;++u<n.length;)s.push(n[u]?n[u]+" and "+r:r);i=[]}else i.push(t);return s}(t.slice(1),a(j)||[""]),B[n]=t[0]+" "+a(j).join(",");else B[n]=t[0]+(t.length>1?" "+t.slice(1).join(""):"");break;case s.AT_RULE_LINE:c(C,u(B),i(t[0]+(t.length>1?" "+t.slice(1).join(""):"")));break;case s.ATTRIBUTE:c(C,u(B),i(t.join("")).replace(/^\s*(\w[\w-]*)\s*:/,(function(e,n){return n in O||(O[n]=I.length,I.push(n)),'"+'+T+"["+O[n]+']+"'})))}}));var U,y='"'+function(e){for(var n,r,t="",s=[],a=0,l=-1;l++<e.length;){var u=e[l]||[[],""];for(n=u[0],r=u[1],a=s.length;a>0&&""+s.slice(0,a)!=""+n.slice(0,a);)";"===t[t.length-1]&&(t=t.slice(0,-1)),t+="}",a--;for(;a<n.length;a++)t+=i(n[a])+"{";r&&(t+=r+";"),s=n}return t}(C)+'"',m={},x=[];for(var K in f=function(e){for(var n=function(e){for(var n,r=1,t=(e+="").length,s=t/99|0||1,i=0;i<t;i+=s)13===(n=e.charCodeAt(i))?i-=s-1:(r+=n*r*997/(n+r)+.0001002707309736288)>0&&(r-=0|r);return r}(e).toString(36).slice(2)||"0";n.length<9;)n+=n;return n=n.slice(0,9),/\d/.test(n[0])&&(n="h"+n.slice(0,8)),n}(f+o),y=y.replace(/%REASE%SELECTOR%(\w+)/g,(function(e,n){return n in m||(m[n]=x.length,x.push(n)),'."+'+g+"+"+m[n]+'+"'})),L)t.isStorefyForExpo(U=E(L[K]))||(L[K]="("+U+")!!");return y=function(e,n){return e.replace(/(%REASE%PROP%\d+%)/g,(function(e,r){return r in n?'"+('+n[r]+')+"':r})).trim()}(y,L),y=E(y=y.replace(/""\s*\+\s*/g,"")),'{\n  id: "'+f+'",\n  _: ('+T+(x.length?", "+g:"")+") => ("+y+"),\n  on() {\n    "+h+"(\n      this,\n      "+e.v(x)+",\n      "+e.v(I)+"\n    )\n  }\n}"};