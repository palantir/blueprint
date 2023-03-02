/**
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 */

        // "test": "yarn node --experimental-vm-modules $(yarn bin jest)"
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
// import { fileURLToPath } from "node:url";

import { generateScssVariables, getParsedVars } from "../cssVariables.mjs";

const FIXTURES_DIR = join(__dirname, "__fixtures__");
const INPUT_DIR = resolve(FIXTURES_DIR, "input");
const EXPECTED_DIR = resolve(FIXTURES_DIR, "expected");

describe("generateScssVariables", () => {
    it("produces expected output", async () => {
        const parsedInput = await getParsedVars(INPUT_DIR, ["_variables.scss"]);
        const actualVariables = generateScssVariables(parsedInput, true);
        const expectedVariables = readFileSync(join(EXPECTED_DIR, "variables.scss"), { encoding: "utf8" });
        expect(actualVariables).toStrictEqual(expectedVariables);
    });
});
