#!/usr/bin/env node
/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

import { argv, cwd } from "node:process";
import yargs from "yargs";

import { validateSassVariableMigration } from "./src/sassVariableMigration.mjs";

const args = yargs(argv.slice(2))
    .usage("$0 <config>")
    .positional("config", {
        description: "Path to a Sass-variable migration audit config",
        type: "string",
    })
    .option("write", {
        default: false,
        description: "Refresh the committed ledger before validating it",
        type: "boolean",
    })
    .check(parsedArgs => parsedArgs._.length === 1 && typeof parsedArgs._[0] === "string")
    .parseSync();

const result = await validateSassVariableMigration(String(args._[0]), { repositoryRoot: cwd(), write: args.write });

for (const warning of result.warnings) {
    console.warn(`warning: ${warning}`);
}
for (const error of result.errors) {
    console.error(`error: ${error}`);
}

if (result.errors.length > 0) {
    process.exitCode = 1;
} else {
    console.info(`Validated ${result.entries.length} Sass variable declarations with zero unclassified entries.`);
}
