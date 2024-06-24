/* eslint-disable */
/*
dester builds:
client.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = require("rease"), t = require("../core");

function r(e) {
    if (e && e.__esModule) return e;
    var t = Object.create(null);
    return e && Object.keys(e).forEach((function(r) {
        if ("default" !== r) {
            var a = Object.getOwnPropertyDescriptor(e, r);
            Object.defineProperty(t, r, a.get ? a : {
                enumerable: !0,
                get: function() {
                    return e[r];
                }
            });
        }
    })), t.default = e, Object.freeze(t);
}

exports.default = a => (n, o, l) => {
    window.addEventListener("load", (() => {
        var i = t.unpack(__reaserve__), c = i[t.KEY_PAGE], s = t.ceateObject();
        for (var u in c.params) s[u] = c.params[u];
        t.__setPageClient__(c.params = s, c.code);
        var f, d = e.subjectGlobal(!0);
        (f = "./" + i[t.KEY_CHUNK] + ".js", Promise.resolve().then((function() {
            return r(require(f));
        }))).then((r => {
            var s = e.subjectGlobal(r.default);
            e.createReaseApp(a, {
                clearTarget: !0,
                target: document.body,
                props: {
                    $component: s,
                    $isLoading: d
                },
                rootPub: {
                    reaserve: i
                }
            });
            var u = (e, r, a) => {
                if (r && 0 === r.indexOf(location.origin)) {
                    var i = r.slice(location.origin.length), u = i.indexOf("?");
                    u > -1 && (i = i.slice(0, u));
                    var f, p, v = (i = i.replace(/^[/\s]+|[/\s]+$/g, "")).length ? i.split("/").length : 0;
                    e: {
                        if (v in n) for (var b = n[v], g = 0, _ = b.length; g < _; g++) if (null != (f = i.match((p = b[g])[0]))) break e;
                        for (var h = v; h >= 0; h--) if (h in n[-1]) for (var m = n[-1][h], j = 0, y = m.length; j < y; j++) if (null != (f = i.match((p = m[j])[0]))) break e;
                    }
                    var O = f ? p[1] : o[404] || l;
                    O && (e.preventDefault(), d.set(!0), O().then((e => {
                        s.set(null), a && history.pushState(null, "", r), f ? (c.params = f.group || t.ceateObject(), 
                        c.code = 200) : c.code = 404, t.__setPageClient__(c.params, c.code), s.set(e.default);
                    })));
                }
            };
            window.addEventListener("popstate", (e => {
                u(e, location.href);
            })), document.body.addEventListener("click", (e => {
                if (!e.defaultPrevented && 0 === e.button && !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)) {
                    for (var t = e.target; t && "a" !== t.localName; ) t = t.parentNode;
                    t && !t.target && u(e, t.href, !0);
                }
            }));
        }));
    }));
};
