/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const { generateIsomorphicTests } = require("@blueprintjs/test-commons");
const React = require("react");
const DateTime = require("../lib/cjs");

describe("DateTime isomorphic rendering", () => {
    const formatProps = {
        formatDate: date => date.toLocaleString(),
        parseDate: str => new Date(Date.parse(str)),
        placeholder: "enter date",
    };

    generateIsomorphicTests(
        DateTime,
        {
            DateInput: { props: formatProps },
            DateRangeInput: { props: formatProps },
        }
    );
});
