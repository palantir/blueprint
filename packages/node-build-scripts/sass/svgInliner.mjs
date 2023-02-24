/*
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

/**
 * @fileoverview adapted from a fork of sass-inline-svg which implements dart-sass support
 * @see https://github.com/Liquid-JS/sass-inline-svg/blob/958bd0e27782d46349da7d8a831467257d4130d1/index.js
 */

// @ts-check

import selectAll, { selectOne } from "css-select";
import serialize from "dom-serializer";
import { parseDocument } from "htmlparser2";
import svgToDataUri from "mini-svg-data-uri";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sass from "sass";

import { svgOptimizer } from "../svg/svgOptimizer.mjs";

/**
 * The SVG inliner function.
 * This is a factory that expects a base path and returns the actual function.
 *
 * @param {string} base
 * @param {{optimize: boolean, encodingFormat: string}} opts
 * @returns {sass.CustomFunction<"async">}
 */
export function svgInlinerFactory(base, opts) {
    const { optimize = false, encodingFormat = "base64" } = opts;

    /**
     * @param {sass.Value[]} args
     * @returns {Promise<sass.SassString>}
     */
    return async function (args) {
        const path = /** @type {sass.SassString} */ (args[0]);
        const selectors = /** @type {sass.SassMap | undefined} */ (args[1]);
        const resolvedPath = resolve(base, path.text);
        try {
            let svgContents = readFileSync(resolvedPath, { encoding: "utf8" });

            if (selectors !== undefined && selectors.asList.size > 0) {
                svgContents = changeStyle(svgContents, selectors);
            }

            if (optimize) {
                svgContents = (await svgOptimizer.optimize(svgContents, { path: resolvedPath })).data;
            }

            return encode(svgContents, { encodingFormat });
        } catch (err) {
            console.error("[node-build-scripts]", err);
            return new sass.SassString("");
        }
    };
}

/**
 * Encode a JS string as a Sass string.
 *
 * @param {any} content
 * @param {any} opts
 * @returns {sass.SassString}
 */
function encode(content, opts) {
    if (opts.encodingFormat === "uri") {
        return new sass.SassString(`url("${svgToDataUri(content.toString("UTF-8"))}")`);
    }

    if (opts.encodingFormat === "base64") {
        return new sass.SassString(`url("data:image/svg+xml;base64,${content.toString("base64")})`);
    }

    throw new Error(`[node-build-scripts] encodingFormat ${opts.encodingFormat} is not supported`);
}

/**
 * Change the style attributes of an SVG string.
 *
 * @param {string} source
 * @param {sass.SassMap} selectorsMap
 * @returns {*}
 */
function changeStyle(source, selectorsMap) {
    const document = parseDocument(source, {
        xmlMode: true,
    });
    const svg = document ? selectOne("svg", document.childNodes) : null;

    const selectors = mapToObj(selectorsMap);

    if (!svg) {
        throw Error("[node-build-scripts] Invalid svg file");
    }

    Object.keys(selectors).forEach(function (selector) {
        const elements = selectAll(selector, svg);
        const newAttributes = selectors[selector];

        elements.forEach(function (element) {
            // @ts-ignore -- attribs property does exist
            Object.assign(element.attribs, newAttributes);
        });
    });

    return serialize(document);
}

/**
 * Recursively transforms a Sass map into a JS object.
 *
 * @param {sass.SassMap} sassMap
 * @returns {Record<any, any>}
 */
function mapToObj(sassMap) {
    const obj = Object.create(null);
    const map = sassMap.contents.toJS();

    for (const [key, value] of /** @type {[string, sass.Value][]} */ (Object.entries(map))) {
        obj[key] = value instanceof sass.SassMap ? mapToObj(value) : value.toString();
    }

    return obj;
}
