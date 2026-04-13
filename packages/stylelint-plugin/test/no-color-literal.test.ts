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

import stylelint from "stylelint";
import { describe, expect, it } from "vitest";

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
            config,
            files: "test/fixtures/no-color-literal/bp-hex-literal-1.scss",
        });
        expect(result.errored).toBe(true);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(1);
        expect(warnings[0].line).toBe(2);
        expect(warnings[0].column).toBe(10);
    });

    it("Warns when blueprint color literal is used (2)", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-color-literal/bp-hex-literal-2.scss",
        });
        expect(result.errored).toBe(true);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(1);
        expect(warnings[0].line).toBe(5);
        expect(warnings[0].column).toBe(21);
    });

    it("Doesn't warn when non-blueprint color literal is used", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-color-literal/non-bp-hex-literal.scss",
        });
        expect(result.errored).toBe(false);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(0);
    });
});
