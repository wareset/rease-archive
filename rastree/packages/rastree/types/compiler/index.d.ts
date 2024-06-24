export declare function compiler(source: string, { env, salt, useJSX, jsxImportName, envImportName, cssImportName, tsNocheck }?: {
    env?: "client" | "server";
    salt?: string;
    useJSX?: boolean;
    jsxImportName?: string;
    envImportName?: string;
    cssImportName?: string;
    tsNocheck?: boolean;
}): string;
