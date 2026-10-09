/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { useEffect } from "storybook/preview-api";

import * as Classes from "../../packages/core/src/common/classes";
import { type AccentPalette, generateAccentPalette } from "../../packages/core/src/design-tokens/generateAccentPalette";

import type { TokenValues } from "./tokens";

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const tokenOverrides: Partial<TokenValues> = globals.tokenOverrides;

    useEffect(
        function applyAccentPalette() {
            const palette = generateAccentPalette(globals.accentColor ?? "");
            if (palette === undefined) {
                return undefined;
            }
            const stylesheet = document.createElement("style");
            stylesheet.dataset.blueprintAccent = "";
            // Inherited CSS aliases resolve where declared, not at their descendant consumers.
            // Rebind primary aliases alongside the primitives in every scope, including nested dark scopes.
            stylesheet.textContent = `body { ${accentDeclarations(palette.light)} }
                body.${Classes.DARK}, body .${Classes.DARK}, body[data-bp-color-scheme="dark"],
                body [data-bp-color-scheme="dark"], html.${Classes.DARK} body, html[data-bp-color-scheme="dark"] body {
                    ${accentDeclarations(palette.dark)}
                }`;
            document.head.append(stylesheet);
            return () => stylesheet.remove();
        },
        [globals.accentColor, id],
    );

    useEffect(
        function applyTokenOverrides() {
            const style = document.body.style;
            const previousValues = Object.keys(tokenOverrides).map(name => ({
                name,
                priority: style.getPropertyPriority(name),
                value: style.getPropertyValue(name),
            }));

            for (const [name, value] of Object.entries(tokenOverrides)) {
                if (value != null) {
                    style.setProperty(name, String(value));
                }
            }

            return () => {
                for (const { name, value, priority } of previousValues) {
                    // An empty value removes the inline property.
                    style.setProperty(name, value, priority);
                }
            };
        },
        [id, tokenOverrides],
    );

    return <Story />;
};

function accentDeclarations(palette: AccentPalette) {
    const step = (number: number) => palette.steps[number - 1];
    const mix = (color: string, opacity: number) => `color-mix(in srgb, ${color} ${opacity}%, transparent)`;
    const primaryLayer = `color-mix(in srgb, ${step(9)} calc(var(--bp-surface-layer-opacity) * 100%), transparent)`;
    const tokens: Record<string, string> = {
        ...Object.fromEntries(palette.steps.map((color, index) => [`--bp-color-blue-${index + 1}`, color])),
        "--bp-button-primary-minimal-background-active": step(5),
        "--bp-button-primary-minimal-background-hover": step(4),
        "--bp-button-primary-minimal-foreground-active": step(13),
        "--bp-button-primary-minimal-foreground-hover": step(13),
        "--bp-button-primary-minimal-foreground-rest": step(13),
        "--bp-button-primary-outlined-border-hover": step(8),
        "--bp-button-primary-outlined-border-rest": step(7),
        "--bp-color-blue-contrast": palette.contrast,
        "--bp-color-blue-contrast-active": palette.contrast,
        "--bp-color-blue-contrast-hover": palette.contrast,
        "--bp-emphasis-focus-color": step(12),
        "--bp-intent-primary-active": step(11),
        "--bp-intent-primary-background-active": step(5),
        "--bp-intent-primary-background-disabled-active": mix(step(9), 30),
        "--bp-intent-primary-background-hover": step(4),
        "--bp-intent-primary-background-rest": step(3),
        "--bp-intent-primary-background-subtle": step(2),
        "--bp-intent-primary-border-disabled": mix(step(7), 35),
        "--bp-intent-primary-border-hover": step(8),
        "--bp-intent-primary-border-rest": step(7),
        "--bp-intent-primary-border-subtle": step(6),
        "--bp-intent-primary-disabled": step(9),
        "--bp-intent-primary-foreground": palette.contrast,
        "--bp-intent-primary-hover": step(10),
        "--bp-intent-primary-rest": step(9),
        "--bp-intent-primary-solid-active": step(11),
        "--bp-intent-primary-solid-disabled": mix(step(9), 50),
        "--bp-intent-primary-solid-foreground": palette.contrast,
        "--bp-intent-primary-solid-foreground-disabled": mix(palette.contrast, 60),
        "--bp-intent-primary-solid-hover": step(10),
        "--bp-intent-primary-solid-rest": step(9),
        "--bp-surface-background-color-primary-active": step(11),
        "--bp-surface-background-color-primary-disabled": step(9),
        "--bp-surface-background-color-primary-hover": step(10),
        "--bp-surface-background-color-primary-rest": step(9),
        "--bp-surface-layer-color-primary": primaryLayer,
        "--bp-surface-layer-primary": `linear-gradient(${primaryLayer} 0 0)`,
        "--bp-text-color-primary-default": step(13),
        "--bp-text-color-primary-disabled": mix(step(13), 50),
        "--bp-text-color-primary-muted": step(12),
        "--bp-typography-color-primary-active": step(13),
        "--bp-typography-color-primary-disabled": mix(step(13), 50),
        "--bp-typography-color-primary-hover": step(13),
        "--bp-typography-color-primary-rest": step(13),
    };
    return Object.entries(tokens)
        .map(([name, value]) => `${name}: ${value};`)
        .join("\n");
}
