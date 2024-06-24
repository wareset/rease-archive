/* eslint-disable */
/*
dester builds:
_core/keys.ts
_core/util.ts
_core/queryParse.ts
_core/page.ts
_core/head.ts
core.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e, r, t, o, n, a, p = require("cookie"), s = require("cyclepack"), [u, c, i] = "req_and_res page chunk".split(" ").map((e => "%%" + e + "%%")), l = Object.create, g = () => l(null), d = Array.isArray, h = e => {
    for (var r, t, o = g(), n = e.indexOf("%") > -1, a = e.split("&"), p = 0; p < a.length; p++) [r, t] = n ? a[p].split("=").map(decodeURIComponent) : a[p].split("="), 
    r && (t = t || "", r in o ? d(o[r]) ? o[r].push(t) : o[r] = [ o[r], t ] : o[r] = t);
    return o;
}, [m, x] = (a = {
    get code() {
        return +e || 200;
    },
    get params() {
        return r || (r = g());
    },
    get cookie() {
        return t || (t = document.cookie ? p.parse(document.cookie) : g());
    },
    get query() {
        return n || (n = (o = location.search.slice(1)) ? h(o) : g());
    },
    get protocol() {
        return location.protocol;
    },
    get hostname() {
        return location.hostname;
    },
    get port() {
        return location.port;
    },
    get host() {
        return location.host;
    },
    get pathname() {
        return location.pathname;
    }
}, [ () => a, (o, a) => {
    r = o, e = a, t = n = null;
} ]), y = "undefined" == typeof window ? (e, r) => {
    if (e[c]) return e[c];
    if (!r) {
        var t = e.root.pub[u];
        e = t.req, r = t.res;
    }
    var o, n, a = e.parsedUrl;
    return e[c] || (e[c] = {
        get code() {
            return +r.statusCode || 200;
        },
        get params() {
            return e.params;
        },
        get cookie() {
            return o || (o = e.headers.cookie ? p.parse(e.headers.cookie) : g());
        },
        get query() {
            return n || (n = a.query ? h(a.query) : g());
        },
        get protocol() {
            return a.protocol;
        },
        get hostname() {
            return a.hostname;
        },
        get port() {
            return a.port;
        },
        get host() {
            return a.host;
        },
        get pathname() {
            return a.pathname;
        }
    });
} : m;

Object.defineProperty(exports, "cookieParse", {
    enumerable: !0,
    get: function() {
        return p.parse;
    }
}), exports.KEY_CHUNK = i, exports.KEY_PAGE = c, exports.KEY_REQ_AND_RES = u, exports.__setPageClient__ = x, 
exports.ceateObject = g, exports.head = () => {}, exports.isArray = d, exports.noop = () => {}, 
exports.page = y, exports.pageClient = m, exports.queryParse = h, Object.keys(s).forEach((function(e) {
    "default" === e || exports.hasOwnProperty(e) || Object.defineProperty(exports, e, {
        enumerable: !0,
        get: function() {
            return s[e];
        }
    });
}));
