/* eslint-disable header/header, camelcase, import/no-extraneous-dependencies */
/**
 * Forked from https://github.com/niksy/node-sass-json-functions
 * To resolve an issue where it's impossible to know if a list should be separated by
 * commas or by spaces. For use with `get-sass-vars` in `generate-css-variables.js`.
 */

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

"use strict";

const isPlainObject = require("is-plain-obj");
const parseColor = require("parse-color");
const parseUnit = require("parse-css-dimension");
const rgbHex = require("rgb-hex");
const round = require("round-to");
const sass = require("sass");
const shortHexColor = require("shorten-css-hex");

// eslint-disable-next-line no-underscore-dangle
function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { default: e };
}

const sass__default = /* #__PURE__*/ _interopDefaultLegacy(sass);
const round__default = /* #__PURE__*/ _interopDefaultLegacy(round);
const rgbHex__default = /* #__PURE__*/ _interopDefaultLegacy(rgbHex);
const shortHexColor__default = /* #__PURE__*/ _interopDefaultLegacy(shortHexColor);
const isPlainObject__default = /* #__PURE__*/ _interopDefaultLegacy(isPlainObject);
const parseColor__default = /* #__PURE__*/ _interopDefaultLegacy(parseColor);
const parseUnit__default = /* #__PURE__*/ _interopDefaultLegacy(parseUnit);

/**
 * @typedef {object} Options
 * @property {number} precision Number of digits after the decimal.
 */

/**
 * @typedef {import('../index').JsonValue} JsonValue
 * @typedef {import('../index').JsonObject} JsonObject
 * @typedef {import('../index').JsonArray} JsonArray
 */

/**
 * @param {sass.LegacyValue|undefined} value
 * @param {Options}                    options
 */
function getJsonValueFromSassValue(value, options) {
    let resolvedValue;
    if (value instanceof sass__default["default"].types.List) {
        resolvedValue = listToArray(value, options);
    } else if (value instanceof sass__default["default"].types.Map) {
        resolvedValue = mapToObject(value, options);
    } else if (value instanceof sass__default["default"].types.Color) {
        /** @type {[number, number, number]} */
        const rgbValue = [value.getR(), value.getG(), value.getB()];
        const alphaValue = value.getA();
        if (alphaValue === 1) {
            resolvedValue = shortHexColor__default["default"](`#${rgbHex__default["default"].apply(null, rgbValue)}`);
        } else {
            resolvedValue = `rgba(${rgbValue.join(",")},${alphaValue})`;
        }
    } else if (value instanceof sass__default["default"].types.Number) {
        if (value.getUnit() !== "") {
            resolvedValue = String(
                round__default["default"](Number(value.getValue()), options.precision) + value.getUnit(),
            );
        } else {
            resolvedValue = round__default["default"](Number(value.getValue()), options.precision);
        }
    } else {
        try {
            if (typeof value !== "undefined" && "getValue" in value) {
                resolvedValue = value.getValue();
            } else {
                resolvedValue = null;
            }
        } catch (error) {
            resolvedValue = null;
        }
    }
    return resolvedValue;
}

/**
 * @param {sass.types.List} list
 * @param {Options}         options
 */
function listToArray(list, options) {
    const length = list.getLength();
    /** @type {JsonArray} */
    const data = [];
    for (const index of Array.from({ length }).keys()) {
        const value = getJsonValueFromSassValue(list.getValue(index), options);
        data.push(value);
    }
    return list.getSeparator() ? data : data.join(" ");
}

/**
 * @param {sass.types.Map} map
 * @param {Options}        options
 */
function mapToObject(map, options) {
    const length = map.getLength();
    /** @type {JsonObject} */
    const data = {};
    for (const index of Array.from({ length }).keys()) {
        // @ts-ignore
        const key = String(map.getKey(index).getValue());
        const value = getJsonValueFromSassValue(map.getValue(index), options);
        data[key] = value;
    }
    return data;
}

/**
 * @typedef {import('../index').JsonValue} JsonValue
 * @typedef {import('../index').JsonObject} JsonObject
 * @typedef {import('../index').JsonArray} JsonArray
 */

const unitTypes = ["length", "angle", "resolution", "frequency", "time"];

/**
 * @param {string} value
 */
function isColor(value) {
    return typeof parseColor__default["default"](value).rgba !== "undefined";
}

/**
 * @param {string} value
 */
function parseValueToStringOrNumber(value) {
    let resolvedValue;
    try {
        const { value: parsedValue, unit, type } = parseUnit__default["default"](value);
        if (unitTypes.includes(type)) {
            resolvedValue = new sass__default["default"].types.Number(parsedValue, unit);
        } else if (type === "percentage") {
            resolvedValue = new sass__default["default"].types.Number(parsedValue, "%");
        } else {
            resolvedValue = new sass__default["default"].types.String(value);
        }
    } catch (error) {
        resolvedValue = new sass__default["default"].types.String(value);
    }
    return resolvedValue;
}

/**
 * @param {string} value
 */
function parseValueToColor(value) {
    const [r, g, b, a] = parseColor__default["default"](value).rgba;
    return new sass__default["default"].types.Color(r, g, b, a);
}

/**
 * @param {JsonValue} value
 */
function setJsonValueToSassValue(value) {
    let resolvedValue;
    if (Array.isArray(value)) {
        resolvedValue = arrayToList(value);
    } else if (isPlainObject__default["default"](value)) {
        resolvedValue = objectToMap(value);
    } else if (isColor(String(value))) {
        resolvedValue = parseValueToColor(String(value));
    } else if (typeof value === "string") {
        resolvedValue = parseValueToStringOrNumber(value);
    } else if (typeof value === "number") {
        resolvedValue = new sass__default["default"].types.Number(value);
    } else if (typeof value === "boolean") {
        resolvedValue = value
            ? sass__default["default"].types.Boolean.TRUE
            : sass__default["default"].types.Boolean.FALSE;
    } else {
        resolvedValue = sass__default["default"].types.Null.NULL;
    }
    return resolvedValue;
}

/**
 * @param {JsonArray} array
 */
function arrayToList(array) {
    const length = array.length;
    const data = new sass__default["default"].types.List(length);
    for (const [index, item] of array.entries()) {
        data.setValue(index, setJsonValueToSassValue(item));
    }
    return data;
}

/**
 * @param {JsonObject} object
 */
function objectToMap(object) {
    const length = Object.keys(object).length;
    const data = new sass__default["default"].types.Map(length);
    for (const [index, [property, value = null]] of Object.entries(object).entries()) {
        data.setKey(index, setJsonValueToSassValue(property));
        data.setValue(index, setJsonValueToSassValue(value));
    }
    return data;
}

/**
 * @typedef {JsonPrimitive | JsonObject | JsonArray} JsonValue
 * @typedef {JsonValue[]} JsonArray
 * @typedef {string | number | boolean | null} JsonPrimitive
 * @typedef {{[Key in string]?: JsonValue}} JsonObject
 */

/**
 * Encodes (`JSON.stringify`) data and returns Sass string. By default, string is quoted with single quotes so that it can be easily used in standard CSS values.
 *
 * @param {sass.LegacyValue}   value     Data to encode (stringify).
 * @param {sass.types.Boolean} quotes    Should output string be quoted with single quotes.
 * @param {sass.types.Number}  precision Number of digits after the decimal.
 */
function encode(value, quotes, precision) {
    const shouldQuote = quotes.getValue();
    let resolvedValue = JSON.stringify(getJsonValueFromSassValue(value, { precision: precision.getValue() }));
    if (shouldQuote) {
        resolvedValue = `'${resolvedValue}'`;
    }
    return new sass__default["default"].types.String(resolvedValue);
}

/**
 * Decodes (`JSON.parse`) string and returns one of available Sass types.
 *
 * @param {sass.types.String} value String to decode (parse).
 */
function decode(value) {
    /** @type {JsonValue?} */
    let resolvedValue = {};
    try {
        resolvedValue = JSON.parse(value.getValue());
    } catch (error) {
        resolvedValue = null;
    }
    return setJsonValueToSassValue(resolvedValue);
}

/** @type {{ 'json-encode($value, $quotes: true, $precision: 5)': typeof encode, 'json-decode($value)': typeof decode }} */
const api = {
    "json-encode($value, $quotes: true, $precision: 5)": encode,
    "json-decode($value)": decode,
};

module.exports = api;
