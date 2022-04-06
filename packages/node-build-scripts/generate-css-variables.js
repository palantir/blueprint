#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Asserts that all library packages adhere to the layout spec.
 */

// @ts-check
const fs = require("fs");
const getSassVars = require("get-sass-vars");
const path = require("path");
const prettier = require("prettier");
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

/* BEGIN LESS CONVERSION */

// Gets variable values from compiled sass vars
// @ts-ignore, issues with types in `get-sass-vars`
const parsedVars = getSassVars.sync(variablesScss, {
    sassOptions: { functions: require("./node-sass-json-functions.js") },
});

const isPrimitive = value => value !== Object(value);

// Convert value received from `get-sass-vars` to less variable value
const convertValue = value => {
    // array values should be separated with commas
    if (Array.isArray(value)) {
        return `${value.map(elt => convertValue(elt)).join(",\n")}`;
    }

    // Objects are map variables, formatted like: https://lesscss.org/features/#maps-feature
    if (typeof value === "object") {
        return `{${Object.entries(value).reduce((str, [key, val]) => `${str}\n${key}: ${convertValue(val)};`, "")}\n}`;
    }

    if (isPrimitive(value)) {
        return value;
    }

    throw new Error(`Encountered sass variable value that cannot be converted to less value: ${value}`);
};

const convertField = ([varName, value]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
        return `${varName}: ${convertValue(value)}`;
    }
    return `${varName}: ${convertValue(value)};`;
};

// split into blocks by double newlines to get the same spacing in the less output
const splitBlocks = stripCssComments(variablesScss).split("\n\n");

let variablesLess = COPYRIGHT_HEADER + "\n";
for (const block of splitBlocks) {
    const varsInBlock = new Set(
        [...block.matchAll(/(?<varName>\$[-_a-zA-z0-9]+)(?::)/g)].map(match => match.groups.varName),
    );
    const lessVariablesArray = Object.entries(parsedVars)
        .filter(([varName, _value]) => varsInBlock.has(varName))
        .map(convertField);

    const lessBlock = lessVariablesArray
        .join("\n")
        // !default syntax is not valid in less, so remove it regardless of `retainDefault` flag
        .replace(/\ \!default/g, "")
        .replace(/rgba\((\$[\w-]+), ([\d\.]+)\)/g, (_match, color, opacity) => `fade(${color}, ${+opacity * 100}%)`)
        .replace(/rgba\((\$[\w-]+), (\$[\w-]+)\)/g, (_match, color, variable) => `fade(${color}, ${variable} * 100%)`)
        .replace(/\$/g, "@")
        // @use doesn't exist in less and is only used for `@use "sass:math"`
        // and those values get computed in get-sass-vars
        .replace(/@use.*/g, "");

    variablesLess = `${variablesLess}${lessBlock}\n\n`;
}

const formattedVariablesLess = prettier.format(variablesLess, { parser: "less" });

if (!fs.existsSync(`${DEST_DIR}/less`)) {
    fs.mkdirSync(`${DEST_DIR}/less`, { recursive: true });
}
fs.writeFileSync(`${DEST_DIR}/less/${outputFileName}.less`, formattedVariablesLess);
