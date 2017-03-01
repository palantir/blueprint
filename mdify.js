#!/usr/bin/env node

const glob = require("glob");
const fs = require("fs");

// captures: [title, body, reference]
const BLOCK_REGEX = /\/\*\n(.+)\n\n((?:.|\n)+?)\nStyleguide:? (.+)\n\*\//g;

const HEADINGS = "######";

glob.sync("packages/core/src/components/*/*.scss")
    .filter((filepath) => !/common\.scss$/.test(filepath))
    .forEach((comp) => {
        const scss = fs.readFileSync(comp, "utf-8").replace(/^ */gm, "");
        const contents = [`---\nparent: ${comp.indexOf("/forms/") > 0 ? "forms" : "components"}\n---`];

        /** @type {RegExpExecArray} */
        let match;
        // tslint:disable-next-line:no-conditional-assignment
        while ((match = BLOCK_REGEX.exec(scss)) !== null) {
            const [title, body, reference] = match.slice(1);
            const depth = reference.split(".").length - 1;

            contents.push(
                `${HEADINGS.slice(0, depth)} ${title}`,
                body.trim().replace(/@\w+(-\w+)/g, (tag, ext) => tag.replace(ext, ext[1].toUpperCase() + ext.slice(2)))
            );
        }
        fs.writeFileSync(comp.replace(".scss", ".md").replace("/_", "/"), contents.join("\n\n") + "\n");
    });
