/* eslint-disable */
/*
dester builds:
rollup/utils/fs.ts
*/
import * as r from "fs";

import * as i from "path";

var e = e => {
    r.mkdirSync(i.resolve(e), {
        recursive: !0
    });
}, n = (o, s) => {
    if (r.statSync(o).isDirectory()) for (var c = r.readdirSync(o), t = c.length; t-- > 0; ) n(i.join(o, c[t]), i.join(s, c[t])); else e(i.dirname(s)), 
    r.existsSync(s) && r.unlinkSync(s), r.copyFileSync(o, s);
};

export { n as copySyncRecursive, e as createDirSyncRecursive };
