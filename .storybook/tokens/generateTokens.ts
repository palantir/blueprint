/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { parseHex, yiq } from "culori";

import paletteTokens from "../../packages/core/src/design-tokens/tokens/base/palette.tokens.json";

import { generatePalette } from "./generatePalette";
import type { TokenName, TokenValues } from "./tokens";

export interface FamilyInput {
    color: string;
}

export const TOKEN_FAMILIES = ["default", "primary", "success", "warning", "danger"] as const;
export type TokenFamily = (typeof TOKEN_FAMILIES)[number];
export type GeneratorInputs = Partial<Record<TokenFamily, FamilyInput>>;

export interface GeneratedTokens {
    dark: Partial<TokenValues>;
    light: Partial<TokenValues>;
}

export const GENERATED_TOKEN_NAMES = TOKEN_FAMILIES.flatMap(getFamilyTokenNames);

/** Composes the independent palette and role-assignment stages. No dependent tokens are emitted. */
export function generateTokens(inputs: GeneratorInputs): GeneratedTokens | undefined {
    const result: GeneratedTokens = { dark: {}, light: {} };
    for (const family of TOKEN_FAMILIES) {
        const input = inputs[family];
        if (input == null) {
            continue;
        }
        const palette = generatePalette(input.color);
        const seed = parseHex(input.color);
        if (palette == null || seed == null) {
            return undefined;
        }
        // The approved brightness heuristic is a starting choice, not a contrast guarantee.
        const foreground = yiq(seed).y >= 0.5 ? paletteTokens.palette.black.$value : paletteTokens.palette.white.$value;
        result.light[`--bp-intent-${family}-foreground`] = foreground;
        result.dark[`--bp-intent-${family}-foreground`] = foreground;
        for (const { name, light, dark } of getFamilyAssignments(family)) {
            result.light[name] = palette[light];
            result.dark[name] = palette[dark];
        }
    }
    return result;
}

export function getFamilyTokenNames(family: TokenFamily): TokenName[] {
    return [`--bp-intent-${family}-foreground`, ...getFamilyAssignments(family).map(({ name }) => name)];
}

interface TokenAssignment {
    dark: number;
    light: number;
    name: TokenName;
}

function getFamilyAssignments(family: TokenFamily): TokenAssignment[] {
    const textAssignments: TokenAssignment[] =
        family === "default"
            ? [
                  // Default hover and disabled text stay owned by existing CSS.
                  { dark: 0, light: 7, name: "--bp-typography-color-default-rest" },
                  { dark: 1, light: 6, name: "--bp-typography-color-default-active" },
              ]
            : [
                  { dark: 3, light: 6, name: `--bp-typography-color-${family}-rest` },
                  { dark: 3, light: 6, name: `--bp-typography-color-${family}-hover` },
                  { dark: 2, light: 7, name: `--bp-typography-color-${family}-active` },
                  { dark: 4, light: 4, name: `--bp-typography-color-${family}-disabled` },
              ];
    return [
        { dark: 5, light: 5, name: `--bp-intent-${family}-rest` },
        { dark: 6, light: 6, name: `--bp-intent-${family}-hover` },
        { dark: 7, light: 7, name: `--bp-intent-${family}-active` },
        { dark: 4, light: 4, name: `--bp-intent-${family}-disabled` },
        ...textAssignments,
    ];
}
