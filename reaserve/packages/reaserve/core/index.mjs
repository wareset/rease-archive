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
import { parse as e } from "cookie";

export { parse as cookieParse } from "cookie";

export * from "cyclepack";

var r, t, o, n, a, u, [p, c, s] = "req_and_res page chunk".split(" ").map((e => "%%" + e + "%%")), i = Object.create, l = () => i(null), g = Array.isArray, m = () => {}, h = e => {
    for (var r, t, o = l(), n = e.indexOf("%") > -1, a = e.split("&"), u = 0; u < a.length; u++) [r, t] = n ? a[u].split("=").map(decodeURIComponent) : a[u].split("="), 
    r && (t = t || "", r in o ? g(o[r]) ? o[r].push(t) : o[r] = [ o[r], t ] : o[r] = t);
    return o;
}, [d, k] = (u = {
    get code() {
        return +r || 200;
    },
    get params() {
        return t || (t = l());
    },
    get cookie() {
        return o || (o = document.cookie ? e(document.cookie) : l());
    },
    get query() {
        return a || (a = (n = location.search.slice(1)) ? h(n) : l());
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
}, [ () => u, (e, n) => {
    t = e, r = n, o = a = null;
} ]), f = "undefined" == typeof window ? (r, t) => {
    if (r[c]) return r[c];
    if (!t) {
        var o = r.root.pub[p];
        r = o.req, t = o.res;
    }
    var n, a, u = r.parsedUrl;
    return r[c] || (r[c] = {
        get code() {
            return +t.statusCode || 200;
        },
        get params() {
            return r.params;
        },
        get cookie() {
            return n || (n = r.headers.cookie ? e(r.headers.cookie) : l());
        },
        get query() {
            return a || (a = u.query ? h(u.query) : l());
        },
        get protocol() {
            return u.protocol;
        },
        get hostname() {
            return u.hostname;
        },
        get port() {
            return u.port;
        },
        get host() {
            return u.host;
        },
        get pathname() {
            return u.pathname;
        }
    });
} : d, y = () => {};

export { s as KEY_CHUNK, c as KEY_PAGE, p as KEY_REQ_AND_RES, k as __setPageClient__, l as ceateObject, y as head, g as isArray, m as noop, f as page, d as pageClient, h as queryParse };
