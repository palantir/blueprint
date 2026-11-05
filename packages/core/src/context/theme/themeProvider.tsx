/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useMemo } from "react";
import { z } from "zod";

import { THEME_API_VERSION, type ThemeAPI } from "../../theme/themeApi";

import { BlueprintThemeContext, type BlueprintThemeTokens } from "./themeContext";

export type ThemeRepresentations = Readonly<Record<string, unknown>>;

export type ThemeProviderProps =
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

const themeSchema = z.object({
    borderRadius: z.string().optional(),
    fontFamily: z.string().optional(),
    version: z.literal(THEME_API_VERSION),
} satisfies { [Key in keyof ThemeAPI]-?: z.ZodType<ThemeAPI[Key]> });

const themeTokenMap = {
    borderRadius: "--bp-surface-border-radius",
    fontFamily: "--bp-typography-family-default",
} as const satisfies Record<Exclude<keyof ThemeAPI, "version">, `--bp-${string}`>;

/** Supplies converted tokens without adding DOM elements. Consumers apply them to their existing roots. */
export function ThemeProvider({ children, theme, themesByVersion }: React.PropsWithChildren<ThemeProviderProps>) {
    const tokens = useMemo(() => {
        const selectedTheme = parseTheme(theme ?? themesByVersion?.[THEME_API_VERSION]);
        return selectedTheme == null ? {} : customThemeToBlueprintTokens(selectedTheme);
    }, [theme, themesByVersion]);

    return <BlueprintThemeContext.Provider value={tokens}>{children}</BlueprintThemeContext.Provider>;
}

export function customThemeToBlueprintTokens(theme: ThemeAPI): BlueprintThemeTokens {
    const tokens: Partial<Record<`--bp-${string}`, string>> = {};
    for (const key of Object.keys(themeTokenMap) as Array<keyof typeof themeTokenMap>) {
        const value = theme[key];
        if (value != null) {
            tokens[themeTokenMap[key]] = value;
        }
    }
    return tokens;
}

function parseTheme(value: unknown): ThemeAPI | undefined {
    const result = themeSchema.safeParse(value);
    return result.success ? result.data : undefined;
}
