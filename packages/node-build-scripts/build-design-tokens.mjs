#!/usr/bin/env node
/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

import { argv } from "node:process";
import yargs from "yargs";

import { buildDesignTokens } from "./src/designTokens.mjs";

const args = yargs(argv.slice(2))
    .usage("$0 <config>")
    .positional("config", {
        type: "string",
        description: "Path to a package-local design token config",
    })
    .check(parsedArgs => parsedArgs._.length === 1 && typeof parsedArgs._[0] === "string")
    .parseSync();

await buildDesignTokens(String(args._[0]));
