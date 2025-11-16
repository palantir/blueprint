/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import path from "path";
import { fileURLToPath } from "url";

import type { InstallConfig } from "../types.js";
import { copyFile, ensureDirectory, readFile, writeFile } from "../utils/file-utils.js";

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

export async function installScss(config: InstallConfig): Promise<void> {
    // Ensure styles directory exists
    await ensureDirectory(config.stylesPath);

    // Copy tokens.scss from @blueprintjs/core package (tokens are now bundled in core)
    const tokensSource = path.join(
        process.cwd(),
        "node_modules",
        "@blueprintjs/core",
        "lib",
        "tokens",
        "tokens.scss",
    );
    const tokensDestination = path.join(config.stylesPath, "tokens.scss");
    await copyFile(tokensSource, tokensDestination);

    // Read blueprint.scss template
    const templatePath = path.join(currentDirname, "../templates/blueprint.scss.template");
    const template = await readFile(templatePath);

    // Write blueprint.scss
    const blueprintPath = path.join(config.stylesPath, "blueprint.scss");
    await writeFile(blueprintPath, template);
}
