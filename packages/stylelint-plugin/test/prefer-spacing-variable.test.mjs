/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { expect } from "chai";
import { copyFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import stylelint from "stylelint";

const config = {
    customSyntax: "postcss-scss",
    plugins: ["@blueprintjs/stylelint-plugin"],
    rules: {
        "@blueprintjs/prefer-spacing-variable": true,
    },
};

describe("prefer-spacing-variable", () => {
    it("Warns when $pt-grid-size is used directly", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-simple.scss",
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(1);
        expect(warnings[0].line).to.be.eq(2, "line number");
        expect(warnings[0].text).to.include("$pt-spacing");
        expect(warnings[0].text).to.include("deprecated");
    });

    it("Warns when $pt-grid-size is used with multipliers", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-multiplier.scss",
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(3); // Three usages in the file
        expect(warnings[0].line).to.be.eq(2);
        expect(warnings[1].line).to.be.eq(3);
        expect(warnings[2].line).to.be.eq(4);
    });

    it("Warns when $pt-grid-size is used in calc() expressions", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-calc.scss",
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(2); // Two calc expressions
        expect(warnings[0].line).to.be.eq(2);
        expect(warnings[1].line).to.be.eq(3);
    });

    it("Warns when $pt-grid-size is used with division", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-division.scss",
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(2); // Two division expressions
        expect(warnings[0].line).to.be.eq(2);
        expect(warnings[1].line).to.be.eq(3);
    });

    it("Warns when $pt-grid-size is used in complex expressions", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-complex.scss",
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings.length).to.be.greaterThan(0);
    });

    it("Warns when namespaced bp.$pt-grid-size is used", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-namespaced-grid-size.scss",
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(3); // Three usages in the file
        expect(warnings[0].line).to.be.eq(4);
        expect(warnings[1].line).to.be.eq(5);
        expect(warnings[2].line).to.be.eq(6);
    });

    it("Warns when left-side multipliers are used", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-left-multipliers.scss",
        });
        expect(result.errored).to.be.true;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(3); // Three usages in the file
    });

    it("Doesn't warn when $pt-grid-size is not present", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/does-not-contain-grid-size.scss",
        });
        expect(result.errored).to.be.false;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(0);
    });

    it("Doesn't warn when $pt-grid-size is present but lint rule is disabled", async () => {
        const result = await stylelint.lint({
            config,
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-disabled.scss",
        });
        expect(result.errored).to.be.false;
        const warnings = result.results[0].warnings;
        expect(warnings).lengthOf(0);
    });

    it("Accepts a valid secondary config", async () => {
        const result = await stylelint.lint({
            config: {
                plugins: ["@blueprintjs/stylelint-plugin"],
                rules: {
                    "@blueprintjs/prefer-spacing-variable": [
                        true,
                        { disableFix: true, variablesImportPath: { sass: "some-path" } },
                    ],
                },
            },
            customSyntax: "postcss-scss",
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-simple.scss",
        });
        expect(result.results[0].invalidOptionWarnings).to.have.lengthOf(0);
    });

    it("Rejects an invalid secondary config", async () => {
        const result = await stylelint.lint({
            config: {
                plugins: ["@blueprintjs/stylelint-plugin"],
                rules: {
                    "@blueprintjs/prefer-spacing-variable": [
                        true,
                        {
                            disableFix: "yes",
                            variablesImportPath: { scss: "some-path", somethingElse: "some-other-path" },
                        },
                    ],
                },
            },
            customSyntax: "postcss-scss",
            files: "test/fixtures/prefer-spacing-variable/contains-grid-size-simple.scss",
        });
        expect(result.results[0].invalidOptionWarnings.length).to.be.eq(1);
    });

    describe("auto-fixer", () => {
        const tmpDir = join(import.meta.dirname, "tmp");

        before(() => {
            mkdirSync(tmpDir);
        });
        after(() => {
            rmSync(tmpDir, { force: true, recursive: true });
        });

        it("Replaces simple $pt-grid-size with $pt-spacing", async () => {
            const fixtureFilename = "contains-grid-size-simple.scss";
            const fixturePath = join(import.meta.dirname, "fixtures", "prefer-spacing-variable", fixtureFilename);
            const mutableFixturePath = join(tmpDir, fixtureFilename);
            copyFileSync(fixturePath, mutableFixturePath);

            const result = await stylelint.lint({
                config,
                files: mutableFixturePath,
                fix: true,
            });

            expect(result.errored).to.be.false;
            const warnings = result.results[0].warnings;
            expect(warnings).to.have.lengthOf(0);

            const fixedSourceContents = readFileSync(mutableFixturePath, { encoding: "utf-8" });

            expect(fixedSourceContents).to.contain("$pt-spacing");
            expect(fixedSourceContents).to.not.contain("$pt-grid-size");
        });

        it("Replaces $pt-grid-size with multipliers and adjusts values", async () => {
            const fixtureFilename = "contains-grid-size-multiplier.scss";
            const fixturePath = join(import.meta.dirname, "fixtures", "prefer-spacing-variable", fixtureFilename);
            const mutableFixturePath = join(tmpDir, fixtureFilename);
            copyFileSync(fixturePath, mutableFixturePath);

            const result = await stylelint.lint({
                config,
                files: mutableFixturePath,
                fix: true,
            });

            expect(result.errored).to.be.false;
            const warnings = result.results[0].warnings;
            expect(warnings).to.have.lengthOf(0);

            const fixedSourceContents = readFileSync(mutableFixturePath, { encoding: "utf-8" });

            expect(fixedSourceContents).to.contain("$pt-spacing * 5"); // 2 * 2.5
            expect(fixedSourceContents).to.contain("$pt-spacing * 1.25"); // 0.5 * 2.5
            expect(fixedSourceContents).to.contain("$pt-spacing * 3.75"); // 1.5 * 2.5
            expect(fixedSourceContents).to.not.contain("$pt-grid-size");
        });

        it("Replaces $pt-grid-size in calc() expressions", async () => {
            const fixtureFilename = "contains-grid-size-calc.scss";
            const fixturePath = join(import.meta.dirname, "fixtures", "prefer-spacing-variable", fixtureFilename);
            const mutableFixturePath = join(tmpDir, fixtureFilename);
            copyFileSync(fixturePath, mutableFixturePath);

            const result = await stylelint.lint({
                config,
                files: mutableFixturePath,
                fix: true,
            });

            expect(result.errored).to.be.false;
            const warnings = result.results[0].warnings;
            expect(warnings).to.have.lengthOf(0);

            const fixedSourceContents = readFileSync(mutableFixturePath, { encoding: "utf-8" });

            expect(fixedSourceContents).to.contain("$pt-spacing");
            expect(fixedSourceContents).to.not.contain("$pt-grid-size");
        });

        it("Replaces $pt-grid-size with division and adjusts values", async () => {
            const fixtureFilename = "contains-grid-size-division.scss";
            const fixturePath = join(import.meta.dirname, "fixtures", "prefer-spacing-variable", fixtureFilename);
            const mutableFixturePath = join(tmpDir, fixtureFilename);
            copyFileSync(fixturePath, mutableFixturePath);

            const result = await stylelint.lint({
                config,
                files: mutableFixturePath,
                fix: true,
            });

            expect(result.errored).to.be.false;
            const warnings = result.results[0].warnings;
            expect(warnings).to.have.lengthOf(0);

            const fixedSourceContents = readFileSync(mutableFixturePath, { encoding: "utf-8" });

            expect(fixedSourceContents).to.contain("$pt-spacing / 0.8"); // 2 / 2.5
            expect(fixedSourceContents).to.contain("$pt-spacing / 1.6"); // 4 / 2.5
            expect(fixedSourceContents).to.not.contain("$pt-grid-size");
        });

        it("Replaces namespaced bp.$pt-grid-size variables", async () => {
            const fixtureFilename = "contains-namespaced-grid-size.scss";
            const fixturePath = join(import.meta.dirname, "fixtures", "prefer-spacing-variable", fixtureFilename);
            const mutableFixturePath = join(tmpDir, fixtureFilename);
            copyFileSync(fixturePath, mutableFixturePath);

            const result = await stylelint.lint({
                config,
                files: mutableFixturePath,
                fix: true,
            });

            expect(result.errored).to.be.false;
            const warnings = result.results[0].warnings;
            expect(warnings).to.have.lengthOf(0);

            const fixedSourceContents = readFileSync(mutableFixturePath, { encoding: "utf-8" });
            expect(fixedSourceContents).to.contain("bp.$pt-spacing");
            expect(fixedSourceContents).to.not.contain("bp.$pt-grid-size");
        });

        it("Replaces left-side multipliers correctly", async () => {
            const fixtureFilename = "contains-left-multipliers.scss";
            const fixturePath = join(import.meta.dirname, "fixtures", "prefer-spacing-variable", fixtureFilename);
            const mutableFixturePath = join(tmpDir, fixtureFilename);
            copyFileSync(fixturePath, mutableFixturePath);

            const result = await stylelint.lint({
                config,
                files: mutableFixturePath,
                fix: true,
            });

            expect(result.errored).to.be.false;
            const warnings = result.results[0].warnings;
            expect(warnings).to.have.lengthOf(0);

            const fixedSourceContents = readFileSync(mutableFixturePath, { encoding: "utf-8" });
            expect(fixedSourceContents).to.contain("5 * $pt-spacing"); // 2 * 2.5
            expect(fixedSourceContents).to.contain("1.25 * $pt-spacing"); // 0.5 * 2.5
            expect(fixedSourceContents).to.contain("3.75 * $pt-spacing"); // 1.5 * 2.5
            expect(fixedSourceContents).to.not.contain("$pt-grid-size");
        });
    });
});
