/*
 * Copyright 2019 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const inliner = require("@vgrid/sass-inline-svg");

module.exports = {
    /**
     * Sass function to inline a UI icon svg and change its path color.
     *
     * Usage:
     * svg-icon("16px/icon-name.svg", (path: (fill: $color)) )
     */
    "svg-icon($path, $selectors: null)": inliner("../../resources/icons", {
        // run through SVGO first
        optimize: true,
        // minimal "uri" encoding is smaller than base64
        encodingFormat: "uri",
    }),
};
