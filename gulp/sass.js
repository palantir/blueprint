/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const autoprefixer = require("autoprefixer");
    const path = require("path");
    const packageImporter = require("node-sass-package-importer");
    const postcssCopyAssets = require("postcss-copy-assets");
    const postcssImport = require("postcss-import");
    const postcssUrl = require("postcss-url");
    const COPYRIGHT_HEADER = require("./util/text").COPYRIGHT_HEADER;

    const blueprintCwd = blueprint.findProject("core").cwd;

    const config = {
        autoprefixer: {
            browsers: ["Chrome >= 37", "Explorer >= 11", "Edge > 11", "Firefox >= 24", "Safari >= 7"],
        },

        srcGlob: (project, excludePartials) => {
            return path.join(project.cwd, "src/**/", `${excludePartials ? "!(_)" : ""}*.scss`);
        },

        // TODO: make this configurable from root
        // source files to concatenate and export as `variables.{scss,less}`
        variables: [
            `${blueprintCwd}/src/common/_colors.scss`,
            `${blueprintCwd}/src/common/_color-aliases.scss`,
            `${blueprintCwd}/src/common/_variables.scss`,
            `${blueprintCwd}/src/generated/_icon-variables.scss`,
        ],
    };

    blueprint.defineTaskGroup({
        block: "sass",
        name: "stylelint",
    }, (project, taskName) => {
        gulp.task(taskName, () => (
            gulp.src(config.srcGlob(project))
                .pipe(plugins.stylelint({
                    failAfterError: true,
                    reporters: [
                        { formatter: "string", console: true },
                    ],
                    syntax: "scss",
                }))
                .pipe(plugins.count(`${project.id}: ## stylesheets linted`))
        ));
    });

    blueprint.defineTaskGroup({
        block: "sass",
    }, (project, taskName, depTaskNames) => {
        gulp.task(taskName, ["icons", "sass-variables", ...depTaskNames], () => sassCompile(project, false));
        gulp.task(`${taskName}:only`, () => sassCompile(project, true));
    });

    function sassCompile(project, isDevMode) {
        const sassCompiler = plugins.sass({
            importer: packageImporter({ cwd: project.cwd }),
        });
        if (isDevMode) {
            sassCompiler.on("error", plugins.sass.logError);
        }

        const postcssOptions = {
            map: { inline: false },
            to : blueprint.destPath(project, "dist.css"),
        };
        const postcssPlugins = project.sass === "bundle" ? [
            // inline all imports
            postcssImport(),
            // rebase all urls due to inlining
            postcssUrl({ url: "rebase" }),
            // copy assets to dist folder, respecting rebase
            postcssCopyAssets({
                pathTransform: (newPath, origPath) => {
                    return path.resolve(
                        blueprint.destPath(project),
                        "assets",
                        path.basename(origPath)
                    );
                },
            }),
        ] : [];
        // always run autoprefixer
        postcssPlugins.push(autoprefixer(config.autoprefixer));

        return gulp.src(config.srcGlob(project, true))
            .pipe(plugins.sourcemaps.init())
            .pipe(sassCompiler)
            .pipe(plugins.postcss(postcssPlugins, postcssOptions))
            .pipe(plugins.stripCssComments({ preserve: /^\*/ }))
            .pipe(plugins.replace(/\n{3,}/g, "\n\n"))
            // see https://github.com/floridoo/vinyl-sourcemaps-apply/issues/11#issuecomment-231220574
            .pipe(plugins.sourcemaps.write(".", { sourceRoot: null }))
            .pipe(gulp.dest(blueprint.destPath(project)))
            .pipe(plugins.count({
                logFiles: `write ${plugins.util.colors.yellow("<%= file.relative %>")}`,
                message: false,
            }))
            // only bundled packages will reload the dev site
            .pipe(project.sass === "bundle" ? plugins.connect.reload() : plugins.util.noop());
    }

    // concatenate all sass variables files together into one single exported list of variables
    gulp.task("sass-variables", ["icons"], () => {
        const mainProject = blueprint.findProject("core");
        return gulp.src(config.variables)
            .pipe(plugins.concat("variables.scss"))
            // package the variables list for consumption -- no imports or functions
            .pipe(plugins.stripCssComments())
            .pipe(plugins.replace(" !default", ""))
            .pipe(plugins.replace(/(@import|\/\/).*\n+/g, ""))
            .pipe(plugins.replace(/border-shadow\((.+)\)/g, "0 0 0 1px rgba($black, $1)"))
            .pipe(plugins.replace(/\n{3,}/g, "\n\n"))
            .pipe(plugins.insert.prepend(COPYRIGHT_HEADER))
            .pipe(gulp.dest(blueprint.destPath(mainProject)))
            // convert scss to less
            .pipe(plugins.replace(/rgba\((\$[\w-]+), ([\d\.]+)\)/g,
                (match, color, opacity) => `fade(${color}, ${+opacity * 100}%)`))
            .pipe(plugins.replace(/rgba\((\$[\w-]+), (\$[\w-]+)\)/g,
                (match, color, variable) => `fade(${color}, ${variable} * 100%)`))
            .pipe(plugins.replace(/\$/g, "@"))
            .pipe(plugins.rename("variables.less"))
            .pipe(gulp.dest(blueprint.destPath(mainProject)))
            // run it through less compiler (after writing files) to ensure we converted correctly.
            // this line will throw an 'invalid type' error if grid size is not a single px value.
            .pipe(plugins.insert.append(".unit-test { width: @pt-grid-size * 2; }"))
            .pipe(plugins.less());
    });
};
