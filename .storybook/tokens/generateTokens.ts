/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { wcagContrast } from "culori";

import { generatePalette } from "./generatePalette";
import { BLACK, type TokenName, WHITE } from "./tokens";

export interface FamilyInput {
    color: string;
}

export const TOKEN_FAMILIES = ["default", "primary", "success", "warning", "danger"] as const;
export type TokenFamily = (typeof TOKEN_FAMILIES)[number];
export type GeneratorInputs = Partial<Record<TokenFamily, FamilyInput>>;

export interface GeneratedTokens {
    dark: Partial<Record<TokenName, string>>;
    light: Partial<Record<TokenName, string>>;
}

/** Composes palette generation and role assignment, including BP6's warning Button rest override. */
export function generateTokens(inputs: GeneratorInputs): GeneratedTokens | undefined {
    const result: GeneratedTokens = { dark: {}, light: {} };
    for (const family of TOKEN_FAMILIES) {
        const input = inputs[family];
        if (input == null) {
            continue;
        }
        const palette = generatePalette(input.color);
        if (palette == null) {
            return undefined;
        }
        // Choose the higher-contrast foreground against the filled rest color.
        const foreground =
            wcagContrast(palette[6], BLACK) >= wcagContrast(palette[6], WHITE)
                ? "var(--bp-palette-black)"
                : "var(--bp-palette-white)";
        const familyAssignments = getFamilyAssignments(family);
        for (const { name, light, dark } of familyAssignments) {
            result.light[name] = light === "foreground" ? foreground : palette[light];
            result.dark[name] = dark === "foreground" ? foreground : palette[dark];
        }
    }
    return result;
}

export function generateTokensForTheme(inputs: GeneratorInputs, theme: unknown) {
    return generateTokens(inputs)?.[theme === "dark" ? "dark" : "light"];
}

export function getFamilyTokenNames(family: TokenFamily): TokenName[] {
    return getFamilyAssignments(family).map(({ name }) => name);
}

type PaletteShade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "foreground";

interface TokenAssignment {
    dark: PaletteShade;
    light: PaletteShade;
    name: TokenName;
}

function getFamilyAssignments(family: TokenFamily): TokenAssignment[] {
    const textAssignments: TokenAssignment[] =
        family === "default"
            ? [
                  // Hover and disabled text are derived from existing colors
                  { dark: 0, light: 9, name: "--bp-typography-color-default-rest" },
                  { dark: 1, light: 8, name: "--bp-typography-color-default-active" },
              ]
            : [
                  { dark: 3, light: 7, name: `--bp-typography-color-${family}-rest` },
                  { dark: 3, light: 7, name: `--bp-typography-color-${family}-hover` },
                  { dark: 2, light: 8, name: `--bp-typography-color-${family}-active` },
                  { dark: 4, light: 4, name: `--bp-typography-color-${family}-disabled` },
              ];
    const assignments: TokenAssignment[] = [
        { dark: "foreground", light: "foreground", name: `--bp-intent-${family}-foreground` },
        { dark: 6, light: 6, name: `--bp-intent-${family}-rest` },
        { dark: 7, light: 7, name: `--bp-intent-${family}-hover` },
        { dark: 8, light: 8, name: `--bp-intent-${family}-active` },
        { dark: 4, light: 4, name: `--bp-intent-${family}-disabled` },
        ...textAssignments,
    ];
    if (family === "warning") {
        // Keep the warning Button on the generated filled shade instead of BP6's lighter recipe.
        assignments.push({ dark: 6, light: 6, name: "--bp6-button-warning-rest" });
    }
    return assignments;
}
