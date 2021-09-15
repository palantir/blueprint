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
    })
    .option("retainDefault", {
        default: false,
        type: "boolean",
    }).argv;

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
    fs.mkdirSync(`${DEST_DIR}/scss`);
}
fs.writeFileSync(`${DEST_DIR}/scss/${outputFileName}.scss`, variablesScss);

// convert scss to less
const variablesLess = variablesScss
    .replace(/rgba\((\$[\w-]+), ([\d\.]+)\)/g, (match, color, opacity) => `fade(${color}, ${+opacity * 100}%)`)
    .replace(/rgba\((\$[\w-]+), (\$[\w-]+)\)/g, (match, color, variable) => `fade(${color}, ${variable} * 100%)`)
    .replace(/\$/g, "@");

if (!fs.existsSync(`${DEST_DIR}/less`)) {
    fs.mkdirSync(`${DEST_DIR}/less`);
}
fs.writeFileSync(`${DEST_DIR}/less/${outputFileName}.less`, variablesLess);
