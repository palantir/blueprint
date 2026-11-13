/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { ColorControl, RangeControl } from "@storybook/addon-docs/blocks";
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root Culori devDependency.
import { formatHex, parse } from "culori";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React from "react";
import { IconButton, Loader, TabsView } from "storybook/internal/components";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";
import { styled } from "storybook/theming";

import {
    type FamilyInput,
    type GeneratedTokens,
    generateTokens,
    type GeneratorInputs,
    getFamilyTokenNames,
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
const FAMILY_LABELS: Record<TokenFamily, string> = {
    danger: "Danger",
    default: "Default",
    primary: "Primary",
    success: "Success",
    warning: "Warning",
};
// Preserve picker drafts/debounced edits and the token editor's expanded groups across tab changes.
const TAB_PANEL_PROPS = { renderAllChildren: true };
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
                <ResetButton disabled={!hasOverride} name={name} onClick={handleReset} />
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
    name: string;
    onChange: (value: string | undefined) => void;
    overrideValue: string | undefined;
}

function ColorTokenControl({ editor, name, onChange, overrideValue }: TokenControlProps<ColorTokenEditor>) {
    const onChangeRef = React.useRef(onChange);
    onChangeRef.current = onChange;
    const isMounted = React.useRef(true);
    React.useEffect(function ignoreUnmountedPickerUpdates() {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    const cssValue = overrideValue || editor.defaultCssValue;
    const controlValue = cssValue === undefined ? undefined : editor.toControlValue(cssValue);
    const handleChange = React.useCallback(
        (value: string | undefined) => {
            // ColorControl debounces by 200 ms without cancelling on unmount. Reset remounts the generator controls.
            if (isMounted.current) {
                onChangeRef.current(value == null || value === "" ? undefined : editor.toCssValue(value));
            }
        },
        [editor],
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
    const manualOverrides: Partial<TokenValues> = React.useMemo(
        () => globals.tokenOverrides ?? {},
        [globals.tokenOverrides],
    );
    const generatorInputs: GeneratorInputs | undefined = globals.generatorInputs;
    const generatedOverrides: GeneratedTokens | undefined = globals.generatedTokenOverrides;
    const theme = globals.theme === "dark" ? "dark" : "light";
    const tokenOverrides = { ...generatedOverrides?.[theme], ...manualOverrides };

    const handleGenerate = React.useCallback(
        (family: TokenFamily, input: FamilyInput) => {
            const defaultColor = TOKEN_CONFIG[`--bp-intent-${family}-rest`].defaultCssValue;
            if (input.color === (generatorInputs?.[family]?.color ?? defaultColor)) {
                return;
            }
            const inputs = { ...generatorInputs };
            if (input.color === defaultColor) {
                delete inputs[family];
            } else {
                inputs[family] = input;
            }
            const generated = generateTokens({ [family]: inputs[family] });
            if (generated == null) {
                return;
            }
            const overrides = { ...manualOverrides };
            const generatedTokenOverrides: GeneratedTokens = {
                dark: { ...generatedOverrides?.dark },
                light: { ...generatedOverrides?.light },
            };
            for (const name of getFamilyTokenNames(family)) {
                delete overrides[name];
                delete generatedTokenOverrides.light[name];
                delete generatedTokenOverrides.dark[name];
            }
            Object.assign(generatedTokenOverrides.light, generated.light);
            Object.assign(generatedTokenOverrides.dark, generated.dark);
            updateGlobals({ generatedTokenOverrides, generatorInputs: inputs, tokenOverrides: overrides });
        },
        [generatedOverrides, generatorInputs, manualOverrides, updateGlobals],
    );

    const handleUpdateToken = React.useCallback(
        (name: TokenName, value: string | undefined) => {
            const overrides: Partial<TokenValues> = { ...manualOverrides };
            if (value === undefined) {
                delete overrides[name];
            } else {
                overrides[name] = value;
            }
            const generatedTokenOverrides: GeneratedTokens = {
                dark: { ...generatedOverrides?.dark },
                light: { ...generatedOverrides?.light },
            };
            // Manual editing/reset replaces the generated value in both modes; reset never reveals a fallback.
            delete generatedTokenOverrides.dark[name];
            delete generatedTokenOverrides.light[name];
            updateGlobals({ generatedTokenOverrides, tokenOverrides: overrides });
        },
        [generatedOverrides, manualOverrides, updateGlobals],
    );

    const handleResetToken = React.useCallback(
        (name: TokenName) => handleUpdateToken(name, undefined),
        [handleUpdateToken],
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
            defaultSelected="generate"
            panelProps={TAB_PANEL_PROPS}
            tabs={[
                {
                    children: <GenerateColors inputs={generatorInputs} onChange={handleGenerate} />,
                    id: "generate",
                    title: "Generate",
                },
                {
                    children: (
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
                    ),
                    id: "tokens",
                    title: "Tokens",
                },
            ]}
        />
    );
}

function ResetButton({ disabled, name, onClick }: { disabled: boolean; name: string; onClick: () => void }) {
    return (
        <IconButton
            ariaLabel={`Reset ${name}`}
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

function GenerateColors({
    inputs,
    onChange,
}: {
    inputs: GeneratorInputs | undefined;
    onChange: (family: TokenFamily, input: FamilyInput) => void;
}) {
    return (
        <TableWrapper>
            <TokensTable>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Color</th>
                        <th aria-label="Reset" />
                    </tr>
                </thead>
                <tbody>
                    {TOKEN_FAMILIES.map(family => (
                        <FamilyColorRow key={family} family={family} input={inputs?.[family]} onChange={onChange} />
                    ))}
                </tbody>
            </TokensTable>
        </TableWrapper>
    );
}

function FamilyColorRow({
    family,
    input,
    onChange,
}: {
    family: TokenFamily;
    input: FamilyInput | undefined;
    onChange: (family: TokenFamily, input: FamilyInput) => void;
}) {
    const editor = TOKEN_CONFIG[`--bp-intent-${family}-rest`];
    const color = input?.color ?? editor.defaultCssValue;
    const [colorResetRevision, setColorResetRevision] = React.useState(0);
    const handleColor = React.useCallback(
        (value: string | undefined) => {
            const normalized = normalizeOpaqueColor(value);
            if (normalized != null) {
                onChange(family, { color: normalized });
            }
        },
        [family, onChange],
    );
    const handleResetColor = React.useCallback(() => {
        setColorResetRevision(revision => revision + 1);
        onChange(family, { color: editor.defaultCssValue });
    }, [editor, family, onChange]);

    return (
        <tr>
            <td>{FAMILY_LABELS[family]}</td>
            <td>
                <ColorTokenControl
                    key={colorResetRevision}
                    editor={editor}
                    name={`${FAMILY_LABELS[family]} color`}
                    onChange={handleColor}
                    overrideValue={color}
                />
            </td>
            <td>
                <ResetButton
                    disabled={color === editor.defaultCssValue}
                    name={`${family} color`}
                    onClick={handleResetColor}
                />
            </td>
        </tr>
    );
}

function normalizeOpaqueColor(value: string | undefined): string | undefined {
    const color = value == null ? undefined : parse(value);
    return color == null || (color.alpha != null && color.alpha !== 1) ? undefined : formatHex(color);
}
