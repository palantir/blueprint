/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const DateTime = require("../dist");

describe("DateTime isomorphic rendering", () => {
    generateIsomorphicTests(
        DateTime,
        {},
        {}
    );
});
