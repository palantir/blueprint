/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import StyleDictionary from "style-dictionary";
import type { Config, TransformedToken } from "style-dictionary/types";

/**
 * Custom transform: OKLCH color to CSS rgba/hex format
 * Using rgba/hex for better compatibility with scss functions
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "color" && token.$value?.hex,
    name: "color/oklch-to-css",
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
 * Custom transform: Shadow composite to standard CSS box-shadow with hex colors
 *
 * Universal transform - works in both CSS custom properties and SCSS variables.
 * Outputs standard CSS box-shadow syntax with hex/rgba colors.
 *
 * Note: Uses hex colors (not OKLCH) for maximum compatibility. SCSS needs hex for
 * color manipulation functions, and CSS custom properties can use hex everywhere.
 */
StyleDictionary.registerTransform({
    filter: (token: TransformedToken) => token.$type === "shadow",
    name: "shadow/standard-css",
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
 * Custom transform group for CSS output
 */
StyleDictionary.registerTransformGroup({
    name: "css/dtcg",
    transforms: [
        "name/css-custom-property",
        "color/oklch-to-css",
        "dimension/standard-css",
        "duration/standard-css",
        "cubicBezier/standard-css",
        "fontFamily/standard-css",
        "shadow/standard-css",
    ],
});

/**
 * Export configuration - CSS variables only
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
    },
    source: ["src/tokens/base/**/*.tokens.json", "src/tokens/semantic/**/*.tokens.json"],
};
