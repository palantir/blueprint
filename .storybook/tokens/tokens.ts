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
    "--bp-typography-family-default": tokenEditor<string>({
        control: { type: "text" },
        toControlValue: value => value,
        toCssValue: value => value,
    }),
} as const satisfies Record<`--${string}`, TokenEditor<number> | TokenEditor<string>>;

export type TokenName = keyof typeof TOKEN_CONFIG;
export type TokenValues = Record<TokenName, string>;
export type TokenControlValues = {
    [Name in TokenName]: ReturnType<(typeof TOKEN_CONFIG)[Name]["toControlValue"]>;
};

// All keys come from the module-owned configuration above.
export const TOKEN_NAMES = Object.keys(TOKEN_CONFIG) as TokenName[];

export function tokenControlValueToCss<Name extends TokenName>(name: Name, value: TokenControlValues[Name]): string {
    const editors: { [Key in TokenName]: TokenEditor<TokenControlValues[Key]> } = TOKEN_CONFIG;
    return editors[name].toCssValue(value);
}

interface TokenEditor<T> {
    control: NonNullable<ArgTypes[string]["control"]>;
    toControlValue: (cssValue: string) => T;
    toCssValue: (controlValue: T) => string;
}

function tokenEditor<T>(editor: TokenEditor<T>): TokenEditor<T> {
    return editor;
}
