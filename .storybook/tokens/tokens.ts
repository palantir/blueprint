/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ArgTypes } from "@storybook/react-vite";

import typographyTokens from "../../packages/core/src/design-tokens/tokens/base/typography.tokens.json";

export const TOKEN_CONFIG = {
    "--bp-surface-border-radius": tokenEditor<number>({
        control: { max: 32, min: 0, step: 1, type: "range" },
        // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
    "--bp-typography-family-default": tokenEditor<string>({
        control: { type: "text" },
        toControlValue: value => value,
        toCssValue: value => String(value),
    }),
    "--bp-typography-family-mono": tokenEditor<string>({
        control: { type: "text" },
        toControlValue: value => value,
        toCssValue: value => String(value),
    }),
    "--bp-typography-line-height-default": tokenEditor<number>({
        control: { max: 3, min: 0.5, step: 0.05, type: "number" },
        defaultValue: typographyTokens.typography["line-height"].default.$value,
        toControlValue: value => Number(value),
        toCssValue: value => String(value),
    }),
    "--bp-typography-line-height-large": tokenEditor<number>({
        control: { max: 3, min: 0.5, step: 0.05, type: "number" },
        defaultValue: typographyTokens.typography["line-height"].large.$value,
        toControlValue: value => Number(value),
        toCssValue: value => String(value),
    }),
    "--bp-typography-weight-bold": tokenEditor<number>({
        control: { max: 900, min: 100, step: 100, type: "number" },
        defaultValue: typographyTokens.typography.weight.bold.$value,
        toControlValue: value => Number(value),
        toCssValue: value => String(value),
    }),
    "--bp-typography-weight-default": tokenEditor<number>({
        control: { max: 900, min: 100, step: 100, type: "number" },
        defaultValue: typographyTokens.typography.weight.default.$value,
        toControlValue: value => Number(value),
        toCssValue: value => String(value),
    }),
} as const satisfies Record<`--${string}`, TokenEditor<number> | TokenEditor<string>>;

export type TokenName = keyof typeof TOKEN_CONFIG;
export type TokenValues = Record<TokenName, string>;
export type TokenControlValues = {
    [Name in TokenName]: ReturnType<(typeof TOKEN_CONFIG)[Name]["toControlValue"]>;
};

// All keys come from the module-owned configuration above.
export const TOKEN_NAMES = Object.keys(TOKEN_CONFIG) as TokenName[];

interface TokenEditor<T> {
    control: NonNullable<ArgTypes[string]["control"]>;
    defaultValue?: T;
    toControlValue: (cssValue: string) => T;
    toCssValue: (controlValue: string | number) => string;
}

function tokenEditor<T>(editor: TokenEditor<T>): TokenEditor<T> {
    return editor;
}
