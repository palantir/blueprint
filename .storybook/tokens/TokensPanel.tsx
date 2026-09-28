/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { PureArgsTable } from "@storybook/addon-docs/blocks";
import type { ArgTypes } from "@storybook/react-vite";
import React, { useMemo } from "react";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";

import { getTokensByTheme, TOKEN_CONFIG, type TokenControlValue, type TokenValues } from "./tokens";

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const theme = globals.theme === "dark" ? "dark" : "light";
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const tokenValues = useMemo(
        () =>
            Object.fromEntries(
                Array.from(TOKEN_CONFIG, ([name, editor]) => [
                    name,
                    editor.toControlValue(tokenOverrides?.[name] ?? getTokensByTheme(theme, name)),
                ]),
            ),
        [theme, tokenOverrides],
    );

    const handleUpdateArgs = React.useCallback(
        (updates: Record<string, TokenControlValue | undefined>) => {
            const overrides: Partial<TokenValues> = { ...tokenOverrides };
            for (const [name, editor] of TOKEN_CONFIG) {
                const value = updates[name];
                if (value !== undefined) {
                    overrides[name] = editor.toCssValue(value);
                }
            }
            updateGlobals({ tokenOverrides: overrides });
        },
        [tokenOverrides, updateGlobals],
    );

    const rows = useMemo(
        () =>
            Array.from(TOKEN_CONFIG).reduce<ArgTypes>((acc, [key, editor]) => {
                acc[key] = {
                    control: editor.control,
                    name: key,
                    table: {
                        defaultValue: { summary: getTokensByTheme(theme, key) },
                    },
                };
                return acc;
            }, {}),
        [theme],
    );

    return (
        <PureArgsTable
            args={tokenValues}
            inAddonPanel={true}
            isLoading={!isStoryPrepared}
            rows={rows}
            updateArgs={handleUpdateArgs}
        />
    );
}
