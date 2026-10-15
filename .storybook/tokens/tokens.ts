/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import typographyTokens from "../../packages/core/src/design-tokens/tokens/base/typography.tokens.json";

export const TOKEN_CONFIG = {
    "--bp-surface-border-radius": tokenEditor<number>({
        control: { max: 32, min: 0, step: 1, type: "range" },
        // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
    "--bp-typography-family-default": tokenEditor<string>({
        control: { type: "select" },
        defaultValue: "",
        options: {
            Arial: "Arial, Helvetica, sans-serif",
            "Blueprint system font": "",
            "Courier New": '"Courier New", Courier, monospace',
            Georgia: "Georgia, serif",
            "Times New Roman": '"Times New Roman", Times, serif',
        },
        toControlValue: value => value,
        toCssValue: value => String(value),
    }),
    "--bp-typography-family-mono": tokenEditor<string>({
        control: { type: "select" },
        defaultValue: "",
        options: {
            "Blueprint monospace": "",
            "Courier New": '"Courier New", Courier, monospace',
            Menlo: "Menlo, monospace",
            Monaco: "Monaco, monospace",
        },
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
// All keys come from the module-owned configuration above.
export const TOKEN_NAMES = Object.keys(TOKEN_CONFIG) as TokenName[];
export const TYPOGRAPHY_TOKEN_NAMES = TOKEN_NAMES.filter(name => name.startsWith("--bp-typography-"));

interface TokenEditor<T> {
    control: { type: "number" | "range" | "select"; min?: number; max?: number; step?: number };
    defaultValue?: T;
    options?: Record<string, string>;
    toControlValue: (cssValue: string) => T;
    toCssValue: (controlValue: string | number) => string;
}

function tokenEditor<T>(editor: TokenEditor<T>): TokenEditor<T> {
    return editor;
}
