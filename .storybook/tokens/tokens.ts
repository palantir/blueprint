/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ArgTypes } from "@storybook/react-vite";

/** Emitted by the preview with the computed token values, ignoring any overrides. */
export const TOKEN_DEFAULTS_EVENT = "tokens/defaults";

/** Emitted by the manager to ask the preview for {@link TOKEN_DEFAULTS_EVENT}. */
export const TOKEN_DEFAULTS_REQUEST_EVENT = "tokens/defaults-request";

/** Converts between a token's CSS value and the value type of its Storybook control. */
interface TokenEditor<T> {
    control: NonNullable<ArgTypes[string]["control"]>;
    toControlValue: (cssValue: string) => T;
    toCssValue: (controlValue: T) => string;
}

/** Infers `T` from the editor's converters. */
function tokenEditor<T>(editor: TokenEditor<T>): TokenEditor<T> {
    return editor;
}

export const TOKEN_CONFIG = {
    "--bp-intent-primary-rest": tokenEditor<string>({
        control: { type: "color" },
        toControlValue: value => value,
        toCssValue: value => value,
    }),
    "--bp-surface-border-radius": tokenEditor<number>({
        control: { max: 32, min: 0, step: 1, type: "range" },
        // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
} satisfies Record<`--${string}`, TokenEditor<number> | TokenEditor<string>>;

export type TokenName = keyof typeof TOKEN_CONFIG;

export type TokenValues = Record<TokenName, string>;

export const TOKEN_NAMES = Object.keys(TOKEN_CONFIG) as TokenName[];

/**
 * Converts a value from Storybook's controls into the token's CSS value. Storybook doesn't type control values, so
 * this trusts the value to match the token's control.
 */
export function toCssValue(name: TokenName, controlValue: unknown): string {
    const editor = TOKEN_CONFIG[name] as TokenEditor<unknown>;
    return editor.toCssValue(controlValue);
}
