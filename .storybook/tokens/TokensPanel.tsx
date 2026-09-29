/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { PureArgsTable } from "@storybook/addon-docs/blocks";
import type { ArgTypes } from "@storybook/react-vite";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React, { useMemo } from "react";
import { useChannel, useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";

import {
    TOKEN_CONFIG,
    TOKEN_DEFAULTS_REQUESTED,
    TOKEN_DEFAULTS_UPDATED,
    TOKEN_NAMES,
    type TokenControlValues,
    type TokenDefaults,
    type TokenValues,
} from "./tokens";

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const theme = globals.theme === "dark" ? "dark" : "light";
    const [defaults, setDefaults] = React.useState<TokenDefaults>();
    const emit = useChannel(
        {
            [TOKEN_DEFAULTS_UPDATED]: (nextDefaults: TokenDefaults) => {
                if (nextDefaults.storyId === storyId && nextDefaults.theme === theme) {
                    setDefaults(nextDefaults);
                }
            },
        },
        [storyId, theme],
    );
    React.useEffect(
        function requestTokenDefaults() {
            // The panel may mount after the preview's initial defaults event.
            if (isStoryPrepared) {
                emit(TOKEN_DEFAULTS_REQUESTED);
            }
        },
        [emit, isStoryPrepared, storyId, theme],
    );
    const tokenDefaults = defaults?.storyId === storyId && defaults.theme === theme ? defaults.values : undefined;
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const tokenValues = useMemo(
        () =>
            Object.fromEntries(
                TOKEN_NAMES.flatMap(name => {
                    const cssValue = tokenOverrides?.[name] ?? tokenDefaults?.[name];
                    return cssValue === undefined || cssValue === ""
                        ? []
                        : [[name, TOKEN_CONFIG[name].toControlValue(cssValue)]];
                }),
            ),
        [tokenDefaults, tokenOverrides],
    );

    const handleUpdateArgs = React.useCallback(
        (updates: Partial<TokenControlValues>) => {
            const overrides: Partial<TokenValues> = { ...tokenOverrides };
            for (const name of TOKEN_NAMES) {
                const value = updates[name];
                if (value !== undefined) {
                    overrides[name] = TOKEN_CONFIG[name].toCssValue(value);
                }
            }
            updateGlobals({ tokenOverrides: overrides });
        },
        [tokenOverrides, updateGlobals],
    );

    const rows = useMemo(
        () =>
            TOKEN_NAMES.reduce<ArgTypes>((acc, key) => {
                acc[key] = {
                    control: TOKEN_CONFIG[key].control,
                    name: key,
                    table: {
                        defaultValue: { summary: tokenDefaults?.[key] },
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
