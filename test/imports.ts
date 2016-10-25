/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 */

/*
Quick explanation of what's going on here:

This file imports every Blueprint package with JS exports to ensure that the typings can be consumed by various
TypeScript project configurations. A Gulp task at the bottom of `gulp/typescript.js` attempts to compile this file
in TypeScript 2.0 with `--strictNullChecks`.
*/

// import each blueprint package that provides JS exports to ensure that the typings can be consumed
import * as Blueprint from "../packages/core/build/src";
import * as BlueprintDateTime from "../packages/datetime/build/src";

console.log(
    Blueprint,
    BlueprintDateTime,
);
