/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useMemo } from "react";
import { z } from "zod";

import type { ThemeAPI } from "../../theme/themeApi";

import { BlueprintThemeContext, type BlueprintThemeTokens } from "./themeContext";

export type ThemeRepresentations = Readonly<Record<string, unknown>>;

export type ThemeProviderProps =
    | {
          /**
           * Use when authoring overrides against the ThemeAPI type exported by your installed Blueprint version.
           * Omit to clear overrides; mutually exclusive with themesByVersion.
           */
          theme?: ThemeAPI;
          themesByVersion?: never;
      }
    | {
          theme?: never;
          /**
           * Use when the receiving Blueprint instance's supported Theme API version is unknown, for example
           * when a host forwards overrides to an independently deployed widget. Provide the available
           * representations keyed by schema version; the receiving provider selects the version it supports.
           * A missing or invalid matching entry clears overrides. Mutually exclusive with theme.
           */
          themesByVersion?: ThemeRepresentations;
      };

const THEME_API_VERSION = 1 satisfies ThemeAPI["version"];

const pixelStringSchema = z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d+)?px$/);

const themeSchema = z.object({
    borderRadius: pixelStringSchema.optional(),
    fontFamily: z.string().optional(),
    version: z.literal(THEME_API_VERSION),
} satisfies { [Key in keyof ThemeAPI]-?: z.ZodType<ThemeAPI[Key]> });

const themeTokenMap = {
    borderRadius: "--bp-surface-border-radius",
    fontFamily: "--bp-typography-family-default",
} as const satisfies Record<Exclude<keyof ThemeAPI, "version">, `--bp-${string}`>;

/**
 * Supplies converted Blueprint tokens without adding DOM elements. Consumers apply them to their existing roots.
 *
 * Use `theme` when authoring overrides against the `ThemeAPI` type exported by your installed Blueprint version.
 * Use `themesByVersion` when the receiving Blueprint instance's supported Theme API version is unknown,
 * such as when a host forwards overrides to an independently deployed widget. Provide representations keyed
 * by schema version; the receiving provider selects the version it supports.
 * The inputs are mutually exclusive. Omitting both, or providing an invalid matching theme, clears overrides.
 */
export function ThemeProvider({ children, theme, themesByVersion }: React.PropsWithChildren<ThemeProviderProps>) {
    const contextValue = useMemo(() => {
        const selectedTheme = theme ?? themesByVersion?.[THEME_API_VERSION];
        const validTheme = isTheme(selectedTheme) ? selectedTheme : undefined;
        return {
            theme: validTheme,
            tokens: validTheme == null ? undefined : customThemeToBlueprintTokens(validTheme),
        };
    }, [theme, themesByVersion]);

    return <BlueprintThemeContext.Provider value={contextValue}>{children}</BlueprintThemeContext.Provider>;
}

function customThemeToBlueprintTokens(theme: ThemeAPI): BlueprintThemeTokens {
    const tokens: Record<`--bp-${string}`, string> = {};
    for (const key of Object.keys(themeTokenMap) as Array<keyof typeof themeTokenMap>) {
        const value = theme[key];
        if (value != null) {
            tokens[themeTokenMap[key]] = value;
        }
    }
    return tokens;
}

function isTheme(value: unknown): value is ThemeAPI {
    if (value === undefined) {
        return false;
    }
    const result = themeSchema.safeParse(value);
    if (!result.success) {
        console.error("[Blueprint] Invalid theme:", result.error.issues);
    }
    return result.success;
}
