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
    const varsInBlocks = cleanedInput.split("\n\n").map(
        block =>
            new Set(
                [...block.matchAll(/(?<varName>\$[-_a-zA-z0-9]+)(?::)/g)].map(match =>
                    // trip the leading "$"
                    match.groups?.varName.substring(1),
                ),
            ),
    );

    return { parsedVars, varsInBlocks };
}

/**
 * Converts parsed postcss "simple variables" to valid scss or less
 *
 * @param {string} value
 * @param {Record<string, string>} allVariables
 * @param {"less" | "scss"} outputType
 * @returns {string} output
 */
function printVariable(value, allVariables, outputType) {
    value = value.trim();

    // special case for rgba(#hexColor) math, which is supported in Sass but not Less,
    // so we manually look up the hex value of the color and convert it to RGB
    value = evaluateRgbaInitializerColor(value, allVariables);

    if (outputType === "less") {
        // special case for maps in Less, which need to be printed with a different syntax
        // https://lesscss.org/features/#maps-feature
        // https://sass-lang.com/documentation/values/maps
        if (value.startsWith("(") && value.endsWith(")")) {
            // looks like a Sass map (we do not support lists of this syntax)
            value = value
                .split("\n")
                .map(line => {
                    if (line === "(") {
                        return "{";
                    } else if (line === ")") {
                        return "}";
                    } else {
                        return line.replace(/"(\S+)": (.+),/, (_substr, key, value) => `${key}: ${value.trim()};`);
                    }
                })
                .join("\n");
        }
    }

    return value;
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
            .filter(([varName, _value]) => varsInBlock.has(varName))
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

    let variablesLess = COPYRIGHT_HEADER + "\n";
    for (const varsInBlock of varsInBlocks) {
        const lessVariablesArray = Object.entries(parsedVars)
            .filter(([varName, _value]) => varsInBlock.has(varName))
            // !default syntax is not valid in less, so remove it regardless of `retainDefault` flag
            .map(([varName, value]) => [varName, value.replace(" !default", "")])
            .map(([varName, value]) => `@${varName}: ${printVariable(value, parsedVars, "less")};`);

        const lessBlock = lessVariablesArray
            .join("\n")
            .replace(/rgba\((\$[\w-]+), ([\d\.]+)\)/g, (_match, color, opacity) => `fade(${color}, ${+opacity * 100}%)`)
            // special case for hsl(), which supports a value like '270deg' in its first argument in Sass, but in Less we must omit the 'deg'
            .replace(/hsl\(([0-9]+)deg, (.+)\)/g, (_match, degrees, rest) => `hsl(${degrees}, ${rest})`)
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
