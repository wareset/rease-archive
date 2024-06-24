declare const optimize: (source: string, { safeMath, safeDefaults, uglifyStrings }?: {
    safeMath?: boolean;
    safeDefaults?: boolean;
    uglifyStrings?: boolean;
}) => string;
export default optimize;
