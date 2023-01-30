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

import { optimizeSync, svgOptimizer } from "../svg/svgOptimizer.mjs";

/**
 * The SVG inliner function
 * This is a factory that expects a base path abd returns the actual function
 *
 * @param {string} base
 * @param {{optimize: boolean, encodingFormat: string}} opts
 */
export async function svgInliner(base, opts) {
    const { optimize = false, encodingFormat = "base64" } = opts;

    /**
     * @param {sass.types.String} path
     * @param {sass.types.Map | undefined} selectors
     * @returns {Promise<sass.types.String | undefined>}
     */
    return async function (path, selectors) {
        const resolvedPath = resolve(base, path.getValue());
        try {
            let svgContents = readFileSync(resolvedPath, { encoding: "utf8" });

            if (selectors && selectors.getLength && selectors.getLength()) {
                svgContents = changeStyle(svgContents, selectors);
            }

            if (optimize) {
                // const optimizedSvg = optimizeSync(svgContents);
                // svgContents = Buffer.from(optimizedSvg.data, "utf8");
                svgContents = (await svgOptimizer.optimize(svgContents, { path: resolvedPath })).data;
                // svgContents = optimizeSync(svgContents, resolvedPath).data;
                console.info(`with optimization:`, svgContents);
            }

            return encode(svgContents, { encodingFormat });
        } catch (err) {
            console.error("[node-build-scripts]", err);
        }
    };
}

/**
 * encode the string
 *
 * @param {any} content
 * @param {any} opts
 * @returns {sass.types.String}
 */
function encode(content, opts) {
    if (opts.encodingFormat === "uri") {
        return new sass.types.String(`url("${svgToDataUri(content.toString("UTF-8"))}")`);
    }

    if (opts.encodingFormat === "base64") {
        return new sass.types.String(`url("data:image/svg+xml;base64,${content.toString("base64")})`);
    }

    throw new Error(`[node-build-scripts] encodingFormat ${opts.encodingFormat} is not supported`);
}

/**
 * Change the style of an SVG
 *
 * @param {string} source
 * @param {sass.types.Map} selectorsMap
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
            // @ts-ignore
            Object.assign(element.attribs, newAttributes);
        });
    });

    // return Buffer.from(serialize(document), "utf8");
    return serialize(document);
}

/**
 * Transform a Sass map into a JS object
 *
 * @param {sass.types.Map} map
 * @returns {Record<any, any>}
 */
function mapToObj(map) {
    const obj = Object.create(null);

    for (let i = 0, len = map.getLength(); i < len; i++) {
        // @ts-ignore
        const key = map.getKey(i).getValue();
        let value = map.getValue(i);

        switch (value.constructor.name) {
            case sass.types.Map.name:
                value = mapToObj(/** @type {sass.types.Map} */ (value));
                break;
            case sass.types.Color.name:
                const color = /** @type {sass.types.Color} */ (value);
                if (color.getA() === 1) {
                    value = `rgb(${color.getR()},${color.getG()},${color.getB()})`;
                } else {
                    value = `rgba(${color.getR()},${color.getG()},${color.getB()},${color.getA()})`;
                }
                break;
            default:
                // @ts-ignore
                value = value.getValue();
        }

        obj[key] = value;
    }

    return obj;
}
