/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const camelCase = require("lodash/camelCase");
    const merge = require("merge-stream");
    const path = require("path");
    const through = require("through2");
    const { COPYRIGHT_HEADER } = require("./util/text");

    // concatenate all sass variables files together into one single exported list of variables
    blueprint.defineTaskGroup({
        block: "variables",
        name: "variables",
    }, (project, taskName) => {
        gulp.task(taskName, () => {
            const sass = gulp.src(project.variables, { cwd: project.cwd })
                .pipe(plugins.concat("variables.scss"))
                // package the variables list for consumption -- no imports or functions
                .pipe(plugins.stripCssComments())
                .pipe(plugins.replace(" !default", ""))
                .pipe(plugins.replace(/(@import|\/\/).*\n+/g, ""))
                .pipe(plugins.replace(/border-shadow\((.+)\)/g, "0 0 0 1px rgba($black, $1)"))
                .pipe(plugins.replace(/\n{3,}/g, "\n\n"))
                .pipe(plugins.insert.prepend(COPYRIGHT_HEADER))
                .pipe(gulp.dest(blueprint.destPath(project)));

            // convert sass to typescript
            const ts = sass.pipe(cloneStream())
                .pipe(plugins.rename("variables.ts"))
                // remove icon variables (there's a separate task for that)
                .pipe(plugins.replace(/\$pt-icon-.+\n/g, ""))
                .pipe(plugins.replace(/(\$[\w-]+): (([^;]|\n)+);/g, (sub, varName, value) => {
                    // convert sass var declaration to valid equivalent JS
                    const varValue = VAR_TYPES.find((t) => t.pattern.test(value)).escape(value);
                    return `export const ${varName} = ${varValue};`;
                }))
                // camelCase all variable names throughout the file (it's the same process everywhere)
                .pipe(plugins.replace(/(\$[\w-]+)/g, (sub, name) => camelCase(name.replace("pt-", ""))))
                // inject imports for two helper functions we provide in js
                .pipe(plugins.replace(" */",
                    ` */\n\nimport { floor, rgba } from "../common/variables";\n`))
                .pipe(gulp.dest(path.join(project.cwd, "src", "generated")));

            // convert sass to less
            const less = sass.pipe(cloneStream())
                .pipe(plugins.rename("variables.less"))
                .pipe(plugins.replace(/rgba\((\$[\w-]+), ([\d\.]+)\)/g,
                    (match, color, opacity) => `fade(${color}, ${+opacity * 100}%)`))
                .pipe(plugins.replace(/rgba\((\$[\w-]+), (\$[\w-]+)\)/g,
                    (match, color, variable) => `fade(${color}, ${variable} * 100%)`))
                .pipe(plugins.replace(/\$/g, "@"))
                .pipe(gulp.dest(blueprint.destPath(project)))
                // run it through less compiler (after writing files) to ensure we converted correctly.
                // this line will throw an 'invalid type' error if grid size is not a single px value.
                .pipe(plugins.insert.append(".unit-test { width: @pt-grid-size * 2; }"))
                .pipe(plugins.less());

            return merge(less, ts);
        });
    });

    /** Clone files in the stream so we can destructively change them in parallel pipelines. */
    function cloneStream() {
        // borrowed from https://github.com/mariocasciaro/gulp-clone/blob/master/index.js
        return through.obj((file, enc, cb) => cb(null, file.clone()));
    }
};

// Convert Sass variables to usable JavaScript form using `escape(val)` function
// tslint:disable:object-literal-sort-keys
const VAR_TYPES = [
    {
        // strip units
        pattern: /(px|ms)$/,
        escape: (val) => +val.slice(0, -2),
    }, {
        // string values
        pattern: /^#|^monospace$/,
        escape: (val) => `"${val}"`,
    }, {
        // multiline values contain commas and must be backtick-ed to support newlines
        pattern: /,/,
        escape: (val) => `\`${val}\``
            // interpolate rgba() functions, to use the JS implementation
            .replace(/rgba\(\$[\w-]+, [^)]+\)/g, (s) => `\${${s}}`)
            // special case variable that appears in multiline values
            .replace(/\$pt(-dark)?-divider-black/, (s) => `\${${s}}`),
    }, {
        // no-op on everything else
        pattern: /.?/,
        escape: (val) => val,
    },
];
