/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Decorator } from "@storybook/react-vite";

import nextStyles from "@blueprintjs/core/lib/css/blueprint-next.css?raw";
import defaultStyles from "@blueprintjs/core/lib/css/blueprint.css?raw";

export type CoreStyles = "default" | "next";

const CORE_STYLE_ID = "bp-storybook-core-styles";

/**
 * Loads either the default core stylesheet or the next one (`blueprint-next.css`), never both: the next
 * stylesheet replaces the default one rather than layering on top of it.
 */
export const withCoreStyles: Decorator = function WithCoreStyles(Story, { globals }) {
    const css = (globals.styles as CoreStyles | undefined) === "next" ? nextStyles : defaultStyles;
    if (typeof document !== "undefined") {
        let style = document.getElementById(CORE_STYLE_ID);
        if (style == null) {
            style = document.createElement("style");
            style.id = CORE_STYLE_ID;
            // First in <head> so the other packages' stylesheets keep coming after core, as with a static import.
            document.head.prepend(style);
        }
        if (style.textContent !== css) {
            style.textContent = css;
        }
    }
    return <Story />;
};
