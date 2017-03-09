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

    gulp.task("docs-json", async () => {
        const docs = dm.Documentalist.create({ renderer: text.renderer })
            .use(".scss", new dm.KssPlugin());
        const contents = await docs.documentGlobs("packages/core/src/**/*");

        function nestChildPage(child, parent) {
            const originalRef = child.reference;

            // update entry reference to include parent reference
            const nestedRef = dm.slugify(parent.reference, originalRef);
            child.reference = nestedRef;

            if (dm.isPageNode(child)) {
                // rename nested pages to be <parent>.<child> and remove old <child> entry
                contents.docs[nestedRef] = contents.docs[originalRef];
                contents.docs[nestedRef].reference = nestedRef;
                delete contents.docs[originalRef];
                // recurse through page children
                child.children.forEach((innerchild) => nestChildPage(innerchild, child));
            }
        }

        // navPage is used to construct the sidebar menu
        const roots = dm.createNavigableTree(contents.docs, contents.docs[config.navPage]).children;
        // nav page is not a real docs page so we can remove it from output
        delete contents.docs[config.navPage];
        roots.forEach((page) => {
            if (dm.isPageNode(page)) {
                page.children.forEach((child) => nestChildPage(child, page));
            }
        });

        // add a new field to data file with pre-processed layout tree
        contents.layout = roots;

        return text.fileStream(filenames.data, JSON.stringify(contents, null, 2))
            .pipe(gulp.dest(config.data));
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
