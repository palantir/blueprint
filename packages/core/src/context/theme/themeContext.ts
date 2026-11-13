/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { createContext } from "react";

import type { ThemeAPI } from "../../theme/themeApi";

export type BlueprintThemeTokens = Readonly<Record<`--bp-${string}`, string>>;

export interface BlueprintThemeContextValue {
    tokens: BlueprintThemeTokens | undefined;
    theme: ThemeAPI | undefined;
}

export const BlueprintThemeContext = createContext<BlueprintThemeContextValue>({ theme: undefined, tokens: undefined });
