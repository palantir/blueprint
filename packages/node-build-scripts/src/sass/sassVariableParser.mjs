/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import postcss from "postcss";
import scssParser from "postcss-scss";
import simpleVars from "postcss-simple-vars";

import { DEFAULT_FLAG } from "../constants.mjs";

/**
 * Parses Sass source file contents for variables using "postcss-simple-vars"
 *
 * @param {string} source
 * @returns {Promise<Record<string, string>>}
 */
export default async function (source) {
    /** @type {Record<string, string>} */
    const vars = {};
    const collectVariablesPlugin = simpleVars({
        onVariables: parsedSimpleVars => {
            // @ts-ignore -- types for postcss-simple-vars are wrong here, it's actually an object, not a string
            Object.entries(parsedSimpleVars).forEach(([varName, value]) => {
                // postcss-simple-vars is very simple, and does not understand the Sass "!default" syntax.
                // It includes it as a string suffix for all variables that have it, even including when it looks up
                // variable references. So we have to strip out some extraneous "!default" substrings.
                const hasDefaultFlag = value.endsWith(DEFAULT_FLAG);
                const suffix = hasDefaultFlag ? " !default" : "";
                vars[varName] = value.replace(new RegExp(DEFAULT_FLAG, "g"), "") + suffix;
            });
        },
    });
    await postcss([collectVariablesPlugin]).process(source, {
        // set something here to avoid PostCSS printing a warning about missing the "from" option
        from: "",
        parser: scssParser,
    });
    return vars;
}
