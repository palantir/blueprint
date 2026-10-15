/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable react/jsx-no-bind -- Six lightweight manager controls do not need memoized callbacks. */
/** @jsxRuntime classic */

import { NumberControl, RangeControl } from "@storybook/addon-docs/blocks";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React from "react";
import { Form, IconButton, Loader } from "storybook/internal/components";
import { useGlobals, useParameter, useStorybookState, useStoryPrepared } from "storybook/manager-api";
import { styled } from "storybook/theming";

import { TOKEN_CONFIG, TOKEN_NAMES, type TokenName, type TokenValues } from "./tokens";

const Panel = styled.div({ padding: 12 });
const TokenRow = styled.div(({ theme }) => ({
    borderTop: `1px solid ${theme.appBorderColor}`,
    padding: "10px 0",
}));
const TokenLabel = styled.div({
    alignItems: "center",
    display: "flex",
    gap: 4,
    justifyContent: "space-between",
    marginBottom: 6,
});
const TokenNameLabel = styled.code({ fontSize: 11, overflowWrap: "anywhere" });

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const names = useParameter<TokenName[]>("themeTokens", TOKEN_NAMES);
    const tokenOverrides: Partial<TokenValues> = globals.tokenOverrides ?? {};

    const updateToken = (name: TokenName, value: string | number | null | undefined) => {
        const overrides = { ...tokenOverrides };
        if (value == null || value === "") {
            delete overrides[name];
        } else {
            overrides[name] = TOKEN_CONFIG[name].toCssValue(value);
        }
        updateGlobals({ tokenOverrides: overrides });
    };

    const resetTokens = () => {
        const overrides = { ...tokenOverrides };
        for (const name of names) {
            delete overrides[name];
        }
        updateGlobals({ tokenOverrides: overrides });
    };

    if (!isStoryPrepared) {
        return <Loader />;
    }

    return (
        <Panel>
            <IconButton
                disabled={!names.some(name => tokenOverrides[name] !== undefined)}
                onClick={resetTokens}
                variant="ghost"
            >
                Reset all
            </IconButton>
            {names.map(name => {
                const editor = TOKEN_CONFIG[name];
                const override = tokenOverrides[name];
                const value = override ? editor.toControlValue(override) : editor.defaultValue;
                const NumberEditor = editor.control.type === "range" ? RangeControl : NumberControl;
                return (
                    <TokenRow key={name}>
                        <TokenLabel>
                            <label htmlFor={`control-${name}`}>
                                <TokenNameLabel>{name}</TokenNameLabel>
                            </label>
                            <IconButton
                                ariaLabel={`Reset ${name}`}
                                disabled={override === undefined}
                                onClick={() => updateToken(name, undefined)}
                                size="small"
                                variant="ghost"
                            >
                                <span aria-hidden={true}>↺</span>
                            </IconButton>
                        </TokenLabel>
                        {editor.options ? (
                            <>
                                <Form.Select
                                    id={`control-${name}`}
                                    onChange={event => updateToken(name, event.currentTarget.value)}
                                    value={value ?? ""}
                                >
                                    {override && !Object.values(editor.options).includes(override) && (
                                        <option value={override}>Custom font stack</option>
                                    )}
                                    {Object.entries(editor.options).map(([label, optionValue]) => (
                                        <option key={label} value={optionValue}>
                                            {label}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Input
                                    aria-label={`Custom font stack for ${name}`}
                                    onChange={event => updateToken(name, event.currentTarget.value)}
                                    placeholder="Custom CSS font stack"
                                    style={{ marginTop: 6 }}
                                    type="text"
                                    value={value ?? ""}
                                />
                            </>
                        ) : (
                            <NumberEditor
                                {...editor.control}
                                name={name}
                                onChange={nextValue => updateToken(name, nextValue)}
                                value={typeof value === "number" ? value : undefined}
                            />
                        )}
                    </TokenRow>
                );
            })}
        </Panel>
    );
}
