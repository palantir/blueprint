/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require("chai");
const stylelint = require("stylelint");

const config = {
    customSyntax: "postcss-scss",
    plugins: ["@blueprintjs/stylelint-plugin"],
    rules: {
        "@blueprintjs/no-prefix-literal": true,
    },
};

describe("no-prefix-literal", () => {
    it("Warns when .bp3 is present", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-bp3.scss",
            config,
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(1);
        expect(warnings[0].line).to.be.eq(1);
        expect(warnings[0].column).to.be.eq(2);
    });

    it("Warns when .bp3 is present (CSS modules)", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-bp3.module.scss",
            config,
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(1);
        expect(warnings[0].line).to.be.eq(1);
        expect(warnings[0].column).to.be.eq(10);
    });

    it("Warns when nested .bp3 is present even when not first selector", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-nested-bp3.scss",
            config,
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(1);
        expect(warnings[0].line).to.be.eq(2);
        expect(warnings[0].column).to.be.eq(21);
    });

    it("Warns when nested .bp3 is present even when not first selector (CSS modules)", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-nested-bp3.module.scss",
            config,
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(1);
        expect(warnings[0].line).to.be.eq(2);
        expect(warnings[0].column).to.be.eq(29);
    });

    it("Doesn't warn bp3 string is present but not as a prefix", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-non-prefix-bp3.scss",
            config,
        });
        expect(result.errored).to.be.false;
    });

    it("Doesn't warn bp3 string is present but not as a prefix (CSS modules)", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-non-prefix-bp3.module.scss",
            config,
        });
        expect(result.errored).to.be.false;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(0);
    });

    it("Doesn't warn when .bp3 is not present", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/does-not-contain-bp3.scss",
            config,
        });
        expect(result.errored).to.be.false;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(0);
    });

    it("Doesn't warn when .bp3 is not present (CSS modules)", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/does-not-contain-bp3.module.scss",
            config,
        });
        expect(result.errored).to.be.false;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(0);
    });

    it("Doesn't warn when .bp3 is present but lint rule is disabled", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-bp3-disabled.scss",
            config,
        });
        expect(result.errored).to.be.false;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(0);
    });

    it("Accepts a valid secondary config", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-bp3.scss",
            config: {
                plugins: ["@blueprintjs/stylelint-plugin"],
                rules: {
                    "@blueprintjs/no-prefix-literal": [
                        true,
                        { disableFix: true, variablesImportPath: { sass: "some-path" } },
                    ],
                },
            },
        });
        expect(result.results[0].invalidOptionWarnings.length).to.be.eq(0);
    });

    it("Rejects an invalid secondary config", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-bp3.scss",
            config: {
                plugins: ["@blueprintjs/stylelint-plugin"],
                rules: {
                    "@blueprintjs/no-prefix-literal": [
                        true,
                        {
                            disableFix: "yes",
                            variablesImportPath: { scss: "some-path", somethingElse: "some-other-path" },
                        },
                    ],
                },
            },
        });
        expect(result.results[0].invalidOptionWarnings.length).to.be.eq(1);
    });

    it("Works for a double bp3 selector", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-prefix-literal/contains-double-bp3-selector.scss",
            config,
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(2);
    });
});
