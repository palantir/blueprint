#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Asserts that all library packages adhere to the layout spec.
 */

// @ts-check
const fs = require("fs");
const path = require("path");
const stripCssComments = require("strip-css-comments");
const yargs = require("yargs/yargs");

const { COPYRIGHT_HEADER } = require("./constants");

const SRC_DIR = path.resolve(process.cwd(), "./src");
const DEST_DIR = path.resolve(process.cwd(), "./lib");

const args = yargs(process.argv.slice(2))
    .option("outputFileName", {
        alias: "o",
        default: "variables",
        type: "string",
        description: "The file name for the generated less and scss files",
    })
    .option("retainDefault", {
        default: false,
        type: "boolean",
        description: "Set to true to retain the !default syntax for the generated scss file",
    }).argv;

// Ignoring ts because yargs typings don't match the yargs docs:
// "Arguments without a corresponding flag show up in the argv._ array."
// @ts-ignore
const variablesSources = args._;

const outputFileName = args["outputFileName"];

// concatenate sources
let variablesScss = variablesSources.reduce((str, currentFilename) => {
    return str + fs.readFileSync(`${SRC_DIR}/${currentFilename}`).toString();
}, "");

// strip comments, clean up for consumption
variablesScss = stripCssComments(variablesScss);
variablesScss = variablesScss
    .replace(/(@import|\/\/).*\n+/g, "")
    .replace(/border-shadow\((.+)\)/g, "0 0 0 1px rgba($black, $1)")
    .replace(/\n{3,}/g, "\n\n");
if (!args["retainDefault"]) {
    variablesScss = variablesScss.replace(/\ \!default/g, "");
}
variablesScss = COPYRIGHT_HEADER + "\n" + variablesScss;

if (!fs.existsSync(`${DEST_DIR}/scss`)) {
    fs.mkdirSync(`${DEST_DIR}/scss`, { recursive: true });
}
fs.writeFileSync(`${DEST_DIR}/scss/${outputFileName}.scss`, variablesScss);

// convert scss to less
const variablesLess = variablesScss
    // !default syntax is not valid in less, so remove it regardless of `retainDefault` flag
    .replace(/\ \!default/g, "")
    .replace(/rgba\((\$[\w-]+), ([\d\.]+)\)/g, (_match, color, opacity) => `fade(${color}, ${+opacity * 100}%)`)
    .replace(/rgba\((\$[\w-]+), (\$[\w-]+)\)/g, (_match, color, variable) => `fade(${color}, ${variable} * 100%)`)
    .replace(/\$/g, "@");

if (!fs.existsSync(`${DEST_DIR}/less`)) {
    fs.mkdirSync(`${DEST_DIR}/less`, { recursive: true });
}
fs.writeFileSync(`${DEST_DIR}/less/${outputFileName}.less`, variablesLess);
