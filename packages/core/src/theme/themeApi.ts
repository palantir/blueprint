/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/** A versioned theme for one color mode. Applications can pair light and dark themes separately. */
export interface ThemeAPI {
    version: "1.0";
    borderRadius?: string;
    fontFamily?: string;
}
