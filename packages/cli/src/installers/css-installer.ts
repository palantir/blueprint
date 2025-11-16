/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import path from "path";
import { fileURLToPath } from "url";

import type { InstallConfig } from "../types.js";
import { copyFile, ensureDirectory, readFile, writeFile } from "../utils/file-utils.js";

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

export async function installCSS(config: InstallConfig): Promise<void> {
    // Ensure styles directory exists
    await ensureDirectory(config.stylesPath);

    // Copy tokens.css from @blueprintjs/tokens package
    const tokensCSSSource = path.join(
        process.cwd(),
        "node_modules",
        "@blueprintjs/tokens",
        "dist",
        "tokens.css",
    );
    const tokensCSSDestination = path.join(config.stylesPath, "tokens.css");
    await copyFile(tokensCSSSource, tokensCSSDestination);

    // Read blueprint.css template
    const templatePath = path.join(currentDirname, "../templates/blueprint.css.template");
    const template = await readFile(templatePath);

    // Write blueprint.css
    const blueprintPath = path.join(config.stylesPath, "blueprint.css");
    await writeFile(blueprintPath, template);
}
