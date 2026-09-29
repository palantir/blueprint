/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { addons, useEffect } from "storybook/preview-api";

import {
    TOKEN_DEFAULTS_REQUESTED,
    TOKEN_DEFAULTS_UPDATED,
    TOKEN_NAMES,
    type TokenDefaults,
    type TokenValues,
} from "./tokens";

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const tokenOverrides: Partial<TokenValues> = globals.tokenOverrides;
    const theme = globals.theme === "dark" ? "dark" : "light";
    useEffect(
        function applyTokenOverrides() {
            const channel = addons.getChannel();
            const style = document.body.style;
            const previousValues = Object.keys(tokenOverrides).map(name => ({
                name,
                priority: style.getPropertyPriority(name),
                value: style.getPropertyValue(name),
            }));

            // Capture defaults before our overrides
            const defaults: TokenDefaults = { storyId: id, theme, values: readTokenDefaults() };
            function publishDefaults() {
                channel.emit(TOKEN_DEFAULTS_UPDATED, defaults);
            }
            channel.on(TOKEN_DEFAULTS_REQUESTED, publishDefaults);
            publishDefaults();

            for (const [name, value] of Object.entries(tokenOverrides)) {
                if (value !== undefined) {
                    style.setProperty(name, String(value));
                }
            }

            return () => {
                channel.off(TOKEN_DEFAULTS_REQUESTED, publishDefaults);
                for (const { name, value, priority } of previousValues) {
                    // An empty value removes the inline property.
                    style.setProperty(name, value, priority);
                }
            };
        },
        [id, theme, tokenOverrides],
    );

    return <Story />;
};

function readTokenDefaults(): TokenValues {
    const computedStyle = getComputedStyle(document.body);
    // Every configured token is included in this mapping.
    return Object.fromEntries(
        TOKEN_NAMES.map(name => [name, computedStyle.getPropertyValue(name).trim()]),
    ) as TokenValues;
}
