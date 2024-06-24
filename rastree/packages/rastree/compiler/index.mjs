/* eslint-disable */
import{v as e}from"../_includes/dester-inject-String.mjs";import{v as a}from"../_includes/dester-inject-JSON.mjs";import{v as r}from"../_includes/dester-inject-Math.mjs";import{prevRealTokenIndex as t,stringifyTokens as i,nextRealTokenIndex as s,trimTokens as l}from"../jsx2tokens/index.mjs";import{chunkifyArrayBy as n}from"../utilites/index.mjs";import{styles as c}from"../styles/index.mjs";import{storefy as u,isStorefy as o,isStorefyForExpo as v}from"../storefy/index.mjs";import{jsx2tokens as f,TOKEN_TYPES as _}from"jsx2tokens";var p=Array,m=r.pow;function d(e,a,r){for(var t=a+1;t<e.length;t++)if(r(e[t]))return t;return-1}function h(a){return n(a,(function(e,a,r){var i,l=r[0].deep,n=e.deep,c=e.type,u=e.value;if(n===l&&((c===_.SPACE||/^[,;]$/.test(u))&&((i=t(r,a))<0||"="!==r[i].value)&&((i=s(r,a))<0||"="!==r[i].value)))return!0;return!1}),void 0,!0).map((function(e){return n(l(e),(function(e,a,r){var t=r[0].deep,i=e.deep,s=e.value;return i===t&&"="===s}),void 0,!0).map((function(e){return i(l(e))}))})).filter(e)}function E(){for(var e=arguments.length,a=new p(e),r=0;r<e;r++)a[r]=arguments[r];return a.join(", ").replace(/[,\s]+$/,"")}function S(e){return 0!==e.indexOf("r-")&&/^[a-z][a-zA-Z0-9-]*$/.test(e)}function g(e){return"r-fragment"===e}var I="ELEMENT_OR_FRAGMENT";function N(e){return/^r-(if|elif|else-if|else|for|watch|await|then)$/.test(e)}function R(e){return"r-slot"===e}var b="RULE_OR_SLOT",k="r-component";function y(e){return"r-tag"===e}function T(e){return e===k||0!==e.indexOf("r-")&&!S(e)}var O="COMPONENT_OR_TAG",w=65535;var x=m(2,31),X=x-1;function D(e){return function(){return((e=(t=(a=16807)&w)*(i=(r=e)&w)+((a>>>16&w)*i+t*(r>>>16&w)<<16>>>0)|0|0%X)&X)/x;var a,r,t,i}}function $(e,a){for(var r=1,t=(e=((a||"")+e).replace(/\r/g,"")).length;t--;)r*=(9e4-r)/(r+e.charCodeAt(t));return+(""+r).replace(/[-.]/g,"")}function A(e,r){var l=void 0===r?{}:r,n=l.env,p=void 0===n?"client":n,m=l.salt,w=void 0===m?"":m,x=l.useJSX,X=void 0===x||x,A=l.jsxImportName,C=void 0===A?"rease/jsx":A,L=l.envImportName,j=void 0===L?"rease/env":L,J=l.cssImportName,F=void 0===J?"rease/css":J,M=l.tsNocheck,G="";(void 0===M||M)&&(G+="// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck\n");var P,U,q,z=!("server"===p),H="^['\"`]"+j,V="^['\"`]"+F,W="^['\"`]"+C,B={},Q=f(e,{useJSX:X,considerChildlessTags:!1,proxy:function(e,a,r){if(e.type===_.IDENTIFIER)B[e.value]=!0;else if(!P&&e.value.match(H)){var i=t(r,a);if(i>-1&&"from"===r[i].value)for(var s,l=e.deep,n=a;n-- >0;)if((s=r[n]).deep===l){if("import"===s.value){r.splice(n,a-n+1);break}s.type===_.IDENTIFIER&&(P=s.value)}}else if(!U&&e.value.match(V)){var c=t(r,a);if(c>-1&&"from"===r[c].value)for(var u,o=e.deep,v=a;v-- >0;)if((u=r[v]).deep===o){if("import"===u.value){r.splice(v,a-v+1);break}u.type===_.IDENTIFIER&&(U=u.value)}}else if(!q&&e.value.match(W)){var f=t(r,a);if(f>-1&&/^(import|type|from)$/.test(r[f].value))for(var p,m=e.deep,d=a+1;d-- >0;)if((p=r[d]).deep===m&&"import"===p.value){q="OK",r.splice(d,a-d+1);break}}}}),K=0;function Z(e){for(var a=e;a+ ++K in B;);return{origin:e,alias:a+=K}}var Y,ee,ae,re={_$:Z("_$"),_expo:Z("_x"),_text:Z("_t"),_comment:Z("_c"),_html:Z("_h"),_tag:Z("_X"),_component:Z("_C"),_componentX:Z("_D"),_element:Z("_E"),_elementX:Z("_R"),_slot:Z("_S"),_fragment:Z("_F"),_if:Z("_i"),_elif:Z("_o"),_else:Z("_e"),_watch:Z("_w"),_await:Z("_a"),_then:Z("_n"),_for:Z("_f"),_func_call:Z("_z"),_use_listen:Z("_l"),_css:Z("_s")},te={};function ie(e,a){a?e.value+="\n":oe[0][0]===b?e.value+=";\n":e.value+=oe[0][1]?",\n":"\n",oe.length>1&&oe[0][0]&&(oe[0][1]=!0),e.value="  ".repeat(oe.length)+e.value}function se(e,a){if(void 0===a&&(a=""),oe[0][0]===O){var r=oe[0][2];if(oe[0][2]=oe[0][3]=e,e.value="["+a+", () => { "+e.value+" }]",r){var t="["+a+", () => { ",i=r.value.indexOf(t);i===2*oe.length&&(e.value=e.value.slice(0,-3),r.value="  ".repeat(oe.length+1)+r.value.slice(i+t.length))}}}function le(e){oe[0][0]===O&&(oe[0][3]=e,e.value=e.value+" }]")}function ne(e){var a=u(e,re._$.alias,X);return o(a)&&(te._$=!0),a}function ce(){Y||(Y=D($(w+e)))}function ue(e){return ce(),a((e||"")+$("",Y()).toString(36).slice(0,8))}var oe=[["",!1]];if(P)for(var ve,fe=function(e,a){if((e=Q[a]).value!==P)return _e=a,ve=e,"continue";if(a>0&&("]"===Q[a-1].value||"."===Q[a-1].value))return ve=e,_e=a,"continue";if(e.value===P&&(ee=s(Q,a))>-1&&"."===Q[ee].value&&(ee=s(Q,ee))>-1){var r=Q[ee].value;switch(r){case"$":break;case"isClient":case"isServer":case"is_client":case"is_server":case"IS_CLIENT":case"IS_SERVER":var l=z;for(Q.splice(a+1,ee-a);(ee=a-1)>-1&&"!"===Q[ee].value;)Q.splice(a=ee,1),l=!l;if(e.type=_.BOOLEAN,e.value=""+(l===/CLIENT/i.test(r)),"false"===e.value&&(ee=s(Q,a))>-1&&")"===Q[ee].value&&(ee=s(Q,ee))>-1&&"{"===Q[ee].value&&(ee=t(Q,a))>-1&&"("===Q[ee].value&&(ee=t(Q,ee))>-1&&"if"===Q[ee].value){var n=!1;(ae=t(Q,ee))>-1&&"else"===Q[ae].value&&(n=!0,ee=ae),e.deep--,ae=d(Q,a,(function(a){return e.deep===a.deep&&"}"===a.value})),Q.splice(a=ee,ae-ee+1),!n&&(ee=s(Q,a))>-1&&"else"===Q[ee].value&&((ae=s(Q,ee))>-1&&"if"===Q[ae].value?Q.splice(ee,1):Q.splice.apply(Q,[ee,1].concat(f("if (true)"))))}break;case"randomString":case"random_string":case"RANDOM_STRING":Q.splice(a+1,ee-a),e.type=_.STRING,e.value=ue();break;case"randomNumber":case"random_number":case"RANDOM_NUMBER":Q.splice(a+1,ee-a),e.type=_.NUMERIC,e.value=(ce(),(""+Y()).slice(0,8));break;case"requireIfClient":case"requireIfServer":case"require_if_client":case"require_if_server":case"REQUIRE_IF_CLIENT":case"REQUIRE_IF_SERVER":var c="";if(ae=d(Q,a,(function(r){return c||r.type!==_.STRING||(c=r.value),ve=e,_e=a,e.deep===r.deep&&")"===r.value})),!c)throw console.error("ENV "+r+" is incorrectly"),i(Q.splice(a+1,ae-a));var u="default";if((ee=s(Q,ae))>-1&&"."===Q[ee].value&&(ee=s(Q,ee))>-1&&(u=Q[ee].value,ae=ee),Q.splice(a+1,ae-a),z===/CLIENT/i.test(r)){var o=Z(u).alias;G+="import { "+u+" as "+o+" } from "+c+";\n",e.type=_.IDENTIFIER,e.value=o}else e.type=_.NULL,e.value="null";break;default:throw"rease/env: "+r+" not support"}}ve=e,_e=a},_e=0;_e<Q.length;_e++)fe(ve,_e);for(var pe,me=function(e,r){if(e=Q[r],U&&e.value===U&&(!r||"]"!==Q[r-1].value&&"."!==Q[r-1].value)&&(ee=s(Q,r))>-1&&"`"===Q[ee].value[0]){var t=ee,l=d(Q,r,(function(a){return e.deep===a.deep&&/`$/.test(a.value)})),n=i(Q.splice(ee,1+l-t));te._css=!0;var f=c(n,ue("c"),re._css.alias,ne);return e.type=_.MODIFIER,e.value=f,pe=e,"continue"}if(P&&e.value===P&&(!r||"]"!==Q[r-1].value&&"."!==Q[r-1].value)&&(ee=s(Q,r))>-1&&"."===Q[ee].value&&(ee=s(Q,ee))>-1){if("$"===Q[ee].value){Q.splice(r+1,ee-r),ee=s(Q,r),ae=d(Q,r+1,(function(a){return e.deep===a.deep&&")"===a.value})),te._$=!0;var p=u(i(Q.splice(ee,ae-ee+1).slice(1,-1)),re._$.alias);o(p)||(p=re._$.alias+"(["+p+"], (a) => a[0])"),e.type=_.MODIFIER,e.value=p}return pe=e,"continue"}switch(e.type){case _.JSX_EXPRESSION_END:oe.unshift([,!1]);break;case _.JSX_EXPRESSION_START:oe.shift();var m=d(Q,r,(function(a){return e.deep===a.deep&&a.type===_.JSX_EXPRESSION_END})),w=ne(i(Q.splice(r+1,m-r).slice(0,-1)));w?(e.type=_.MODIFIER,te._expo=!0,e.value=re._expo.alias+"("+w+")",se(e),ie(e)):Q.splice(r,1);break;case _.JSX_TEXT:e.type=_.MODIFIER;var x=e.value.replace(/^\s*\n\s*|\s*\n\s*$/g,"").replace(/\s+/g," ");x?(te._text=!0,e.value=re._text.alias+"("+a(x).replace(/\\\\u/gi,"\\u")+")",se(e),ie(e)):Q.splice(r,1);break;case _.JSX_TAG_CLOSER_START:var X=d(Q,r,(function(e){return e.type===_.JSX_TAG_CLOSER_END})),D=h(Q.splice(r+1,X-r).slice(0,-1));e.type=_.MODIFIER;var $=D[0]&&D[0][0]||"r-fragment";if(S($)||g($))e.value=")";else if(N($)||R($))e.value="})";else{if(!T($)&&!y($))throw"Tag "+$+" not support";e.value="])"}le(e),ie(e),S($)||g($)?oe.unshift([I,!1]):N($)||R($)?oe.unshift([b,!1]):(T($)||y($))&&oe.unshift([O,!1]);break;case _.JSX_TAG_OPENER_END_CHILDLESS:case _.JSX_TAG_OPENER_END:oe.unshift([,!1]);break;case _.JSX_TAG_OPENER_START:oe.shift();for(var A,C,L=d(Q,r,(function(e){return e.type===_.JSX_TAG_OPENER_END||e.type===_.JSX_TAG_OPENER_END_CHILDLESS})),j=Q[L].type===_.JSX_TAG_OPENER_END_CHILDLESS,J=h(Q.splice(r+1,L-r).slice(0,-1)),F=J[0]&&J[0].length<2&&J.shift()[0]||"r-fragment",M="",G=[],q="",H="",V="",W="",B="",K="",Z="",Y="",ce="",ve="",fe=0;fe<J.length;fe++)if(A=J[fe][0])if("{"===A[0])G.push(A.slice(1,-1));else switch("{"===(C=J[fe][1]||"")[0]&&(C=ne(C.slice(1,-1))),A){case"r-is":M=C;break;case"r-use":H=C;break;case"r-use-client":V=C;break;case"r-use-server":W=C;break;case"r-tag":B=C;break;case"r-slot":K=C;break;case"r-name":Z=C;break;case"r-children":Y=C;break;case"r-policy":ve=C;break;default:if(A.startsWith("r-on-"))z&&(A=A.slice(5))&&(te._use_listen=!0,ce+=re._use_listen.alias+"('"+A+"', "+C+"), ");else{if(A.startsWith("r-"))throw"System attribute "+A+" not support";"className"===A&&(A="class"),A=/^[$_a-z][$\w]*$/i.test(me=A)?me:a(me),C=C||"true",G.push(A+": "+C)}}z?(ce&&(H=H?"["===H[0]?"["+ce+H.slice(1,-1)+"]":"["+ce+"...("+H+") || []]":"["+ce.slice(0,-2)+"]"),V&&(H&&"["!==V[0]&&(V="("+V+") || []"),H=H?"["===H[0]?"["+H.slice(1,-1)+", ..."+V+"]":"[...("+H+") || [], ..."+V+"]":V)):W&&(H&&"["!==W[0]&&(W="("+W+") || []"),H=H?"["===H[0]?"["+H.slice(1,-1)+", ..."+W+"]":"[...("+H+") || [], ..."+W+"]":W),G.length&&(q="{ "+G.join(", ")+" }");var _e="";switch(F){case"r-void":if(v(M))throw"System tag "+F+" does not accept reactive values";_e=E(M);break;case"r-text":te._expo=!0,_e=re._expo.alias+"("+E(M)+")";break;case"r-comment":te._comment=!0,_e=re._comment.alias+"("+E(M)+")";break;case"r-html":te._html=!0,_e=re._html.alias+"("+E(M,ve)+")";break;case"r-fragment":te._fragment=!0,H&&(q=q||"{}"),_e=re._fragment.alias+"("+E(q,H)+")(";break;case"r-slot":te._slot=!0,H&&(q=q||"{}"),q&&(M=M||"void 0"),_e=re._slot.alias+"("+E(Z||M,q,H)+")(";break;case"r-tag":te._tag=!0,Z&&(H=H||"void 0"),H&&(q=q||"{}"),q&&(M=M||"void 0"),_e=re._tag.alias+"("+E(M,q,H,Z)+")(";break;case"r-if":te._if=!0,H&&(q=q||"{}"),q&&(M=M||"void 0"),_e=re._if.alias+"("+E(M,q,H)+")(";break;case"r-elif":case"r-elseif":case"r-else-if":te._elif=!0,H&&(q=q||"{}"),q&&(M=M||"void 0"),_e=re._elif.alias+"("+E(M,q,H)+")(";break;case"r-else":te._else=!0,H&&(q=q||"{}"),_e=re._else.alias+"("+E(q,H)+")(";break;case"r-for":te._for=!0,H&&(q=q||"{}"),q&&(M=M||"void 0"),_e=re._for.alias+"("+E(M,q,H)+")(";break;case"r-watch":te._watch=!0,H&&(q=q||"{}"),q&&(M=M||"void 0"),_e=re._watch.alias+"("+E(M,q,H)+")(";break;case"r-await":te._await=!0,H&&(q=q||"{}"),q&&(M=M||"void 0"),_e=re._await.alias+"("+E(M,q,H)+")(";break;case"r-then":te._then=!0,H&&(q=q||"{}"),_e=re._then.alias+"("+E(q,H)+")(";break;default:if(T(F))M||F===k?(te._componentX=!0,M?(H=H||"void 0",q=q||"{}"):H&&(q=q||"{}"),_e=re._componentX.alias+"("+E(F!==k?F:"null",q,H,M)+")("):(te._component=!0,H&&(q=q||"{}"),_e=re._component.alias+"("+E(F,q,H)+")(");else{if(F.startsWith("r-"))throw"System tag "+F+" not support";B||M?(te._elementX=!0,H=H||"void 0",q=q||"{}",_e=re._elementX.alias+"("+E(a(F),q,H,B||M)+")("):(te._element=!0,H&&(q=q||"{}"),_e=re._element.alias+"("+E(a(F),q,H)+")(")}}if(S(F)||g(F)){if(j)Y&&(te._func_call=!0,_e+=re._func_call.alias+"("+Y+")"),_e+=")";else if(Y)throw"System tag "+F+" must be childless"}else if(N(F)||R(F)){if(j)_e+=Y?Y+")":")";else if(_e+="() => {",Y)throw"System tag "+F+" must be childless if contains r-children"}else if(T(F)||y(F)){if(j)_e+=Y?"[[,"+Y+"]]":"[]",_e+=")";else if(_e+="[",Y)throw"Component or r-tag "+F+" must be childless"}else if(!_e)throw"Tag "+F+" not found";e.type=_.MODIFIER,e.value=_e,j?le(e):oe.shift(),function(e,a){if(void 0===a&&(a=""),oe[0][0]===O){var r=oe[0][2],t=oe[0][3];if(oe[0][2]=e,e.value="["+a+", () => { "+e.value,r){var i="["+a+", () => { ",s=r.value.indexOf(i);s===2*oe.length&&(t.value=t.value.replace(/[}\],\s\n]+$/,"")+",\n",r.value="  ".repeat(oe.length+1)+r.value.slice(s+i.length))}}}(e,K),ie(e,!j),e.value=e.value.replace(/\s*,\s*,\s*$/,",\n")}var me;pe=e},de=Q.length;de-- >0;)me(pe,de);var he=[];for(var Ee in te)he.push("  "+re[Ee].origin+" as "+re[Ee].alias);return he.length&&(G+="import {\n"+he.join(",\n")+"\n} from 'rease';\n"),G+=i(Q)}export{A as compiler};
