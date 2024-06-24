/* eslint-disable */
/*
dester builds:
rollup/utils/fs.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = require("fs"), r = require("path");

function t(e) {
    if (e && e.__esModule) return e;
    var r = Object.create(null);
    return e && Object.keys(e).forEach((function(t) {
        if ("default" !== t) {
            var n = Object.getOwnPropertyDescriptor(e, t);
            Object.defineProperty(r, t, n.get ? n : {
                enumerable: !0,
                get: function() {
                    return e[t];
                }
            });
        }
    })), r.default = e, Object.freeze(r);
}

var n = t(e), c = t(r), i = e => {
    n.mkdirSync(c.resolve(e), {
        recursive: !0
    });
}, o = (e, r) => {
    if (n.statSync(e).isDirectory()) for (var t = n.readdirSync(e), u = t.length; u-- > 0; ) o(c.join(e, t[u]), c.join(r, t[u])); else i(c.dirname(r)), 
    n.existsSync(r) && n.unlinkSync(r), n.copyFileSync(e, r);
};

exports.copySyncRecursive = o, exports.createDirSyncRecursive = i;
