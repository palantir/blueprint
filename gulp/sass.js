/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const autoprefixer = require("autoprefixer");
    const path = require("path");
    const packageImporter = require("node-sass-package-importer");
    const postcssImport = require("postcss-import");
    const postcssUrl = require("postcss-url");

    const blueprintCwd = blueprint.findProject("core").cwd;

    const config = {
        autoprefixer: {
            browsers: ["Chrome >= 37", "Explorer >= 11", "Edge > 11", "Firefox >= 24", "Safari >= 7"],
        },

        srcGlob: (project, excludePartials) => {
            return path.join(project.cwd, "src/**/", `${excludePartials ? "!(_)" : ""}*.scss`);
        },
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
        gulp.task(taskName, ["icons", "variables", ...depTaskNames], () => sassCompile(project, false));
        gulp.task(`${taskName}:only`, () => sassCompile(project, true));
    });

    function sassCompile(project, isDevMode) {
        const sassCompiler = plugins.sass({
            importer: packageImporter({ cwd: project.cwd }),
        });
        if (isDevMode) {
            sassCompiler.on("error", plugins.sass.logError);
        }

        const postcssPlugins = project.sass === "bundle" ? [
            // inline all imports
            postcssImport(),
            // copy all url() assets into dist/resources/...
            postcssUrl({
                assetsPath: "./assets",
                basePath: [
                    // search current package and core resources
                    "../resources",
                    "../../core/resources",
                    // if new resources are added to packages, they'll need to be listed here
                ],
                url: "copy",
            }),
        ] : [];
        // always run autoprefixer
        postcssPlugins.push(autoprefixer(config.autoprefixer));

        return gulp.src(config.srcGlob(project, true))
            .pipe(plugins.sourcemaps.init())
            .pipe(sassCompiler)
            .pipe(plugins.postcss(postcssPlugins, {
                to : blueprint.destPath(project, "dist.css"),
            }))
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
};
