/* eslint-disable */
/*
dester builds:
server.ts
*/
import { createReaseApp as e, destroy as r } from "rease";

import { toString as t } from "rease/toString";

import { createRouter as o, METHODS as s } from "like-file-router";

export * from "like-file-router";

import { isArray as a, KEY_CHUNK as n, KEY_PAGE as i, KEY_REQ_AND_RES as l, pack as d } from "../core";

var f = (o, s, a, f, p) => {
    var c = (o, s) => {
        e(f, {
            beforeCreated: e => {
                e.pub.reaserve = {
                    [n]: a,
                    [i]: {
                        params: o.params,
                        code: +s.statusCode
                    }
                }, e.pub[l] = {
                    req: o,
                    res: s
                };
            },
            onCreated: e => {
                var o = s.locals && s.locals.nonce ? 'nonce="' + s.locals.nonce + '"' : "", a = t(e), n = "", i = e.is.css;
                for (var l in i) n += "<style " + o + ' id="' + l + '">' + i[l] + "</style>";
                var f = "\n  <script " + o + ">\n    window.__reaserve__ = " + d(e.pub.reaserve, null, !0) + "\n  <\/script>\n        ";
                r(e), s.writeHead(+s.statusCode || 200, {
                    "Content-Type": "text/html"
                }), s.end(p({
                    head: "",
                    body: a,
                    styles: n,
                    scripts: f,
                    nonce: o
                }));
            }
        });
    };
    /^\+?\d+$/.test(s) ? o._errors[s] = (e, r) => {
        r.statusCode = +s || 500, c(e, r);
    } : /^\+Err/i.test(s) ? o._errorsFactory = e => (r, t) => {
        t.statusCode = +e || 500, c(r, t);
    } : o.get(s, c);
}, p = (e, r, t, o) => {
    if (a(o) || (o = [ o ]), a(o[0])) for (var s = 0; s < o.length; s++) p(e, r, t, o[s]); else "string" == typeof o[0] && (t += "/" + o.shift()), 
    e.add(r, t, o);
}, c = (...e) => {
    var r = o(...e);
    return r.__reaserve__ = (e => (r, t, o, a) => {
        for (var n in o) o[n] && ("default" === n ? f(e, r, t, o[n], a) : s.indexOf(n) > -1 && p(e, n, r, o[n]));
    })(r), r;
};

export { c as default };
