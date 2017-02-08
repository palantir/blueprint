/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 */
"use strict";

module.exports = (blueprint, gulp, plugins) => {
    const glob = require("glob");
    const path = require("path");
    const text = require("./util/text");
    const tsdoc = require("ts-quick-docs");
    const spawn = require("child_process").spawn;
    const semver = require("semver");
    const cwd = blueprint.findProject("docs").cwd;

    const config = {
        data: path.join(cwd, "src", "generated"),
        dest: path.join(cwd, "build"),
        kssSources: blueprint.projectsWithBlock("sass").map((project) => path.join(project.cwd, "src")),
    };

    // paths to data files used to generate documentation app
    const filenames = {
        docs: "docs.json",
        props: "props.json",
        releases: "releases.json",
        styleguide: path.join(cwd, "src", "styleguide.md"),
        versions: "versions.json",
    };

    const unwrapData = (section) => section.data;

    function processSection(section) {
        return Object.assign({}, section, {
            description: text.markdown(section.description),
            highlightedMarkup: text.highlight(section.markup, "text.html.handlebars"),
            modifiers: section.modifiers.map(unwrapData),
            parameters: section.parameters.map(unwrapData),
            sections: new Map(),
        });
    }

    // find all flags: @[flag-name] [value?]
    const FLAG_REGEX = /<p>@([\w-]+)(?:\s(.+))?<\/p>/g;
    function processFlags(section) {
        if (typeof section.description === "string") {
            section.description = section.description.replace(FLAG_REGEX, function (m, flag, value) {
                switch (flag) {
                case "interface":
                    section.interfaceName = value;
                    break;
                case "hide-markup":
                    section.hideMarkup = true;
                    break;
                case "react-docs":
                    section.reactDocs = value;
                    break;
                case "react-example":
                    section.reactExample = value;
                    break;
                case "angular-example":
                    section.angularExample = value;
                    break;
                default:
                    break;
                }
                // remove flag from output
                return "";
            });
        }
        return section;
    }

    let parentsStack = [];
    /**
     * Convert a flat array of pages to a nested structure. Repeated references will overwrite previous instances.
     * Keeps a stack of parent sections so every new section can be added to its parent.
     * @param {Map<string, Object>} pages map of reference to section, to ensure uniqueness
     * @param {Object} section
     * @return {Map<string, object>} of top-level pages, each of which contains its sections.
     */
    function nestPages(pages, section) {
        // pop the stack till we find the nearest parent
        let parentPage = parentsStack.pop();
        while (parentPage != null && section.depth <= parentPage.depth) {
            parentPage = parentsStack.pop();
        }
        if (parentPage == null) {
            // if there's no parent then we found a new root page
            parentsStack = [section];
            pages.set(section.reference, section);
        } else {
            // otherwise add this page to its parent's sections list
            parentPage.sections.set(section.reference, section);
            parentsStack.push(parentPage, section);
        }
        return pages;
    }

    // JSON properties with special processing:
    var EXCLUDED = ["raw", "styleguide", "weight", "autoincrement", "referenceURI", "section"];
    var STRINGS = ["markup", "description"];
    // JSON.stringify replacer function for Kss.Styleguide
    function stringifyKss(key, value) {
        if (EXCLUDED.indexOf(key) >= 0) { return undefined; }
        if (STRINGS.indexOf(key) >= 0 && !value) { return undefined; }
        if (key === "sections") {
            // unwrap Map into array, in insertion order
            return Array.from(value.values()).map(entry => entry[1]);
        }
        return value;
    }

    // run KSS against all the Sass files to extract documentation sections, then process each
    // section to detect our custom @flags, then save it to a JSON file using some custom stringify
    // logic to unwrap the raw KSS data.
    gulp.task("docs-kss", (done) => {
        var kss = require("kss");
        var options = {
            // disable KSS internal markdown rendering so we can do it all ourselves!
            markdown: false,
            mask: /\.scss$/,
        };

        kss.traverse(config.kssSources, options, (err, styleguide) => {
            if (err) { return done(err); }

            var pages = styleguide.section()
                .map(unwrapData)
                .map(processSection)
                .map(processFlags)
                .reduce(nestPages, new Map());
            // convert Map to array, in insertion order
            pages = Array.from(pages.values());

            pages.unshift({
                deprecated: false,
                depth: 1,
                description: text.markdown(text.fromFile(filenames.styleguide)),
                experimental: false,
                header: "Overview",
                modifiers: [],
                parameters: [],
                reference: "overview",
                sections: [],
            });

            text.fileStream(filenames.docs, JSON.stringify(pages, stringifyKss, 2))
                .pipe(gulp.dest(config.data))
                .on("end", done);
        });
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

    // must include external typings for React things like JSX.Element and React.HTMLProps
    const TYPINGS_PATH = "packages/core/typings/tsd.d.ts";

    gulp.task("docs-interfaces", () => {
        function markdownEntry(entry) {
            if (entry.documentation.length) {
                entry.documentation = text.markdown(entry.documentation.trim());
            }
            if (entry.properties && entry.properties.length) {
                entry.properties = entry.properties.map(markdownEntry);
            }
            return entry;
        }

        // load interfaces from .d.ts files
        const props = tsdoc.fromFiles(glob.sync("packages/*/dist/index.d.ts").concat(TYPINGS_PATH), {}, {
            excludeNames: [/Factory$/, /^I.+State$/],
            excludePaths: ["node_modules/", "core/typings"],
            includeDefinitionFiles: true,
        }).map(markdownEntry);

        return text.fileStream(filenames.props, JSON.stringify(props, null, 2))
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
