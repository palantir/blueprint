/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

import { describe, expect, test } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { generateLessVariables, generateScssVariables, getParsedVars } from "../cssVariables.mjs";

const FIXTURES_DIR = join(__dirname, "__fixtures__");
const INPUT_DIR = resolve(FIXTURES_DIR, "input");
const EXPECTED_DIR = resolve(FIXTURES_DIR, "expected");

describe("generateScssVariables", () => {
    test("produces expected output", async () => {
        const parsedInput = await getParsedVars(INPUT_DIR, ["_variables.scss"]);
        const actualVariables = await generateScssVariables(parsedInput, true);
        const expectedVariables = readFileSync(join(EXPECTED_DIR, "variables.scss"), { encoding: "utf8" });
        expect(actualVariables).toStrictEqual(expectedVariables);
    });
});

describe("generateLessVariables", () => {
    test("produces expected output", async () => {
        const parsedInput = await getParsedVars(INPUT_DIR, ["_variables.scss"]);
        const actualVariables = await generateLessVariables(parsedInput);
        const expectedVariables = readFileSync(join(EXPECTED_DIR, "variables.less"), { encoding: "utf8" });
        expect(actualVariables).toStrictEqual(expectedVariables);
    });
});
