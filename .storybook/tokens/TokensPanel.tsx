/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { ColorControl, RangeControl } from "@storybook/addon-docs/blocks";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React from "react";
import { IconButton, Loader, TabsView } from "storybook/internal/components";
import { useChannel, useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";
import { styled } from "storybook/theming";

import {
    type ColorTokenEditor,
    EXISTING_TOKEN_NAMES,
    PROPOSAL_TOKEN_GROUPS,
    type RangeTokenEditor,
    TOKEN_CONFIG,
    TOKEN_VALUES_REQUESTED,
    TOKEN_VALUES_UPDATED,
    type TokenGroup,
    type TokenName,
    type TokenValues,
    type TokenValuesSnapshot,
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

    "thead th:last-of-type, td:last-of-type": {
        paddingLeft: 0,
        width: 32,
    },

    'th[scope="rowgroup"]': {
        background: theme.background.app,
        color: theme.color.defaultText,
    },
}));

const TokenNameLabel = styled.code({ whiteSpace: "nowrap" });
const ResetGlyph = styled.span({ fontSize: 16, lineHeight: 1 });

interface TokenRowProps {
    name: TokenName;
    onResetToken: (name: TokenName) => void;
    onUpdateToken: (name: TokenName, value: string | undefined) => void;
    overrideValue: string | undefined;
    resolvedValue: string | undefined;
}

function TokenRow({ name, onResetToken, onUpdateToken, overrideValue, resolvedValue }: TokenRowProps) {
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
                        resolvedValue={resolvedValue}
                    />
                ) : (
                    <RangeTokenControl
                        editor={editor}
                        name={name}
                        onChange={handleUpdate}
                        overrideValue={overrideValue}
                        resolvedValue={resolvedValue}
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

interface TokenControlProps<TEditor> {
    editor: TEditor;
    name: TokenName;
    onChange: (value: string | undefined) => void;
    overrideValue: string | undefined;
    resolvedValue: string | undefined;
}

function ColorTokenControl({
    editor,
    name,
    onChange,
    overrideValue,
    resolvedValue,
}: TokenControlProps<ColorTokenEditor>) {
    const cssValue = overrideValue || resolvedValue || editor.defaultCssValue;
    const controlValue = cssValue === undefined ? undefined : editor.toControlValue(cssValue);
    const handleChange = React.useCallback(
        (value: string | undefined) =>
            onChange(value === undefined || value === "" ? undefined : editor.toCssValue(value)),
        [editor, onChange],
    );

    return <ColorControl {...editor.control} name={name} onChange={handleChange} value={controlValue} />;
}

function RangeTokenControl({
    editor,
    name,
    onChange,
    overrideValue,
    resolvedValue,
}: TokenControlProps<RangeTokenEditor>) {
    const cssValue = overrideValue ?? resolvedValue ?? editor.defaultCssValue;
    const controlValue = cssValue === undefined ? undefined : editor.toControlValue(cssValue);
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
    const [resolvedTokenValues, setResolvedTokenValues] = React.useState<Partial<TokenValues>>({});
    const emit = useChannel(
        {
            [TOKEN_VALUES_UPDATED]: (snapshot: TokenValuesSnapshot) => {
                if (snapshot.storyId === storyId) {
                    setResolvedTokenValues(snapshot.values);
                }
            },
        },
        [storyId],
    );

    React.useEffect(() => {
        setResolvedTokenValues({});
        if (isStoryPrepared) {
            emit(TOKEN_VALUES_REQUESTED);
        }
    }, [emit, isStoryPrepared, storyId]);

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

    const renderTokens = (groups: TokenGroup[]) => (
        <TokenList
            groups={groups}
            onResetToken={handleResetToken}
            onUpdateToken={handleUpdateToken}
            resolvedTokenValues={resolvedTokenValues}
            tokenOverrides={tokenOverrides}
        />
    );

    return (
        <TabsView
            defaultSelected="proposal"
            tabs={[
                { children: renderTokens(PROPOSAL_TOKEN_GROUPS), id: "proposal", title: "Proposal" },
                { children: renderTokens([{ names: EXISTING_TOKEN_NAMES }]), id: "existing", title: "Existing" },
            ]}
        />
    );
}

interface TokenListProps {
    groups: TokenGroup[];
    onResetToken: TokenRowProps["onResetToken"];
    onUpdateToken: TokenRowProps["onUpdateToken"];
    resolvedTokenValues: Partial<TokenValues>;
    tokenOverrides: Partial<TokenValues>;
}

function TokenList({ groups, onResetToken, onUpdateToken, resolvedTokenValues, tokenOverrides }: TokenListProps) {
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
                {groups.map(({ names, title }) => (
                    <tbody key={title ?? "existing"}>
                        {title !== undefined && (
                            <tr>
                                <th colSpan={3} scope="rowgroup">
                                    {title}
                                </th>
                            </tr>
                        )}
                        {names.map(name => (
                            <TokenRow
                                key={name}
                                name={name}
                                onResetToken={onResetToken}
                                onUpdateToken={onUpdateToken}
                                overrideValue={tokenOverrides[name]}
                                resolvedValue={resolvedTokenValues[name]}
                            />
                        ))}
                    </tbody>
                ))}
            </TokensTable>
        </TableWrapper>
    );
}
