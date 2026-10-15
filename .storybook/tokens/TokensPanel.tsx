/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { PureArgsTable } from "@storybook/addon-docs/blocks";
import type { ArgTypes } from "@storybook/react-vite";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React, { useEffect, useMemo, useState } from "react";
import { useChannel, useGlobals, useParameter, useStorybookState, useStoryPrepared } from "storybook/manager-api";

import {
    TOKEN_CONFIG,
    TOKEN_VALUES_CHANGED,
    TOKEN_VALUES_REQUEST,
    type TokenControlValues,
    type TokenName,
    type TokenValues,
} from "./tokens";

const DEFAULT_TOKEN_NAMES: TokenName[] = ["--bp-surface-border-radius"];

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const tokenNames = useParameter<TokenName[]>("themeTokens", DEFAULT_TOKEN_NAMES);
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const [resolvedValues, setResolvedValues] = useState<Partial<TokenValues>>({});
    const emit = useChannel({ [TOKEN_VALUES_CHANGED]: setResolvedValues }, []);
    useEffect(() => {
        if (isStoryPrepared) {
            emit(TOKEN_VALUES_REQUEST);
        }
    }, [emit, isStoryPrepared, storyId]);
    const tokenValues = useMemo(
        () =>
            Object.fromEntries(
                tokenNames.map(name => {
                    const overrideValue = tokenOverrides?.[name];
                    return [
                        name,
                        overrideValue === undefined || overrideValue === ""
                            ? resolvedValues[name]
                            : TOKEN_CONFIG[name].toControlValue(overrideValue),
                    ];
                }),
            ),
        [resolvedValues, tokenNames, tokenOverrides],
    );

    const handleUpdateArgs = React.useCallback(
        (updates: Partial<TokenControlValues>) => {
            const overrides: Partial<TokenValues> = { ...tokenOverrides };
            for (const name of tokenNames) {
                if (!Object.hasOwn(updates, name)) {
                    continue;
                }
                const value = updates[name];
                if (value == null || value === "") {
                    delete overrides[name];
                } else {
                    overrides[name] = TOKEN_CONFIG[name].toCssValue(value);
                }
            }
            updateGlobals({ tokenOverrides: overrides });
        },
        [tokenNames, tokenOverrides, updateGlobals],
    );

    const handleResetArgs = React.useCallback(
        (names: string[] = tokenNames) => {
            const overrides = { ...tokenOverrides };
            for (const name of tokenNames) {
                if (names.includes(name)) {
                    delete overrides[name];
                }
            }
            updateGlobals({ tokenOverrides: overrides });
        },
        [tokenNames, tokenOverrides, updateGlobals],
    );

    const rows = useMemo(
        () =>
            tokenNames.reduce<ArgTypes>((acc, key) => {
                acc[key] = {
                    control: TOKEN_CONFIG[key].control,
                    name: key,
                    table: { category: key.split("-")[3] },
                };
                return acc;
            }, {}),
        [tokenNames],
    );

    return (
        <PureArgsTable
            compact={true}
            args={tokenValues}
            inAddonPanel={true}
            isLoading={!isStoryPrepared}
            resetArgs={handleResetArgs}
            rows={rows}
            updateArgs={handleUpdateArgs}
        />
    );
}
