/* eslint-disable */
/*
dester builds:
rollup/index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = require("fs"), r = require("path"), t = require("node-watch"), s = require("./utils/getExports"), i = require("./utils"), n = require("./utils/fs"), l = require("like-file-router"), a = require("rollup-plugin-rease");

function o(e) {
    return e && "object" == typeof e && "default" in e ? e : {
        default: e
    };
}

function u(e) {
    if (e && e.__esModule) return e;
    var r = Object.create(null);
    return e && Object.keys(e).forEach((function(t) {
        if ("default" !== t) {
            var s = Object.getOwnPropertyDescriptor(e, t);
            Object.defineProperty(r, t, s.get ? s : {
                enumerable: !0,
                get: function() {
                    return e[t];
                }
            });
        }
    })), r.default = e, Object.freeze(r);
}

var p = u(e), c = u(r), v = o(t), f = o(a), m = e => {
    var r = [];
    if (p.statSync(e = c.resolve(e)).isDirectory()) for (var t = p.readdirSync(e), s = t.length; s-- > 0; ) "_" !== c.parse(t[s]).base[0] && r.push(...m(c.join(e, t[s]))); else (e => "_" !== c.parse(e).base[0] && /\.tsx?$/.test(e))(e) && r.push(e);
    return r;
}, d = (e, r) => /\.[tj]sx?$/.test(r) ? "/* filename: " + r + "\n  timestamp: " + (new Date).toISOString() + " */\n" + e : null;

exports.default = ({dirSrc: e = "src", dirTemp: r = "tmp", dirOutput: t = "app", dirSrcAssets: a = "assets", dirSrcRoutes: o = "routes", fileSrcClient: u = "client.ts", fileSrcServer: g = "server.ts", fileSrcTemplate: h = "template.html", rollupClientPluginsBefore: y = [], rollupClientOptions: S = {}, rollupServerPluginsBefore: x = [], rollupServerOptions: b = {}, debug: j = !1, devmode: _ = !1, watchStatic: O = !0} = {}) => {
    var T = c.resolve(), F = c.resolve(T, e), k = c.resolve(T, r), q = c.resolve(T, t), E = c.resolve(F, a), $ = c.resolve(q, "assets");
    n.copySyncRecursive(E, $), _ && O && v.default(E, {
        recursive: !0
    }, ((e, r) => {
        if (r = c.relative(E, c.resolve(r)).trim()) if ("remove" === e) p.unlinkSync(c.join($, r)); else n.copySyncRecursive(c.join(E, r), c.join($, r));
    }));
    var w = c.resolve(F, o), C = m(w).map((e => {
        var r = c.relative(w, e).trim(), t = (_ ? r.replace(/[^\w$]+/g, "_") : i.hash(e)) + ".js", n = s.getExports(p.readFileSync(e, "utf8"), e, /x$/.test(r));
        return {
            route: r = r.replace(/([/\\]*index)?(\.rease)?\.tsx?$/, "") || "/",
            input: e,
            clientOutput: t,
            exports: n
        };
    })).filter((e => Object.keys(e.exports).length > 0)), P = c.resolve($, "static", "build");
    if (p.existsSync(P)) for (var R = p.readdirSync(P), D = R.length; D--; ) p.unlinkSync(c.resolve(P, R[D]));
    var G = c.resolve(F, h), N = p.readFileSync(G, "utf8");
    N = "`" + N.replace(/([\\`])/g, "\\$1") + "`", n.createDirSyncRecursive(k);
    var B = c.resolve(k, "server.ts"), M = "/* eslint-disable no-tabs */\n";
    M += "import { default as route } from '" + i.slashes2posix(c.relative(k, i.trimTsx(c.resolve(F, g)))) + "'\n", 
    M += "\nconst templateFactory = (rease: any): string => " + N + "\n\n";
    for (var z = 0; z < C.length; z++) {
        var A = C[z], I = "_" + A.clientOutput.slice(0, -3);
        M += "import * as " + I + " from '" + i.slashes2posix(c.relative(k, i.trimTsx(A.input))) + "'\n", 
        M += "route.__reaserve__(" + i.stringify(A.route) + ", " + i.stringify(A.clientOutput.slice(0, -3)) + ", " + I + ", templateFactory)\n\n";
    }
    p.writeFileSync(B, M);
    var H = c.resolve(k, "client.ts"), J = "/* eslint-disable no-tabs */\n";
    J += "import { default as reaserveClient } from '" + i.slashes2posix(c.relative(k, i.trimTsx(c.resolve(F, u)))) + "'\n";
    for (var K = l.createRouter({
        on() {}
    }), L = {}, Q = "", U = 0; U < C.length; U++) {
        var V = C[U];
        V.exports.default && function() {
            var e = i.slashes2posix(c.relative(k, i.trimTsx(V.input)));
            /^\+?\d+$/.test(V.route) ? L[V.route] = e : /^\+Err$/i.test(V.route) ? Q = ", () => import('" + e + "')" : K.get(V.route, (() => e));
        }();
    }
    var W = "{\n";
    for (var X in L) W += "  " + X + ": () => import('" + L[X] + "'),\n";
    W += "\n}";
    var Y = "{\n";
    for (var Z in K._routes.GET) if (+Z >= 0) Y += "  '" + Z + "': [" + K._routes.GET[Z].map((e => "\n    [" + e.regex + ", () => import('" + e.handlers[0]() + "')]\n")) + "],\n"; else {
        var ee = Z;
        for (var re in Y += "  '" + Z + "': {\n", K._routes.GET[ee]) Y += "    '" + re + "': [" + K._routes.GET[re].map((e => "\n      [" + e.regex + ", () => import('" + e.handlers[0]() + "')]\n")) + "],\n";
        Y += "\n  }";
    }
    return J += "\nreaserveClient(" + (Y += "\n}") + ", " + W + Q + ")\n", p.writeFileSync(H, J), 
    [ {
        ...S,
        input: [],
        output: {
            compact: !0,
            format: "system",
            dir: P,
            chunkFileNames: _ ? "_[name]-[hash].js" : "[hash].js"
        },
        plugins: [ {
            name: "reaserve-client",
            buildStart() {
                this.emitFile({
                    type: "chunk",
                    id: H,
                    fileName: "index.js",
                    preserveSignature: "strict"
                });
                for (var e = C.length; e--; ) {
                    var r = C[e];
                    r.exports.default && this.emitFile({
                        type: "chunk",
                        id: r.input,
                        fileName: r.clientOutput,
                        preserveSignature: "strict"
                    });
                }
            },
            transform: d
        }, ...y, f.default({
            env: "client",
            debug: j
        }), ...S.plugins || [] ]
    }, {
        ...b,
        input: [ B ],
        output: {
            compact: !0,
            sourcemap: !1,
            format: "cjs",
            file: c.resolve(q, "index.js")
        },
        plugins: [ {
            name: "reaserve-server",
            transform: d
        }, ...x, f.default({
            env: "server",
            debug: j
        }), ...b.plugins || [] ]
    } ];
};
