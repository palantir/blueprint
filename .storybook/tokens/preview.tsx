/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import React from "react";

import type { TokenValues } from "./tokens";

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
    React.useEffect(
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
