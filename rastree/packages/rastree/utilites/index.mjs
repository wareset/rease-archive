/* eslint-disable */
import{CHILDLESS_TAGS as n}from"jsx2tokens";function r(r){return!0===n[r]}function t(n,r){return n=n.replace(/^['"`]|['"`]$/g,(function(n){return r=r||n,""})),(!r||"`"===r)&&(n=n.replace(/^}|\${$/g,(function(){return r="`",""}))),r&&(n=n.replace(/\\[^]/g,(function(n){return n[1]===r?r:n}))),n}function e(n,r,t,e){for(var u,o,f=[],c=[],i=0;i<n.length;i++)(o=r(u=n[i],i,n,t))&&f.length&&(c.push(f),f=[]),e&&o||f.push(u);return f.length&&c.push(f),c}function u(n,r){for(;n.length&&r(n[0]);)n.shift();return n}function o(n,r){for(;n.length&&r(n[n.length-1]);)n.pop();return n}function f(n,r){return u(o(n,r),r)}function c(n,r){for(var t=0,e=(n=((r||"")+n).replace(/\r/g,"")).length;e--;)t=(256*t+n.charCodeAt(e))%2147483642;return(-t>>>0).toString(36)}export{e as chunkifyArrayBy,c as hash,r as isChildlessTagName,t as safeRemoveQuotes,f as trimArrayBy,u as trimLeftArrayBy,o as trimRightArrayBy};
