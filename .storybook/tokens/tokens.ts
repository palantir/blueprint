/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ArgTypes } from "@storybook/react-vite";

export const TOKEN_CONFIG = {
    "--bp-surface-border-radius": tokenEditor<number>({
        control: { max: 32, min: 0, step: 1, type: "range" },
        // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
} as const satisfies Record<`--${string}`, TokenEditor<number> | TokenEditor<string>>;

export type TokenName = keyof typeof TOKEN_CONFIG;
export type TokenValues = Record<TokenName, string>;
export type TokenControlValues = {
    [Name in TokenName]: ReturnType<(typeof TOKEN_CONFIG)[Name]["toControlValue"]>;
};

// All keys come from the module-owned configuration above.
export const TOKEN_NAMES = Object.keys(TOKEN_CONFIG) as TokenName[];

// The Theme panel runs in the manager, but token defaults come from the preview iframe's CSS.
// The preview publishes defaults over the channel; the panel requests them in case it missed the initial event.
export const TOKEN_DEFAULTS_UPDATED = "tokens/defaults";
export const TOKEN_DEFAULTS_REQUESTED = "tokens/request-defaults";

export interface TokenDefaults {
    storyId: string;
    theme: "light" | "dark";
    values: TokenValues;
}

interface TokenEditor<T> {
    control: NonNullable<ArgTypes[string]["control"]>;
    toControlValue: (cssValue: string) => T;
    toCssValue: (controlValue: T) => string;
}

function tokenEditor<T>(editor: TokenEditor<T>): TokenEditor<T> {
    return editor;
}
