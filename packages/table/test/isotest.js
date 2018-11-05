/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// @ts-check
const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const Table = require("../lib/cjs");

describe("Table isomorphic rendering", () => {
    generateIsomorphicTests(
        Table,
        {
            // Pass-through renders
            DragSelectable: { skip: true },
            Draggable: { skip: true },
            // needs at least one handler or it returns undefined
            ResizeHandle: { props: { onDoubleClick: () => undefined } },
        }
    );
});
