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

// @ts-check

import { copyFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import stylelint from "stylelint";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

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
            config,
            files: "test/fixtures/no-prefix-literal/contains-bp3.scss",
        });
        expect(result.errored).toBe(true);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(1);
        expect(warnings[0].line).toBe(1);
        expect(warnings[0].column).toBe(2);
    });

    it("Warns when .bp3 is present (CSS modules)", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/contains-bp3.module.scss",
        });
        expect(result.errored).toBe(true);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(1);
        expect(warnings[0].line).toBe(1);
        expect(warnings[0].column).toBe(10);
    });

    it("Warns when nested .bp3 is present even when not first selector", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/contains-nested-bp3.scss",
        });
        expect(result.errored).toBe(true);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(1);
        expect(warnings[0].line).toBe(2);
        expect(warnings[0].column).toBe(21);
    });

    it("Warns when nested .bp3 is present even when not first selector (CSS modules)", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/contains-nested-bp3.module.scss",
        });
        expect(result.errored).toBe(true);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(1);
        expect(warnings[0].line).toBe(2);
        expect(warnings[0].column).toBe(29);
    });

    it("Doesn't warn bp3 string is present but not as a prefix", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/contains-non-prefix-bp3.scss",
        });
        expect(result.errored).toBe(false);
    });

    it("Doesn't warn bp3 string is present but not as a prefix (CSS modules)", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/contains-non-prefix-bp3.module.scss",
        });
        expect(result.errored).toBe(false);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(0);
    });

    it("Doesn't warn when .bp3 is not present", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/does-not-contain-bp3.scss",
        });
        expect(result.errored).toBe(false);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(0);
    });

    it("Doesn't warn when .bp3 is not present (CSS modules)", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/does-not-contain-bp3.module.scss",
        });
        expect(result.errored).toBe(false);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(0);
    });

    it("Doesn't warn when .bp3 is present but lint rule is disabled", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/contains-bp3-disabled.scss",
        });
        expect(result.errored).toBe(false);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(0);
    });

    it("Accepts a valid secondary config", async () => {
        const result = await stylelint.lint({
            config: {
                plugins: ["@blueprintjs/stylelint-plugin"],
                rules: {
                    "@blueprintjs/no-prefix-literal": [
                        true,
                        { disableFix: true, variablesImportPath: { sass: "some-path" } },
                    ],
                },
            },
            customSyntax: "postcss-scss",
            files: "test/fixtures/no-prefix-literal/contains-bp3.scss",
        });
        expect(result.results[0].invalidOptionWarnings).toHaveLength(0);
    });

    it("Rejects an invalid secondary config", async () => {
        const result = await stylelint.lint({
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
            customSyntax: "postcss-scss",
            files: "test/fixtures/no-prefix-literal/contains-bp3.scss",
        });
        expect(result.results[0].invalidOptionWarnings).toHaveLength(1);
    });

    it("Works for a double bp3 selector", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/no-prefix-literal/contains-double-bp3-selector.scss",
        });
        expect(result.errored).toBe(true);
        const warnings = result.results[0].warnings;
        expect(warnings).toHaveLength(2);
    });

    describe("auto-fixer", () => {
        const tmpDir = join(import.meta.dirname, "tmp", "no-prefix-literal");

        beforeAll(() => {
            mkdirSync(tmpDir, { recursive: true });
        });
        afterAll(() => {
            rmSync(tmpDir, { force: true, recursive: true });
        });

        it("Replaces selector text properly", async () => {
            const fixtureFilename = "contains-bp3.scss";
            // path to the fixture we want to test
            const fixturePath = join(import.meta.dirname, "fixtures", "no-prefix-literal", fixtureFilename);
            // path to a copy of the fixture which we can allow stylelint to mutate
            const mutableFixturePath = join(tmpDir, fixtureFilename);
            copyFileSync(fixturePath, mutableFixturePath);

            const result = await stylelint.lint({
                config,
                files: mutableFixturePath,
                fix: true,
            });
            // there should be no warnings/errors since the fixer should succeed
            expect(result.errored).toBe(false);
            const warnings = result.results[0].warnings;
            expect(warnings).toHaveLength(0);

            const fixedSourceContents = readFileSync(mutableFixturePath, { encoding: "utf-8" });
            expect(fixedSourceContents).toContain(`@use "@blueprintjs/core/lib/scss/variables.scss" as bp;`);
            expect(fixedSourceContents).toContain(".#{bp.$ns}-tag {");
        });
    });
});
