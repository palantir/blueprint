/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { addons, useChannel, useEffect } from "storybook/preview-api";

import {
    COLOR_TOKEN_NAMES,
    TOKEN_CONFIG,
    TOKEN_NAMES,
    TOKEN_VALUES_CHANGED,
    TOKEN_VALUES_REQUEST,
    type TokenName,
    type TokenValues,
} from "./tokens";

type InlineTokenValues = Array<{
    style: CSSStyleDeclaration;
    values: Record<TokenName, { priority: string; value: string }>;
}>;

// Docs mounts several stories against the same document, so they share one original-value snapshot.
let initialTokenValues: InlineTokenValues | undefined;
let activeDecorators = 0;

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    useChannel({ [TOKEN_VALUES_REQUEST]: publishColorTokenValues }, []);

    useEffect(
        function captureInitialTokenValues() {
            // Aliases resolve where they are declared: :root for base tokens, body for the dark theme.
            initialTokenValues ??= [document.documentElement.style, document.body.style].map(style => ({
                style,
                values: Object.fromEntries(
                    TOKEN_NAMES.map(name => [
                        name,
                        {
                            priority: style.getPropertyPriority(name),
                            value: style.getPropertyValue(name),
                        },
                    ]),
                ),
            }));
            activeDecorators += 1;

            return () => {
                activeDecorators -= 1;
                if (activeDecorators !== 0) {
                    return;
                }
                for (const { style, values } of initialTokenValues ?? []) {
                    for (const name of TOKEN_NAMES) {
                        const { value, priority } = values[name];
                        // An empty value removes the inline property.
                        style.setProperty(name, value, priority);
                    }
                }
                initialTokenValues = undefined;
            };
        },
        [id],
    );

    useEffect(
        function applyTokenOverrides() {
            for (const { style, values } of initialTokenValues ?? []) {
                for (const name of TOKEN_NAMES) {
                    const override = tokenOverrides?.[name];
                    if (override != null && override !== "") {
                        style.setProperty(name, override);
                    } else {
                        const { value, priority } = values[name];
                        style.setProperty(name, value, priority);
                    }
                }
            }
            publishColorTokenValues();
        },
        [globals.theme, id, tokenOverrides],
    );

    return <Story />;
};

function publishColorTokenValues() {
    const styles = getComputedStyle(document.body);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context === null) {
        return;
    }
    const values = Object.fromEntries(
        COLOR_TOKEN_NAMES.flatMap(name => {
            const color = TOKEN_CONFIG[name].toControlValue(styles.getPropertyValue(name).trim());
            if (typeof color !== "string" || !CSS.supports("color", color)) {
                return [];
            }
            // Storybook's color picker needs sRGB values, including for OKLCH and relative-color tokens.
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);
            const rgba = Array.from(context.getImageData(0, 0, 1, 1).data);
            const opaqueColor = `rgb(from ${color} r g b / 1)`;
            if (rgba[3] !== 255 && CSS.supports("color", opaqueColor)) {
                // Read translucent channels at full opacity to avoid premultiplication rounding.
                context.fillStyle = opaqueColor;
                context.fillRect(0, 0, 1, 1);
                rgba.splice(0, 3, ...context.getImageData(0, 0, 1, 1).data.slice(0, 3));
            }
            const channels = rgba[3] === 255 ? rgba.slice(0, 3) : rgba;
            return [[name, `#${channels.map(channel => channel.toString(16).padStart(2, "0")).join("")}`]];
        }),
    );
    addons.getChannel().emit(TOKEN_VALUES_CHANGED, values);
}
