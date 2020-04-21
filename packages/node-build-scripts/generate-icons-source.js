#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Generates icons Sass and TypeScript source code from JSON metadata about icons.
 */

// @ts-check
const fs = require("fs");
const path = require("path");
const SVGO = require("svgo");
const { COPYRIGHT_HEADER } = require("./constants");

const svgo = new SVGO({ plugins: [{ convertShapeToPath: { convertArcs: true } }] });

/**
 * @typedef {Object} IconMetadata
 * @property {string} displayName - "Icon name" for display
 * @property {string} iconName - `icon-name` for IconName and CSS class
 * @property {string} tags - comma separated list of tags describing this icon
 * @property {string} group - group to which this icon belongs
 * @property {string} content - unicode character for icon glyph in font
 */

/** @type {IconMetadata[]} */
const ICONS_METADATA = require(path.resolve(process.cwd(), "./resources/icons/icons.json")).sort((a, b) =>
    a.iconName.localeCompare(b.iconName),
);
const ICONS_WITH_FONT_SUPPORT = ICONS_METADATA.filter(icon => typeof icon.content === "string");
const GENERATED_SRC_DIR = path.resolve(process.cwd(), "./src/generated");

if (!fs.existsSync(GENERATED_SRC_DIR)) {
    fs.mkdirSync(GENERATED_SRC_DIR);
}

// map for iterating through icons with font support
writeLinesToFile(
    "_icon-map.scss",
    '@import "icon-variables";',
    "$icons: (",
    ...ICONS_WITH_FONT_SUPPORT.map(icon => `  "${icon.iconName}": ${toSassVariable(icon)},`),
    ");",
);

// list out content strings for icons with font support
writeLinesToFile(
    "_icon-variables.scss",
    ...ICONS_WITH_FONT_SUPPORT.map(icon => `${toSassVariable(icon)}: "${icon.content}";`),
);

// map ENUM_NAME to unicode character
writeLinesToFile(
    "iconContents.ts",
    ...ICONS_WITH_FONT_SUPPORT.map(
        icon => `export const ${toEnumName(icon)} = "${icon.content.replace("\\", "\\u")}";`,
    ),
);

// map ENUM_NAME to icon-name, must include ALL icons (not just those with font support)
// so that we can reference their SVG paths
writeLinesToFile(
    "iconNames.ts",
    ...ICONS_METADATA.map(icon => `export const ${toEnumName(icon)} = "${icon.iconName}";`),
);

(async () => {
    // SVG path strings. IIFE to unwrap async.
    writeLinesToFile(
        "iconSvgPaths.ts",
        'import { IconName } from "../iconName";',
        "",
        "export const IconSvgPaths16: Record<IconName, string[]> = {",
        ...(await buildPathsObject("IconSvgPaths", 16)),
        "};",
        "",
        "export const IconSvgPaths20: Record<IconName, string[]> = {",
        ...(await buildPathsObject("IconSvgPaths", 20)),
        "};",
    );
})();

/**
 * Writes lines to given filename in GENERATED_SRC_DIR.
 * @param {string} filename
 * @param {Array<string>} lines
 */
async function writeLinesToFile(filename, ...lines) {
    const outputPath = path.join(GENERATED_SRC_DIR, filename);
    const contents = [COPYRIGHT_HEADER, ...lines, ""].join("\n");
    fs.writeFileSync(outputPath, contents);
}

/**
 * Returns Sass variable name `$pt-icon-{name}`.
 * @param {IconMetadata} icon
 */
function toSassVariable(icon) {
    return `$pt-icon-${icon.iconName}`;
}

/**
 * Converts iconName to uppercase constant name.
 * Example: `"align-left"` &rArr; `"ALIGN_LEFT"`
 * @param {IconMetadata} icon
 */
function toEnumName(icon) {
    return icon.iconName.replace(/-/g, "_").toUpperCase();
}

/**
 * Loads SVG file for each icon, extracts path strings `d="path-string"`,
 * and constructs map of icon name to array of path strings.
 * @param {string} objectName
 * @param {16 | 20} size
 */
async function buildPathsObject(objectName, size) {
    return Promise.all(
        ICONS_METADATA.map(async icon => {
            const filepath = path.resolve(__dirname, `../../resources/icons/${size}px/${icon.iconName}.svg`);
            const svg = fs.readFileSync(filepath, "utf-8");
            const pathStrings = await svgo
                .optimize(svg, { path: filepath })
                .then(({ data }) => data.match(/ d="[^"]+"/g) || [])
                .then(paths => paths.map(s => s.slice(3)));
            return `    "${icon.iconName}": [${pathStrings.join(",\n")}],`;
        }),
    );
}
