/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
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
    "jquery": "$",
    "moment": "moment",
    "moment-timezone": "moment",
    "react": "React",
    "react-transition-group": "ReactTransitionGroup",
    "react-day-picker": "DayPicker",
    "react-dom": "ReactDOM",
    "tslib": "tslib",
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
