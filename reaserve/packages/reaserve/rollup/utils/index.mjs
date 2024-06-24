/* eslint-disable */
/*
dester builds:
rollup/utils/index.ts
*/
var r = (r, e) => {
    for (var t = 1, a = (r = ((e || "") + r).replace(/\r/g, "")).length; a--; ) t *= (9e4 - t) / (t + r.charCodeAt(a));
    return "h" + t.toString(36).replace(/\./, "");
}, e = r => r.replace(/[\\/]+/g, "/"), t = JSON.stringify, a = r => r.replace(/\.tsx?$/, "");

export { r as hash, e as slashes2posix, t as stringify, a as trimTsx };
