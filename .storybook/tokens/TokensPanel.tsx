/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { ColorControl, RangeControl } from "@storybook/addon-docs/blocks";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React from "react";
import { IconButton, Loader, TabsView } from "storybook/internal/components";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";
import { styled } from "storybook/theming";

import {
    generateTokens,
    generateTokensForTheme,
    type GeneratorInputs,
    TOKEN_FAMILIES,
    type TokenFamily,
} from "./generateTokens";
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
const InputError = styled.p(({ theme }) => ({ color: theme.color.negative, margin: "10px 15px" }));

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
    label?: string;
    name: TokenName;
    onResetToken: (name: TokenName) => void;
    onUpdateToken: (name: TokenName, value: string | undefined) => void;
    overrideValue: string | undefined;
}

function TokenRow({ label, name, onResetToken, onUpdateToken, overrideValue }: TokenRowProps) {
    const displayLabel = label ?? name;
    const editor = TOKEN_CONFIG[name];
    const handleReset = React.useCallback(() => onResetToken(name), [name, onResetToken]);
    const handleUpdate = React.useCallback(
        (value: string | undefined) => onUpdateToken(name, value),
        [name, onUpdateToken],
    );

    return (
        <tr>
            <td>
                <TokenNameLabel>{displayLabel}</TokenNameLabel>
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
                    ariaLabel={`Reset ${displayLabel}`}
                    disabled={!overrideValue}
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
    children: React.ReactNode;
    group: TokenGroup;
}

function TokenGroupSection({ children, group }: TokenGroupSectionProps) {
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
                {children}
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
    const [inputError, setInputError] = React.useState<string>();
    const simpleTokenOverrides: GeneratorInputs | undefined = globals.simpleTokenOverrides;
    const explicitTokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const generatedTokens = React.useMemo(
        () => (simpleTokenOverrides != null ? generateTokensForTheme(simpleTokenOverrides, globals.theme) : undefined),
        [simpleTokenOverrides, globals.theme],
    );
    const tokenOverrides: Partial<TokenValues> = React.useMemo(
        () => ({ ...generatedTokens, ...explicitTokenOverrides }),
        [generatedTokens, explicitTokenOverrides],
    );

    const handleUpdateToken = React.useCallback(
        (name: TokenName, value: string | undefined) => {
            const overrides: Partial<TokenValues> = { ...explicitTokenOverrides };
            if (value === undefined && generatedTokens?.[name] === undefined) {
                delete overrides[name];
            } else {
                // An empty override restores the original CSS value instead of the generated value.
                overrides[name] = value ?? "";
            }
            updateGlobals({ tokenOverrides: overrides });
        },
        [explicitTokenOverrides, generatedTokens, updateGlobals],
    );

    const handleResetToken = React.useCallback(
        (name: TokenName) => handleUpdateToken(name, undefined),
        [handleUpdateToken],
    );

    const handleUpdateFamily = React.useCallback(
        (family: TokenFamily, value: string | undefined) => {
            if (value !== undefined && generateTokens({ [family]: { color: value } }) === undefined) {
                setInputError(`Choose an opaque color for ${family}.`);
                return;
            }
            setInputError(undefined);
            const inputs = { ...simpleTokenOverrides };
            if (value === undefined) {
                delete inputs[family];
            } else {
                inputs[family] = { color: value };
            }
            updateGlobals({ simpleTokenOverrides: inputs });
        },
        [simpleTokenOverrides, updateGlobals],
    );

    if (!isStoryPrepared) {
        return (
            <LoadingWrapper>
                <Loader size={32} />
            </LoadingWrapper>
        );
    }

    return (
        <TabsView
            defaultSelected="simple"
            tabs={[
                {
                    children: (
                        <>
                            <TokenTable>
                                <tbody>
                                    {TOKEN_FAMILIES.map(family => (
                                        <IntentSeedRow
                                            key={family}
                                            family={family}
                                            onUpdate={handleUpdateFamily}
                                            value={simpleTokenOverrides?.[family]?.color}
                                        />
                                    ))}
                                </tbody>
                            </TokenTable>
                            {inputError !== undefined && <InputError role="alert">{inputError}</InputError>}
                        </>
                    ),
                    id: "simple",
                    title: "Simple",
                },
                {
                    children: (
                        <TokenTable>
                            {TOKEN_GROUPS.map(group => (
                                <TokenGroupSection key={group.label} group={group}>
                                    {group.tokenNames.map(name => (
                                        <TokenRow
                                            key={name}
                                            name={name}
                                            onResetToken={handleResetToken}
                                            onUpdateToken={handleUpdateToken}
                                            overrideValue={tokenOverrides[name]}
                                        />
                                    ))}
                                </TokenGroupSection>
                            ))}
                        </TokenTable>
                    ),
                    id: "advanced",
                    title: "Advanced",
                },
            ]}
        />
    );
}

function TokenTable({ children }: React.PropsWithChildren) {
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
                {children}
            </TokensTable>
        </TableWrapper>
    );
}

interface IntentSeedRowProps {
    family: TokenFamily;
    onUpdate: (family: TokenFamily, value: string | undefined) => void;
    value: string | undefined;
}

function IntentSeedRow({ family, onUpdate, value }: IntentSeedRowProps) {
    const handleReset = React.useCallback(() => onUpdate(family, undefined), [family, onUpdate]);
    const handleUpdate = React.useCallback(
        (_name: TokenName, color: string | undefined) => onUpdate(family, color),
        [family, onUpdate],
    );

    return (
        <TokenRow
            label={family}
            name={`--bp-intent-${family}-rest`}
            onResetToken={handleReset}
            onUpdateToken={handleUpdate}
            overrideValue={value}
        />
    );
}
