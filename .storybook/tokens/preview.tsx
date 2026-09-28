/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { useEffect } from "react";
import { addons } from "storybook/preview-api";

import { TOKEN_DEFAULTS_EVENT, TOKEN_DEFAULTS_REQUEST_EVENT, TOKEN_NAMES, type TokenValues } from "./tokens";

interface TokenPreviewProps {
    children: React.ReactNode;
    tokenOverrides: Partial<TokenValues>;
}

export const withTokens: Decorator = (Story, context) => (
    <TokenPreview tokenOverrides={context.globals.tokenOverrides}>
        <Story />
    </TokenPreview>
);

function TokenPreview({ children, tokenOverrides }: TokenPreviewProps) {
    useEffect(publishTokenDefaults, []);

    useEffect(
        function applyTokenOverrides() {
            const style = document.body.style;
            const previousValues = Object.keys(tokenOverrides).map(name => ({
                name,
                priority: style.getPropertyPriority(name),
                value: style.getPropertyValue(name),
            }));

            for (const [name, value] of Object.entries(tokenOverrides)) {
                if (value !== undefined) {
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
        [tokenOverrides],
    );

    return children;
}

let isPublishingTokenDefaults = false;

/**
 * Sends the stylesheet values of each configured token to the manager, which renders them as the panel defaults.
 * Values are resent on request and whenever the body class changes, since the theme decorator toggles the dark
 * theme class there.
 */
function publishTokenDefaults() {
    if (isPublishingTokenDefaults) {
        return;
    }
    isPublishingTokenDefaults = true;

    const channel = addons.getChannel();
    const emitDefaults = () => channel.emit(TOKEN_DEFAULTS_EVENT, readTokenDefaults());

    channel.on(TOKEN_DEFAULTS_REQUEST_EVENT, emitDefaults);
    new MutationObserver(emitDefaults).observe(document.body, { attributeFilter: ["class"] });
    emitDefaults();
}

/** Reads each token's computed value on the body, excluding inline overrides. */
function readTokenDefaults(): Partial<TokenValues> {
    const style = document.body.style;
    const computedStyle = getComputedStyle(document.body);
    const defaults: Partial<TokenValues> = {};

    for (const name of TOKEN_NAMES) {
        const value = style.getPropertyValue(name);
        const priority = style.getPropertyPriority(name);

        // Removing and restoring the override happens synchronously, so it is never painted.
        style.removeProperty(name);
        defaults[name] = computedStyle.getPropertyValue(name).trim();
        if (value !== "") {
            style.setProperty(name, value, priority);
        }
    }

    return defaults;
}
