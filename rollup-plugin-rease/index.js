/* eslint-disable */
Object.defineProperty(exports, "__esModule", {
    value: !0
});

const e = require("path"), t = require("fs"), s = require("@rollup/pluginutils"), r = require("rastree");

exports.default = function({env: n = "client", debug: l = !1, extensions: i = [ ".rease", ".js", ".ts", ".jsx", ".tsx" ], include: u = null, exclude: o = null} = {}) {
    "server" !== n && (n = "client");
    const c = process.cwd(), a = s.createFilter(u, o), p = "function" == typeof l ? l : e => l && e.startsWith(c);
    return {
        name: "rollup-plugin-rease",
        transform(s, l) {
            if (!a(l)) return null;
            if (!i.some((e => l.endsWith(e)))) return null;
            if (/\.[tj]s$/.test(l) && !/\brease\/(?:env|css|jsx)\b/.test(s)) return null;
            const u = r.compiler(s, {
                env: n,
                salt: l,
                useJSX: !/\.[jt]s$/.test(l)
            });
            if (!/\bnode_modules\b/.test(l) && p(l)) {
                const s = e.relative(c, l).split(".");
                s.splice(-1, 0, n);
                const r = e.parse(s.join("."));
                let i = e.join(r.dir, "__" + r.base);
                /\.[jt]sx$/.test(i) && (i = i.slice(0, -1)), t.writeFileSync(i, "/* eslint-disable */\n// @ts-nocheck\n" + u);
            }
            return u;
        }
    };
};
