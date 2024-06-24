/* eslint-disable */
/*
dester builds:
client.ts
*/
import { subjectGlobal as e, createReaseApp as a } from "rease";

import { unpack as r, KEY_PAGE as t, ceateObject as o, __setPageClient__ as n, KEY_CHUNK as i } from "../core";

var l = l => (s, d, f) => {
    window.addEventListener("load", (() => {
        var c = r(__reaserve__), p = c[t], v = o();
        for (var m in p.params) v[m] = p.params[m];
        n(p.params = v, p.code);
        var u = e(!0);
        import("./" + c[i] + ".js").then((r => {
            var t = e(r.default);
            a(l, {
                clearTarget: !0,
                target: document.body,
                props: {
                    $component: t,
                    $isLoading: u
                },
                rootPub: {
                    reaserve: c
                }
            });
            var i = (e, a, r) => {
                if (a && 0 === a.indexOf(location.origin)) {
                    var i = a.slice(location.origin.length), l = i.indexOf("?");
                    l > -1 && (i = i.slice(0, l));
                    var c, v, m = (i = i.replace(/^[/\s]+|[/\s]+$/g, "")).length ? i.split("/").length : 0;
                    e: {
                        if (m in s) for (var g = s[m], h = 0, y = g.length; h < y; h++) if (null != (c = i.match((v = g[h])[0]))) break e;
                        for (var b = m; b >= 0; b--) if (b in s[-1]) for (var w = s[-1][b], K = 0, L = w.length; K < L; K++) if (null != (c = i.match((v = w[K])[0]))) break e;
                    }
                    var _ = c ? v[1] : d[404] || f;
                    _ && (e.preventDefault(), u.set(!0), _().then((e => {
                        t.set(null), r && history.pushState(null, "", a), c ? (p.params = c.group || o(), 
                        p.code = 200) : p.code = 404, n(p.params, p.code), t.set(e.default);
                    })));
                }
            };
            window.addEventListener("popstate", (e => {
                i(e, location.href);
            })), document.body.addEventListener("click", (e => {
                if (!e.defaultPrevented && 0 === e.button && !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)) {
                    for (var a = e.target; a && "a" !== a.localName; ) a = a.parentNode;
                    a && !a.target && i(e, a.href, !0);
                }
            }));
        }));
    }));
};

export { l as default };
