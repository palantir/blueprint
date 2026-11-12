/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { ColorControl, RangeControl } from "@storybook/addon-docs/blocks";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React from "react";
import { IconButton, Loader } from "storybook/internal/components";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";
import { styled } from "storybook/theming";

import {
    type ColorTokenEditor,
    type RangeTokenEditor,
    TOKEN_CONFIG,
    TOKEN_GROUPS,
    type TokenGroup,
    type TokenName,
    type TokenValues,
} from "./tokens";

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
const TokenGroupHeader = styled.th({
    "&&": { padding: 0 },
});
const TokenGroupButton = styled.button(({ theme }) => ({
    alignItems: "center",
    background: "transparent",
    border: 0,
    color: theme.color.defaultText,
    cursor: "pointer",
    display: "flex",
    font: "inherit",
    fontWeight: theme.typography.weight.bold,
    gap: 8,
    padding: "10px 15px",
    textAlign: "left",
    width: "100%",

    "&:focus-visible": {
        outline: `2px solid ${theme.color.secondary}`,
        outlineOffset: -2,
    },
    "&:hover": { background: theme.background.hoverable },
}));
const TokenGroupChevron = styled.span({
    display: "inline-block",
    transition: "transform 100ms ease",
});
const TokenGroupCount = styled.span(({ theme }) => ({
    color: theme.textMutedColor,
    fontWeight: theme.typography.weight.regular,
    marginLeft: "auto",
}));

interface TokenRowProps {
    name: TokenName;
    onResetToken: (name: TokenName) => void;
    onUpdateToken: (name: TokenName, value: string | undefined) => void;
    overrideValue: string | undefined;
}

function TokenRow({ name, onResetToken, onUpdateToken, overrideValue }: TokenRowProps) {
    const editor = TOKEN_CONFIG[name];
    const hasOverride = overrideValue !== undefined && overrideValue !== "";
    const handleReset = React.useCallback(() => onResetToken(name), [name, onResetToken]);
    const handleUpdate = React.useCallback(
        (value: string | undefined) => onUpdateToken(name, value),
        [name, onUpdateToken],
    );

    return (
        <tr>
            <td>
                <TokenNameLabel>{name}</TokenNameLabel>
            </td>
            <td>
                {editor.type === "color" ? (
                    <ColorTokenControl
                        editor={editor}
                        name={name}
                        onChange={handleUpdate}
                        overrideValue={overrideValue}
                    />
                ) : (
                    <RangeTokenControl
                        editor={editor}
                        name={name}
                        onChange={handleUpdate}
                        overrideValue={overrideValue}
                    />
                )}
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

interface TokenGroupSectionProps {
    group: TokenGroup;
    onResetToken: (name: TokenName) => void;
    onUpdateToken: (name: TokenName, value: string | undefined) => void;
    tokenOverrides: Partial<TokenValues>;
}

function TokenGroupSection({ group, onResetToken, onUpdateToken, tokenOverrides }: TokenGroupSectionProps) {
    const [isExpanded, setIsExpanded] = React.useState(!group.initialCollapsed);
    const controlsId = React.useId();
    const handleToggle = React.useCallback(() => setIsExpanded(expanded => !expanded), []);

    return (
        <>
            <tbody>
                <tr>
                    <TokenGroupHeader colSpan={3} scope="rowgroup">
                        <TokenGroupButton
                            aria-controls={controlsId}
                            aria-expanded={isExpanded}
                            onClick={handleToggle}
                            type="button"
                        >
                            <TokenGroupChevron
                                aria-hidden={true}
                                style={{ transform: isExpanded ? "rotate(90deg)" : undefined }}
                            >
                                ▸
                            </TokenGroupChevron>
                            {group.label}
                            <TokenGroupCount>{group.tokenNames.length}</TokenGroupCount>
                        </TokenGroupButton>
                    </TokenGroupHeader>
                </tr>
            </tbody>
            <tbody hidden={!isExpanded} id={controlsId}>
                {group.tokenNames.map(name => (
                    <TokenRow
                        key={name}
                        name={name}
                        onResetToken={onResetToken}
                        onUpdateToken={onUpdateToken}
                        overrideValue={tokenOverrides[name]}
                    />
                ))}
            </tbody>
        </>
    );
}

interface TokenControlProps<TEditor> {
    editor: TEditor;
    name: TokenName;
    onChange: (value: string | undefined) => void;
    overrideValue: string | undefined;
}

function ColorTokenControl({ editor, name, onChange, overrideValue }: TokenControlProps<ColorTokenEditor>) {
    const cssValue = overrideValue || editor.defaultCssValue;
    const controlValue = cssValue === undefined ? undefined : editor.toControlValue(cssValue);
    const handleChange = React.useCallback(
        (value: string | undefined) =>
            onChange(value === undefined || value === "" ? undefined : editor.toCssValue(value)),
        [editor, onChange],
    );

    return <ColorControl {...editor.control} name={name} onChange={handleChange} value={controlValue} />;
}

function RangeTokenControl({ editor, name, onChange, overrideValue }: TokenControlProps<RangeTokenEditor>) {
    const controlValue = overrideValue === undefined ? undefined : editor.toControlValue(overrideValue);
    const handleChange = React.useCallback(
        (value: number | null | undefined) => onChange(value == null ? undefined : editor.toCssValue(value)),
        [editor, onChange],
    );

    return <RangeControl {...editor.control} name={name} onChange={handleChange} value={controlValue} />;
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
        (name: TokenName, value: string | undefined) => {
            const overrides: Partial<TokenValues> = { ...tokenOverrides };
            if (value === undefined) {
                delete overrides[name];
            } else {
                overrides[name] = value;
            }
            updateGlobals({ tokenOverrides: overrides });
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
                {TOKEN_GROUPS.map(group => (
                    <TokenGroupSection
                        key={group.label}
                        group={group}
                        onResetToken={handleResetToken}
                        onUpdateToken={handleUpdateToken}
                        tokenOverrides={tokenOverrides}
                    />
                ))}
            </TokensTable>
        </TableWrapper>
    );
}
