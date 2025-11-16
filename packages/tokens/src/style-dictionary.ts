/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import StyleDictionary from "style-dictionary";
import type { Config, TransformedToken } from "style-dictionary/types";

/**
 * Custom transform: OKLCH color to CSS oklch() format
 * Using OKLCH for perceptually uniform colors in CSS custom properties
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => {
        return token.$type === "color" && typeof token.$value === "object" && token.$value?.components;
    },
    name: "color/oklch",
    transform: (token: TransformedToken) => {
        const { components, alpha } = token.$value;
        const [l, c, h] = components;

        // Format: oklch(L C H / alpha)
        if (alpha !== undefined && alpha < 1) {
            return `oklch(${l} ${c} ${h} / ${alpha})`;
        }
        return `oklch(${l} ${c} ${h})`;
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: OKLCH color to hex/rgba format for SCSS
 * Using hex/rgba for better compatibility with SCSS color functions
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "color",
    name: "color/oklch-to-scss",
    transform: (token: TransformedToken) => {
        const { hex, alpha } = token.$value;
        // Preserve alpha channel for semi-transparent colors
        if (alpha !== undefined && alpha < 1) {
            return `rgba(${hex}, ${alpha})`;
        }
        return hex;
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: Dimension to standard CSS value with unit
 *
 * Universal transform - works in both CSS custom properties and SCSS variables.
 * Outputs standard CSS dimension syntax (e.g., "4px", "10px", "2px").
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "dimension" && token.$value?.value !== undefined,
    name: "dimension/standard-css",
    transform: (token: TransformedToken) => {
        return `${token.$value.value}${token.$value.unit}`;
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: Duration to standard CSS value with unit
 *
 * Universal transform - works in both CSS custom properties and SCSS variables.
 * Outputs standard CSS duration syntax (e.g., "100ms", "200ms").
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "duration" && token.$value?.value !== undefined,
    name: "duration/standard-css",
    transform: (token: TransformedToken) => {
        return `${token.$value.value}${token.$value.unit}`;
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: Cubic bezier to standard CSS cubic-bezier() function
 *
 * Universal transform - works in both CSS custom properties and SCSS variables.
 * Outputs standard CSS cubic-bezier function (e.g., "cubic-bezier(0.4, 1, 0.75, 0.9)").
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "cubicBezier",
    name: "cubicBezier/standard-css",
    transform: (token: TransformedToken) => {
        return `cubic-bezier(${token.$value.join(", ")})`;
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: Font family array to standard CSS font stack
 *
 * Universal transform - works in both CSS custom properties and SCSS variables.
 * Outputs standard CSS font-family syntax (e.g., "-apple-system, BlinkMacSystemFont, ...").
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "fontFamily" && Array.isArray(token.$value),
    name: "fontFamily/standard-css",
    transform: (token: TransformedToken) => {
        return token.$value.map((font: string) => (font.includes(" ") ? `"${font}"` : font)).join(", ");
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: Shadow composite to CSS box-shadow with OKLCH colors
 * For CSS custom properties - uses OKLCH for perceptually uniform colors
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "shadow",
    name: "shadow/oklch",
    transform: (token: TransformedToken) => {
        const shadows = Array.isArray(token.$value) ? token.$value : [token.$value];

        return shadows
            .map((shadow: any) => {
                // Guard: ensure shadow has the expected structure
                if (!shadow.color || !shadow.offsetX || !shadow.offsetY || !shadow.blur || !shadow.spread) {
                    console.warn(`Invalid shadow structure for token ${token.path.join(".")}`);
                    return "";
                }

                const { color, offsetX, offsetY, blur, spread, inset } = shadow;
                const { components, alpha } = color;
                const [l, c, h] = components;

                // Use OKLCH with alpha
                const colorValue =
                    alpha !== undefined && alpha < 1 ? `oklch(${l} ${c} ${h} / ${alpha})` : `oklch(${l} ${c} ${h})`;

                const shadowValue = `${offsetX.value}${offsetX.unit} ${offsetY.value}${offsetY.unit} ${blur.value}${blur.unit} ${spread.value}${spread.unit} ${colorValue}`;

                // Prepend "inset " if the inset property is true
                return inset === true ? `inset ${shadowValue}` : shadowValue;
            })
            .filter(s => s !== "")
            .join(", ");
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: Shadow composite to CSS box-shadow with hex colors
 * For SCSS variables - uses hex/rgba for better compatibility with SCSS color functions
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "shadow",
    name: "shadow/hex",
    transform: (token: TransformedToken) => {
        const shadows = Array.isArray(token.$value) ? token.$value : [token.$value];

        return shadows
            .map((shadow: any) => {
                // Guard: ensure shadow has the expected structure
                if (!shadow.color || !shadow.offsetX || !shadow.offsetY || !shadow.blur || !shadow.spread) {
                    console.warn(`Invalid shadow structure for token ${token.path.join(".")}`);
                    return "";
                }

                const { color, offsetX, offsetY, blur, spread, inset } = shadow;
                // Use hex with rgba for colors with alpha
                const colorValue =
                    color.alpha !== undefined && color.alpha < 1 ? `rgba(${color.hex}, ${color.alpha})` : color.hex;

                const shadowValue = `${offsetX.value}${offsetX.unit} ${offsetY.value}${offsetY.unit} ${blur.value}${blur.unit} ${spread.value}${spread.unit} ${colorValue}`;

                // Prepend "inset " if the inset property is true
                return inset === true ? `inset ${shadowValue}` : shadowValue;
            })
            .filter(s => s !== "")
            .join(", ");
    },
    transitive: true,
    type: "value",
});

/**
 * Custom transform: Token name to CSS custom property name
 * Converts token paths like "color.blue.3" to "--color-blue-3"
 */
StyleDictionary.registerTransform({
    name: "name/css-custom-property",
    transform: (token: TransformedToken) => {
        // Join path with hyphens, but don't add -- prefix since Style Dictionary handles that
        return token.path.join("-");
    },
    type: "name",
});

/**
 * Custom transform: Token name to Blueprint SCSS variable name
 * Maps DTCG token paths to Blueprint's existing variable naming conventions
 */
StyleDictionary.registerTransform({
    name: "name/scss-blueprint",
    transform: (token: TransformedToken) => {
        const [group, ...rest] = token.path;

        // Color tokens: color.blue.3 → $blue3, color.gray.dark.1 → $dark-gray1
        if (group === "color") {
            const [colorName, ...levels] = rest;

            switch (colorName) {
                case "gray":
                    // Handle gray special cases
                    if (levels.length === 1) {
                        // color.gray.black → $black, color.gray.white → $white
                        return levels[0];
                    }
                    // color.gray.medium.1 → $gray1 (Blueprint's default gray scale)
                    // color.gray.dark.1 → $dark-gray1, color.gray.light.5 → $light-gray5
                    switch (levels[0]) {
                        case "medium":
                            return `gray${levels[1]}`;
                        default:
                            return `${levels[0]}-gray${levels[1]}`;
                    }
                default:
                    // color.blue.3 → $blue3, color.green.5 → $green5
                    return `${colorName}${levels.join("")}`;
            }
        }

        // Dimension tokens
        if (group === "dimension") {
            const [category, ...props] = rest;

            switch (category) {
                case "spacing":
                    switch (props[0]) {
                        case "base":
                            return "pt-spacing";
                        case "grid":
                            return "pt-grid-size";
                        default:
                            return `pt-spacing-${props.join("-")}`;
                    }
                case "border":
                    if (props[0] === "radius") {
                        return "pt-border-radius";
                    }
                    return `pt-border-${props.join("-")}`;
                case "icon":
                    // dimension.icon.standard → $pt-icon-size-standard
                    return `pt-icon-size-${props.join("-")}`;
                case "button":
                    // dimension.button.height → $pt-button-height
                    return `pt-button-${props.join("-")}`;
                case "input":
                    return `pt-input-${props.join("-")}`;
                case "navbar":
                    return `pt-navbar-${props.join("-")}`;
                default:
                    return `pt-${category}-${props.join("-")}`;
            }
        }

        // Typography tokens
        if (group === "typography") {
            const [category, ...props] = rest;

            switch (category) {
                case "font-family":
                    return props[0] === "default" ? "pt-font-family" : `pt-font-family-${props.join("-")}`;
                case "font-size":
                    return props[0] === "default" ? "pt-font-size" : `pt-font-size-${props.join("-")}`;
                case "line-height":
                    return props[0] === "default" ? "pt-line-height" : `pt-line-height-${props.join("-")}`;
                default:
                    return `pt-${category}-${props.join("-")}`;
            }
        }

        // Animation tokens
        if (group === "animation") {
            const [category, ...props] = rest;

            switch (category) {
                case "duration":
                    return props[0] === "default" ? "pt-transition-duration" : `pt-${category}-${props.join("-")}`;
                case "easing":
                    // animation.easing.ease → $pt-transition-ease
                    return `pt-transition-${props.join("-")}`;
                default:
                    return `pt-${category}-${props.join("-")}`;
            }
        }

        // Layout tokens
        if (group === "layout") {
            const [category, ...props] = rest;

            switch (category) {
                case "z-index":
                    // layout.z-index.base → $pt-z-index-base
                    return `pt-z-index-${props.join("-")}`;
                default:
                    return `pt-${category}-${props.join("-")}`;
            }
        }

        // Shadow tokens - DTCG variant pattern (.light / .dark)
        if (group === "shadow") {
            const lastPart = rest[rest.length - 1];
            const isDark = lastPart === "dark";
            const isLight = lastPart === "light";

            // Remove .light or .dark from the path to get the base path
            const basePath = isDark || isLight ? rest.slice(0, -1) : rest;
            const [category, ...shadowRest] = basePath;

            const prefix = isDark ? "pt-dark" : "pt";

            switch (category) {
                case "opacity": {
                    // shadow.opacity.border-shadow.light → $pt-border-shadow-opacity
                    // shadow.opacity.border-shadow.dark → $pt-dark-border-shadow-opacity
                    const name = shadowRest.join("-");
                    return `${prefix}-${name}-opacity`;
                }
                case "elevation": {
                    const level = shadowRest[0];
                    // shadow.elevation.0.light → $pt-elevation-shadow-0
                    // shadow.elevation.0.dark → $pt-dark-elevation-shadow-0
                    return `${prefix}-elevation-shadow-${level}`;
                }
                case "input":
                    // shadow.input.light → $pt-input-box-shadow
                    return `${prefix}-input-box-shadow`;
                case "dialog":
                    // shadow.dialog.light → $pt-dialog-box-shadow
                    return `${prefix}-dialog-box-shadow`;
                case "popover":
                    // shadow.popover.light → $pt-popover-box-shadow
                    return `${prefix}-popover-box-shadow`;
                case "tooltip":
                    // shadow.tooltip.light → $pt-tooltip-box-shadow
                    return `${prefix}-tooltip-box-shadow`;
                case "toast":
                    // shadow.toast.light → $pt-toast-box-shadow
                    return `${prefix}-toast-box-shadow`;
                default:
                    return `${prefix}-${category}-${shadowRest.join("-")}`;
            }
        }

        // Semantic tokens
        if (group === "intent") {
            // intent.primary.light → $pt-intent-primary
            const lastPart = rest[rest.length - 1];
            const isDark = lastPart === "dark";
            const isLight = lastPart === "light";

            const basePath = isDark || isLight ? rest.slice(0, -1) : rest;
            const prefix = isDark ? "pt-dark" : "pt";

            return `${prefix}-intent-${basePath.join("-")}`;
        }

        if (group === "ui") {
            // DTCG variant pattern: ui.text.default.light → $pt-text-color
            const lastPart = rest[rest.length - 1];
            const isDark = lastPart === "dark";
            const isLight = lastPart === "light";

            // Remove .light or .dark from the path to get the base path
            const basePath = isDark || isLight ? rest.slice(0, -1) : rest;
            const [category, ...props] = basePath;

            const prefix = isDark ? "pt-dark" : "pt";

            switch (category) {
                case "text":
                    switch (props[0]) {
                        case "default":
                            return `${prefix}-text-color`;
                        case "muted":
                            return `${prefix}-text-color-muted`;
                        case "disabled":
                            return `${prefix}-text-color-disabled`;
                        case "heading":
                            return `${prefix}-heading-color`;
                        case "on-primary":
                            return `${prefix}-text-on-primary`;
                        default:
                            return `${prefix}-text-${props.join("-")}`;
                    }

                case "background":
                    switch (props[0]) {
                        case "app":
                            return `${prefix}-app-background-color`;
                        case "secondary":
                            return `${prefix}-app-secondary-background-color`;
                        case "elevated":
                            return `${prefix}-app-elevated-background-color`;
                        case "hover":
                            return `${prefix}-background-hover`;
                        case "active":
                            return `${prefix}-background-active`;
                        default:
                            return `${prefix}-background-${props.join("-")}`;
                    }

                case "divider":
                    // ui.divider.black.light → $pt-divider-black
                    return `${prefix}-divider-${props.join("-")}`;

                case "focus":
                    switch (props[0]) {
                        case "outline":
                            return `${prefix}-outline-color`;
                        case "indicator":
                            return `${prefix}-focus-indicator-color`;
                        default:
                            return `${prefix}-focus-${props.join("-")}`;
                    }

                case "link":
                    switch (props[0]) {
                        case "default":
                            return `${prefix}-link-color`;
                        default:
                            return `${prefix}-link-${props.join("-")}`;
                    }

                case "icon":
                    switch (props[0]) {
                        case "default":
                            return `${prefix}-icon-color`;
                        case "hover":
                            return `${prefix}-icon-color-hover`;
                        case "disabled":
                            return `${prefix}-icon-color-disabled`;
                        case "selected":
                            return `${prefix}-icon-color-selected`;
                        default:
                            return `${prefix}-icon-${props.join("-")}`;
                    }

                case "selection":
                    return `${prefix}-text-selection-color`;

                case "code":
                    switch (props[0]) {
                        case "text":
                            return `${prefix}-code-text-color`;
                        case "background":
                            return `${prefix}-code-background-color`;
                        default:
                            return `${prefix}-code-${props.join("-")}`;
                    }

                default:
                    return `${prefix}-${category}-${props.join("-")}`;
            }
        }

        // Default fallback
        return token.path.join("-");
    },
    type: "name",
});

/**
 * Custom transform group for CSS output
 * Uses OKLCH for colors and shadows, standard CSS formats for other types
 */
StyleDictionary.registerTransformGroup({
    name: "css/dtcg",
    transforms: [
        "name/css-custom-property",
        "color/oklch",
        "dimension/standard-css",
        "duration/standard-css",
        "cubicBezier/standard-css",
        "fontFamily/standard-css",
        "shadow/oklch",
    ],
});

/**
 * Custom transform group for SCSS output
 * Uses hex/rgba for colors (SCSS compatibility), standard CSS formats for other types
 */
StyleDictionary.registerTransformGroup({
    name: "scss/blueprint",
    transforms: [
        "name/scss-blueprint",
        "color/oklch-to-scss",
        "dimension/standard-css",
        "duration/standard-css",
        "cubicBezier/standard-css",
        "fontFamily/standard-css",
        "shadow/hex",
    ],
});

/**
 * Export configuration - CSS and SCSS outputs
 */
export const config: Config = {
    log: { verbosity: "verbose" },
    platforms: {
        css: {
            buildPath: "dist/",
            files: [
                {
                    destination: "tokens.css",
                    format: "css/variables",
                    options: { outputReferences: true, selector: ":root" },
                },
            ],
            transformGroup: "css/dtcg",
        },
        scss: {
            buildPath: "dist/",
            files: [
                {
                    destination: "tokens.scss",
                    format: "scss/variables",
                    options: {
                        outputReferences: false,
                    },
                },
            ],
            transformGroup: "scss/blueprint",
        },
    },
    source: ["src/tokens/base/**/*.tokens.json", "src/tokens/semantic/**/*.tokens.json"],
};
