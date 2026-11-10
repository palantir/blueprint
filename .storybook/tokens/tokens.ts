/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ColorProps } from "@storybook/addon-docs/blocks";

import intentTokenSource from "../../packages/core/src/design-tokens/tokens/base/intent.tokens.json";
import paletteTokenSource from "../../packages/core/src/design-tokens/tokens/base/palette.tokens.json";

const INTENT_TOKENS = intentTokenSource.intent;
const PALETTE_TOKENS = paletteTokenSource.palette;
const TOKEN_SOURCES: Record<string, unknown> = { ...intentTokenSource, ...paletteTokenSource };
const TOKEN_REFERENCE_PATTERN = /^\{([^{}]+)\}$/;

// Keep palette tokens before their semantic aliases so the panel mirrors their dependency order.
/* eslint-disable sort-keys */
export const TOKEN_CONFIG = {
    "--bp-surface-border-radius": rangeTokenEditor({
        control: { max: 32, min: 0, step: 1 },
        // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
        type: "range",
    }),
    "--bp-palette-black": colorTokenEditor(PALETTE_TOKENS.black.$value),
    "--bp-palette-white": colorTokenEditor(PALETTE_TOKENS.white.$value),
    "--bp-palette-dark-gray-1": colorTokenEditor(PALETTE_TOKENS["dark-gray"]["1"].$value),
    "--bp-palette-dark-gray-2": colorTokenEditor(PALETTE_TOKENS["dark-gray"]["2"].$value),
    "--bp-palette-dark-gray-3": colorTokenEditor(PALETTE_TOKENS["dark-gray"]["3"].$value),
    "--bp-palette-dark-gray-4": colorTokenEditor(PALETTE_TOKENS["dark-gray"]["4"].$value),
    "--bp-palette-dark-gray-5": colorTokenEditor(PALETTE_TOKENS["dark-gray"]["5"].$value),
    "--bp-palette-gray-1": colorTokenEditor(PALETTE_TOKENS.gray["1"].$value),
    "--bp-palette-gray-2": colorTokenEditor(PALETTE_TOKENS.gray["2"].$value),
    "--bp-palette-gray-3": colorTokenEditor(PALETTE_TOKENS.gray["3"].$value),
    "--bp-palette-gray-4": colorTokenEditor(PALETTE_TOKENS.gray["4"].$value),
    "--bp-palette-gray-5": colorTokenEditor(PALETTE_TOKENS.gray["5"].$value),
    "--bp-palette-light-gray-1": colorTokenEditor(PALETTE_TOKENS["light-gray"]["1"].$value),
    "--bp-palette-light-gray-2": colorTokenEditor(PALETTE_TOKENS["light-gray"]["2"].$value),
    "--bp-palette-light-gray-3": colorTokenEditor(PALETTE_TOKENS["light-gray"]["3"].$value),
    "--bp-palette-light-gray-4": colorTokenEditor(PALETTE_TOKENS["light-gray"]["4"].$value),
    "--bp-palette-light-gray-5": colorTokenEditor(PALETTE_TOKENS["light-gray"]["5"].$value),
    "--bp-palette-blue-1": colorTokenEditor(PALETTE_TOKENS.blue["1"].$value),
    "--bp-palette-blue-2": colorTokenEditor(PALETTE_TOKENS.blue["2"].$value),
    "--bp-palette-blue-3": colorTokenEditor(PALETTE_TOKENS.blue["3"].$value),
    "--bp-palette-blue-4": colorTokenEditor(PALETTE_TOKENS.blue["4"].$value),
    "--bp-palette-blue-5": colorTokenEditor(PALETTE_TOKENS.blue["5"].$value),
    "--bp-palette-green-1": colorTokenEditor(PALETTE_TOKENS.green["1"].$value),
    "--bp-palette-green-2": colorTokenEditor(PALETTE_TOKENS.green["2"].$value),
    "--bp-palette-green-3": colorTokenEditor(PALETTE_TOKENS.green["3"].$value),
    "--bp-palette-green-4": colorTokenEditor(PALETTE_TOKENS.green["4"].$value),
    "--bp-palette-green-5": colorTokenEditor(PALETTE_TOKENS.green["5"].$value),
    "--bp-palette-orange-1": colorTokenEditor(PALETTE_TOKENS.orange["1"].$value),
    "--bp-palette-orange-2": colorTokenEditor(PALETTE_TOKENS.orange["2"].$value),
    "--bp-palette-orange-3": colorTokenEditor(PALETTE_TOKENS.orange["3"].$value),
    "--bp-palette-orange-4": colorTokenEditor(PALETTE_TOKENS.orange["4"].$value),
    "--bp-palette-orange-5": colorTokenEditor(PALETTE_TOKENS.orange["5"].$value),
    "--bp-palette-red-1": colorTokenEditor(PALETTE_TOKENS.red["1"].$value),
    "--bp-palette-red-2": colorTokenEditor(PALETTE_TOKENS.red["2"].$value),
    "--bp-palette-red-3": colorTokenEditor(PALETTE_TOKENS.red["3"].$value),
    "--bp-palette-red-4": colorTokenEditor(PALETTE_TOKENS.red["4"].$value),
    "--bp-palette-red-5": colorTokenEditor(PALETTE_TOKENS.red["5"].$value),
    "--bp-intent-default-rest": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.default.rest.$value)),
    "--bp-intent-default-hover": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.default.hover.$value)),
    "--bp-intent-default-active": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.default.active.$value)),
    "--bp-intent-default-disabled": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.default.disabled.$value)),
    "--bp-intent-default-foreground": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.default.foreground.$value)),
    "--bp-intent-primary-rest": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.primary.rest.$value)),
    "--bp-intent-primary-hover": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.primary.hover.$value)),
    "--bp-intent-primary-active": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.primary.active.$value)),
    "--bp-intent-primary-disabled": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.primary.disabled.$value)),
    "--bp-intent-primary-foreground": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.primary.foreground.$value)),
    "--bp-intent-success-rest": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.success.rest.$value)),
    "--bp-intent-success-hover": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.success.hover.$value)),
    "--bp-intent-success-active": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.success.active.$value)),
    "--bp-intent-success-disabled": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.success.disabled.$value)),
    "--bp-intent-success-foreground": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.success.foreground.$value)),
    "--bp-intent-warning-rest": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.warning.rest.$value)),
    "--bp-intent-warning-hover": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.warning.hover.$value)),
    "--bp-intent-warning-active": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.warning.active.$value)),
    "--bp-intent-warning-disabled": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.warning.disabled.$value)),
    "--bp-intent-warning-foreground": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.warning.foreground.$value)),
    "--bp-intent-danger-rest": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.danger.rest.$value)),
    "--bp-intent-danger-hover": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.danger.hover.$value)),
    "--bp-intent-danger-active": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.danger.active.$value)),
    "--bp-intent-danger-disabled": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.danger.disabled.$value)),
    "--bp-intent-danger-foreground": colorTokenEditor(resolveColorTokenValue(INTENT_TOKENS.danger.foreground.$value)),
} as const satisfies Record<`--${string}`, TokenEditor>;
/* eslint-enable sort-keys */

export type TokenName = keyof typeof TOKEN_CONFIG;
export type TokenValues = Record<TokenName, string>;

// All keys come from the module-owned configuration above.
export const TOKEN_NAMES = Object.keys(TOKEN_CONFIG) as TokenName[];

interface BaseTokenEditor<T, TControlType extends "color" | "range", TControl> {
    control: TControl;
    defaultCssValue?: string;
    toControlValue: (cssValue: string) => T;
    toCssValue: (controlValue: T) => string;
    type: TControlType;
}

export type ColorTokenEditor = BaseTokenEditor<string, "color", Pick<ColorProps, "presetColors" | "startOpen">>;
export type RangeTokenEditor = BaseTokenEditor<number, "range", RangeTokenControlConfig>;
export type TokenEditor = ColorTokenEditor | RangeTokenEditor;

interface RangeTokenControlConfig {
    max?: number;
    min?: number;
    step?: number;
}

function resolveColorTokenValue(value: string, resolvedReferences = new Set<string>()): string {
    const reference = TOKEN_REFERENCE_PATTERN.exec(value)?.[1];
    if (reference === undefined) {
        return value;
    }
    if (resolvedReferences.has(reference)) {
        throw new Error(`Circular design token reference: ${reference}`);
    }

    const referencedToken = getTokenByPath(reference);
    if (!isRecord(referencedToken) || typeof referencedToken.$value !== "string") {
        throw new Error(`Unable to resolve design token reference: ${reference}`);
    }

    const nextResolvedReferences = new Set(resolvedReferences).add(reference);
    return resolveColorTokenValue(referencedToken.$value, nextResolvedReferences);
}

function getTokenByPath(path: string): unknown {
    return path
        .split(".")
        .reduce<unknown>((value, segment) => (isRecord(value) ? value[segment] : undefined), TOKEN_SOURCES);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function colorTokenEditor(defaultCssValue: string): ColorTokenEditor {
    return {
        control: {},
        defaultCssValue,
        toControlValue: value => value,
        toCssValue: value => value,
        type: "color",
    };
}

function rangeTokenEditor(editor: RangeTokenEditor): RangeTokenEditor {
    return editor;
}
