#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import getSassVars from "get-sass-vars";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { argv, cwd } from "node:process";
import prettier from "prettier";
import yargs from "yargs/yargs";

import { COPYRIGHT_HEADER, DEFAULT_FLAG, USE_MATH_RULE } from "./constants.mjs";

const SRC_DIR = resolve(cwd(), "./src");
const DEST_DIR = resolve(cwd(), "./lib");

await main();

async function main() {
    const args = yargs(argv.slice(2))
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

    const outputFilename = args["outputFileName"];
    const parsedInput = await getParsedVars(args["_"]);
    generateScssVariables(parsedInput, outputFilename, args["retainDefault"]);
    generateLessVariables(parsedInput, outputFilename);
}

/**
 * @typedef {Object} ParsedVarsResult
 * @property {Record<string, unknown>} parsedVars keyed by variable name, including the leading "$"
 * @property {Set<string | undefined>[]} varsInBlocks
 * @property {Set<string | undefined>} varsWithDefaultFlag
 */

/**
 * Pulls together variables from the specified Sass source files and sanitizes them for consumption.
 *
 * @param {string[]} inputSources
 * @returns {Promise<ParsedVarsResult>} output compiled variable values and grouped variable blocks
 */
async function getParsedVars(inputSources) {
    const stripCssComments = (await import("strip-css-comments")).default;
    // concatenate sources
    let cleanedInput = inputSources.reduce((str, currentFilename) => {
        return str + readFileSync(`${SRC_DIR}/${currentFilename}`).toString();
    }, "");
    // strip comments, clean up for consumption
    cleanedInput = stripCssComments(cleanedInput);
    cleanedInput = cleanedInput
        // variables files should be free of relative imports
        .replace(/(@import|\/\/).*\n+/g, "")
        // we only want one "sass:math" reference, we'll add it in manually
        .replace(new RegExp(USE_MATH_RULE, "g"), "")
        // special case for one common mixin used in variables
        .replace(/border-shadow\((.+)\)/g, "0 0 0 1px rgba($black, $1)")
        .replace(/\n{3,}/g, "\n\n");
    cleanedInput = [USE_MATH_RULE, cleanedInput].join("\n");

    const parsedVars = await getSassVars(cleanedInput);

    // `getSassVarsSync` strips `!default` flags from the output, so we need to determine which
    // variables had those flags set here and pass it on. This is a bit of a hack since it relies on regex;
    // an alternative approach would involve postcss parsing via a plugin like postcss-simple-vars.
    const varsWithDefaultFlag = new Set(
        [...cleanedInput.matchAll(/(?<varName>\$[-_a-zA-z0-9]+)(?::)(?<varValue>[\s\S]+?);/gm)]
            .map(match => [match.groups?.varName, match.groups?.varValue.trim()])
            .filter(([, varValue]) => varValue?.endsWith(DEFAULT_FLAG))
            .map(([varName]) => varName),
    );

    // get variable blocks for separating variables in output
    const varsInBlocks = cleanedInput
        .split("\n\n")
        .map(
            block =>
                new Set([...block.matchAll(/(?<varName>\$[-_a-zA-z0-9]+)(?::)/g)].map(match => match.groups?.varName)),
        );

    return { parsedVars, varsInBlocks, varsWithDefaultFlag };
}

function isPrimitive(value) {
    return value !== Object(value);
}

/**
 * Converts values from parsed output of `get-sass-vars` to valid scss or less
 *
 * @param {unknown} value
 * @param {"less" | "scss"} outputType
 * @returns {unknown} output
 */
function convertParsedValueToOutput(value, outputType) {
    // array values should be separated with commas
    if (Array.isArray(value)) {
        return `${value.map(elt => convertParsedValueToOutput(elt, outputType)).join(",\n")}`;
    }

    // Objects are map variables, formatted like:
    // https://lesscss.org/features/#maps-feature
    // https://sass-lang.com/documentation/values/maps
    if (value !== null && typeof value === "object") {
        return outputType === "scss"
            ? `(${Object.entries(value).reduce(
                  (str, [key, val]) => `${str}\n"${key}": ${convertParsedValueToOutput(val, outputType)},`,
                  "",
              )}\n)`
            : `{${Object.entries(value).reduce(
                  (str, [key, val]) => `${str}\n${key}: ${convertParsedValueToOutput(val, outputType)};`,
                  "",
              )}\n}`;
    }

    if (isPrimitive(value)) {
        return value;
    }

    throw new Error(`Encountered sass variable value that cannot be converted to scss/less value: ${value}`);
}

/**
 * Pulls together variables from the specified Sass source files, sanitizes them for consumption,
 * and writes to an output file.
 *
 * @param {ParsedVarsResult} parsedInput
 * @param {string} outputFilename
 * @param {boolean} retainDefault whether to retain `!default` flags on variables
 * @returns {string} output Sass contents
 */
function generateScssVariables(parsedInput, outputFilename, retainDefault) {
    const { parsedVars, varsInBlocks, varsWithDefaultFlag } = parsedInput;

    let variablesScss = COPYRIGHT_HEADER + "\n";
    for (const varsInBlock of varsInBlocks) {
        const variablesArray = Object.entries(parsedVars)
            .filter(([varName, _value]) => varsInBlock.has(varName))
            .map(([varName, value]) => {
                const initializerSuffix = retainDefault && varsWithDefaultFlag.has(varName) ? DEFAULT_FLAG : "";
                return `${varName}: ${convertParsedValueToOutput(value, "scss")} ${initializerSuffix};`;
            });

        variablesScss = `${variablesScss}${variablesArray.join("\n")}\n\n`;
    }

    const formattedVariablesScss = prettier.format(variablesScss, { parser: "less" });

    if (!existsSync(`${DEST_DIR}/scss`)) {
        mkdirSync(`${DEST_DIR}/scss`, { recursive: true });
    }
    writeFileSync(`${DEST_DIR}/scss/${outputFilename}.scss`, formattedVariablesScss);
    return formattedVariablesScss;
}

/**
 * Takes in variable values from compiled sass vars, converts them to Less and writes to an output file.
 *
 * @param {ParsedVarsResult} parsedInput
 * @param {string} outputFilename
 * @returns {void}
 */
function generateLessVariables(parsedInput, outputFilename) {
    const { parsedVars, varsInBlocks } = parsedInput;

    const convertField = ([varName, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) {
            return `${varName}: ${convertParsedValueToOutput(value, "less")}`;
        }
        return `${varName}: ${convertParsedValueToOutput(value, "less")};`;
    };

    let variablesLess = COPYRIGHT_HEADER + "\n";
    for (const varsInBlock of varsInBlocks) {
        const lessVariablesArray = Object.entries(parsedVars)
            .filter(([varName, _value]) => varsInBlock.has(varName))
            .map(convertField);

        const lessBlock = lessVariablesArray
            .join("\n")
            // !default syntax is not valid in less, so remove it regardless of `retainDefault` flag
            .replace(/\ \!default/g, "")
            .replace(/rgba\((\$[\w-]+), ([\d\.]+)\)/g, (_match, color, opacity) => `fade(${color}, ${+opacity * 100}%)`)
            .replace(
                /rgba\((\$[\w-]+), (\$[\w-]+)\)/g,
                (_match, color, variable) => `fade(${color}, ${variable} * 100%)`,
            )
            .replace(/\$/g, "@");

        variablesLess = `${variablesLess}${lessBlock}\n\n`;
    }

    const formattedVariablesLess = prettier.format(variablesLess, { parser: "less" });

    if (!existsSync(`${DEST_DIR}/less`)) {
        mkdirSync(`${DEST_DIR}/less`, { recursive: true });
    }
    writeFileSync(`${DEST_DIR}/less/${outputFilename}.less`, formattedVariablesLess);
}
