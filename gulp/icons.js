/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (gulp, plugins, blueprint) => {
    const map = require("lodash/map");
    const path = require("path");
    const text = require("./util/text");
    const mergeStream = require("merge-stream");

    // accepts map of filename to array of lines, writes lines to file, writes to src/generated
    function writeFiles(files) {
        const streams = map(files, (contents, filename) => text.fileStream(filename, contents.join("\n") + "\n"));
        const outputDir = path.join(blueprint.findProject("core").cwd, "src", "generated");
        return mergeStream(...streams).pipe(gulp.dest(outputDir));
    }

    // generate sass and typescript files containing icon variables, driven by docs/src/icons.json
    gulp.task("icons", () => {
        const ICONS = require(path.resolve(blueprint.findProject("core").cwd, "resources", "icons", "icons.json"));

        function toEnumName(icon) {
            return icon.className.replace("pt-icon-", "").replace(/-/g, "_").toUpperCase();
        }
        function buildTSObject(objectName, valueGetter) {
            return [
                // the TS files are published to NPM so they need a header, but the Sass files are compiled away
                text.COPYRIGHT_HEADER,
                "// tslint:disable:object-literal-sort-keys",
                `export const ${objectName} = {`,
                ...ICONS.map((prop) => `    ${toEnumName(prop)}: "${valueGetter(prop)}",`),
                "};",
            ];
        }

        return writeFiles({
            // simple variable definitions
            "_icon-variables.scss": ICONS.map((icon) => `$${icon.className}: "${icon.content}";`),

            // great big map for iteration
            "_icon-map.scss": [
                '@import "icon-variables";',
                "$icons: (",
                ...ICONS.map(i => `  "${i.className.replace("pt-icon-", "")}": $${i.className},`),
                ");",
            ],

            // map name to className
            "iconClasses.ts": buildTSObject("IconClasses", (icon) => icon.className),

            // map name to character code
            "iconStrings.ts": buildTSObject("IconContents", (icon) => icon.content.replace("\\", "\\u")),
        });
    });
};
