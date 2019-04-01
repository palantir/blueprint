/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

module.exports = externalize({
    "@blueprintjs/core": ["Blueprint", "Core"],
    "@blueprintjs/icons": ["Blueprint", "Icons"],
    "@blueprintjs/datetime": ["Blueprint", "Datetime"],
    "@blueprintjs/labs": ["Blueprint", "Labs"],
    "@blueprintjs/select": ["Blueprint", "Select"],
    "@blueprintjs/table": ["Blueprint", "Table"],
    "@blueprintjs/timezone": ["Blueprint", "Timezone"],
    "classnames": "classNames",
    "dom4": "window",
    "moment": "moment",
    "moment-timezone": "moment",
    "popper.js": "Popper",
    "react": "React",
    "react-day-picker": "DayPicker",
    "react-dom": "ReactDOM",
    "react-popper": "ReactPopper",
    "react-transition-group": "ReactTransitionGroup",
    "resize-observer-polyfill": "ResizeObserver",
    "tslib": "window",
});

/**
 * Generates a full webpack `external` listing declaring names for various module formats.
 * @param {Record<string, string | string[]>} externals
 */
function externalize(externals) {
    const newExternals = {}
    for (const pkgName in externals) {
        if (externals.hasOwnProperty(pkgName)) {
            newExternals[pkgName] = {
                commonjs: pkgName,
                commonjs2: pkgName,
                amd: pkgName,
                root: externals[pkgName],
            }
        }
    }
    return newExternals;
}
