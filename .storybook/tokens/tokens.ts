/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ColorProps } from "@storybook/addon-docs/blocks";

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
    "--bp-palette-black": colorTokenEditor("#111418"),
    "--bp-palette-white": colorTokenEditor("#ffffff"),
    "--bp-palette-dark-gray-1": colorTokenEditor("#1c2127"),
    "--bp-palette-dark-gray-2": colorTokenEditor("#252a31"),
    "--bp-palette-dark-gray-3": colorTokenEditor("#2f343c"),
    "--bp-palette-dark-gray-4": colorTokenEditor("#383e47"),
    "--bp-palette-dark-gray-5": colorTokenEditor("#404854"),
    "--bp-palette-gray-1": colorTokenEditor("#5f6b7c"),
    "--bp-palette-gray-2": colorTokenEditor("#738091"),
    "--bp-palette-gray-3": colorTokenEditor("#8f99a8"),
    "--bp-palette-gray-4": colorTokenEditor("#abb3bf"),
    "--bp-palette-gray-5": colorTokenEditor("#c5cbd3"),
    "--bp-palette-light-gray-1": colorTokenEditor("#d3d8de"),
    "--bp-palette-light-gray-2": colorTokenEditor("#dce0e5"),
    "--bp-palette-light-gray-3": colorTokenEditor("#e5e8eb"),
    "--bp-palette-light-gray-4": colorTokenEditor("#edeff2"),
    "--bp-palette-light-gray-5": colorTokenEditor("#f6f7f9"),
    "--bp-palette-blue-1": colorTokenEditor("#184a90"),
    "--bp-palette-blue-2": colorTokenEditor("#215db0"),
    "--bp-palette-blue-3": colorTokenEditor("#2d72d2"),
    "--bp-palette-blue-4": colorTokenEditor("#4c90f0"),
    "--bp-palette-blue-5": colorTokenEditor("#8abbff"),
    "--bp-palette-green-1": colorTokenEditor("#165a36"),
    "--bp-palette-green-2": colorTokenEditor("#1c6e42"),
    "--bp-palette-green-3": colorTokenEditor("#238551"),
    "--bp-palette-green-4": colorTokenEditor("#32a467"),
    "--bp-palette-green-5": colorTokenEditor("#72ca9b"),
    "--bp-palette-orange-1": colorTokenEditor("#77450d"),
    "--bp-palette-orange-2": colorTokenEditor("#935610"),
    "--bp-palette-orange-3": colorTokenEditor("#c87619"),
    "--bp-palette-orange-4": colorTokenEditor("#ec9a3c"),
    "--bp-palette-orange-5": colorTokenEditor("#fbb360"),
    "--bp-palette-red-1": colorTokenEditor("#8e292c"),
    "--bp-palette-red-2": colorTokenEditor("#ac2f33"),
    "--bp-palette-red-3": colorTokenEditor("#cd4246"),
    "--bp-palette-red-4": colorTokenEditor("#e76a6e"),
    "--bp-palette-red-5": colorTokenEditor("#fa999c"),
    "--bp-intent-default-rest": colorTokenEditor("#5f6b7c"),
    "--bp-intent-default-hover": colorTokenEditor("#404854"),
    "--bp-intent-default-active": colorTokenEditor("#383e47"),
    "--bp-intent-default-disabled": colorTokenEditor("#8f99a8"),
    "--bp-intent-default-foreground": colorTokenEditor("#ffffff"),
    "--bp-intent-primary-rest": colorTokenEditor("#2d72d2"),
    "--bp-intent-primary-hover": colorTokenEditor("#215db0"),
    "--bp-intent-primary-active": colorTokenEditor("#184a90"),
    "--bp-intent-primary-disabled": colorTokenEditor("#4c90f0"),
    "--bp-intent-primary-foreground": colorTokenEditor("#ffffff"),
    "--bp-intent-success-rest": colorTokenEditor("#238551"),
    "--bp-intent-success-hover": colorTokenEditor("#1c6e42"),
    "--bp-intent-success-active": colorTokenEditor("#165a36"),
    "--bp-intent-success-disabled": colorTokenEditor("#32a467"),
    "--bp-intent-success-foreground": colorTokenEditor("#ffffff"),
    "--bp-intent-warning-rest": colorTokenEditor("#c87619"),
    "--bp-intent-warning-hover": colorTokenEditor("#935610"),
    "--bp-intent-warning-active": colorTokenEditor("#77450d"),
    "--bp-intent-warning-disabled": colorTokenEditor("#ec9a3c"),
    "--bp-intent-warning-foreground": colorTokenEditor("#111418"),
    "--bp-intent-danger-rest": colorTokenEditor("#cd4246"),
    "--bp-intent-danger-hover": colorTokenEditor("#ac2f33"),
    "--bp-intent-danger-active": colorTokenEditor("#8e292c"),
    "--bp-intent-danger-disabled": colorTokenEditor("#e76a6e"),
    "--bp-intent-danger-foreground": colorTokenEditor("#ffffff"),
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
