/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useContext } from "react";

import type { ThemeAPI } from "../../theme/themeApi";

import { BlueprintThemeContext, type BlueprintThemeTokens } from "./themeContext";

/** Returns overrides for the current subtree, suitable for an existing element's style prop. */
export function useBlueprintThemeTokens(): BlueprintThemeTokens {
    return useContext(BlueprintThemeContext).tokens;
}

/** Returns the validated theme selected for this Blueprint version, preserving the input object's identity and extra fields. */
export function useBlueprintThemeValue(): ThemeAPI | undefined {
    return useContext(BlueprintThemeContext).theme;
}
