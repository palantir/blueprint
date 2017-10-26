/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const React = require("react");

const generateIsomorphicTests = require("../../../test/isotest");
const DateTime = require("../dist");

describe("DateTime isomorphic rendering", () => {
    generateIsomorphicTests(
        DateTime,
        {},
        {}
    );
});
