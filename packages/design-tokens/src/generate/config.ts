/**
 * @license Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 */

import path from "path";
import StyleDictionary from "style-dictionary";
import type { Config, FormatFn } from "style-dictionary/types";
import { fileURLToPath } from "url";

import { formatCssThemed, formatLessPalette, formatScssPalette, formatTypescriptPalette } from "./formats/palette.ts";

/* eslint-disable sort-keys */

const dir = path.dirname(fileURLToPath(import.meta.url));
const tokensDir = path.resolve(dir, "../tokens");
const outputDir = path.resolve(dir, "../../lib");

const hexOnlyTransforms = ["attribute/cti", "name/kebab"];

StyleDictionary.registerTransformGroup({ name: "css/hex-only", transforms: hexOnlyTransforms });
StyleDictionary.registerTransformGroup({ name: "scss/hex-only", transforms: hexOnlyTransforms });
StyleDictionary.registerTransformGroup({ name: "less/hex-only", transforms: hexOnlyTransforms });

StyleDictionary.registerFormat({ name: "typescript/palette", format: formatTypescriptPalette as FormatFn });
StyleDictionary.registerFormat({ name: "css/themed", format: formatCssThemed as FormatFn });
StyleDictionary.registerFormat({ name: "scss/palette", format: formatScssPalette as FormatFn });
StyleDictionary.registerFormat({ name: "less/palette", format: formatLessPalette as FormatFn });

const config: Config = {
    // All palette tokens with $root, light, and dark groups
    source: [path.join(tokensDir, "palette/**/*.json")],

    platforms: {
        css: {
            buildPath: path.join(outputDir, "css/"),
            files: [
                {
                    destination: "palette.css",
                    format: "css/themed",
                    options: {
                        darkSelector: '[data-bp-theme="dark"]',
                        selector: ':root, [data-bp-theme="light"]',
                    },
                },
            ],
            transformGroup: "css/hex-only",
        },
        less: {
            buildPath: path.join(outputDir, "less/"),
            files: [{ destination: "palette.less", format: "less/palette" }],
            transformGroup: "less/hex-only",
        },
        scss: {
            buildPath: path.join(outputDir, "scss/"),
            files: [{ destination: "palette.scss", format: "scss/palette" }],
            transformGroup: "scss/hex-only",
        },
        typescript: {
            buildPath: path.join(outputDir, "esm/"),
            files: [{ destination: "palette.ts", format: "typescript/palette" }],
            transformGroup: "js",
        },
    },
};

// eslint-disable-next-line import/no-default-export
export default config;
