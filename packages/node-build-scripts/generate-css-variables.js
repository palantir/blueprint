#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check
const fs = require("fs");
const getSassVars = require("get-sass-vars");
const path = require("path");
const prettier = require("prettier");
const stripCssComments = require("strip-css-comments");
const yargs = require("yargs/yargs");

const { COPYRIGHT_HEADER, USE_MATH_RULE } = require("./constants");

const SRC_DIR = path.resolve(process.cwd(), "./src");
const DEST_DIR = path.resolve(process.cwd(), "./lib");

main();

function main() {
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

    const outputFilename = args["outputFileName"];
    const parsedInput = getParsedVars(args["_"]);
    generateScssVariables(parsedInput, outputFilename, args["retainDefault"]);
    generateLessVariables(parsedInput, outputFilename);
}

/**
 * Pulls together variables from the specified Sass source files, sanitizes them for consumption,
 * and gets compiled output from `get-sass-vars`.
 *
 * @param {string[]} inputSources
 * @returns {{parsedVars: object, varsInBlocks: Set<string>[], varsWithDefaultFlag: Set<string>}} output compiled variable values and grouped variable blocks
 */
function getParsedVars(inputSources) {
    // concatenate sources
    let cleanedInput = inputSources.reduce((str, currentFilename) => {
        return str + fs.readFileSync(`${SRC_DIR}/${currentFilename}`).toString();
    }, "");
    // strip comments, clean up for consumption
    cleanedInput = stripCssComments(cleanedInput);
    cleanedInput = cleanedInput
        .replace(/(@import|\/\/).*\n+/g, "")
        .replace(/@use "sass:math";\n/g, "")
        .replace(/border-shadow\((.+)\)/g, "0 0 0 1px rgba($black, $1)")
        .replace(/\n{3,}/g, "\n\n");
    cleanedInput = [USE_MATH_RULE, cleanedInput].join("\n");

    // @ts-ignore, issues with types in `get-sass-vars`
    const getSassVarsSync = getSassVars.sync;

    const parsedVars = getSassVarsSync(cleanedInput, {
        sassOptions: { functions: require("./node-sass-json-functions.js") },
    });

    // get variable blocks for separating variables in output
    const varsInBlocks = cleanedInput
        .split("\n\n")
        .map(
            block =>
                new Set([...block.matchAll(/(?<varName>\$[-_a-zA-z0-9]+)(?::)/g)].map(match => match.groups.varName)),
        );

    // `getSassVarsSync` strips `!default` flags from the output, so we need to determine which
    // variables had those flags set here and pass it on
    const varsWithDefaultFlag = new Set(
        [...cleanedInput.matchAll(/(?<varName>\$[-_a-zA-z0-9]+)(?::)(?<varValue>[\s\S]+?);/gm)]
            .map(match => [match.groups.varName, match.groups.varValue.trim()])
            .filter(([, varValue]) => varValue.endsWith("!default"))
            .map(([varName]) => varName),
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
    if (typeof value === "object") {
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
 * @param {{parsedVars: object, varsInBlocks: Set<string>[], varsWithDefaultFlag: Set<string>}} parsedInput
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
                const defaultFlag = retainDefault && varsWithDefaultFlag.has(varName) ? "!default" : "";
                return `${varName}: ${convertParsedValueToOutput(value, "scss")} ${defaultFlag};`;
            });

        variablesScss = `${variablesScss}${variablesArray.join("\n")}\n\n`;
    }

    const formattedVariablesScss = prettier.format(variablesScss, { parser: "less" });

    if (!fs.existsSync(`${DEST_DIR}/scss`)) {
        fs.mkdirSync(`${DEST_DIR}/scss`, { recursive: true });
    }
    fs.writeFileSync(`${DEST_DIR}/scss/${outputFilename}.scss`, formattedVariablesScss);
    return formattedVariablesScss;
}

/**
 * Takes in variable values from compiled sass vars, converts them to Less and writes to an output file.
 * @param {{parsedVars: object, varsInBlocks: Set<string>[]}} parsedInput
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

    if (!fs.existsSync(`${DEST_DIR}/less`)) {
        fs.mkdirSync(`${DEST_DIR}/less`, { recursive: true });
    }
    fs.writeFileSync(`${DEST_DIR}/less/${outputFilename}.less`, formattedVariablesLess);
}
