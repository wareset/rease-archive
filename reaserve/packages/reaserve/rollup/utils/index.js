/* eslint-disable */
/*
dester builds:
rollup/utils/index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = JSON.stringify;

exports.hash = (e, r) => {
    for (var t = 1, s = (e = ((r || "") + e).replace(/\r/g, "")).length; s--; ) t *= (9e4 - t) / (t + e.charCodeAt(s));
    return "h" + t.toString(36).replace(/\./, "");
}, exports.slashes2posix = e => e.replace(/[\\/]+/g, "/"), exports.stringify = e, 
exports.trimTsx = e => e.replace(/\.tsx?$/, "");
