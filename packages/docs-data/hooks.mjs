/*
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import { statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @typedef {{ conditions: string[], importAttributes: object; parentURL: string }} ResolveContext
 * @typedef {{ format?: string | null, importAttributes: any, shortCircuit?: boolean, url: string }} ResolveResult
 */

/**
 *
 * @param {string} specifier
 * @param {ResolveContext} context
 * @param {(specifier: string, context: ResolveContext) => ResolveResult} nextResolve
 * @returns {ResolveResult}
 */
export async function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
        const { parentURL } = context;
        const parentPath = fileURLToPath(parentURL);
        const parenterDir = dirname(parentPath);

        if (extname(specifier) === "") {
            try {
                const specifierStat = statSync(join(parenterDir, specifier));
                if (specifierStat.isDirectory()) {
                    // console.info("attempting append /index.js", specifier);
                    return {
                        ...nextResolve(`${specifier}/index.js`, context),
                        format: "module",
                    };
                }
            } catch {
                // console.info("attempting append .js", specifier, context);
                return {
                    ...nextResolve(`${specifier}.js`, context),
                    format: "module",
                };
            }

            // try {
            //     console.info("attempting append .js", specifier, context);
            //     const resolved = nextResolve(`${specifier}.js`, context);
            //     return resolved;
            // } catch {
            //     console.info("attempting append /index.js", specifier);
            //     return nextResolve(`${specifier}/index.js`, context);
            // }
        }
    } else {
        if (/^@blueprintjs\/([a-zA-Z]+)$/.test(specifier)) {
            const newSpecifier = `${specifier}/lib/esm/index.js`;
            console.info("******* blueprint module ****", specifier, context);
            const nextResult = await nextResolve(newSpecifier, context);
            console.info(nextResult);
            return {
                ...nextResult,
                format: "module",
            };
        }
        // if (/^@popperjs\/([a-zA-Z]+)$/.test(specifier)) {
        //     console.log("******* POPPER *********", specifier, context);
        //     const newSpecifier = `${specifier}/lib/index.js`;
        //     return nextResolve(newSpecifier, context);
        // }
    }

    // Defer to the next hook in the chain, which would be the
    // Node.js default resolve if this is the last user-specified loader.
    return nextResolve(specifier);
}
