import { FilterPattern } from '@rollup/pluginutils';
export default function ({ env, debug, extensions, include, exclude, }?: {
    env?: "client" | "server";
    debug?: boolean | ((path: string) => boolean);
    extensions?: string[];
    include?: FilterPattern;
    exclude?: FilterPattern;
}): any;
