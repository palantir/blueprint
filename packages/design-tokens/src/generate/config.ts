/**
 * @license Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 */

import path from "path";
import StyleDictionary from "style-dictionary";
import type { Config } from "style-dictionary/types";
import { fileURLToPath } from "url";

import {
    formatCssThemed,
    formatLessPalette,
    formatScssPalette,
    formatTypescriptPalette,
} from "./formats/palette.ts";
import { transformDarkMode } from "./transforms/dark-mode.ts";

const dir = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.resolve(dir, "../tokens");
const outputDir = path.resolve(dir, "../../lib");

StyleDictionary.registerTransform({
    name: "color/dark-mode",
    transform: transformDarkMode,
    type: "attribute",
});

StyleDictionary.registerTransformGroup({
    name: "css/hex-only",
    transforms: ["attribute/cti", "name/kebab"],
});

StyleDictionary.registerTransformGroup({
    name: "scss/hex-only",
    transforms: ["attribute/cti", "name/kebab"],
});

StyleDictionary.registerTransformGroup({
    name: "less/hex-only",
    transforms: ["attribute/cti", "name/kebab"],
});

StyleDictionary.registerFormat({
    format: formatTypescriptPalette as any,
    name: "typescript/palette",
});

StyleDictionary.registerFormat({
    format: formatCssThemed as any,
    name: "css/themed",
});

StyleDictionary.registerFormat({
    format: formatScssPalette as any,
    name: "scss/palette",
});

StyleDictionary.registerFormat({
    format: formatLessPalette as any,
    name: "less/palette",
});

const config: Config = {
    // All palette tokens with $root, light, and dark groups
    source: [path.join(tokensDir, "palette/**/*.json")],

    platforms: {
        typescript: {
            buildPath: path.join(outputDir, "esm/"),
            files: [
                {
                    destination: "palette.ts",
                    format: "typescript/palette",
                    options: {
                        outputReferences: false,
                    },
                },
            ],
            transformGroup: "js",
        },

        css: {
            buildPath: path.join(outputDir, "css/"),
            files: [
                {
                    destination: "palette.css",
                    format: "css/themed",
                    options: {
                        darkSelector: '[data-theme="dark"]',
                        selector: ':root, [data-theme="light"]',
                    },
                },
            ],
            transformGroup: "css/hex-only",
        },

        scss: {
            buildPath: path.join(outputDir, "scss/"),
            files: [
                {
                    destination: "palette.scss",
                    format: "scss/palette",
                    options: {
                        outputReferences: false,
                    },
                },
            ],
            transformGroup: "scss/hex-only",
        },

        less: {
            buildPath: path.join(outputDir, "less/"),
            files: [
                {
                    destination: "palette.less",
                    format: "less/palette",
                    options: {
                        outputReferences: false,
                    },
                },
            ],
            transformGroup: "less/hex-only",
        },
    },
};

// eslint-disable-next-line import/no-default-export
export default config;
