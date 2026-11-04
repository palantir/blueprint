/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { createContext, useContext, useMemo } from "react";

import type { ThemeAPI } from "../../theme/themeApi";

export type ThemeRepresentations = Readonly<Record<string, unknown>>;
export type BlueprintThemeTokens = Readonly<Partial<Record<`--bp-${string}`, string>>>;

export interface BlueprintThemeProviderProps {
    /** Version-keyed Theme API payloads. Unknown versions and fields are preserved by callers. */
    themes?: ThemeRepresentations;
}

const BlueprintThemeContext = createContext<BlueprintThemeTokens>({});

/** Supplies converted tokens without adding DOM elements. Consumers apply them to their existing roots. */
export function BlueprintThemeProvider({ children, themes }: React.PropsWithChildren<BlueprintThemeProviderProps>) {
    const tokens = useMemo(() => {
        const theme = parseTheme(themes?.["1"]);
        return theme == null ? {} : customThemeToBlueprintTokens(theme);
    }, [themes]);

    return <BlueprintThemeContext.Provider value={tokens}>{children}</BlueprintThemeContext.Provider>;
}

/** Returns overrides for the current subtree, suitable for an existing element's style prop. */
export function useBlueprintTheme(): BlueprintThemeTokens {
    return useContext(BlueprintThemeContext);
}

export function customThemeToBlueprintTokens(theme: ThemeAPI): BlueprintThemeTokens {
    return {
        ...(theme.borderRadius == null ? {} : { "--bp-surface-border-radius": theme.borderRadius }),
        ...(theme.fontFamily == null ? {} : { "--bp-typography-family-default": theme.fontFamily }),
    };
}

function parseTheme(value: unknown): ThemeAPI | undefined {
    if (typeof value !== "object" || value == null || !("version" in value) || value.version !== 1) {
        return undefined;
    }
    if ("borderRadius" in value && value.borderRadius !== undefined && typeof value.borderRadius !== "string") {
        return undefined;
    }
    if ("fontFamily" in value && value.fontFamily !== undefined && typeof value.fontFamily !== "string") {
        return undefined;
    }
    return value as ThemeAPI;
}
