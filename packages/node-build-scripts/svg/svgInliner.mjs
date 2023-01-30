/*
 * (c) Copyright 2023 Palantir Technologies Inc. All rights reserved.
 */

/**
 * @fileoverview adapted from a fork of sass-inline-svg which implements dart-sass support
 * @see https://github.com/Liquid-JS/sass-inline-svg/blob/958bd0e27782d46349da7d8a831467257d4130d1/index.js
 */

import selectAll, { selectOne } from "css-select";
import serialize from "dom-serializer";
import { parseDOM } from "htmlparser2";
import svgToDataUri from "mini-svg-data-uri";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sass from "sass";

import { optimizeSync } from "./svgOptimizer.mjs";

const defaultOptions = {
    optimize: false,
    encodingFormat: "base64",
};

/**
 * The SVG inliner function
 * This is a factory that expects a base path abd returns the actual function
 *
 * @param base
 * @param opts {{optimize: boolean, encodingFormat: string}}
 * @returns {Function}
 */
export function svgInliner(base, opts) {
    opts = {
        ...defaultOptions,
        ...opts,
    };

    return function (path, selectors) {
        try {
            let svgContents = readFileSync(resolve(base, path.getValue()), { encoding: "utf8" });

            if (selectors && selectors.getLength && selectors.getLength()) {
                svgContents = changeStyle(svgContents, selectors);
            }

            if (opts.optimize) {
                const optimizedSvg = optimizeSync(svgContents);
                svgContents = Buffer.from(optimizedSvg.data, "utf8");
            }

            return encode(svgContents, {
                encodingFormat: opts.encodingFormat,
            });
        } catch (err) {
            console.log(err);
        }
    };
}

/**
 * encode the string
 *
 * @param content
 * @param opts
 * @returns {sass.types.String}
 */
function encode(content, opts) {
    if (opts.encodingFormat === "uri") {
        return new sass.types.String(`url("${svgToDataUri(content.toString("UTF-8"))}")`);
    }

    if (opts.encodingFormat === "base64") {
        return new sass.types.String(`url("data:image/svg+xml;base64,${content.toString("base64")})`);
    }

    throw new Error("encodingFormat " + opts.encodingFormat + " is not supported");
}

/**
 * change the style of the svg
 *
 * @param source
 * @param styles
 * @returns {*}
 */
function changeStyle(source, selectors) {
    const dom = parseDOM(source, {
        xmlMode: true,
    });
    const svg = dom ? selectOne("svg", dom) : null;

    selectors = mapToObj(selectors);

    if (!svg) {
        throw Error("Invalid svg file");
    }

    Object.keys(selectors).forEach(function (selector) {
        const elements = selectAll(selector, svg);
        const attribs = selectors[selector];

        elements.forEach(function (element) {
            // @ts-ignore
            element.attribs = { ...attribs };
        });
    });

    return Buffer.from(serialize(dom), "utf8");
}

/**
 * transform a sass map into a js object
 *
 * @param map
 * @returns {null}
 */
function mapToObj(map) {
    const obj = Object.create(null);

    for (let i = 0, len = map.getLength(); i < len; i++) {
        const key = map.getKey(i).getValue();
        let value = map.getValue(i);

        switch (value.constructor.name) {
            case sass.types.Map.name:
                value = mapToObj(value);
                break;
            case sass.types.Color.name:
                if (value.getA() === 1) {
                    value = `rgb(${value.getR()},${value.getG()},${value.getB()})`;
                } else {
                    value = `rgba(${value.getR()},${value.getG()},${value.getB()},${value.getA()})`;
                }
                break;
            default:
                value = value.getValue();
        }

        obj[key] = value;
    }

    return obj;
}
