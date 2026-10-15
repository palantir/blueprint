/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { ArgTypes } from "@storybook/react-vite";

import emphasisTokens from "../../packages/core/src/design-tokens/tokens/base/emphasis.tokens.json";
import intentTokens from "../../packages/core/src/design-tokens/tokens/base/intent.tokens.json";
import paletteTokens from "../../packages/core/src/design-tokens/tokens/base/palette.tokens.json";
import surfaceTokens from "../../packages/core/src/design-tokens/tokens/base/surface.tokens.json";
import typographyTokens from "../../packages/core/src/design-tokens/tokens/base/typography.tokens.json";

export const TOKEN_VALUES_REQUEST = "blueprint/token-values/request";
export const TOKEN_VALUES_CHANGED = "blueprint/token-values/changed";

const colorTokenConfig = Object.fromEntries(
    [paletteTokens, intentTokens, surfaceTokens, typographyTokens, emphasisTokens].flatMap(source =>
        collectColorTokens(source),
    ),
);

export const TOKEN_CONFIG: Record<TokenName, TokenEditor<number> | TokenEditor<string>> = {
    ...colorTokenConfig,
    "--bp-surface-border-radius": tokenEditor<number>({
        control: { max: 32, min: 0, step: 1, type: "range" },
        // Storybook's slider uses numbers; the CSS token keeps its pixel unit.
        toControlValue: value => Number.parseFloat(value),
        toCssValue: value => `${value}px`,
    }),
};

export type TokenName = `--bp-${string}`;
export type TokenValues = Record<TokenName, string>;
export type TokenControlValues = Record<TokenName, string | number>;

// Both lists come from the token definitions and configuration above.
export const COLOR_TOKEN_NAMES = Object.keys(colorTokenConfig) as TokenName[];
export const TOKEN_NAMES = Object.keys(TOKEN_CONFIG) as TokenName[];

interface TokenEditor<T> {
    control: NonNullable<ArgTypes[string]["control"]>;
    toControlValue: (cssValue: string) => T;
    toCssValue: (controlValue: string | number) => string;
}

function tokenEditor<T>(editor: TokenEditor<T>): TokenEditor<T> {
    return editor;
}

function collectColorTokens(
    node: Record<string, unknown>,
    path: string[] = [],
    inheritedType?: unknown,
): Array<[TokenName, TokenEditor<string>]> {
    const type = node.$type ?? inheritedType;
    if (Object.hasOwn(node, "$value")) {
        if (type !== "color") {
            return [];
        }
        const extensions = node.$extensions as Record<string, unknown> | undefined;
        const isStackableLayer = extensions?.["com.blueprint.role"] === "stackable-layer";
        return [
            [
                `--bp-${path.join("-")}`,
                tokenEditor<string>({
                    control: { type: "color" },
                    toControlValue: value =>
                        isStackableLayer ? value.replace(/^linear-gradient\((.*) 0 0\)$/, "$1") : value,
                    toCssValue: value => (isStackableLayer ? `linear-gradient(${value} 0 0)` : String(value)),
                }),
            ],
        ];
    }
    return Object.entries(node).flatMap(([key, value]) =>
        !key.startsWith("$") && typeof value === "object" && value !== null && !Array.isArray(value)
            ? collectColorTokens(value as Record<string, unknown>, [...path, key], type)
            : [],
    );
}
