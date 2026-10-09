/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";
import { useEffect } from "storybook/preview-api";

import { generateThemeStylesheet, type ThemeColors } from "./intentScale";

const THEME_STYLE_ID = "bp-storybook-intent-scales";

export const withTokens: Decorator = function WithTokens(Story, { globals }) {
    const themeColors: ThemeColors = globals.themeColors ?? {};
    const colorsKey = JSON.stringify(themeColors);

    useEffect(
        function applyIntentScales() {
            if (!Object.values(themeColors).some(Boolean)) {
                return;
            }
            // Scales are set per theme selector, so the roles redeclared for dark resolve against the dark scale.
            const style = document.createElement("style");
            style.id = THEME_STYLE_ID;
            style.textContent = generateThemeStylesheet(themeColors);
            document.head.appendChild(style);
            return () => style.remove();
        },
        // themeColors is a fresh object on every render; the serialized key captures its content.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [colorsKey],
    );

    return <Story />;
};
