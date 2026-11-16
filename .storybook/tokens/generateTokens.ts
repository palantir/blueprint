/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { wcagContrast } from "culori";

import { generatePalette, type Palette } from "./generatePalette";
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
        const familyAssignments = getFamilyAssignments(family, palette);
        for (const { name, light, dark } of familyAssignments) {
            result.light[name] = light;
            result.dark[name] = dark;
        }
    }
    return result;
}

interface TokenAssignment {
    dark: string;
    light: string;
    name: TokenName;
}

function getFamilyAssignments(family: TokenFamily, palette: Palette): TokenAssignment[] {
    // Choose the higher-contrast foreground against the filled rest color.
    const foreground =
        wcagContrast(palette[6], BLACK) >= wcagContrast(palette[6], WHITE)
            ? "var(--bp-palette-black)"
            : "var(--bp-palette-white)";
    const textAssignments: TokenAssignment[] =
        family === "default"
            ? [
                  // Hover and disabled text are derived from existing colors
                  { dark: palette[0], light: palette[9], name: "--bp-typography-color-default-rest" },
                  { dark: palette[1], light: palette[8], name: "--bp-typography-color-default-active" },
              ]
            : [
                  { dark: palette[3], light: palette[7], name: `--bp-typography-color-${family}-rest` },
                  { dark: palette[3], light: palette[7], name: `--bp-typography-color-${family}-hover` },
                  { dark: palette[2], light: palette[8], name: `--bp-typography-color-${family}-active` },
                  { dark: palette[4], light: palette[4], name: `--bp-typography-color-${family}-disabled` },
              ];
    const assignments: TokenAssignment[] = [
        { dark: foreground, light: foreground, name: `--bp-intent-${family}-foreground` },
        { dark: palette[6], light: palette[6], name: `--bp-intent-${family}-rest` },
        { dark: palette[7], light: palette[7], name: `--bp-intent-${family}-hover` },
        { dark: palette[8], light: palette[8], name: `--bp-intent-${family}-active` },
        { dark: palette[4], light: palette[4], name: `--bp-intent-${family}-disabled` },
        ...textAssignments,
    ];
    if (family === "warning") {
        // Keep the warning Button on the generated filled shade instead of BP6's lighter recipe.
        assignments.push({ dark: palette[6], light: palette[6], name: "--bp6-button-warning-rest" });
    }
    return assignments;
}
