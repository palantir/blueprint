/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// @ts-check
const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const Icons = require("../lib/cjs");

describe("Icons isomorphic rendering", () => {
    generateIsomorphicTests(Icons);
});
