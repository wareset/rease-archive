/* eslint-disable */
/*
dester builds:
rollup/utils/getExports.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = require("rastree/jsx2tokens"), t = t => !(t.type === e.TYPES.SPACE || t.type === e.TYPES.COMMENT_LINE || t.type === e.TYPES.COMMENT_BLOCK);

exports.getExports = (r, l, s) => {
    for (var a, o = e.jsx2tokens(r, {
        useJSX: s
    }), n = {}, u = 0; u < o.length; u++) {
        if ("export" === o[u].value && ((a = e.prevRealTokenIndex(o, u)) < 0 || "." !== o[a].value) && (a = e.nextRealTokenIndex(o, u)) > -1) {
            var p = o[a];
            if ("default" === p.value) n.default = !0; else if (/^(?:var|let|const|function|class)$/.test(p.value)) n[o[e.nextRealTokenIndex(o, a)].value] = !0; else if ("*" === p.value) console.warn("export * from routes in '" + l + "' not support"); else if ("{" === p.value) {
                var v = "";
                for (u = a + 1; u < o.length && "}" !== o[u].value; u++) t(o[u]) && (v += o[u].value + " ");
                for (var f = v.trim().split(/\s*,\s*/).map((e => e.split(/\s+as\s+/).pop())), i = f.length; i--; ) n[f[i]] = !0;
            }
        }
    }
    return n;
};
