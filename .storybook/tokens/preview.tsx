/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { useEffect, useRef } from "storybook/preview-api";

import { GENERATED_TOKEN_NAMES, type GeneratedTokenName, type GeneratedTokens } from "./generateTokens";
import { TOKEN_NAMES, type TokenValues } from "./tokens";

type InlineTokenValues = Map<GeneratedTokenName, { priority: string; value: string }>;

export const withTokens: Decorator = function WithTokens(Story, { globals, id }) {
    const tokenOverrides: Partial<TokenValues> | undefined = globals.tokenOverrides;
    const generatedOverrides: GeneratedTokens | undefined = globals.generatedTokenOverrides;
    const theme = globals.theme === "dark" ? "dark" : "light";
    const initialTokenValues = useRef<InlineTokenValues | undefined>(undefined);
    const initialRootTokenValues = useRef<InlineTokenValues | undefined>(undefined);

    useEffect(
        function captureInitialTokenValues() {
            const style = document.body.style;
            const rootStyle = document.documentElement.style;
            const values = captureInlineValues(style, TOKEN_NAMES);
            const rootValues = captureInlineValues(rootStyle, GENERATED_TOKEN_NAMES);
            initialTokenValues.current = values;
            initialRootTokenValues.current = rootValues;

            return () => {
                applyOverrides(style, values, {});
                applyOverrides(rootStyle, rootValues, {});
                initialTokenValues.current = undefined;
                initialRootTokenValues.current = undefined;
            };
        },
        [id],
    );

    useEffect(
        function applyTokenOverrides() {
            const overrides = { ...generatedOverrides?.[theme], ...tokenOverrides };
            applyOverrides(document.body.style, initialTokenValues.current, overrides);
            // Root-scoped aliases resolve before inheritance. Source colors must also reach those declarations.
            // Body remains the dark-theme scope; dependent CSS stays owned by the shipped stylesheets.
            applyOverrides(document.documentElement.style, initialRootTokenValues.current, overrides);
        },
        [generatedOverrides, id, theme, tokenOverrides],
    );

    return <Story />;
};

function captureInlineValues(style: CSSStyleDeclaration, names: readonly GeneratedTokenName[]): InlineTokenValues {
    return new Map(
        names.map(name => [name, { priority: style.getPropertyPriority(name), value: style.getPropertyValue(name) }]),
    );
}

function applyOverrides(
    style: CSSStyleDeclaration,
    initialValues: InlineTokenValues | undefined,
    overrides: GeneratedTokens["light"],
) {
    for (const [name, initial] of initialValues ?? []) {
        const override = overrides[name];
        if (override != null && override !== "") {
            style.setProperty(name, override);
        } else {
            // An empty value restores the cascade by removing the inline property.
            style.setProperty(name, initial.value, initial.priority);
        }
    }
}
