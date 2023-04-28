/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

// @ts-check

import sass from "sass";

import { sassSvgInlinerFactory } from "./sassSvgInliner.mjs";

/** @type {Record<string, sass.CustomFunction<"async">>} */
export default {
    /**
     * Sass function to inline a UI icon svg and change its path color.
     *
     * Usage in Sass code:
     * svg-icon("16px/icon-name.svg", (path: (fill: $color)) )
     *
     * Note that this conly works inside the Blueprint monorepo, where we have access to the resources/icons folder.
     */
    "svg-icon($path, $selectors: null)": sassSvgInlinerFactory("../../resources/icons", {
        // run through SVGO first
        optimize: true,
        // minimal "uri" encoding is smaller than base64
        encodingFormat: "uri",
    }),
};
