/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { useEffect } from "storybook/preview-api";

import type { TokenValues } from "./tokens";

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const tokenOverrides: Partial<TokenValues> = globals.tokenOverrides;

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
