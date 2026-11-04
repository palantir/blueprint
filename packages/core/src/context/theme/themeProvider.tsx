/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { createContext, useContext, useMemo } from "react";

import { THEME_API_VERSION, type ThemeAPI } from "../../theme/themeApi";

export type ThemeRepresentations = Readonly<Record<string, unknown>>;
export type BlueprintThemeTokens = Readonly<Partial<Record<`--bp-${string}`, string>>>;

export type BlueprintThemeProviderProps =
    | {
          /**
           * Use when authoring a theme for this Blueprint release. Construct a ThemeAPI using
           * THEME_API_VERSION. Omit to clear overrides; mutually exclusive with themesByVersion.
           */
          theme?: ThemeAPI;
          themesByVersion?: never;
      }
    | {
          theme?: never;
          /**
           * Use when forwarding themes from a host which supports multiple schema versions, such as
           * Workshop. Pass the bundle unchanged; Blueprint selects THEME_API_VERSION and ignores other
           * entries. A missing or invalid matching entry clears overrides. Mutually exclusive with theme.
           */
          themesByVersion?: ThemeRepresentations;
      };

const BlueprintThemeContext = createContext<BlueprintThemeTokens>({});

/** Supplies converted tokens without adding DOM elements. Consumers apply them to their existing roots. */
export function BlueprintThemeProvider({
    children,
    theme,
    themesByVersion,
}: React.PropsWithChildren<BlueprintThemeProviderProps>) {
    const tokens = useMemo(() => {
        const selectedTheme = parseTheme(theme ?? themesByVersion?.[THEME_API_VERSION]);
        return selectedTheme == null ? {} : customThemeToBlueprintTokens(selectedTheme);
    }, [theme, themesByVersion]);

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
    if (typeof value !== "object" || value == null || !("version" in value) || value.version !== THEME_API_VERSION) {
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
