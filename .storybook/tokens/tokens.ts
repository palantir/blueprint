/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ArgTypes } from "@storybook/react-vite";

import darkTokens from "../../packages/core/src/design-tokens/build/tokens-dark.json";
import lightTokens from "../../packages/core/src/design-tokens/build/tokens-light.json";

export type TokenValues = {
    "--bp-surface-border-radius": string;
};

export type TokenName = keyof TokenValues;

export type TokenControlValue = string | number;

export const TOKEN_CONFIG = new Map<TokenName, TokenEditor>([
    [
        "--bp-surface-border-radius",
        {
            control: { max: 32, min: 0, step: 1, type: "range" },
            // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
            toControlValue: value => Number.parseFloat(value),
            toCssValue: value => `${value}px`,
        },
    ],
]);

export function getTokensByTheme(theme: TokenTheme, tokenName: TokenName): string {
    const tokens = theme === "dark" ? darkTokens : lightTokens;
    // Generated JSON names omit the CSS custom property's "--" prefix.
    const sourceName = tokenName.slice(2) as SourceTokenName;
    return tokens[sourceName];
}

interface TokenEditor {
    control: NonNullable<ArgTypes[string]["control"]>;
    toControlValue: (cssValue: string) => TokenControlValue;
    toCssValue: (controlValue: TokenControlValue) => string;
}

type TokenTheme = "light" | "dark";

type SourceTokenName = TokenName extends `--${infer Name}` ? Name : never;
