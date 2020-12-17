/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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

const { generateFonts, FontAssetType } = require("fantasticon");
const path = require("path");

generateFonts({
    name: "icons-16",
    inputDir: path.resolve(__dirname, "../../../resources/icons/16px"),
    outputDir: path.resolve(__dirname, "../resources/generated/"),
    fontTypes: [FontAssetType.TTF, FontAssetType.EOT, FontAssetType.WOFF2, FontAssetType.WOFF],
    // assetTypes: [OtherAssetType.CSS, OtherAssetType.HTML, OtherAssetType.JSON, OtherAssetType.TS],
    formatOptions: { json: { indent: 2 } },
    // templates: {},
    // pathOptions: {},
    // codepoints: {},
    fontHeight: 16,
    // round: undefined,
    // descent: undefined, // Will use `svgicons2svgfont` defaults
    // normalize: undefined, // --
    // selector: null,
    tag: "i",
    prefix: "icon",
    // fontsUrl: null,
}).then(results => {
    console.info(results);
});
