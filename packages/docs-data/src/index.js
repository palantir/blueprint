/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * @fileoverview Exports JSON data for packages/docs-app
 */

module.exports = {
    docsData: require("./generated/docs.json"),
    PACKAGES: ["blueprint", "core", "datetime", "icons", "select", "table", "labs"],
    SECTIONS: ["components", "context", "hooks", "legacy", "form-controls", "form-inputs", "overlays"],
};
