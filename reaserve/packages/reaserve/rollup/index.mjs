/* eslint-disable */
/*
dester builds:
rollup/index.ts
*/
import * as e from "fs";

import * as r from "path";

import t from "node-watch";

import { getExports as s } from "./utils/getExports";

import { hash as i, slashes2posix as n, trimTsx as l, stringify as o } from "./utils";

import { copySyncRecursive as a, createDirSyncRecursive as u } from "./utils/fs";

import { createRouter as p } from "like-file-router";

import v from "rollup-plugin-rease";

var m = t => {
    var s = [];
    if (e.statSync(t = r.resolve(t)).isDirectory()) for (var i = e.readdirSync(t), n = i.length; n-- > 0; ) "_" !== r.parse(i[n]).base[0] && s.push(...m(r.join(t, i[n]))); else (e => "_" !== r.parse(e).base[0] && /\.tsx?$/.test(e))(t) && s.push(t);
    return s;
}, c = (e, r) => /\.[tj]sx?$/.test(r) ? "/* filename: " + r + "\n  timestamp: " + (new Date).toISOString() + " */\n" + e : null, f = ({dirSrc: f = "src", dirTemp: d = "tmp", dirOutput: g = "app", dirSrcAssets: S = "assets", dirSrcRoutes: h = "routes", fileSrcClient: y = "client.ts", fileSrcServer: x = "server.ts", fileSrcTemplate: _ = "template.html", rollupClientPluginsBefore: b = [], rollupClientOptions: j = {}, rollupServerPluginsBefore: F = [], rollupServerOptions: O = {}, debug: $ = !1, devmode: k = !1, watchStatic: w = !0} = {}) => {
    var E = r.resolve(), T = r.resolve(E, f), C = r.resolve(E, d), G = r.resolve(E, g), N = r.resolve(T, S), B = r.resolve(G, "assets");
    a(N, B), k && w && t(N, {
        recursive: !0
    }, ((t, s) => {
        if (s = r.relative(N, r.resolve(s)).trim()) if ("remove" === t) e.unlinkSync(r.join(B, s)); else a(r.join(N, s), r.join(B, s));
    }));
    var D = r.resolve(T, h), P = m(D).map((t => {
        var n = r.relative(D, t).trim(), l = (k ? n.replace(/[^\w$]+/g, "_") : i(t)) + ".js", o = s(e.readFileSync(t, "utf8"), t, /x$/.test(n));
        return {
            route: n = n.replace(/([/\\]*index)?(\.rease)?\.tsx?$/, "") || "/",
            input: t,
            clientOutput: l,
            exports: o
        };
    })).filter((e => Object.keys(e.exports).length > 0)), A = r.resolve(B, "static", "build");
    if (e.existsSync(A)) for (var I = e.readdirSync(A), R = I.length; R--; ) e.unlinkSync(r.resolve(A, I[R]));
    var q = r.resolve(T, _), z = e.readFileSync(q, "utf8");
    z = "`" + z.replace(/([\\`])/g, "\\$1") + "`", u(C);
    var H = r.resolve(C, "server.ts"), J = "/* eslint-disable no-tabs */\n";
    J += "import { default as route } from '" + n(r.relative(C, l(r.resolve(T, x)))) + "'\n", 
    J += "\nconst templateFactory = (rease: any): string => " + z + "\n\n";
    for (var K = 0; K < P.length; K++) {
        var L = P[K], M = "_" + L.clientOutput.slice(0, -3);
        J += "import * as " + M + " from '" + n(r.relative(C, l(L.input))) + "'\n", J += "route.__reaserve__(" + o(L.route) + ", " + o(L.clientOutput.slice(0, -3)) + ", " + M + ", templateFactory)\n\n";
    }
    e.writeFileSync(H, J);
    var Q = r.resolve(C, "client.ts"), U = "/* eslint-disable no-tabs */\n";
    U += "import { default as reaserveClient } from '" + n(r.relative(C, l(r.resolve(T, y)))) + "'\n";
    for (var V = p({
        on() {}
    }), W = {}, X = "", Y = 0; Y < P.length; Y++) {
        var Z = P[Y];
        Z.exports.default && function() {
            var e = n(r.relative(C, l(Z.input)));
            /^\+?\d+$/.test(Z.route) ? W[Z.route] = e : /^\+Err$/i.test(Z.route) ? X = ", () => import('" + e + "')" : V.get(Z.route, (() => e));
        }();
    }
    var ee = "{\n";
    for (var re in W) ee += "  " + re + ": () => import('" + W[re] + "'),\n";
    ee += "\n}";
    var te = "{\n";
    for (var se in V._routes.GET) if (+se >= 0) te += "  '" + se + "': [" + V._routes.GET[se].map((e => "\n    [" + e.regex + ", () => import('" + e.handlers[0]() + "')]\n")) + "],\n"; else {
        var ie = se;
        for (var ne in te += "  '" + se + "': {\n", V._routes.GET[ie]) te += "    '" + ne + "': [" + V._routes.GET[ne].map((e => "\n      [" + e.regex + ", () => import('" + e.handlers[0]() + "')]\n")) + "],\n";
        te += "\n  }";
    }
    return U += "\nreaserveClient(" + (te += "\n}") + ", " + ee + X + ")\n", e.writeFileSync(Q, U), 
    [ {
        ...j,
        input: [],
        output: {
            compact: !0,
            format: "system",
            dir: A,
            chunkFileNames: k ? "_[name]-[hash].js" : "[hash].js"
        },
        plugins: [ {
            name: "reaserve-client",
            buildStart() {
                this.emitFile({
                    type: "chunk",
                    id: Q,
                    fileName: "index.js",
                    preserveSignature: "strict"
                });
                for (var e = P.length; e--; ) {
                    var r = P[e];
                    r.exports.default && this.emitFile({
                        type: "chunk",
                        id: r.input,
                        fileName: r.clientOutput,
                        preserveSignature: "strict"
                    });
                }
            },
            transform: c
        }, ...b, v({
            env: "client",
            debug: $
        }), ...j.plugins || [] ]
    }, {
        ...O,
        input: [ H ],
        output: {
            compact: !0,
            sourcemap: !1,
            format: "cjs",
            file: r.resolve(G, "index.js")
        },
        plugins: [ {
            name: "reaserve-server",
            transform: c
        }, ...F, v({
            env: "server",
            debug: $
        }), ...O.plugins || [] ]
    } ];
};

export { f as default };
