/* eslint-disable */
/*
dester builds:
rollup/utils/getExports.ts
*/
import { jsx2tokens as e, prevRealTokenIndex as t, nextRealTokenIndex as r, TYPES as a } from "rastree/jsx2tokens";

var l = e => !(e.type === a.SPACE || e.type === a.COMMENT_LINE || e.type === a.COMMENT_BLOCK), s = (a, s, o) => {
    for (var u, v = e(a, {
        useJSX: o
    }), p = {}, f = 0; f < v.length; f++) {
        if ("export" === v[f].value && ((u = t(v, f)) < 0 || "." !== v[u].value) && (u = r(v, f)) > -1) {
            var n = v[u];
            if ("default" === n.value) p.default = !0; else if (/^(?:var|let|const|function|class)$/.test(n.value)) p[v[r(v, u)].value] = !0; else if ("*" === n.value) console.warn("export * from routes in '" + s + "' not support"); else if ("{" === n.value) {
                var i = "";
                for (f = u + 1; f < v.length && "}" !== v[f].value; f++) l(v[f]) && (i += v[f].value + " ");
                for (var m = i.trim().split(/\s*,\s*/).map((e => e.split(/\s+as\s+/).pop())), c = m.length; c--; ) p[m[c]] = !0;
            }
        }
    }
    return p;
};

export { s as getExports };
