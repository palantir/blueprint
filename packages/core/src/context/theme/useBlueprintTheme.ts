/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useContext } from "react";

import { BlueprintThemeContext, type BlueprintThemeTokens } from "./themeContext";

/** Returns overrides for the current subtree, suitable for an existing element's style prop. */
export function useBlueprintTheme(): BlueprintThemeTokens {
    return useContext(BlueprintThemeContext);
}
