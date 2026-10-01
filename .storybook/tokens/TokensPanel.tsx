/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { PureArgsTable } from "@storybook/addon-docs/blocks";
import type { ArgTypes } from "@storybook/react-vite";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React, { useMemo } from "react";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";

import { TOKEN_CONFIG, TOKEN_NAMES, type TokenControlValues, type TokenValues } from "./tokens";

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const tokenValues = useMemo(
        () =>
            Object.fromEntries(
                TOKEN_NAMES.flatMap(name => {
                    const overrideValue = tokenOverrides?.[name];
                    return overrideValue === undefined || overrideValue === ""
                        ? []
                        : [[name, TOKEN_CONFIG[name].toControlValue(overrideValue)]];
                }),
            ),
        [tokenOverrides],
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
                };
                return acc;
            }, {}),
        [],
    );

    return (
        <PureArgsTable
            compact={true}
            args={tokenValues}
            inAddonPanel={true}
            isLoading={!isStoryPrepared}
            rows={rows}
            updateArgs={handleUpdateArgs}
        />
    );
}
