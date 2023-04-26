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
        "@blueprintjs/no-color-literal": true,
    },
};

describe("no-color-literal", () => {
    it("Warns when blueprint color literal is used (1)", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-color-literal/bp-hex-literal-1.scss",
            config,
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(1);
        expect(warnings[0].line).to.be.eq(2, "line number");
        expect(warnings[0].column).to.be.eq(10, "col number");
    });

    it("Warns when blueprint color literal is used (2)", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-color-literal/bp-hex-literal-2.scss",
            config,
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(1);
        expect(warnings[0].line).to.be.eq(5, "line number");
        expect(warnings[0].column).to.be.eq(21, "col number");
    });

    it("Doesn't warn when non-blueprint color literal is used", async () => {
        const result = await stylelint.lint({
            files: "test/fixtures/no-color-literal/non-bp-hex-literal.scss",
            config,
        });
        expect(result.errored).to.be.false;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(0);
    });
});
