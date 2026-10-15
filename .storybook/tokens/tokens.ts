/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ArgTypes } from "@storybook/react-vite";

import paletteTokens from "../../packages/core/src/design-tokens/tokens/base/palette.tokens.json";
import surfaceTokens from "../../packages/core/src/design-tokens/tokens/base/surface.tokens.json";
import typographyTokens from "../../packages/core/src/design-tokens/tokens/base/typography.tokens.json";

const COLOR_TOKEN_EDITOR = tokenEditor<string>({
    control: { type: "color" },
    toControlValue: value => value,
    toCssValue: value => String(value),
});

export const TOKEN_CONFIG = {
    "--bp-intent-danger-rest": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.red["3"].$value },
    "--bp-intent-default-rest": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.gray["1"].$value },
    "--bp-intent-primary-rest": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.blue["3"].$value },
    "--bp-intent-success-rest": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.green["3"].$value },
    "--bp-intent-warning-rest": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.orange["3"].$value },
    "--bp-palette-blue-5": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.blue["5"].$value },
    "--bp-palette-gray-3": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.gray["3"].$value },
    "--bp-palette-gray-4": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.gray["4"].$value },
    "--bp-palette-green-5": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.green["5"].$value },
    "--bp-palette-orange-5": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.orange["5"].$value },
    "--bp-palette-red-5": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.red["5"].$value },
    "--bp-palette-white": { ...COLOR_TOKEN_EDITOR, defaultValue: paletteTokens.palette.white.$value },
    "--bp-surface-border-radius": tokenEditor<number>({
        control: { max: 32, min: 0, step: 1, type: "range" },
        defaultValue: surfaceTokens.surface["border-radius"].$value.value,
        // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
    "--bp-surface-border-width": tokenEditor<number>({
        control: { max: 4, min: 1, step: 1, type: "range" },
        defaultValue: surfaceTokens.surface["border-width"].$value.value,
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
    "--bp-surface-spacing": tokenEditor<number>({
        control: { max: 12, min: 0, step: 1, type: "range" },
        defaultValue: surfaceTokens.surface.spacing.$value.value,
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
    "--bp-typography-color-danger-hover": {
        ...COLOR_TOKEN_EDITOR,
        defaultValue: paletteTokens.palette.red["2"].$value,
    },
    "--bp-typography-color-primary-active": {
        ...COLOR_TOKEN_EDITOR,
        defaultValue: paletteTokens.palette.blue["1"].$value,
    },
    "--bp-typography-color-primary-hover": {
        ...COLOR_TOKEN_EDITOR,
        defaultValue: paletteTokens.palette.blue["2"].$value,
    },
    "--bp-typography-color-success-hover": {
        ...COLOR_TOKEN_EDITOR,
        defaultValue: paletteTokens.palette.green["2"].$value,
    },
    "--bp-typography-color-warning-hover": {
        ...COLOR_TOKEN_EDITOR,
        defaultValue: paletteTokens.palette.orange["2"].$value,
    },
    "--bp-typography-family-default": tokenEditor<string>({
        control: { type: "text" },
        defaultValue: typographyTokens.typography.family.default.$value
            .map(family => (family.includes(" ") ? `"${family}"` : family))
            .join(", "),
        toControlValue: value => value,
        toCssValue: value => String(value),
    }),
    "--bp-typography-line-height-large": tokenEditor<number>({
        control: { max: 3, min: 0.5, step: 0.1, type: "number" },
        defaultValue: typographyTokens.typography["line-height"].large.$value,
        toControlValue: value => Number(value),
        toCssValue: value => String(value),
    }),
    "--bp-typography-size-body-medium": tokenEditor<number>({
        control: { max: 24, min: 10, step: 1, type: "number" },
        defaultValue: typographyTokens.typography.size["body-medium"].$value.value,
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
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
