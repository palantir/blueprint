/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { PureArgsTable } from "@storybook/addon-docs/blocks";
import type { ArgTypes } from "@storybook/react-vite";
// This panel uses the manager's separate build config and classic JSX runtime.
// React must be in scope here even though Blueprint's shared config uses the automatic runtime.
// eslint-disable-next-line import/no-extraneous-dependencies -- Storybook uses the root React devDependency.
import React, { type CSSProperties, useId, useMemo, useState } from "react";
import { useGlobals, useStorybookState, useStoryPrepared } from "storybook/manager-api";
import { useTheme } from "storybook/theming";

import { generateAccentPalette } from "../../packages/core/src/design-tokens/generateAccentPalette";
import palette from "../../packages/core/src/design-tokens/tokens/base/palette.tokens.json";
import darkPalette from "../../packages/core/src/design-tokens/tokens/themes/dark/palette.dark.tokens.json";

import { TOKEN_CONFIG, TOKEN_NAMES, type TokenControlValues, type TokenValues } from "./tokens";

const ACCENT_ROLES = [
    "App background",
    "Subtle background",
    "Component background",
    "Hover background",
    "Active background",
    "Subtle border",
    "Border",
    "Strong border",
    "Solid",
    "Solid hover",
    "Solid active",
    "Muted text",
    "Text",
];

export function TokensPanel() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const [globals, updateGlobals] = useGlobals();
    const [accentDraft, setAccentDraft] = useState<string>(globals.accentColor ?? "");
    const [accentError, setAccentError] = useState(false);
    const accentErrorId = useId();
    const isDark = globals.theme === "dark";
    const draftPalette = useMemo(() => generateAccentPalette(accentDraft), [accentDraft]);
    const appliedPalette = useMemo(() => generateAccentPalette(globals.accentColor ?? ""), [globals.accentColor]);
    const currentPalette = appliedPalette?.[isDark ? "dark" : "light"];
    const defaultScale: Record<string, { $value: string }> = isDark ? darkPalette.color.blue : palette.color.blue;
    const handleGenerate = () => {
        if (draftPalette === undefined) {
            setAccentError(true);
            return;
        }
        setAccentError(false);
        updateGlobals({ accentColor: draftPalette.light.steps[8] });
    };
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
        <>
            <section aria-label="Accent palette" style={styles.panel}>
                {/* eslint-disable-next-line @blueprintjs/html-components -- Blueprint runtime is not available in the manager. */}
                <h3 style={styles.heading}>Accent palette</h3>
                <form
                    onSubmit={event => {
                        // Keep Enter-to-generate without navigating away from the Storybook manager.
                        event.preventDefault();
                        handleGenerate();
                    }}
                    style={styles.form}
                >
                    <label style={styles.label}>
                        Accent hex
                        <input
                            aria-describedby={accentError ? accentErrorId : undefined}
                            aria-invalid={accentError}
                            onChange={event => setAccentDraft(event.currentTarget.value)}
                            placeholder="#3CDDDA"
                            style={{ ...styles.input, inlineSize: "14ch" }}
                            type="text"
                            value={accentDraft}
                        />
                    </label>
                    <label style={styles.label}>
                        Accent color picker
                        <input
                            onChange={event => setAccentDraft(event.currentTarget.value)}
                            style={{ ...styles.input, inlineSize: 44, paddingInline: theme.layoutMargin / 2 }}
                            type="color"
                            value={
                                draftPalette?.light.steps[8] ??
                                appliedPalette?.light.steps[8] ??
                                palette.color.blue["9"].$value
                            }
                        />
                    </label>
                    <button style={styles.button} type="submit">
                        Generate
                    </button>
                    <button
                        style={styles.button}
                        onClick={() => {
                            setAccentDraft("");
                            setAccentError(false);
                            updateGlobals({ accentColor: "" });
                        }}
                        type="button"
                    >
                        Reset to Blueprint defaults
                    </button>
                </form>
                {accentError ? (
                    <p id={accentErrorId} role="alert">
                        Palette not applied. Enter 3 or 6 hexadecimal digits, with an optional #.
                    </p>
                ) : null}
                <p role="status" style={styles.status}>
                    {currentPalette === undefined
                        ? "Blueprint default accent"
                        : `Custom accent · ${isDark ? "dark" : "light"} theme`}
                </p>
                <ol aria-label={`${isDark ? "Dark" : "Light"} accent scale`} style={styles.swatches}>
                    {ACCENT_ROLES.map((role, index) => (
                        <li key={role}>
                            <div
                                aria-hidden="true"
                                style={{
                                    backgroundColor: isDark ? palette.color.black.$value : palette.color.white.$value,
                                    borderRadius: 4,
                                    marginBlockEnd: theme.layoutMargin / 2,
                                }}
                            >
                                <div
                                    style={{
                                        ...styles.swatch,
                                        backgroundColor: currentPalette?.steps[index] ?? defaultScale[index + 1].$value,
                                        color: currentPalette?.contrast ?? palette.palette.white.$value,
                                    }}
                                >
                                    {index >= 8 && index <= 10 ? "Aa" : null}
                                </div>
                            </div>
                            <strong style={styles.role}>
                                {index + 1}. {role}
                            </strong>
                            {/* eslint-disable-next-line @blueprintjs/html-components -- Blueprint runtime is not available in the manager. */}
                            <code style={styles.value}>
                                {currentPalette?.steps[index] ?? defaultScale[index + 1].$value}
                            </code>
                        </li>
                    ))}
                </ol>
            </section>
            <PureArgsTable
                compact={true}
                args={tokenValues}
                inAddonPanel={true}
                isLoading={!isStoryPrepared}
                rows={rows}
                updateArgs={handleUpdateArgs}
            />
        </>
    );
}

function getStyles(theme: ReturnType<typeof useTheme>) {
    return {
        button: {
            backgroundColor: "color-mix(in srgb, currentColor 6%, transparent)",
            border: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
            borderRadius: 4,
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
            minBlockSize: 32,
            paddingInline: theme.layoutMargin,
        },
        form: { alignItems: "end", display: "flex", flexWrap: "wrap", gap: theme.layoutMargin },
        heading: { fontSize: theme.typography.size.s2, fontWeight: theme.typography.weight.bold, margin: 0 },
        input: {
            backgroundColor: "transparent",
            border: "1px solid color-mix(in srgb, currentColor 25%, transparent)",
            borderRadius: 4,
            color: "inherit",
            font: "inherit",
            minBlockSize: 32,
            paddingInline: theme.layoutMargin,
        },
        label: {
            display: "flex",
            flexDirection: "column",
            fontSize: theme.typography.size.s1,
            gap: theme.layoutMargin / 2,
        },
        panel: { display: "grid", gap: theme.layoutMargin, padding: theme.layoutMargin * 2 },
        role: { display: "block", fontSize: theme.typography.size.s1, lineHeight: 1.4 },
        status: { fontSize: theme.typography.size.s1, margin: 0 },
        swatch: {
            aspectRatio: "3 / 1",
            borderRadius: 4,
            boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.1)",
            display: "grid",
            fontWeight: theme.typography.weight.bold,
            placeItems: "center",
        },
        swatches: {
            display: "grid",
            gap: theme.layoutMargin,
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 8rem), 1fr))",
            listStyle: "none",
            margin: 0,
            padding: 0,
        },
        value: { display: "block", fontSize: theme.typography.size.s1, lineHeight: 1.4, overflowWrap: "anywhere" },
    } satisfies Record<string, CSSProperties>;
}
