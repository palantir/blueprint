/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { execaCommand } from "execa";
import fs from "fs-extra";
import path from "path";

import type { PackageManager } from "../types.js";

export async function detectPackageManager(): Promise<PackageManager> {
    // Check for lock files
    if (await fs.pathExists(path.join(process.cwd(), "pnpm-lock.yaml"))) {
        return "pnpm";
    }
    if (await fs.pathExists(path.join(process.cwd(), "yarn.lock"))) {
        return "yarn";
    }
    if (await fs.pathExists(path.join(process.cwd(), "package-lock.json"))) {
        return "npm";
    }

    // Fallback to checking which is installed
    try {
        await execaCommand("pnpm --version", { stdio: "ignore" });
        return "pnpm";
    } catch {
        // pnpm not available
    }

    try {
        await execaCommand("yarn --version", { stdio: "ignore" });
        return "yarn";
    } catch {
        // yarn not available
    }

    return "npm";
}

export async function installPackages(
    packages: string[],
    packageManager: PackageManager,
): Promise<void> {
    const commands: Record<PackageManager, string> = {
        npm: `npm install ${packages.join(" ")}`,
        pnpm: `pnpm add ${packages.join(" ")}`,
        yarn: `yarn add ${packages.join(" ")}`,
    };

    await execaCommand(commands[packageManager], {
        stdio: "inherit",
    });
}
