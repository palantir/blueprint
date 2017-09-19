/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const map = require("lodash/map");
    const path = require("path");
    const text = require("./util/text");
    const mergeStream = require("merge-stream");

    /** @type {object[]} */
    const ICONS = require(path.resolve(blueprint.findProject("core").cwd, "resources", "icons", "icons.json"));

    // generate sass and typescript files containing icon variables, driven by docs/src/icons.json
    gulp.task("icons", () => writeFiles({
        // great big map for iteration
        "_icon-map.scss": [
            '@import "icon-variables";',
            "$icons: (",
            ...ICONS.map(i => `  "${i.className.replace("pt-icon-", "")}": $${i.className},`),
            ");",
        ],

        // simple variable definitions
        "_icon-variables.scss": ICONS.map((icon) => `$${icon.className}: "${icon.content}";`),

        // map ENUM_NAME to className (cast as string constant so it can be used as IconName)
        "iconClasses.ts": buildTSObject("IconClasses", (icon) => `${icon.className}" as "${icon.className}`),

        // union type of all valid string names
        "iconName.ts": buildUnionType(),

        // map ENUM_NAME to unicode character
        "iconStrings.ts": buildTSObject("IconContents", (icon) => icon.content.replace("\\", "\\u")),
    }));

    // accepts map of filename to array of lines, writes lines to file, writes to src/generated
    function writeFiles(files) {
        const streams = map(files, (contents, filename) =>
            text.fileStream(filename, [text.COPYRIGHT_HEADER, ...contents, ""].join("\n")));
        const outputDir = path.join(blueprint.findProject("core").cwd, "src", "generated");
        return mergeStream(...streams).pipe(gulp.dest(outputDir));
    }

    function toEnumName(icon) {
        return icon.className.replace("pt-icon-", "").replace(/-/g, "_").toUpperCase();
    }
    function buildTSObject(objectName, valueGetter) {
        return [
            "// tslint:disable:object-literal-sort-keys",
            `export const ${objectName} = {`,
            ...ICONS.map((prop) => `    ${toEnumName(prop)}: "${valueGetter(prop)}",`),
            "};",
        ];
    }

    function buildUnionType() {
        const iconNames = ICONS.reduce((arr, { className }) => {
            // support un/prefixed variants
            arr.push(`"${className}"`, `"${className.replace("pt-icon-", "")}"`);
            return arr;
        }, []).sort();
        return [
            `export type IconName =\n    | ${iconNames.join("\n    | ")};`,
        ];
    }
};
