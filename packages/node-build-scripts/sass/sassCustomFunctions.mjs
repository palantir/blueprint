/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import sass from "sass";

import { sassSvgInlinerFactory } from "./sassSvgInliner.mjs";

/** @type {sass.CustomFunction<"async">} */
const svgIconInliner = sassSvgInlinerFactory("../../resources/icons", {
    // run through SVGO first
    optimize: true,
    // minimal "uri" encoding is smaller than base64
    encodingFormat: "uri",
});

/** @type {Record<string, sass.CustomFunction<"async">>} */
export default {
    /**
     * Sass function to inline a UI icon svg and change its path color.
     *
     * Usage:
     * svg-icon("16px/icon-name.svg", (path: (fill: $color)) )
     *
     * TODO(adahiya): ensure this works when this script is invoked outside of the Blueprint monorepo?
     */
    "svg-icon($path, $selectors: null)": svgIconInliner,
};
