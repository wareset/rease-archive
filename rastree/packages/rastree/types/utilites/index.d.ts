export declare function isChildlessTagName(s: string): boolean;
export declare function safeRemoveQuotes(s: string, quote?: '`' | '"' | "'"): string;
export declare function chunkifyArrayBy<T, C extends object>(a: T[], f: (v: T, k: number, a: T[], ctx: C) => boolean, ctx?: C, splitLike?: boolean): T[][];
export declare function trimLeftArrayBy<T>(a: T[], f: (v: T) => boolean | void): T[];
export declare function trimRightArrayBy<T>(a: T[], f: (v: T) => boolean | void): T[];
export declare function trimArrayBy<T>(a: T[], f: (v: T) => boolean | void): T[];
export declare function hash(str: any, salt?: string): string;
