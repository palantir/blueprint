/**
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 */

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";

import { getRootDir } from "../utils.mjs";

const temporaryDirectories = [];

afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
        rmSync(directory, { force: true, recursive: true });
    }
});

describe("getRootDir", () => {
    test("finds the workspace root from a package source directory", () => {
        const workspaceDir = createTemporaryDirectory();
        const sourceDir = join(workspaceDir, "packages", "select", "src");
        mkdirSync(sourceDir, { recursive: true });
        writeFileSync(join(workspaceDir, "package.json"), JSON.stringify({ workspaces: ["packages/*"] }));
        writeFileSync(join(workspaceDir, "packages", "select", "package.json"), JSON.stringify({ name: "select" }));

        expect(getRootDir(sourceDir)).toBe(workspaceDir);
    });

    test("falls back to the closest package root outside a workspace", () => {
        const packageDir = createTemporaryDirectory();
        const sourceDir = join(packageDir, "src", "components");
        mkdirSync(sourceDir, { recursive: true });
        writeFileSync(join(packageDir, "package.json"), JSON.stringify({ name: "standalone-package" }));

        expect(getRootDir(sourceDir)).toBe(packageDir);
    });
});

function createTemporaryDirectory() {
    const directory = mkdtempSync(join(tmpdir(), "blueprint-node-build-scripts-"));
    temporaryDirectories.push(directory);
    return directory;
}
