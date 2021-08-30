#!/usr/bin/env node
/** Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");
const sass = require("sass");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs.parse(hideBin(process.argv));

let functions;
if (argv.functions) {
    const functionsPath = path.join(process.cwd(), argv.functions);
    try {
        functions = require(functionsPath);
    } catch (ex) {
        console.log(`Could not find ${functionsPath}`);
        process.exit(1);
    }
}

function compileFile({ input, functions, output }) {
    if (output && !output.endsWith(".css")) {
        output = path.join(output, path.basename(input).replace(/\.s[ac]ss$/, ".css"));
    } else if (!output) {
        output = input.replace(/\.s[ac]ss$/, ".css");
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const results = sass.renderSync({
        includePaths: [path.join(process.cwd(), "../../node_modules")],
        file: path.join(process.cwd(), input),
        functions,
    });
    fs.writeFileSync(output, results.css);
    return results;
}

function debounce(func, time) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), time);
        return () => clearTimeout(timeout);
    };
}

function compileDirectory({ input, functions, output }) {
    const files = fs.readdirSync(input).map(value => path.join(input, value));
    files
        .filter(value => !path.basename(value).startsWith("_") && value.match(/\.s[ac]ss$/))
        .forEach(value => compileFile({ input: value, functions, output }));
    files
        .filter(value => fs.statSync(value).isDirectory())
        .forEach(value => compileDirectory({ input: value, functions, output }));
}

const debouncedCompileDirectory = debounce(compileDirectory, 500);

function compilePath({ input, functions, output, watch }) {
    output = output || input.replace(/\.s[ac]ss$/, ".css");
    const inputStat = fs.statSync(input);
    if (!inputStat.isDirectory()) {
        const result = compileFile({ input, functions, output });
        if (watch) {
            const watcher = chokidar.watch(result.stats.includedFiles);
            watcher.once("ready", () => {
                watcher.on("all", (event, payload) => {
                    const result = compileFile({ input, functions, output });
                });
            });
        }
    } else {
        if (watch) {
            const watcher = chokidar.watch(input);
            console.log(`watching ${input}`);
            // don't initiate the watcher until after we've received ready, to avoid tons of
            // pointless recompilations
            watcher.once("ready", () => {
                compileDirectory({ input, functions, output });
                watcher.on("all", () => {
                    debouncedCompileDirectory({ input, functions, output });
                });
            });
        } else {
            compileDirectory({ input, functions, output });
        }
    }
}

let output = process.env.OUTPUT || path.join(process.cwd(), "lib/css");

for (const pair of argv._) {
    const [input, _output] = pair.split(":");
    output = _output || output;
    compilePath({ input, functions, output, watch: argv.watch });
}
