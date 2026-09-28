/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { PureArgsTable } from "@storybook/addon-docs/blocks";
import type { ArgTypes } from "@storybook/react-vite";
import React, { useMemo } from "react";
import { useChannel, useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";

import {
    toCssValue,
    TOKEN_CONFIG,
    TOKEN_DEFAULTS_EVENT,
    TOKEN_DEFAULTS_REQUEST_EVENT,
    TOKEN_NAMES,
    type TokenValues,
} from "./tokens";

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;

    const [tokenDefaults, setTokenDefaults] = React.useState<Partial<TokenValues>>();
    const emit = useChannel({ [TOKEN_DEFAULTS_EVENT]: setTokenDefaults });
    // The preview publishes defaults when it loads; ask again in case it loaded before this panel mounted.
    React.useEffect(() => emit(TOKEN_DEFAULTS_REQUEST_EVENT), [emit]);

    const tokenValues = useMemo(
        () =>
            Object.fromEntries(
                TOKEN_NAMES.map(name => {
                    const value = tokenOverrides?.[name] ?? tokenDefaults?.[name];
                    return [name, value === undefined ? undefined : TOKEN_CONFIG[name].toControlValue(value)];
                }),
            ),
        [tokenDefaults, tokenOverrides],
    );

    const handleUpdateArgs = React.useCallback(
        (updates: Record<string, unknown>) => {
            const overrides: Partial<TokenValues> = { ...tokenOverrides };
            for (const name of TOKEN_NAMES) {
                const value = updates[name];
                if (value !== undefined) {
                    overrides[name] = toCssValue(name, value);
                }
            }
            updateGlobals({ tokenOverrides: overrides });
        },
        [tokenOverrides, updateGlobals],
    );

    const rows = useMemo(
        () =>
            TOKEN_NAMES.reduce<ArgTypes>((acc, name) => {
                acc[name] = {
                    control: TOKEN_CONFIG[name].control,
                    name,
                    table: {
                        defaultValue: { summary: tokenDefaults?.[name] },
                    },
                };
                return acc;
            }, {}),
        [tokenDefaults],
    );

    return (
        <PureArgsTable
            args={tokenValues}
            inAddonPanel={true}
            isLoading={!isStoryPrepared || tokenDefaults === undefined}
            rows={rows}
            updateArgs={handleUpdateArgs}
        />
    );
}
