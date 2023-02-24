#!/usr/bin/env node
/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { argv, cwd } from "node:process";
import prettier from "prettier";
import yargs from "yargs/yargs";

import { COPYRIGHT_HEADER, USE_MATH_RULE } from "./constants.mjs";
import sassVariableParser from "./sass/sassVariableParser.mjs";

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
 * Pulls together variables from the specified Sass source files and sanitizes them for consumption.
 *
 * @param {string[]} inputSources
 * @returns {Promise<{parsedVars: object, varsInBlocks: Set<string | undefined>[]}>} output compiled variable values and grouped variable blocks
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
        .replace(/(@import|\/\/).*\n+/g, "")
        .replace(/@use "sass:math";\n/g, "")
        .replace(/border-shadow\((.+)\)/g, "0 0 0 1px rgba($black, $1)")
        .replace(/\n{3,}/g, "\n\n");
    cleanedInput = [USE_MATH_RULE, cleanedInput].join("\n");

    const parsedVars = await sassVariableParser(cleanedInput);

    // get variable blocks for separating variables in output
    const varsInBlocks = cleanedInput
        .split("\n\n")
        .map(
            block =>
                new Set([...block.matchAll(/(?<varName>\$[-_a-zA-z0-9]+)(?::)/g)].map(match => match.groups?.varName)),
        );

    return { parsedVars, varsInBlocks };
}

function isPrimitive(value) {
    return value !== Object(value);
}

/**
 * Converts values from parsed output of `sassVariableParser` to valid scss or less
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
 * @param {{parsedVars: Record<string, string>, varsInBlocks: Set<string | undefined>[]}} parsedInput
 * @param {string} outputFilename
 * @param {boolean} retainDefault whether to retain `!default` flags on variables
 * @returns {string} output Sass contents
 */
function generateScssVariables(parsedInput, outputFilename, retainDefault) {
    const { parsedVars, varsInBlocks } = parsedInput;

    let variablesScss = COPYRIGHT_HEADER + "\n";
    for (const varsInBlock of varsInBlocks) {
        const variablesArray = Object.entries(parsedVars)
            .filter(([varName, _value]) => varsInBlock.has(`$${varName}`))
            .map(([varName, value]) => {
                let defaultFlag = "";
                // strip the default flag if it exists, and keep track of it if we need to retain it in the output
                if (value.includes("!default")) {
                    value = value.replace("!default", "");
                    if (retainDefault) {
                        defaultFlag = "!default";
                    }
                }
                return `$${varName}: ${convertParsedValueToOutput(value, "scss")} ${defaultFlag};`;
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
 * @param {{parsedVars: Record<string, string>, varsInBlocks: Set<string | undefined>[]}} parsedInput
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
