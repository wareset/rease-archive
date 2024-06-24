/// <reference types="node" />
/// <reference types="node" />
export * from 'like-file-router';
import type { TypeHandler } from 'like-file-router';
import { Router } from 'like-file-router';
export declare type TypeServerRoute = TypeHandler | (TypeHandler | boolean)[] | [string, ...(TypeHandler | boolean)[]][];
declare type TypeTemplateFactoryObject = {
    head: string;
    body: string;
    nonce: string;
    styles: string;
    scripts: string;
};
declare type TypeTemplateFactory = (obj: TypeTemplateFactoryObject) => string;
declare const __reaserve__: (router: Router) => (path: string, clientJs: string, routes: {
    [key: string]: any;
}, templateFactory: TypeTemplateFactory) => void;
declare const _default: (a_0: import("http").Server | import("https").Server, a_1?: {
    baseUrl?: string;
    use?: (boolean | TypeHandler)[];
    errors?: {
        [key: string]: import("like-file-router").TypeHandlerError;
    };
    errorsFactory?: (code: number) => import("like-file-router").TypeHandlerError;
}) => Router & {
    __reaserve__: ReturnType<typeof __reaserve__>;
};
export default _default;
