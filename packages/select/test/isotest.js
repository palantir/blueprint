/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// @ts-check
const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const Select = require("../lib/cjs");

describe("Select isomorphic rendering", () => {
    generateIsomorphicTests(Select, {
        MultiSelect: {
            props: { items: [], query: "", selectedItems: [], tagRenderer: () => null },
        },
        QueryList: {
            // needs at least one handler or it returns undefined
            props: { renderer: () => null },
            skip: true,
        },
        Select: {
            props: { items: [] },
        },
        Suggest: {
            props: { items: [] },
        },
        Omnibar: {
            props: { items: [], isOpen: true, overlayProps: { usePortal: false } },
        },
        QueryList: {
            skip: true,
        }
    });
});
