/* Copyright 2020 Palantir Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.*/

// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require("chai");
const stylelint = require("stylelint");

const config = {
    plugins: ["@blueprintjs/stylelint-plugin"],
    rules: {
        "@blueprintjs/no-prefix-literal": true,
        "at-rule-semicolon-newline-after": "always",
    },
};

it("Warns when .bp3 is present", async () => {
    const result = await stylelint.lint({
        files: "test/fixtures/contains-bp3.scss",
        config,
    });
    expect(result.errored).to.be.true;
});

it("Warns when nested .bp3 is present even when not first selector", async () => {
    const result = await stylelint.lint({
        files: "test/fixtures/contains-nested-bp3.scss",
        config,
    });
    expect(result.errored).to.be.true;
});

it("Doesn't warn bp3 string is present but not as a prefix", async () => {
    const result = await stylelint.lint({
        files: "test/fixtures/contains-non-prefix-bp3.scss",
        config,
    });
    expect(result.errored).to.be.false;
});

it("Doesn't warn when .bp3 is not present", async () => {
    const result = await stylelint.lint({
        files: "test/fixtures/does-not-contain-bp3.scss",
        config,
    });
    expect(result.errored).to.be.false;
});
