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

import { isValidColor } from "./generatePalette";
import { type GeneratorInputs, TOKEN_FAMILIES, type TokenFamily } from "./generateTokens";
import {
    type ColorTokenEditor,
    getActiveTheme,
    normalizeTokenOverrides,
    type RangeTokenEditor,
    TOKEN_CONFIG,
    TOKEN_GROUPS,
    TOKEN_VALUES_REQUESTED,
    TOKEN_VALUES_UPDATED,
    type TokenGroup,
    type TokenName,
    type TokenValues,
    type TokenValuesUpdate,
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
    canReset?: boolean;
    inputError?: string;
    label?: string;
    name: TokenName;
    onResetToken: (name: TokenName) => void;
    onUpdateToken: (name: TokenName, value: string | undefined) => void;
    overrideValue: string | undefined;
    resolvedValue?: string;
}

function TokenRow({
    canReset,
    inputError,
    label,
    name,
    onResetToken,
    onUpdateToken,
    overrideValue,
    resolvedValue,
}: TokenRowProps) {
    const displayLabel = label ?? name;
    const editor = TOKEN_CONFIG[name];
    const effectiveCssValue = overrideValue ?? resolvedValue ?? editor.defaultCssValue;
    const inputErrorId = React.useId();
    const handleReset = React.useCallback(() => onResetToken(name), [name, onResetToken]);
    const handleUpdate = React.useCallback(
        (nextOverrideValue: string | undefined) => onUpdateToken(name, nextOverrideValue),
        [name, onUpdateToken],
    );

    return (
        <tr>
            <td>
                <TokenNameLabel>{displayLabel}</TokenNameLabel>
            </td>
            <td>
                <div
                    aria-describedby={inputError === undefined ? undefined : inputErrorId}
                    aria-label={displayLabel}
                    role="group"
                >
                    {editor.type === "color" ? (
                        <ColorTokenControl
                            editor={editor}
                            name={name}
                            onChange={handleUpdate}
                            value={effectiveCssValue}
                        />
                    ) : (
                        <RangeTokenControl
                            editor={editor}
                            name={name}
                            onChange={handleUpdate}
                            value={effectiveCssValue}
                        />
                    )}
                    {inputError !== undefined && (
                        <InputError id={inputErrorId} role="alert">
                            {inputError}
                        </InputError>
                    )}
                </div>
            </td>
            <td>
                <IconButton
                    ariaLabel={`Reset ${displayLabel}`}
                    disabled={!(canReset ?? overrideValue !== undefined)}
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
    value: string | undefined;
}

function ColorTokenControl({ editor, name, onChange, value: cssValue }: TokenControlProps<ColorTokenEditor>) {
    const controlValue = cssValue === undefined ? undefined : editor.toControlValue(cssValue);
    const handleChange = React.useCallback(
        (value: string | undefined) =>
            onChange(value === undefined || value === "" ? undefined : editor.toCssValue(value)),
        [editor, onChange],
    );

    return <ColorControl {...editor.control} name={name} onChange={handleChange} value={controlValue} />;
}

function RangeTokenControl({ editor, name, onChange, value: cssValue }: TokenControlProps<RangeTokenEditor>) {
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
    const [inputErrors, setInputErrors] = React.useState<Partial<Record<TokenFamily, string>>>({});
    const activeTheme = getActiveTheme(globals.theme);
    const themeTokenOverrides = React.useMemo(
        () => normalizeTokenOverrides(globals.tokenOverrides),
        [globals.tokenOverrides],
    );
    const tokenOverrides = themeTokenOverrides[activeTheme];
    const generatorInputs = globals.generatorInputs as GeneratorInputs | undefined;
    const [resolvedTokenValuesUpdate, setResolvedTokenValuesUpdate] = React.useState<TokenValuesUpdate>();
    const emit = useChannel(
        {
            [TOKEN_VALUES_UPDATED]: (update: TokenValuesUpdate) => {
                if (update.storyId === storyId && update.theme === activeTheme) {
                    setResolvedTokenValuesUpdate(update);
                }
            },
        },
        [activeTheme, storyId],
    );
    const resolvedTokenValues: Partial<TokenValues> =
        resolvedTokenValuesUpdate?.storyId === storyId && resolvedTokenValuesUpdate.theme === activeTheme
            ? resolvedTokenValuesUpdate.values
            : {};

    React.useEffect(() => {
        if (isStoryPrepared) {
            emit(TOKEN_VALUES_REQUESTED, { storyId, theme: activeTheme });
        }
    }, [activeTheme, emit, isStoryPrepared, storyId]);

    const handleUpdateToken = React.useCallback(
        (name: TokenName, value: string | undefined) => {
            const overrides = { ...tokenOverrides };
            if (value === undefined) {
                delete overrides[name];
            } else {
                overrides[name] = value;
            }
            updateGlobals({
                tokenOverrides: {
                    ...themeTokenOverrides,
                    [activeTheme]: overrides,
                },
            });
        },
        [activeTheme, themeTokenOverrides, tokenOverrides, updateGlobals],
    );

    const handleResetToken = React.useCallback(
        (name: TokenName) => handleUpdateToken(name, undefined),
        [handleUpdateToken],
    );

    const handleUpdateFamily = React.useCallback(
        (family: TokenFamily, value: string | undefined) => {
            if (value !== undefined && !isValidColor(value)) {
                setInputErrors(errors => ({ ...errors, [family]: `Choose an opaque color for ${family}.` }));
                return;
            }
            setInputErrors(errors => ({ ...errors, [family]: undefined }));
            const inputs = { ...generatorInputs };
            if (value === undefined) {
                delete inputs[family];
            } else {
                inputs[family] = { color: value };
            }
            updateGlobals({ generatorInputs: inputs });
        },
        [generatorInputs, updateGlobals],
    );

    const hasGeneratorInputs = Object.keys(generatorInputs ?? {}).length > 0;
    const handleResetAllFamilies = React.useCallback(() => {
        setInputErrors({});
        updateGlobals({ generatorInputs: {} });
    }, [updateGlobals]);

    const hasOverrides = Object.values(tokenOverrides).some(value => value !== undefined && value !== "");
    const handleResetAllTokens = React.useCallback(() => {
        updateGlobals({
            tokenOverrides: {
                ...themeTokenOverrides,
                [activeTheme]: {},
            },
        });
    }, [activeTheme, themeTokenOverrides, updateGlobals]);

    if (!isStoryPrepared) {
        return (
            <LoadingWrapper>
                <Loader size={32} />
            </LoadingWrapper>
        );
    }

    return (
        <TabsView
            defaultSelected="generate"
            tabs={[
                {
                    children: (
                        <TokenTable
                            resetControl={
                                <ResetAllButton
                                    ariaLabel="Reset all generator colors"
                                    disabled={!hasGeneratorInputs}
                                    onClick={handleResetAllFamilies}
                                />
                            }
                        >
                            <tbody>
                                {TOKEN_FAMILIES.map(family => (
                                    <IntentSeedRow
                                        key={family}
                                        family={family}
                                        inputError={inputErrors[family]}
                                        onUpdate={handleUpdateFamily}
                                        value={generatorInputs?.[family]?.color}
                                    />
                                ))}
                            </tbody>
                        </TokenTable>
                    ),
                    id: "generate",
                    title: "Generate",
                },
                {
                    children: (
                        <TokenTable
                            resetControl={
                                <ResetAllButton
                                    ariaLabel={`Reset all ${activeTheme} theme tokens`}
                                    disabled={!hasOverrides}
                                    onClick={handleResetAllTokens}
                                />
                            }
                        >
                            {TOKEN_GROUPS.map(group => (
                                <TokenGroupSection key={group.label} group={group}>
                                    {group.tokenNames.map(name => (
                                        <TokenRow
                                            key={name}
                                            canReset={tokenOverrides[name] !== undefined}
                                            name={name}
                                            onResetToken={handleResetToken}
                                            onUpdateToken={handleUpdateToken}
                                            resolvedValue={resolvedTokenValues[name]}
                                            overrideValue={tokenOverrides[name]}
                                        />
                                    ))}
                                </TokenGroupSection>
                            ))}
                        </TokenTable>
                    ),
                    id: "override",
                    title: "Override",
                },
            ]}
        />
    );
}

function TokenTable({ children, resetControl }: React.PropsWithChildren<{ resetControl?: React.ReactNode }>) {
    return (
        <TableWrapper>
            <TokensTable>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Control</th>
                        <th aria-label="Reset">{resetControl}</th>
                    </tr>
                </thead>
                {children}
            </TokensTable>
        </TableWrapper>
    );
}

interface ResetAllButtonProps {
    ariaLabel: string;
    disabled: boolean;
    onClick: () => void;
}

function ResetAllButton({ ariaLabel, disabled, onClick }: ResetAllButtonProps) {
    return (
        <IconButton
            ariaLabel={ariaLabel}
            disabled={disabled}
            onClick={onClick}
            padding="small"
            size="small"
            variant="ghost"
        >
            <ResetGlyph aria-hidden={true}>↺</ResetGlyph>
        </IconButton>
    );
}

interface IntentSeedRowProps {
    family: TokenFamily;
    inputError: string | undefined;
    onUpdate: (family: TokenFamily, value: string | undefined) => void;
    value: string | undefined;
}

function IntentSeedRow({ family, inputError, onUpdate, value }: IntentSeedRowProps) {
    const handleReset = React.useCallback(() => onUpdate(family, undefined), [family, onUpdate]);
    const handleUpdate = React.useCallback(
        (_name: TokenName, color: string | undefined) => onUpdate(family, color),
        [family, onUpdate],
    );

    return (
        <TokenRow
            inputError={inputError}
            label={family}
            name={`--bp-intent-${family}-rest`}
            onResetToken={handleReset}
            onUpdateToken={handleUpdate}
            overrideValue={value}
        />
    );
}
