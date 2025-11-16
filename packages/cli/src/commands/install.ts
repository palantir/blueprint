/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { installCSS } from "../installers/css-installer.js";
import { installScss } from "../installers/scss-installer.js";
import type { InstallOptions } from "../types.js";
import { promptInstallConfig, showError, showSuccess } from "../ui/prompts.js";
import { detectPackageManager, installPackages } from "../utils/package-manager.js";

export async function installCommand(options: InstallOptions): Promise<void> {
    try {
        // Get configuration (interactive or from options)
        const config = options.yes
            ? {
                  format: options.format || "scss",
                  packageManager: await detectPackageManager(),
                  stylesPath: options.path || "./src/styles",
              }
            : {
                  ...(await promptInstallConfig(options.path)),
                  packageManager: await detectPackageManager(),
              };

        // Install npm packages
        await installPackages(["@blueprintjs/core", "@blueprintjs/tokens"], config.packageManager);

        // Set up files based on format
        if (config.format === "scss") {
            await installScss(config);
        } else {
            await installCSS(config);
        }

        // Show success message
        showSuccess(config);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        showError(`Installation failed: ${message}`);
    }
}
