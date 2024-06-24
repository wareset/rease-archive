/* eslint-disable */
import { relative as t, parse as e, join as s } from "path";

import { writeFileSync as n } from "fs";

import { createFilter as r } from "@rollup/pluginutils";

import { compiler as l } from "rastree";

function i({env: i = "client", debug: o = !1, extensions: u = [ ".rease", ".js", ".ts", ".jsx", ".tsx" ], include: c = null, exclude: f = null} = {}) {
    "server" !== i && (i = "client");
    const p = process.cwd(), a = r(c, f), m = "function" == typeof o ? o : t => o && t.startsWith(p);
    return {
        name: "rollup-plugin-rease",
        transform(r, o) {
            if (!a(o)) return null;
            if (!u.some((t => o.endsWith(t)))) return null;
            if (/\.[tj]s$/.test(o) && !/\brease\/(?:env|css|jsx)\b/.test(r)) return null;
            const c = l(r, {
                env: i,
                salt: o,
                useJSX: !/\.[jt]s$/.test(o)
            });
            if (!/\bnode_modules\b/.test(o) && m(o)) {
                const r = t(p, o).split(".");
                r.splice(-1, 0, i);
                const l = e(r.join("."));
                let u = s(l.dir, "__" + l.base);
                /\.[jt]sx$/.test(u) && (u = u.slice(0, -1)), n(u, "/* eslint-disable */\n// @ts-nocheck\n" + c);
            }
            return c;
        }
    };
}

export { i as default };
