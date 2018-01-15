/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const Select = require("../lib/cjs");

const customChildren = {
};

const customProps = {
    MultiSelect: {
        items: [],
        query: "",
        selectedItems: [],
        tagRenderer: () => null,
    },
    QueryList: {
        // needs at least one handler or it returns undefined
        renderer: () => null
    },
    Select: {
        items: []
    },
    Suggest: {
        items: []
    }
};

describe("Select isomorphic rendering", () => {
    generateIsomorphicTests(
        Select,
        customProps,
        customChildren
    );
});
