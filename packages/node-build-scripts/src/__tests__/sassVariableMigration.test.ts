/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { check } from "prettier";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { buildDesignTokens } from "../designTokens.mjs";
import { validateSassVariableMigration } from "../sassVariableMigration.mjs";

const BASE_STYLES = `
$color: #ffffff !default;
$dark-color: #000000 !default;
$offset: 20px;

.thing {
  color: $color;
  margin-top: -$offset;
}

.dark .thing {
  color: $dark-color;
}
`;

const MIGRATED_STYLES = `
$color: #ffffff !default;
$dark-color: #000000 !default;
$offset: 20px;

.thing {
  color: var(--bp-thing-color);
  margin-top: calc(var(--bp-thing-offset) * -1);
}
`;

describe("validateSassVariableMigration", () => {
    let temporaryDirectory: string;
    let baseline: string;

    const replaceFixture = async ({
        baselineSource,
        currentSource,
        path = "package/src/styles.scss",
    }: {
        baselineSource: string;
        currentSource: string;
        path?: string;
    }) => {
        const absolutePath = join(temporaryDirectory, path);
        await mkdir(dirname(absolutePath), { recursive: true });
        await writeFile(absolutePath, baselineSource);
        execFileSync("git", ["add", "--", path], { cwd: temporaryDirectory });
        execFileSync(
            "git",
            [
                "-c",
                "user.name=Blueprint tests",
                "-c",
                "user.email=blueprint@example.com",
                "-c",
                "commit.gpgSign=false",
                "commit",
                "--quiet",
                "-m",
                "fixture baseline",
            ],
            { cwd: temporaryDirectory },
        );
        baseline = execFileSync("git", ["rev-parse", "HEAD"], {
            cwd: temporaryDirectory,
            encoding: "utf8",
        }).trim();
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.baseline = baseline;
        await writeFile(configPath, JSON.stringify(config));
        await writeFile(absolutePath, currentSource);
    };

    beforeEach(async () => {
        temporaryDirectory = await mkdtemp(join(tmpdir(), "blueprint-sass-migration-"));
        await mkdir(join(temporaryDirectory, "package/src"), { recursive: true });
        await mkdir(join(temporaryDirectory, "tokens/base"), { recursive: true });
        await mkdir(join(temporaryDirectory, "tokens/dark"), { recursive: true });
        await writeFile(join(temporaryDirectory, "package/src/styles.scss"), BASE_STYLES);

        execFileSync("git", ["init", "--quiet"], { cwd: temporaryDirectory });
        execFileSync("git", ["add", "package/src/styles.scss"], { cwd: temporaryDirectory });
        execFileSync(
            "git",
            [
                "-c",
                "user.name=Blueprint tests",
                "-c",
                "user.email=blueprint@example.com",
                "-c",
                "commit.gpgSign=false",
                "commit",
                "--quiet",
                "-m",
                "baseline",
            ],
            { cwd: temporaryDirectory },
        );
        baseline = execFileSync("git", ["rev-parse", "HEAD"], {
            cwd: temporaryDirectory,
            encoding: "utf8",
        }).trim();

        await writeFile(join(temporaryDirectory, "package/src/styles.scss"), MIGRATED_STYLES);
        await writeFile(
            join(temporaryDirectory, "tokens/base/thing.tokens.json"),
            JSON.stringify({
                thing: {
                    color: { $type: "color", $value: "#ffffff" },
                    offset: { $type: "dimension", $value: { unit: "px", value: 20 } },
                },
            }),
        );
        await writeFile(
            join(temporaryDirectory, "tokens/dark/thing.tokens.json"),
            JSON.stringify({ thing: { color: { $type: "color", $value: "#000000" } } }),
        );
        await writeFile(
            join(temporaryDirectory, "tokens/config.json"),
            JSON.stringify({
                include: { base: [], dark: [] },
                output: "build/tokens.css",
                source: { base: ["base/**/*.tokens.json"], dark: ["dark/**/*.tokens.json"] },
            }),
        );
        await buildDesignTokens(join(temporaryDirectory, "tokens/config.json"));
        await writeFile(
            join(temporaryDirectory, "migration.json"),
            JSON.stringify({
                artifactFiles: [],
                baseline,
                compatibilityNames: {},
                ledger: "ledger.json",
                manualMappings: {},
                owners: [
                    {
                        id: "test",
                        package: "@blueprintjs/test",
                        roots: ["package/src"],
                        scopeKind: "required",
                    },
                ],
                protectedFiles: [],
                runtimeExceptions: [],
                tokenConfigs: [{ config: "tokens/config.json", owner: "@blueprintjs/test" }],
            }),
        );
    });

    afterEach(async () => {
        await rm(temporaryDirectory, { force: true, recursive: true });
    });

    test("pairs light and dark Sass variables behind one theme-aware token", async () => {
        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        expect(result.entries).toHaveLength(3);
        expect(result.entries.map(entry => entry.disposition)).toStrictEqual(["migrated", "migrated", "migrated"]);
        expect(result.entries.map(entry => entry.migration?.targets.map(target => target.cssVariable))).toStrictEqual([
            ["--bp-thing-color"],
            ["--bp-thing-color"],
            ["--bp-thing-offset"],
        ]);
        expect(result.entries.map(entry => entry.migration?.targets.map(target => target.resolved))).toStrictEqual([
            [{ dark: "#000000", light: "#ffffff", status: "resolved-token-default" }],
            [{ dark: "#000000", light: "#ffffff", status: "resolved-token-default" }],
            [{ dark: "20px", light: "20px", status: "resolved-token-default" }],
        ]);
        expect(result.entries.map(entry => entry.resolution.status)).toStrictEqual([
            "inferred",
            "inferred",
            "inferred",
        ]);
        expect(result.entries.map(entry => entry.sassResolution.status)).toStrictEqual([
            "resolved",
            "resolved",
            "resolved",
        ]);
        expect(result.entries.map(entry => entry.sassResolution.light.values)).toStrictEqual([
            [{ sassType: "color", value: "#ffffff" }],
            [{ sassType: "color", value: "#ffffff" }],
            [{ sassType: "number", value: "20px" }],
        ]);
        expect(result.entries.map(entry => entry.sassResolution.dark.values)).toStrictEqual([
            [{ sassType: "color", value: "#000000" }],
            [{ sassType: "color", value: "#000000" }],
            [{ sassType: "number", value: "20px" }],
        ]);

        const ledgerPath = join(temporaryDirectory, "ledger.json");
        const ledgerSource = await readFile(ledgerPath, "utf8");
        const ledger = JSON.parse(ledgerSource);
        expect(ledger.schemaVersion).toBe(4);
        expect(await check(ledgerSource, { filepath: ledgerPath })).toBe(true);
    });

    test("requires entry-level Sass resolution evidence in schema v4 ledgers", async () => {
        await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });
        const ledgerPath = join(temporaryDirectory, "ledger.json");
        const ledger = JSON.parse(await readFile(ledgerPath, "utf8"));
        delete ledger.entries[0].sassResolution;
        await writeFile(ledgerPath, JSON.stringify(ledger));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
        });

        expect(result.errors).toContain(
            "Sass resolution status is missing for test:package/src/styles.scss:root:color:1.",
        );
    });

    test("adds current-only root and lexical declarations with explicit baseline metadata", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            `${MIGRATED_STYLES}
$post-baseline-map: ("rest": 1);
@mixin post-baseline-helper() {
  $local-offset: 2px;
}
`,
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        const postBaselineEntries = result.entries.filter(entry => entry.original === null);
        expect(postBaselineEntries).toHaveLength(2);
        const rootHelper = postBaselineEntries.find(entry => entry.name === "post-baseline-map");
        const localHelper = postBaselineEntries.find(entry => entry.name === "local-offset");
        expect(rootHelper?.disposition).toBe("retained-compile-time");
        expect(rootHelper?.sassResolution.status).toBe("resolved");
        expect(localHelper?.disposition).toBe("retained-local");
        expect(localHelper?.sassResolution.status).toBe("contextual");
        expect(postBaselineEntries.map(entry => entry.introducedAfterBaseline)).toStrictEqual(
            Array.from({ length: 2 }, () => ({
                baselineCommit: baseline,
                status: "introduced-after-baseline",
            })),
        );
    });

    test("rejects current-only helpers which reach runtime declarations", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            `${MIGRATED_STYLES}
$post-baseline-color: #ffffff;
.new-thing {
  color: $post-baseline-color;
}
`,
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        const helper = result.entries.find(entry => entry.name === "post-baseline-color");
        expect(helper?.original).toBeNull();
        expect(helper?.remainingRuntimeUseCount).toBe(1);
        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.stringContaining(
                    "Eligible Sass value still reaches runtime declarations for test:package/src/styles.scss:root:post-baseline-color:1",
                ),
            ]),
        );
    });

    test("includes untracked nonignored Sass and excludes ignored generated artifacts", async () => {
        await writeFile(join(temporaryDirectory, ".gitignore"), "package/src/generated/\n");
        await mkdir(join(temporaryDirectory, "package/src/generated"), { recursive: true });
        await writeFile(join(temporaryDirectory, "package/src/new-helper.scss"), "$new-helper: 4px;\n");
        await writeFile(
            join(temporaryDirectory, "package/src/generated/_tokens.scss"),
            "$ignored-generated-helper: 8px;\n",
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        expect(result.entries.some(entry => entry.name === "new-helper")).toBe(true);
        expect(result.entries.some(entry => entry.name === "ignored-generated-helper")).toBe(false);
    });

    test("rejects stale migration config keys", async () => {
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.manualMappings = { "test:missing-variable": "--bp-thing-color" };
        config.ledgerOverrides = { "test:package/src/styles.scss:root:missing-variable:1": {} };
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toEqual(
            expect.arrayContaining([
                "Stale manualMappings key: test:missing-variable.",
                "Stale ledgerOverrides key: test:package/src/styles.scss:root:missing-variable:1.",
            ]),
        );
    });

    test("prefers stable declaration ID mappings over owner-and-name mappings", async () => {
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.manualMappings = {
            "test:color": "--bp-thing-offset",
            "test:package/src/styles.scss:root:color:1": "--bp-thing-color",
        };
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        const color = result.entries.find(entry => entry.name === "color");
        expect(color?.migration?.targets.map(target => target.cssVariable)).toStrictEqual(["--bp-thing-color"]);
        expect(color?.resolution).toStrictEqual({
            candidates: ["--bp-thing-color"],
            configuredBy: "test:package/src/styles.scss:root:color:1",
            status: "configured",
        });
        expect(result.errors).toContain("Unused manualMappings key: test:color.");
    });

    test("rejects new runtime declarations which reuse a migrated Sass variable", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            `${MIGRATED_STYLES}
.new-thing {
  color: $color;
}
`,
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        const color = result.entries.find(entry => entry.name === "color");
        expect(color?.disposition).toBe("migrated");
        expect(color?.remainingRuntimeUseCount).toBe(1);
        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.stringContaining(
                    "Eligible Sass value still reaches runtime declarations for test:package/src/styles.scss:root:color:1",
                ),
            ]),
        );
    });

    test("records configured multi-target migrations and per-target defaults", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            MIGRATED_STYLES.replace(
                "calc(var(--bp-thing-offset) * -1)",
                "calc(var(--bp-thing-offset) + var(--bp-thing-color))",
            ),
        );
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.manualMappings = {
            "test:package/src/styles.scss:root:offset:1": {
                kind: "decomposed",
                reconstruction: "The runtime expression combines an offset and a color fixture token.",
                roles: {
                    "--bp-thing-color": "fixture-color",
                    "--bp-thing-offset": "fixture-offset",
                },
                targets: ["--bp-thing-offset", "--bp-thing-color"],
            },
        };
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        const offset = result.entries.find(entry => entry.name === "offset");
        expect(offset?.migration).toStrictEqual({
            kind: "decomposed",
            reconstruction: "The runtime expression combines an offset and a color fixture token.",
            targets: [
                {
                    cssVariable: "--bp-thing-offset",
                    owner: "@blueprintjs/test",
                    resolved: { dark: "20px", light: "20px", status: "resolved-token-default" },
                    role: "fixture-offset",
                },
                {
                    cssVariable: "--bp-thing-color",
                    owner: "@blueprintjs/test",
                    resolved: { dark: "#000000", light: "#ffffff", status: "resolved-token-default" },
                    role: "fixture-color",
                },
            ],
        });
    });

    test("reports ambiguous package-owned targets instead of selecting by frequency", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            MIGRATED_STYLES.replace(
                "calc(var(--bp-thing-offset) * -1)",
                "calc(var(--bp-thing-offset) + var(--bp-thing-offset) + var(--bp-thing-color))",
            ),
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        const offset = result.entries.find(entry => entry.name === "offset");
        expect(offset?.migration).toBeNull();
        expect(offset?.resolution).toStrictEqual({
            candidates: ["--bp-thing-color", "--bp-thing-offset"],
            status: "ambiguous",
        });
        expect(result.errors).toContain(
            "Runtime Sass declaration has ambiguous package-owned target tokens for test:package/src/styles.scss:root:offset:1: --bp-thing-color, --bp-thing-offset. Configure manualMappings with this stable ID.",
        );
    });

    test("rejects changes to protected root Sass initializer contracts", async () => {
        const changedStyles = MIGRATED_STYLES.replace("$color: #ffffff", "$color: #fefefe");
        await writeFile(join(temporaryDirectory, "package/src/styles.scss"), changedStyles);
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.protectedFiles = [
            {
                path: "package/src/styles.scss",
                sha256: createHash("sha256").update(changedStyles).digest("hex"),
            },
        ];
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toContain("Root Sass initializer changed for test:package/src/styles.scss:root:color:1.");
    });

    test("rejects changes to root !default Sass initializer contracts", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            MIGRATED_STYLES.replace("$color: #ffffff", "$color: #fefefe"),
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toContain("Root Sass initializer changed for test:package/src/styles.scss:root:color:1.");
    });

    test("rejects removal of root !default flags", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            MIGRATED_STYLES.replace("$color: #ffffff !default", "$color: #ffffff"),
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toContain(
            "Root Sass !default contract changed for test:package/src/styles.scss:root:color:1.",
        );
    });

    test("rejects changes to root !default initializer kinds", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            MIGRATED_STYLES.replace("$color: #ffffff !default", "$color: $dark-color !default"),
        );

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toContain(
            "Root Sass initializer kind changed for test:package/src/styles.scss:root:color:1.",
        );
    });

    test("rejects runtime call sites for protected Sass-backed mixins", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            `${MIGRATED_STYLES}\n.thing:focus { @include focus-outline; }\n`,
        );
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.mixinCallRules = [{ forbid: true, name: "focus-outline" }];
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.stringContaining("Sass-backed mixin focus-outline must not emit Blueprint runtime CSS"),
            ]),
        );
    });

    test("rejects eligible Sass values passed through runtime mixins", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            `${MIGRATED_STYLES}\n.thing { @include pt-flex-container(row, $offset); }\n`,
        );
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.mixinCallRules = [{ forbidVariables: ["offset"], name: "pt-flex-container" }];
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.stringContaining("Mixin pt-flex-container must not receive Sass variable $offset"),
            ]),
        );
    });

    test("migrates nested lexical values when they have a runtime token", async () => {
        await replaceFixture({
            baselineSource: `
@each $state in (rest, hover) {
  $local-color: #ffffff;
  .thing-#{$state} { color: $local-color; }
}
`,
            currentSource: `
@each $state in (rest, hover) {
  $local-color: #ffffff;
  .thing-#{$state} { color: var(--bp-thing-color); }
}
`,
        });

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        const localColor = result.entries.find(entry => entry.name === "local-color");
        expect(localColor?.disposition).toBe("migrated");
        expect(localColor?.migration?.targets.map(target => target.cssVariable)).toStrictEqual(["--bp-thing-color"]);
        expect(localColor?.sassResolution).toMatchObject({
            declared: { observations: [{ sassType: "color", value: "#ffffff" }] },
            status: "contextual",
        });
    });

    test("rejects remaining nested runtime values even when retained-local", async () => {
        const nestedStyles = `
@each $state in (rest, hover) {
  $local-color: #ffffff;
  .thing-#{$state} { color: $local-color; }
}
`;
        await replaceFixture({ baselineSource: nestedStyles, currentSource: nestedStyles });

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        const localColor = result.entries.find(entry => entry.name === "local-color");
        expect(localColor?.disposition).toBe("retained-local");
        expect(result.errors).toEqual(
            expect.arrayContaining([
                expect.stringContaining("Eligible Sass value still reaches runtime declarations for"),
            ]),
        );
    });

    test("classifies Sass arithmetic separately from lists", async () => {
        await replaceFixture({
            baselineSource: `
$offset: 10px;
$double-offset: $offset * 2;
.thing { margin: $double-offset; }
`,
            currentSource: `
$offset: 10px;
$double-offset: $offset * 2;
.thing { margin: var(--bp-thing-offset); }
`,
        });

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        expect(result.entries.find(entry => entry.name === "double-offset")?.original.initializerKind).toBe(
            "arithmetic",
        );
    });

    test("does not mistake transition-ease names for namespaces", async () => {
        const transitionStyles = "$transition-ease: cubic-bezier(0.4, 1, 0.75, 0.9) !default;\n";
        await replaceFixture({ baselineSource: transitionStyles, currentSource: transitionStyles });

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        const transitionEase = result.entries.find(entry => entry.name === "transition-ease");
        expect(transitionEase?.rationale.code).toBe("public-api");
        expect(transitionEase?.original.initializerKind).toBe("function");
        expect(transitionEase?.migration).toBeNull();
        expect(transitionEase?.resolution).toStrictEqual({ candidates: [], status: "not-applicable" });
    });

    test("labels owner-name use counts when duplicate declarations make attribution ambiguous", async () => {
        const duplicateStyles = `
$duplicate: 1px;
.thing { $duplicate: 2px; }
`;
        await replaceFixture({ baselineSource: duplicateStyles, currentSource: duplicateStyles });

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        expect(result.entries.map(entry => entry.ownerNameUsage)).toStrictEqual([
            {
                ambiguityGroup: "test:duplicate",
                declarationCount: 2,
                remainingDeclarationCount: 2,
                remainingUseCount: 0,
                useCount: 0,
            },
            {
                ambiguityGroup: "test:duplicate",
                declarationCount: 2,
                remainingDeclarationCount: 2,
                remainingUseCount: 0,
                useCount: 0,
            },
        ]);
    });

    test("records the effective value after each duplicate !default assignment", async () => {
        const duplicateDefaults = `
$duplicate: #111111 !default;
$duplicate: #222222 !default;
`;
        await replaceFixture({ baselineSource: duplicateDefaults, currentSource: duplicateDefaults });

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        expect(result.entries.map(entry => entry.sassResolution.declared.observations)).toStrictEqual([
            [{ sassType: "color", value: "#111111" }],
            [{ sassType: "color", value: "#111111" }],
        ]);
    });

    test("classifies generated icon font and codepoint values as metadata", async () => {
        const generatedPath = "package/src/generated/_icon-variables.scss";
        const generatedStyles = `
$blueprint-icons-16-font: "blueprint-icons-16";
$blueprint-icons-16-codepoints: ("add": "\\f101");
.icon {
  content: map.get($blueprint-icons-16-codepoints, "add");
  font-family: $blueprint-icons-16-font;
}
`;
        await replaceFixture({
            baselineSource: generatedStyles,
            currentSource: generatedStyles,
            path: generatedPath,
        });
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.owners = [
            {
                id: "icons",
                package: "@blueprintjs/icons",
                roots: ["package/src/generated"],
                scopeKind: "required",
            },
        ];
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        expect(result.entries.map(entry => entry.disposition)).toStrictEqual([
            "retained-generated-metadata",
            "retained-generated-metadata",
        ]);
        expect(result.entries.map(entry => entry.rationale.code)).toStrictEqual([
            "generated-metadata",
            "generated-metadata",
        ]);
        expect(result.entries.map(entry => entry.sassResolution.status)).toStrictEqual([
            "not-applicable",
            "not-applicable",
        ]);
    });

    test("accepts array mappings with migration metadata overrides", async () => {
        await writeFile(
            join(temporaryDirectory, "package/src/styles.scss"),
            MIGRATED_STYLES.replace(
                "calc(var(--bp-thing-offset) * -1)",
                "calc(var(--bp-thing-offset) + var(--bp-thing-color))",
            ),
        );
        const id = "test:package/src/styles.scss:root:offset:1";
        const configPath = join(temporaryDirectory, "migration.json");
        const config = JSON.parse(await readFile(configPath, "utf8"));
        config.manualMappings = { [id]: ["--bp-thing-offset", "--bp-thing-color"] };
        config.ledgerOverrides = {
            [id]: {
                migration: {
                    kind: "precomposed-fan-out",
                    reconstruction: "Fixture reconstruction metadata.",
                    roles: { "--bp-thing-offset": "direct" },
                },
            },
        };
        await writeFile(configPath, JSON.stringify(config));

        const result = await validateSassVariableMigration("migration.json", {
            repositoryRoot: temporaryDirectory,
            write: true,
        });

        expect(result.errors).toStrictEqual([]);
        const offset = result.entries.find(entry => entry.id === id);
        expect(offset?.migration?.kind).toBe("precomposed-fan-out");
        expect(offset?.migration?.reconstruction).toBe("Fixture reconstruction metadata.");
        expect(offset?.migration?.targets.map(target => target.role)).toStrictEqual(["direct", null]);
    });
});
