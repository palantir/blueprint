/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postcss, { type ChildNode, type Declaration, type Rule } from "postcss";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { buildDesignTokens } from "../designTokens.mjs";

const FIXTURE_DIRECTORY = join(dirname(fileURLToPath(import.meta.url)), "__fixtures__", "design-tokens");

const getTopLevelRule = (nodes: ChildNode[], selector: string) =>
    nodes.find((node): node is Rule => node.type === "rule" && node.selector === selector);

const getDeclaration = (rule: Rule | undefined, property: string) =>
    rule?.nodes.find((node): node is Declaration => node.type === "decl" && node.prop === property);

describe("buildDesignTokens", () => {
    let temporaryDirectory: string;

    beforeEach(async () => {
        temporaryDirectory = await mkdtemp(join(tmpdir(), "blueprint-design-tokens-"));
        await cp(FIXTURE_DIRECTORY, temporaryDirectory, { recursive: true });
    });

    afterEach(async () => {
        await rm(temporaryDirectory, { force: true, recursive: true });
    });

    test("builds ordered theme selectors and preserves token references", async () => {
        const outputPath = await buildDesignTokens(join(temporaryDirectory, "config.json"));
        const css = await readFile(outputPath, "utf8");
        const root = postcss.parse(css);
        const topLevelSelectors = root.nodes
            .filter((node): node is Rule => node.type === "rule")
            .map(rule => rule.selector);

        expect(topLevelSelectors).toStrictEqual([
            ":root",
            ".bp6-dark",
            '[data-bp-color-scheme="light"]',
            '[data-bp-color-scheme="dark"]',
        ]);

        const rootRule = getTopLevelRule(root.nodes, ":root");
        const legacyDarkRule = getTopLevelRule(root.nodes, ".bp6-dark");
        const explicitDarkRule = getTopLevelRule(root.nodes, '[data-bp-color-scheme="dark"]');

        expect(getDeclaration(rootRule, "--bp-sample-alias")?.value).toBe("var(--bp-sample-spacing)");
        expect(getDeclaration(rootRule, "--bp-sample-canonical-spacing")?.value).toBe(
            "var(--bp-sample-legacy-spacing)",
        );
        expect(getDeclaration(rootRule, "--bp-sample-dependency-color")?.value).toBe("var(--bp-dependency-color)");
        expect(getDeclaration(rootRule, "--bp-sample-layer")?.value).toBe(
            "linear-gradient(var(--bp-sample-derived) 0 0)",
        );
        expect(getDeclaration(rootRule, "--bp-sample-shadow")?.value).toBe("0px 1px 2px rgba(17, 20, 24, 0.15)");
        expect(getDeclaration(rootRule, "--bp-dependency-color")).toBeUndefined();

        expect(
            legacyDarkRule?.nodes.filter((node): node is Declaration => node.type === "decl").map(node => node.prop),
        ).toStrictEqual([
            "--bp-sample-spacing",
            "--bp-sample-alias",
            "--bp-sample-canonical-spacing",
            "--bp-sample-dependency-color",
            "--bp-sample-derived",
            "--bp-sample-layer",
        ]);
        expect(getDeclaration(legacyDarkRule, "--bp-sample-spacing")?.value).toBe("8px");
        expect(getDeclaration(legacyDarkRule, "--bp-sample-alias")?.value).toBe("var(--bp-sample-spacing)");
        expect(getDeclaration(legacyDarkRule, "--bp-sample-canonical-spacing")?.value).toBe(
            "var(--bp-sample-legacy-spacing)",
        );
        expect(getDeclaration(legacyDarkRule, "--bp-sample-legacy-spacing")).toBeUndefined();
        expect(getDeclaration(legacyDarkRule, "--bp-sample-dependency-color")?.value).toBe(
            "var(--bp-dependency-color)",
        );
        expect(getDeclaration(legacyDarkRule, "--bp-dependency-color")).toBeUndefined();
        expect(getDeclaration(explicitDarkRule, "--bp-sample-spacing")?.value).toBe("8px");
        expect(getDeclaration(explicitDarkRule, "--bp-sample-alias")?.value).toBe("var(--bp-sample-spacing)");

        const supportsRule = root.nodes.find(
            node => node.type === "atrule" && node.name === "supports" && node.params.includes("oklch"),
        );
        expect(supportsRule).toBeDefined();
        expect(css).toContain("--bp-sample-derived: oklch(from var(--bp-dependency-color) l c h / 0.5)");
    });

    test("rejects configs without a base source", async () => {
        const invalidConfigPath = join(temporaryDirectory, "invalid.json");
        await writeFile(invalidConfigPath, JSON.stringify({ output: "build/tokens.css", source: {} }));

        await expect(buildDesignTokens(invalidConfigPath)).rejects.toThrow('field "source.base"');
    });
});
