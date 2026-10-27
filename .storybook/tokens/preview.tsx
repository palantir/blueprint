/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { useEffect, useRef } from "storybook/preview-api";

import { TOKEN_NAMES, type TokenName, type TokenValues } from "./tokens";

type InlineTokenValues = Record<TokenName, { priority: string; value: string }>;

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const initialTokenValues = useRef<InlineTokenValues | undefined>(undefined);

    useEffect(
        function captureInitialTokenValues() {
            const style = document.body.style;
            const values = Object.fromEntries(
                TOKEN_NAMES.map(name => [
                    name,
                    {
                        priority: style.getPropertyPriority(name),
                        value: style.getPropertyValue(name),
                    },
                ]),
            ) as InlineTokenValues;
            initialTokenValues.current = values;

            return () => {
                for (const name of TOKEN_NAMES) {
                    const { value, priority } = values[name];
                    // An empty value removes the inline property.
                    style.setProperty(name, value, priority);
                }
                initialTokenValues.current = undefined;
            };
        },
        [id],
    );

    useEffect(
        function applyTokenOverrides() {
            const style = document.body.style;
            const overrides = tokenOverrides ?? {};

            for (const name of TOKEN_NAMES) {
                const override = overrides[name];
                if (override != null && override !== "") {
                    style.setProperty(name, override);
                } else {
                    const initialValue = initialTokenValues.current?.[name];
                    style.setProperty(name, initialValue?.value ?? "", initialValue?.priority);
                }
            }
        },
        [id, tokenOverrides],
    );

    return <Story />;
};
