/**
 * @license Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import { readFileSync } from "node:fs";
import { join } from "node:path";
import prettier from "prettier";

import { COPYRIGHT_HEADER, DEFAULT_FLAG, USE_MATH_RULE } from "./constants.mjs";
import sassVariableParser from "./sass/sassVariableParser.mjs";

/**
 * @typedef {Object} ParsedVarsResult
 * @property {Record<string, string>} parsedVars keyed by variable name, including the leading "$"
 * @property {Set<string | undefined>[]} varsInBlocks
 */

/**
 * Pulls together variables from the specified Sass source files and sanitizes them for consumption.
 *
 * @param {string} inputDir
 * @param {string[]} inputSources
 * @returns {Promise<ParsedVarsResult>} output compiled variable values and grouped variable blocks
 */
export async function getParsedVars(inputDir, inputSources) {
    const stripCssComments = (await import("strip-css-comments")).default;
    // concatenate sources
    let cleanedInput = inputSources.reduce((str, currentFilename) => {
        return str + readFileSync(join(inputDir, currentFilename), { encoding: "utf8" });
    }, "");
    // strip comments, clean up for consumption
    cleanedInput = stripCssComments(cleanedInput);
    cleanedInput = cleanedInput
        // variables files should be free of relative imports
        .replace(/(@import|\/\/).*\n+/g, "")
        // we don't want "sass:math" references
        .replace(new RegExp(USE_MATH_RULE, "g"), "")
        // special case for one common mixin used in variables
        .replace(/border-shadow\((.+)\)/g, "0 0 0 1px rgba($black, $1)")
        .replace(/\n{3,}/g, "\n\n");

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
 * Converts parsed postcss "simple variables" to valid scss or less
 *
 * @param {Array | object | string} value
 * @param {Record<string, string>} allVariables
 * @param {"less" | "scss"} outputType
 * @returns {string} output
 */
function printVariable(value, allVariables, outputType) {
    // array values should be separated with commas
    if (Array.isArray(value)) {
        return `${value.map(elt => printVariable(elt, allVariables, outputType)).join(",\n")}`;
    }

    // Objects are map variables, formatted like:
    // https://lesscss.org/features/#maps-feature
    // https://sass-lang.com/documentation/values/maps
    if (value !== null && typeof value === "object") {
        return outputType === "scss"
            ? `(${Object.entries(value).reduce(
                  (str, [key, val]) => `${str}\n"${key}": ${printVariable(val, allVariables, outputType)},`,
                  "",
              )}\n)`
            : `{${Object.entries(value).reduce(
                  (str, [key, val]) => `${str}\n${key}: ${printVariable(val, allVariables, outputType)};`,
                  "",
              )}\n}`;
    }

    if (isPrimitive(value)) {
        // special case for rgba(#hexColor) math, which is supported in Sass but not Less,
        // so we manually look up the hex value of the color and convert it to RGB
        value = evaluateRgbaInitializerColor(value, allVariables);
        return value;
    }

    throw new Error(`Encountered sass variable value that cannot be converted to scss/less value: ${value}`);
}

/**
 * Pulls together variables from the specified Sass source files, sanitizes them for consumption,
 * and writes to an output file.
 *
 * @param {ParsedVarsResult} parsedInput
 * @param {boolean} retainDefault whether to retain `!default` flags on variables
 * @returns {string} output Sass contents
 */
export function generateScssVariables(parsedInput, retainDefault) {
    const { parsedVars, varsInBlocks } = parsedInput;

    let variablesScss = COPYRIGHT_HEADER + "\n";
    for (const varsInBlock of varsInBlocks) {
        const variablesArray = Object.entries(parsedVars)
            // N.B. the leading "$" is intentional here, as postcss-simple-vars preserves those in variable names
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
                return `$${varName}: ${printVariable(value, parsedVars, "scss")} ${defaultFlag};`;
            });

        variablesScss = `${variablesScss}${variablesArray.join("\n")}\n\n`;
    }

    return prettier.format(variablesScss, { parser: "scss" });
}

/**
 * Takes in variable values from compiled sass vars, converts them to Less and writes to an output file.
 *
 * @param {ParsedVarsResult} parsedInput
 * @returns {string} output Less contents
 */
export function generateLessVariables(parsedInput) {
    const { parsedVars, varsInBlocks } = parsedInput;

    const convertField = ([varName, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) {
            return `${varName}: ${printVariable(value, parsedVars, "less")}`;
        }
        return `${varName}: ${printVariable(value, parsedVars, "less")};`;
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

    return prettier.format(variablesLess, { parser: "less" });
}

/**
 * To ensure compatibility with Less, we must converat all instances of `rgba(color, opacity)` which use a hex color
 * as the first argument (e.g. `rgba($black, 0.1)`) to use the more widely-compatible `rgba(r, g, b, a)` syntax.
 *
 * @param {string} variableInitializer
 * @param {Record<string, string>} allVariables
 * @returns {string}
 */
function evaluateRgbaInitializerColor(variableInitializer, allVariables) {
    return variableInitializer.replace(
        /rgba\((.+)\, (.+)\)/g,
        (_, colorHexCode, opacity) => `rgba(${colorHexToRgb(colorHexCode)}, ${opacity})`,
    );
}

/**
 * @param {string} colorHex
 * @returns {string} tuple of r, g, b values of input color
 */
function colorHexToRgb(colorHex) {
    if (colorHex.startsWith("#")) {
        colorHex = colorHex.substring(1);
    }
    const aRgbHex = colorHex.match(/.{1,2}/g);
    if (aRgbHex == null) {
        throw new Error(`[node-build-scripts] Could not convert hex color to RGB '${colorHex}'`);
    }
    const [r, g, b] = [parseInt(aRgbHex[0], 16), parseInt(aRgbHex[1], 16), parseInt(aRgbHex[2], 16)];
    return `${r}, ${g}, ${b}`;
}
