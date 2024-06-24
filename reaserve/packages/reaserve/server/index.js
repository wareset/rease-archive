/* eslint-disable */
/*
dester builds:
server.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = require("rease"), r = require("rease/toString"), t = require("like-file-router"), s = require("../core"), a = (t, a, o, n, i) => {
    var d = (t, a) => {
        e.createReaseApp(n, {
            beforeCreated: e => {
                e.pub.reaserve = {
                    [s.KEY_CHUNK]: o,
                    [s.KEY_PAGE]: {
                        params: t.params,
                        code: +a.statusCode
                    }
                }, e.pub[s.KEY_REQ_AND_RES] = {
                    req: t,
                    res: a
                };
            },
            onCreated: t => {
                var o = a.locals && a.locals.nonce ? 'nonce="' + a.locals.nonce + '"' : "", n = r.toString(t), d = "", u = t.is.css;
                for (var c in u) d += "<style " + o + ' id="' + c + '">' + u[c] + "</style>";
                var l = "\n  <script " + o + ">\n    window.__reaserve__ = " + s.pack(t.pub.reaserve, null, !0) + "\n  <\/script>\n        ";
                e.destroy(t), a.writeHead(+a.statusCode || 200, {
                    "Content-Type": "text/html"
                }), a.end(i({
                    head: "",
                    body: n,
                    styles: d,
                    scripts: l,
                    nonce: o
                }));
            }
        });
    };
    /^\+?\d+$/.test(a) ? t._errors[a] = (e, r) => {
        r.statusCode = +a || 500, d(e, r);
    } : /^\+Err/i.test(a) ? t._errorsFactory = e => (r, t) => {
        t.statusCode = +e || 500, d(r, t);
    } : t.get(a, d);
}, o = (e, r, t, a) => {
    if (s.isArray(a) || (a = [ a ]), s.isArray(a[0])) for (var n = 0; n < a.length; n++) o(e, r, t, a[n]); else "string" == typeof a[0] && (t += "/" + a.shift()), 
    e.add(r, t, a);
};

exports.default = (...e) => {
    var r = t.createRouter(...e);
    return r.__reaserve__ = (e => (r, s, n, i) => {
        for (var d in n) n[d] && ("default" === d ? a(e, r, s, n[d], i) : t.METHODS.indexOf(d) > -1 && o(e, d, r, n[d]));
    })(r), r;
}, Object.keys(t).forEach((function(e) {
    "default" === e || exports.hasOwnProperty(e) || Object.defineProperty(exports, e, {
        enumerable: !0,
        get: function() {
            return t[e];
        }
    });
}));
