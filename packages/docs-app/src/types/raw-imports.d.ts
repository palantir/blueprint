/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable import/no-default-export */

// Type definition for importing files as strings using ?raw query parameter
declare module "*?raw" {
    const content: string;
    export default content;
}

declare module "monaco-themes/themes/*.json" {
    import type { editor } from "monaco-editor";
    const theme: editor.IStandaloneThemeData;
    export default theme;
}
