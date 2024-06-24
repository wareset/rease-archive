import type { TypeReaseContext } from 'rease';
import type { TypeIncomingMessage, TypeServerResponse } from 'like-file-router';
import { parse as cookieParse } from 'cookie';
export { cookieParse };
declare type TypeParams = {
    [key: string]: string;
};
declare type TypeCookie = {
    [key: string]: string;
};
declare type TypeQuery = {
    [key: string]: string | string[] | undefined;
};
export declare type TypePage = Readonly<{
    code: number;
    params: TypeParams;
    cookie: TypeCookie;
    query: TypeQuery;
    protocol: string;
    hostname: string;
    port: string;
    host: string;
    pathname: string;
}>;
export declare const pageClient: () => any, __setPageClient__: (_params: any, _code: any) => void;
export declare const page: ((req: TypeIncomingMessage, res: TypeServerResponse) => TypePage) & ((ctx: TypeReaseContext) => TypePage);
