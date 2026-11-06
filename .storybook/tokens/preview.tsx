/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { useChannel, useEffect, useRef } from "storybook/preview-api";

import { generateTokens } from "./generateTokens";
import {
    INTENTS,
    type SimpleColors,
    TOKEN_CONFIG,
    TOKEN_NAMES,
    TOKEN_VALUES_REQUESTED,
    TOKEN_VALUES_UPDATED,
    type TokenName,
    type TokenValues,
    type TokenValuesSnapshot,
} from "./tokens";

type InlineTokenValues = Record<TokenName, { priority: string; value: string }>;

interface InlineTokenSnapshot {
    style: CSSStyleDeclaration;
    values: InlineTokenValues;
}

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const simpleColors: SimpleColors | undefined = globals.simpleColors;
    const initialTokenValues = useRef<InlineTokenSnapshot[]>([]);
    const emit = useChannel(
        {
            [TOKEN_VALUES_REQUESTED]: () => {
                emit(TOKEN_VALUES_UPDATED, { storyId: id, values: readTokenValues() } satisfies TokenValuesSnapshot);
            },
        },
        [id],
    );

    useEffect(
        function captureInitialTokenValues() {
            // Light aliases are declared on :root; dark aliases are declared on body.bp6-dark.
            // Override inputs at both declaration scopes so the existing CSS derivations stay reactive.
            const snapshots = [document.documentElement.style, document.body.style].map(style => ({
                style,
                // Entries are produced from the complete module-owned token list.
                values: Object.fromEntries(
                    TOKEN_NAMES.map(name => [
                        name,
                        { priority: style.getPropertyPriority(name), value: style.getPropertyValue(name) },
                    ]),
                ) as InlineTokenValues,
            }));
            initialTokenValues.current = snapshots;

            return () => {
                for (const { style, values } of snapshots) {
                    for (const name of TOKEN_NAMES) {
                        const { value, priority } = values[name];
                        // An empty value removes the inline property.
                        style.setProperty(name, value, priority);
                    }
                }
                initialTokenValues.current = [];
            };
        },
        [id],
    );

    useEffect(
        function applyTokenOverrides() {
            const overrides = tokenOverrides ?? {};
            const generated: Record<string, string> = {};
            const theme = globals.theme === "dark" ? "dark" : "light";
            for (const intent of INTENTS) {
                const color = simpleColors?.[intent];
                if (color !== undefined) {
                    for (const [name, values] of Object.entries(generateTokens(color, { intent }))) {
                        generated[name] = values[theme];
                    }
                }
            }

            for (const { style, values } of initialTokenValues.current) {
                for (const name of TOKEN_NAMES) {
                    const override = overrides[name] || generated[name];
                    if (override != null && override !== "") {
                        style.setProperty(name, override);
                    } else {
                        const initialValue = values[name];
                        style.setProperty(name, initialValue.value, initialValue.priority);
                    }
                }
            }
        },
        [globals.theme, id, simpleColors, tokenOverrides],
    );

    useEffect(
        function reportTokenValues() {
            // Wait for the theme decorator to apply its root class before resolving colors.
            const frame = requestAnimationFrame(() => {
                emit(TOKEN_VALUES_UPDATED, { storyId: id, values: readTokenValues() } satisfies TokenValuesSnapshot);
            });
            return () => cancelAnimationFrame(frame);
        },
        [emit, globals.theme, id, simpleColors, tokenOverrides],
    );

    return <Story />;
};

function readTokenValues(): Partial<TokenValues> {
    const values: Partial<TokenValues> = {};
    const computed = getComputedStyle(document.body);
    const probe = document.createElement("span");
    probe.hidden = true;
    document.body.append(probe);

    for (const name of TOKEN_NAMES) {
        const cssValue = computed.getPropertyValue(name).trim();
        if (cssValue === "") {
            continue;
        }
        if (TOKEN_CONFIG[name].type === "color") {
            // Let the browser resolve aliases and alpha derivations rather than duplicating the token build.
            probe.style.color = `var(${name})`;
            if (CSS.supports("color", "rgb(from red r g b)")) {
                probe.style.color = `rgb(from var(${name}) r g b / alpha)`;
            }
            values[name] = toColorControlValue(getComputedStyle(probe).color);
        } else {
            values[name] = cssValue;
        }
    }

    probe.remove();
    return values;
}

function toColorControlValue(color: string): string {
    // Storybook's color picker accepts rgb/rgba, but not CSS Color 4's color(srgb ...) serialization.
    const match = /^color\(srgb ([\d.e+-]+) ([\d.e+-]+) ([\d.e+-]+)(?: \/ ([\d.e+-]+))?\)$/.exec(color);
    if (match === null) {
        return color;
    }
    const channels = match.slice(1, 4).map(channel => Math.round(Math.max(0, Math.min(1, Number(channel))) * 255));
    return `rgba(${channels.join(", ")}, ${match[4] ?? "1"})`;
}
