/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

export type StylesheetFormat = "scss" | "css";

export type PackageManager = "npm" | "pnpm" | "yarn";

export interface InstallOptions {
    format?: StylesheetFormat;
    path?: string;
    yes?: boolean;
}

export interface InstallConfig {
    format: StylesheetFormat;
    stylesPath: string;
    packageManager: PackageManager;
}
