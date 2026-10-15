/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { RangeControl } from "@storybook/addon-docs/blocks";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React from "react";
import { IconButton, Loader } from "storybook/internal/components";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";
import { styled } from "storybook/theming";

import { TOKEN_CONFIG, TOKEN_NAMES, type TokenName, type TokenValues } from "./tokens";

const LoadingWrapper = styled.div({
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
});

const TableWrapper = styled.div({ overflowX: "auto" });

const TokensTable = styled.table(({ theme }) => ({
    borderCollapse: "collapse",
    color: theme.color.defaultText,
    fontSize: theme.typography.size.s2 - 1,
    width: "100%",

    "th, td": {
        borderBottom: `1px solid ${theme.appBorderColor}`,
        padding: "10px 15px",
    },

    th: {
        color: theme.textMutedColor,
        fontWeight: theme.typography.weight.bold,
        textAlign: "left",
    },

    "th:last-of-type, td:last-of-type": {
        paddingLeft: 0,
        width: 32,
    },
}));

const TokenNameLabel = styled.code({ whiteSpace: "nowrap" });
const ResetGlyph = styled.span({ fontSize: 16, lineHeight: 1 });

interface TokenRowProps {
    name: TokenName;
    onResetToken: (name: TokenName) => void;
    onUpdateToken: (name: TokenName, value: number | undefined) => void;
    overrideValue: string | undefined;
}

function TokenRow({ name, onResetToken, onUpdateToken, overrideValue }: TokenRowProps) {
    const editor = TOKEN_CONFIG[name];
    const hasOverride = overrideValue !== undefined && overrideValue !== "";
    const controlValue = hasOverride ? editor.toControlValue(overrideValue) : undefined;
    const handleChange = React.useCallback(
        (value: number | undefined) => onUpdateToken(name, value ?? undefined),
        [name, onUpdateToken],
    );
    const handleReset = React.useCallback(() => onResetToken(name), [name, onResetToken]);

    return (
        <tr>
            <td>
                <TokenNameLabel>{name}</TokenNameLabel>
            </td>
            <td>
                <RangeControl {...editor.control} name={name} onChange={handleChange} value={controlValue} />
            </td>
            <td>
                <IconButton
                    ariaLabel={`Reset ${name}`}
                    disabled={!hasOverride}
                    onClick={handleReset}
                    padding="small"
                    size="small"
                    variant="ghost"
                >
                    <ResetGlyph aria-hidden={true}>↺</ResetGlyph>
                </IconButton>
            </td>
        </tr>
    );
}

export function TokensPanel() {
    const [globals, updateGlobals] = useGlobals();
    const { storyId } = useStorybookState();
    const isStoryPrepared = useStoryPrepared(storyId);
    const tokenOverrides: Partial<TokenValues> = React.useMemo(
        () => globals.tokenOverrides ?? {},
        [globals.tokenOverrides],
    );

    const handleUpdateToken = React.useCallback(
        (name: TokenName, value: number | undefined) => {
            if (value !== undefined) {
                updateGlobals({
                    tokenOverrides: {
                        ...tokenOverrides,
                        [name]: TOKEN_CONFIG[name].toCssValue(value),
                    },
                });
            }
        },
        [tokenOverrides, updateGlobals],
    );

    const handleResetToken = React.useCallback(
        (name: TokenName) => {
            const overrides: Partial<TokenValues> = { ...tokenOverrides };
            delete overrides[name];
            updateGlobals({ tokenOverrides: overrides });
        },
        [tokenOverrides, updateGlobals],
    );

    if (!isStoryPrepared) {
        return (
            <LoadingWrapper>
                <Loader size={32} />
            </LoadingWrapper>
        );
    }

    return (
        <TableWrapper>
            <TokensTable>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Control</th>
                        <th aria-label="Reset" />
                    </tr>
                </thead>
                <tbody>
                    {TOKEN_NAMES.map(name => (
                        <TokenRow
                            key={name}
                            name={name}
                            onResetToken={handleResetToken}
                            onUpdateToken={handleUpdateToken}
                            overrideValue={tokenOverrides[name]}
                        />
                    ))}
                </tbody>
            </TokensTable>
        </TableWrapper>
    );
}
