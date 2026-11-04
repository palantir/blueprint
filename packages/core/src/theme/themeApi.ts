/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/** Theme API schema version supported by this Blueprint release, independent of its package version. */
export const THEME_API_VERSION = 1 as const;

/** A versioned theme for one color mode. Applications can pair light and dark themes separately. */
export interface ThemeAPI {
    version: typeof THEME_API_VERSION;
    borderRadius?: string;
    fontFamily?: string;
}
