/*
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

export async function ensureDirectory(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
}

export async function copyFile(source: string, destination: string): Promise<void> {
    await fs.copy(source, destination, { overwrite: true });
}

export async function writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, "utf-8");
}

export async function readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, "utf-8");
}

export function getPackageRoot(): string {
    // Navigate from src/utils/ to package root
    return path.resolve(currentDirname, "../..");
}

export function getTemplatesDir(): string {
    return path.join(getPackageRoot(), "templates");
}
