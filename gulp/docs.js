/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const dm = require("documentalist");
    const glob = require("glob");
    const path = require("path");
    const text = require("./util/text");
    const spawn = require("child_process").spawn;
    const semver = require("semver");
    const cwd = blueprint.findProject("docs").cwd;

    const config = {
        data: path.join(cwd, "src", "generated"),
        dest: path.join(cwd, "build"),
        navPage: "_nav",
    };

    // paths to data files used to generate documentation app
    const filenames = {
        data: "docs.json",
        releases: "releases.json",
        versions: "versions.json",
    };

    gulp.task("docs-json", () => {
        return new dm.Documentalist([], { renderer: text.renderer })
            .use(".md", new dm.MarkdownPlugin({ navPage: config.navPage }))
            .use(/\.tsx?$/, new dm.TypescriptPlugin())
            .use(".scss", new dm.KssPlugin())
            .documentGlobs("packages/*/src/**/*")
            .then((docs) => JSON.stringify(docs, null, 2))
            .then((content) => (
                text.fileStream(filenames.data, content)
                    .pipe(gulp.dest(config.data))
            ));
    });

    // create a JSON file containing latest released version of each project
    gulp.task("docs-releases", () => {
        var releases = blueprint.projects
            .map((project) => require(path.resolve(project.cwd, "package.json")))
            // only include non-private projects
            .filter((project) => !project.private)
            // just these two fields from package.json:
            .map(({ name, version }) => ({ name, version }));
        return text.fileStream(filenames.releases, JSON.stringify(releases, null, 2))
            .pipe(gulp.dest(config.data));
    });

    // create a JSON file containing published versions of the documentation
    gulp.task("docs-versions", (done) => {
        let stdout = "";
        const child = spawn("git", ["tag"]);
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", data => { stdout += data; });
        child.on("close", () => {
            /** @type {Map<string, string>} */
            const majorVersionMap = stdout.split("\n")
                // turn release-* tags into version numbers
                .filter(val => /release-[1-9]\d*\.\d+\.\d+.*/.test(val))
                .map(val => val.slice(8))
                // inject current version (unreleased package bump)
                .concat(require(path.resolve(cwd, "package.json")).version)
                .reduce((map, version) => {
                    const major = semver.major(version);
                    if (!map.has(major) || semver.gt(version, map.get(major))) {
                        map.set(major, version);
                    }
                    return map;
                }, new Map());
            // sort in reverse order (so latest is first)
            const majorVersions = Array.from(majorVersionMap.values()).sort(semver.rcompare);
            plugins.util.log("Versions:", majorVersions.join(", "));
            text.fileStream(filenames.versions, JSON.stringify(majorVersions, null, 2))
                .pipe(gulp.dest(config.data));
            done();
        });
    });
};
