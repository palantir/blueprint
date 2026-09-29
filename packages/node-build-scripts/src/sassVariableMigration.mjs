/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

import fs from "fs-extra";
import { glob } from "glob";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { dirname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import postcss from "postcss";
import scss from "postcss-scss";
import { format, resolveConfig } from "prettier";
import * as sass from "sass";

const TOKEN_REFERENCE_PATTERN = /\{([^}]+)\}/g;
const CSS_VARIABLE_PATTERN = /var\((--bp-[a-z0-9-]+)/g;
const SASS_RESOLUTION_MARKER = "__BLUEPRINT_SASS_RESOLUTION__";
const LEDGER_SCHEMA_VERSION = 4;
const RESOLVED_VALUE_STATUSES = new Set(["contextual", "not-applicable", "resolved"]);

const DISPOSITIONS = new Set([
    "excluded",
    "migrated",
    "retained-compile-time",
    "retained-generated-metadata",
    "retained-local",
    "retained-public-api",
]);

const normalizePath = path => path.split(sep).join("/");
const sha256 = value => createHash("sha256").update(value).digest("hex");
const normalizeWhitespace = value => value.replace(/\s+/g, " ").trim();
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const variablePattern = (name, flags = "g") =>
    new RegExp(`(?<![a-zA-Z0-9_])\\$${escapeRegExp(name)}(?![a-zA-Z0-9_-])`, flags);

const getInitializerDependencies = (initializer, scope) => {
    const dependencies = [...new Set([...initializer.matchAll(/\$[a-z0-9_-]+/gi)].map(match => match[0]))];
    if (scope.length > 1) dependencies.push(`scope:${scope.slice(1).join("/")}`);
    return dependencies;
};

const parseObject = value => (typeof value === "object" && value !== null && !Array.isArray(value) ? value : undefined);

const assertString = (value, label) => {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`Migration config field "${label}" must be a non-empty string.`);
    }
    return value;
};

const assertArray = (value, label) => {
    if (!Array.isArray(value)) {
        throw new Error(`Migration config field "${label}" must be an array.`);
    }
    return value;
};

const getAtRuleScope = node => {
    const parameters = normalizeWhitespace(node.params ?? "");
    if (node.name === "mixin" || node.name === "function") {
        return `${node.name}:${parameters.split(/[\s(]/, 1)[0]}`;
    }
    if (["each", "else", "for", "if", "while"].includes(node.name)) {
        const siblings =
            node.parent?.nodes?.filter(sibling => sibling.type === "atrule" && sibling.name === node.name) ?? [];
        return `${node.name}:${siblings.indexOf(node) + 1}`;
    }
    return `at:${node.name}:${parameters}`;
};

const getRuleScope = node => `rule:${normalizeWhitespace(node.selector)}`;

const getScope = node => {
    const scopes = [];
    let parent = node.parent;
    while (parent !== undefined && parent.type !== "root") {
        if (parent.type === "atrule") {
            scopes.unshift(getAtRuleScope(parent));
        } else if (parent.type === "rule") {
            scopes.unshift(getRuleScope(parent));
        }
        parent = parent.parent;
    }
    return scopes.length === 0 ? ["root"] : ["root", ...scopes];
};

const getInitializerKind = initializer => {
    const value = initializer.trim();
    if (/^(true|false)$/.test(value)) return "boolean";
    if (value === "null") return "null";
    if (/^(["']).*\1$/s.test(value)) return "string";
    if (/^#[0-9a-f]{3,8}$/i.test(value) || /^(rgba?|hsla?|hwb|lab|lch|oklch|color)\(/i.test(value)) return "color";
    if (/^-?(?:\d*\.)?\d+(?:[a-z%]+)?$/i.test(value)) return "number";
    if (value.startsWith("(") && value.endsWith(")") && /(^|,)\s*[^,()]+\s*:/.test(value)) return "map";
    if (/\s[+*/%-]\s/.test(value)) return "arithmetic";
    if (/^\$[a-z0-9_-]+$/i.test(value)) return "reference";
    if (/#\{[^}]+\}/.test(value)) return "interpolation";
    if (/^(?:[a-z_][a-z0-9_-]*\.)?[a-z_][a-z0-9_-]*\(/i.test(value)) return "function";
    if (value.includes(",") || /^\S+(?:\s+\S+)+$/.test(value)) return "list";
    if (/\$[a-z0-9_-]+/i.test(value)) return "expression";
    return "css-expression";
};

const parseSass = (source, path) => scss.parse(source, { from: path });

const makeDeclarationKey = (scope, name, ordinal) => `${scope.join("/")}|${name}|${ordinal}`;

const scanDeclarations = (source, path, ownerId) => {
    const root = parseSass(source, path);
    const ordinals = new Map();
    const declarations = [];

    root.walkDecls(declaration => {
        if (!declaration.prop.startsWith("$")) return;
        const name = declaration.prop.slice(1);
        const scope = getScope(declaration);
        const ordinalKey = `${scope.join("/")}|${name}`;
        const ordinal = (ordinals.get(ordinalKey) ?? 0) + 1;
        ordinals.set(ordinalKey, ordinal);
        const declarationText = declaration.toString();
        const initializer = declaration.value
            .replace(/\s*!default\b/, "")
            .replace(/\s*!global\b/, "")
            .trim();
        const id = `${ownerId}:${path}:${scope.join("/")}:${name}:${ordinal}`;
        declarations.push({
            declarationText,
            id,
            initializer,
            initializerKind: getInitializerKind(initializer),
            isDefault: /(?:^|\s)!default(?:\s|$)/.test(declaration.value),
            key: makeDeclarationKey(scope, name, ordinal),
            line: declaration.source?.start?.line ?? 0,
            name,
            ordinal,
            scope,
            sha256: sha256(declarationText),
        });
    });
    return declarations;
};

const makeContextualValue = declaration => ({
    sassType: `contextual-${declaration.initializerKind}`,
    value: declaration.initializer,
});

const makeThemeValues = (status, values) => ({ status, values });

const getEvaluationPreludePaths = (ownerId, path, repositoryRoot) => {
    const paths = ["packages/colors/lib/scss/colors.scss"];
    if (ownerId === "core") {
        if (path.endsWith("/common/_mixins.scss")) {
            paths.push("packages/core/src/common/_color-aliases.scss");
        } else if (!path.endsWith("/common/_color-aliases.scss") && !path.endsWith("/common/_variables.scss")) {
            paths.push("packages/core/src/common/_variables.scss");
        }
    } else if (ownerId !== "icons") {
        paths.push("packages/core/src/common/_variables.scss");
    }
    if ((ownerId === "datetime" || ownerId === "datetime2") && !path.endsWith("/datetime/src/_common.scss")) {
        paths.push("packages/datetime/src/_common.scss");
    }
    if (ownerId === "select" && !path.endsWith("/select/src/common/_variables.scss")) {
        paths.push("packages/select/src/common/_variables.scss");
    }
    if (ownerId === "table" && !path.endsWith("/table/src/common/_variables.scss")) {
        paths.push("packages/table/src/common/_variables.scss");
    }
    if (
        (ownerId === "docs-theme" || ownerId === "docs-app") &&
        !path.endsWith("/docs-theme/src/styles/_variables.scss")
    ) {
        paths.push("packages/docs-theme/src/styles/_variables.scss");
    }
    return paths.map(path => resolve(repositoryRoot, path));
};

const evaluateDeclarations = ({ declarations, ownerId, path, repositoryRoot, source }) => {
    const declarationByKey = new Map(declarations.map(declaration => [declaration.key, declaration]));
    const instrumentedRoot = parseSass(source, path);
    const ordinals = new Map();
    const encodedIds = new Map();

    instrumentedRoot.walkDecls(declaration => {
        if (!declaration.prop.startsWith("$")) return;
        const name = declaration.prop.slice(1);
        const scope = getScope(declaration);
        const ordinalKey = `${scope.join("/")}|${name}`;
        const ordinal = (ordinals.get(ordinalKey) ?? 0) + 1;
        ordinals.set(ordinalKey, ordinal);
        const fact = declarationByKey.get(makeDeclarationKey(scope, name, ordinal));
        if (fact === undefined || isGeneratedMetadata(path, name, ownerId)) return;
        const encodedId = Buffer.from(fact.id).toString("base64url");
        encodedIds.set(encodedId, fact.id);
        declaration.after({
            name: "debug",
            params: `"${SASS_RESOLUTION_MARKER}${encodedId}|#{bp_migration_meta.type-of($${name})}|#{bp_migration_meta.inspect($${name})}"`,
        });
    });

    instrumentedRoot.prepend({ name: "use", params: '"sass:meta" as bp_migration_meta' });
    let insertionPoint = instrumentedRoot.nodes
        .filter(node => node.type === "atrule" && (node.name === "forward" || node.name === "use"))
        .at(-1);
    for (const preludePath of getEvaluationPreludePaths(ownerId, path, repositoryRoot)) {
        if (!fs.pathExistsSync(preludePath)) continue;
        const preludeImport = postcss.atRule({ name: "import", params: `"${normalizePath(preludePath)}"` });
        if (insertionPoint === undefined) instrumentedRoot.prepend(preludeImport);
        else instrumentedRoot.insertAfter(insertionPoint, preludeImport);
        insertionPoint = preludeImport;
    }

    const observations = new Map();
    let compileError = null;
    try {
        sass.compileString(instrumentedRoot.toResult({ syntax: scss }).css, {
            loadPaths: [
                resolve(repositoryRoot, path.split("/").slice(0, 2).join("/"), "node_modules"),
                resolve(repositoryRoot, "packages/core/node_modules"),
                resolve(repositoryRoot, "node_modules"),
            ],
            logger: {
                debug(message) {
                    if (!message.startsWith(SASS_RESOLUTION_MARKER)) return;
                    const separator = message.indexOf("|", SASS_RESOLUTION_MARKER.length);
                    const typeSeparator = message.indexOf("|", separator + 1);
                    if (separator === -1 || typeSeparator === -1) return;
                    const id = encodedIds.get(message.slice(SASS_RESOLUTION_MARKER.length, separator));
                    if (id === undefined) return;
                    const observation = {
                        sassType: message.slice(separator + 1, typeSeparator),
                        value: message.slice(typeSeparator + 1),
                    };
                    const declarationObservations = observations.get(id) ?? [];
                    if (
                        !declarationObservations.some(
                            item => item.sassType === observation.sassType && item.value === observation.value,
                        )
                    ) {
                        declarationObservations.push(observation);
                    }
                    observations.set(id, declarationObservations);
                },
                warn() {},
            },
            url: pathToFileURL(resolve(repositoryRoot, path)),
        });
    } catch (error) {
        compileError = normalizeWhitespace(error instanceof Error ? error.message : String(error));
    }
    return { compileError, observations };
};

const makeSassResolution = ({ compileError, declaration, generatedMetadata, observations }) => {
    const dependencies = getInitializerDependencies(declaration.initializer, declaration.scope);
    if (generatedMetadata) {
        return {
            dark: null,
            declared: { expression: declaration.initializer, observations: [], type: declaration.initializerKind },
            dependencies: [`generated-source:${declaration.path}`],
            light: null,
            note: "Generated codepoint or font metadata has no light or dark runtime visual value.",
            pair: null,
            provenance: "baseline-source-classification",
            status: "not-applicable",
        };
    }

    if (declaration.scope.length > 1) {
        const contextualValue = makeContextualValue(declaration);
        const contextualObservations = observations.length === 0 ? [contextualValue] : observations;
        return {
            dark: makeThemeValues("contextual", contextualObservations),
            declared: {
                expression: declaration.initializer,
                observations,
                type: declaration.initializerKind,
            },
            dependencies,
            light: makeThemeValues("contextual", contextualObservations),
            note:
                observations.length > 0
                    ? "The declaration is lexical; Dart Sass captured the distinct values observed when this scope executed."
                    : `The declaration is lexical and was not executed while compiling its source partial${compileError === null ? "." : `: ${compileError}`}`,
            pair: null,
            provenance: "dart-sass-declaration-site",
            status: "contextual",
        };
    }

    const observation = observations[0];
    if (observation === undefined) {
        const contextualValue = makeContextualValue(declaration);
        return {
            dark: makeThemeValues("contextual", [contextualValue]),
            declared: { expression: declaration.initializer, observations, type: declaration.initializerKind },
            dependencies: dependencies.length === 0 ? [`evaluation-context:${declaration.path}`] : dependencies,
            light: makeThemeValues("contextual", [contextualValue]),
            note: `Dart Sass could not reach this root declaration while compiling its source partial${compileError === null ? "." : `: ${compileError}`}`,
            pair: null,
            provenance: "baseline-source-expression",
            status: "contextual",
        };
    }
    return {
        dark: makeThemeValues("resolved", observations),
        declared: { expression: declaration.initializer, observations, type: observation.sassType },
        dependencies,
        light: makeThemeValues("resolved", observations),
        note: "Dart Sass evaluated the rollback-baseline declaration immediately after assignment.",
        pair: null,
        provenance: "dart-sass-declaration-site",
        status: "resolved",
    };
};

const scanRuntimeDeclarations = (source, path) => {
    const root = parseSass(source, path);
    const ordinals = new Map();
    const declarations = [];
    root.walkDecls(declaration => {
        if (declaration.prop.startsWith("$")) return;
        const scope = getScope(declaration);
        const ordinalKey = `${scope.join("/")}|${declaration.prop}`;
        const ordinal = (ordinals.get(ordinalKey) ?? 0) + 1;
        ordinals.set(ordinalKey, ordinal);
        declarations.push({
            key: `${path}|${scope.join("/")}|${declaration.prop}|${ordinal}`,
            line: declaration.source?.start?.line ?? 0,
            path,
            property: declaration.prop,
            scope,
            value: declaration.value,
        });
    });
    return declarations;
};

const countMatches = (source, pattern) => source.match(pattern)?.length ?? 0;

const getVisibility = (declaration, protectedPaths) => {
    if (protectedPaths.has(declaration.path)) return "public-documented";
    if (declaration.scope.length > 1) return "private-local";
    if (declaration.isDefault) return "public-override-hook";
    return "private";
};

const getRationale = ({ declaration, generatedMetadata, migration, runtimeBefore, runtimeAfter, scopeKind }) => {
    if (scopeKind === "supporting-app") {
        return {
            code: "supporting-app-exclusion",
            detail: "Supporting applications are audited, but only their shared spacing and radius consumers are in scope.",
        };
    }
    if (generatedMetadata)
        return { code: "generated-metadata", detail: "Generated icon/codepoint metadata remains Sass." };
    if (migration !== null && runtimeAfter < runtimeBefore) {
        return { code: "runtime-token", detail: "Runtime declarations consume the package-owned CSS token." };
    }
    if (declaration.scope.length > 1)
        return { code: "lexical-local", detail: "Lexical Sass state is not a runtime theme value." };
    if (declaration.initializerKind === "map")
        return { code: "sass-map", detail: "The map drives selector or control-flow generation at compile time." };
    if (runtimeBefore > 0)
        return {
            code: "compile-time-exception",
            detail: "The remaining value is required by documented Sass geometry or control flow.",
        };
    if (declaration.isDefault)
        return { code: "public-api", detail: "The Sass override hook remains available to consumer-authored Sass." };
    return { code: "not-runtime-visual", detail: "The declaration does not feed an emitted runtime visual value." };
};

const getDisposition = ({
    declaration,
    generatedMetadata,
    protectedPath,
    runtimeBefore,
    runtimeAfter,
    scopeKind,
    migration,
}) => {
    if (scopeKind === "supporting-app") return "excluded";
    if (generatedMetadata) return "retained-generated-metadata";
    if (migration !== null && runtimeAfter < runtimeBefore) return "migrated";
    if (declaration.scope.length > 1) return "retained-local";
    if (protectedPath) return "retained-public-api";
    if (declaration.initializerKind === "map" || runtimeBefore > 0) return "retained-compile-time";
    return declaration.isDefault ? "retained-public-api" : "excluded";
};

const extractCssVariables = value => {
    const variables = [];
    for (const match of value.matchAll(CSS_VARIABLE_PATTERN)) variables.push(match[1]);
    return variables;
};

const normalizeVariableName = (name, ownerId) => {
    let normalized = name
        .replace(/^pt-dark-/, "")
        .replace(/^dark-/, "")
        .replace(/^pt-/, "");
    if (ownerId !== "core") normalized = normalized.replace(new RegExp(`^${escapeRegExp(ownerId)}-`), "");
    return normalized;
};

const normalizeMapping = (value, label) => {
    let targets;
    let kind;
    let reconstruction = null;
    let roles = {};
    if (typeof value === "string" || Array.isArray(value)) {
        targets = typeof value === "string" ? [value] : value;
    } else {
        const object = parseObject(value);
        if (object === undefined) {
            throw new Error(`Migration mapping "${label}" must be a string, array, or object.`);
        }
        targets =
            typeof object.targets === "string" ? [object.targets] : assertArray(object.targets, `${label}.targets`);
        if (object.kind !== undefined) kind = assertString(object.kind, `${label}.kind`);
        if (object.reconstruction !== undefined && object.reconstruction !== null) {
            reconstruction = assertString(object.reconstruction, `${label}.reconstruction`);
        }
        const configuredRoles = parseObject(object.roles);
        if (object.roles !== undefined && configuredRoles === undefined) {
            throw new Error(`Migration config field "${label}.roles" must be an object.`);
        }
        roles = Object.fromEntries(
            Object.entries(configuredRoles ?? {}).map(([target, role]) => [
                assertString(target, `${label}.roles target`),
                assertString(role, `${label}.roles.${target}`),
            ]),
        );
    }
    const normalizedTargets = [...new Set(targets.map((target, index) => assertString(target, `${label}[${index}]`)))];
    if (normalizedTargets.length === 0)
        throw new Error(`Migration mapping "${label}" must declare at least one target.`);
    for (const target of Object.keys(roles)) {
        if (!normalizedTargets.includes(target)) {
            throw new Error(`Migration role target "${target}" is not declared by mapping "${label}".`);
        }
    }
    return {
        kind: kind ?? (normalizedTargets.length === 1 ? "direct" : "decomposed"),
        reconstruction,
        roles,
        targets: normalizedTargets,
    };
};

const getManualMapping = ({ declaration, manualMappings, ownerId }) => {
    for (const key of [declaration.id, `${ownerId}:${declaration.name}`, declaration.name]) {
        if (Object.hasOwn(manualMappings, key)) {
            return { key, mapping: normalizeMapping(manualMappings[key], `manualMappings.${key}`) };
        }
    }
    return undefined;
};

const resolveMapping = ({ candidates, declaration, fallbackTokenNames, manualMappings, ownerId }) => {
    const manual = getManualMapping({ declaration, manualMappings, ownerId });
    if (manual !== undefined) {
        return {
            mapping: manual.mapping,
            resolution: { candidates: manual.mapping.targets, configuredBy: manual.key, status: "configured" },
        };
    }

    const runtimeCandidates = [...new Set(candidates.filter(candidate => fallbackTokenNames.has(candidate)))].sort();
    if (runtimeCandidates.length === 1) {
        return {
            mapping: normalizeMapping(runtimeCandidates[0], `inferred target for ${declaration.id}`),
            resolution: { candidates: runtimeCandidates, status: "inferred" },
        };
    }
    if (runtimeCandidates.length > 1) {
        return { mapping: undefined, resolution: { candidates: runtimeCandidates, status: "ambiguous" } };
    }

    const normalized = normalizeVariableName(declaration.name, ownerId);
    const exactCandidates = [...new Set([`--bp-${normalized}`, `--bp-${ownerId}-${normalized}`])].filter(candidate =>
        fallbackTokenNames.has(candidate),
    );
    const nameCandidates =
        exactCandidates.length > 0
            ? exactCandidates
            : [...fallbackTokenNames].filter(candidate => candidate.endsWith(`-${normalized}`)).sort();
    if (nameCandidates.length === 1) {
        return {
            mapping: normalizeMapping(nameCandidates[0], `inferred target for ${declaration.id}`),
            resolution: { candidates: nameCandidates, status: "inferred" },
        };
    }
    if (nameCandidates.length > 1) {
        return { mapping: undefined, resolution: { candidates: nameCandidates, status: "ambiguous" } };
    }
    return { mapping: undefined, resolution: { candidates: [], status: "not-applicable" } };
};

const makeMigration = (mapping, tokenOwners, fallbackOwner) => ({
    kind: mapping.kind,
    reconstruction: mapping.reconstruction,
    targets: mapping.targets.map(cssVariable => ({
        cssVariable,
        owner: tokenOwners.get(cssVariable) ?? fallbackOwner,
        resolved: { dark: null, light: null, status: "pending-generated-token" },
        role: mapping.roles[cssVariable] ?? null,
    })),
});

const applyMigrationOverride = (migration, value, label) => {
    if (value === undefined) return migration;
    const override = parseObject(value);
    if (override === undefined) throw new Error(`Migration config field "${label}" must be an object.`);
    if (migration === null) throw new Error(`Migration override "${label}" has no configured or inferred targets.`);
    const kind = override.kind === undefined ? migration.kind : assertString(override.kind, `${label}.kind`);
    const reconstruction =
        override.reconstruction === undefined
            ? migration.reconstruction
            : override.reconstruction === null
              ? null
              : assertString(override.reconstruction, `${label}.reconstruction`);
    const roles = parseObject(override.roles);
    if (override.roles !== undefined && roles === undefined) {
        throw new Error(`Migration config field "${label}.roles" must be an object.`);
    }
    const targetNames = new Set(migration.targets.map(target => target.cssVariable));
    for (const target of Object.keys(roles ?? {})) {
        if (!targetNames.has(target)) {
            throw new Error(`Migration role target "${target}" is not declared by override "${label}".`);
        }
    }
    return {
        kind,
        reconstruction,
        targets: migration.targets.map(target => ({
            ...target,
            role:
                roles !== undefined && Object.hasOwn(roles, target.cssVariable)
                    ? assertString(roles[target.cssVariable], `${label}.roles.${target.cssVariable}`)
                    : target.role,
        })),
    };
};

const propagateThemePairTargets = (entries, tokens) => {
    const tokenOwners = new Map(tokens.map(token => [token.cssVariable, token.owner]));
    const groups = new Map();
    for (const entry of entries) {
        const ownerId = entry.id.slice(0, entry.id.indexOf(":"));
        const key = `${ownerId}:${normalizeVariableName(entry.name, ownerId)}`;
        const group = groups.get(key) ?? [];
        group.push(entry);
        groups.set(key, group);
    }

    for (const group of groups.values()) {
        const targets = new Set(
            group.flatMap(entry => entry.migration?.targets.map(target => target.cssVariable) ?? []),
        );
        if (targets.size !== 1) continue;
        const [cssVariable] = targets;
        for (const entry of group) {
            if (
                entry.migration !== null ||
                entry.scopeKind === "supporting-app" ||
                entry.originalRuntimeUses.length === 0 ||
                entry.remainingRuntimeUses.length >= entry.originalRuntimeUses.length ||
                entry.resolution.status === "ambiguous"
            ) {
                continue;
            }
            entry.migration = {
                kind: "theme-pair",
                reconstruction: null,
                targets: [
                    {
                        cssVariable,
                        owner: tokenOwners.get(cssVariable) ?? entry.owner,
                        resolved: { dark: null, light: null, status: "pending-generated-token" },
                        role: null,
                    },
                ],
            };
            entry.resolution = { candidates: [cssVariable], status: "inferred" };
            entry.disposition = "migrated";
            entry.rationale = {
                code: "theme-paired-runtime-token",
                detail: "The light and dark Sass values map to one theme-aware CSS token.",
            };
        }
    }
    return entries;
};

const isDarkSassName = name => /^(?:pt-)?dark-/.test(name);

const applySassThemePairs = entries => {
    const groups = new Map();
    for (const entry of entries) {
        if (entry.scope.length !== 1 || entry.sassResolution.status !== "resolved") continue;
        const ownerId = entry.id.slice(0, entry.id.indexOf(":"));
        const key = `${ownerId}:${entry.path}:${normalizeVariableName(entry.name, ownerId)}`;
        const group = groups.get(key) ?? [];
        group.push(entry);
        groups.set(key, group);
    }

    for (const group of groups.values()) {
        const lightEntries = group
            .filter(entry => !isDarkSassName(entry.name))
            .sort((a, b) => a.id.localeCompare(b.id));
        const darkEntries = group.filter(entry => isDarkSassName(entry.name)).sort((a, b) => a.id.localeCompare(b.id));
        if (lightEntries.length === 0 || lightEntries.length !== darkEntries.length) continue;
        for (let index = 0; index < lightEntries.length; index++) {
            const lightEntry = lightEntries[index];
            const darkEntry = darkEntries[index];
            const lightTargets = new Set(lightEntry.migration?.targets.map(target => target.cssVariable) ?? []);
            const darkTargets = new Set(darkEntry.migration?.targets.map(target => target.cssVariable) ?? []);
            const sharesTarget = [...lightTargets].some(target => darkTargets.has(target));
            if ((lightTargets.size > 0 || darkTargets.size > 0) && !sharesTarget) continue;
            const light = lightEntry.sassResolution.declared.observations[0];
            const dark = darkEntry.sassResolution.declared.observations[0];
            if (light === undefined || dark === undefined) continue;
            const pair = { darkEntryId: darkEntry.id, lightEntryId: lightEntry.id };
            for (const entry of [lightEntry, darkEntry]) {
                entry.sassResolution = {
                    ...entry.sassResolution,
                    dark: makeThemeValues("resolved", [dark]),
                    light: makeThemeValues("resolved", [light]),
                    note: "Dart Sass evaluated both rollback-baseline declarations; this explicit pair supplies the light and dark values.",
                    pair,
                };
            }
        }
    }
    return entries;
};

const flattenTokens = (value, path = [], inheritedType) => {
    const object = parseObject(value);
    if (object === undefined) return [];
    const tokenType = typeof object.$type === "string" ? object.$type : inheritedType;
    if (Object.hasOwn(object, "$value")) {
        return [{ path: path.join("."), type: tokenType, value: object.$value }];
    }
    return Object.entries(object).flatMap(([key, child]) =>
        key.startsWith("$") ? [] : flattenTokens(child, [...path, key], tokenType),
    );
};

const readTokenSources = async (repositoryRoot, tokenConfigs) => {
    const tokenFiles = [];
    for (const tokenConfig of tokenConfigs) {
        const configPath = resolve(repositoryRoot, tokenConfig.config);
        if (!(await fs.pathExists(configPath))) continue;
        const config = await fs.readJson(configPath);
        const configDirectory = dirname(configPath);
        for (const layer of ["base", "dark"]) {
            for (const pattern of config.source?.[layer] ?? []) {
                for (const file of await glob(resolve(configDirectory, pattern), { nodir: true })) {
                    tokenFiles.push({ file, layer, owner: tokenConfig.owner });
                }
            }
        }
    }

    const tokens = [];
    for (const tokenFile of tokenFiles) {
        const contents = await fs.readJson(tokenFile.file);
        for (const token of flattenTokens(contents)) {
            tokens.push({
                ...token,
                cssVariable: `--bp-${token.path.replaceAll(".", "-")}`,
                file: normalizePath(relative(repositoryRoot, tokenFile.file)),
                layer: tokenFile.layer,
                owner: tokenFile.owner,
            });
        }
    }
    return tokens;
};

const readGeneratedDefaults = async (repositoryRoot, tokenConfigs) => {
    const defaults = new Map();
    for (const tokenConfig of tokenConfigs) {
        const configPath = resolve(repositoryRoot, tokenConfig.config);
        if (!(await fs.pathExists(configPath))) continue;
        const config = await fs.readJson(configPath);
        const outputPath = resolve(dirname(configPath), config.output);
        if (!(await fs.pathExists(outputPath))) continue;
        const root = postcss.parse(await fs.readFile(outputPath, "utf8"), { from: outputPath });
        const light = new Map();
        const dark = new Map();
        root.nodes.forEach(node => {
            if (node.type !== "rule") return;
            const target =
                node.selector === ":root" || node.selector === '[data-bp-color-scheme="light"]'
                    ? light
                    : node.selector === '[data-bp-color-scheme="dark"]'
                      ? dark
                      : undefined;
            if (target !== undefined) {
                node.walkDecls(/^--bp-/, declaration => target.set(declaration.prop, declaration.value));
            }
        });
        for (const [name, value] of light) {
            defaults.set(name, { dark: dark.get(name) ?? value, light: value, owner: tokenConfig.owner });
        }
    }

    const resolveValue = (value, theme, seen = new Set()) =>
        value.replace(/var\((--bp-[a-z0-9-]+)\)/g, (match, reference) => {
            if (seen.has(reference)) return match;
            const referenced = defaults.get(reference)?.[theme];
            return referenced === undefined ? match : resolveValue(referenced, theme, new Set([...seen, reference]));
        });

    for (const [name, value] of defaults) {
        value.light = resolveValue(value.light, "light", new Set([name]));
        value.dark = resolveValue(value.dark, "dark", new Set([name]));
    }
    return defaults;
};

const getBaselineFiles = (repositoryRoot, baseline, roots) => {
    const output = execFileSync("git", ["ls-tree", "-r", "--name-only", baseline, "--", ...roots], {
        cwd: repositoryRoot,
        encoding: "utf8",
    });
    return output.split("\n").filter(path => path.endsWith(".scss"));
};

const getCurrentFiles = (repositoryRoot, roots) => {
    const output = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "--", ...roots], {
        cwd: repositoryRoot,
        encoding: "utf8",
    });
    return output.split("\n").filter(path => path.endsWith(".scss"));
};

const readGitFile = (repositoryRoot, baseline, path) =>
    execFileSync("git", ["show", `${baseline}:${path}`], { cwd: repositoryRoot, encoding: "utf8" });

const pathMatchesOwner = (path, owner) => owner.roots.some(root => path === root || path.startsWith(`${root}/`));

const isGeneratedMetadata = (path, name, owner) =>
    owner === "icons" &&
    (path.includes("/generated/") || path.includes("/templates/") || /(?:^|-)(?:codepoints?|font)(?:$|-)/.test(name));

const makeFacts = async (config, repositoryRoot, tokens) => {
    const protectedPaths = new Set(config.protectedFiles.map(file => file.path));
    const tokenOwners = new Map(tokens.map(token => [token.cssVariable, token.owner]));
    const tokenNamesByOwner = new Map();
    for (const token of tokens) {
        const ownerTokens = tokenNamesByOwner.get(token.owner) ?? new Set();
        ownerTokens.add(token.cssVariable);
        tokenNamesByOwner.set(token.owner, ownerTokens);
    }
    const allRoots = [...new Set(config.owners.flatMap(owner => owner.roots))];
    const baselinePaths = new Set(getBaselineFiles(repositoryRoot, config.baseline, allRoots));
    const currentPaths = new Set(getCurrentFiles(repositoryRoot, allRoots));
    const paths = [...new Set([...baselinePaths, ...currentPaths])].sort();
    const baselineSources = new Map();
    const currentSources = new Map();
    const baselineRuntime = [];
    const currentRuntime = [];
    const currentRuntimeByKey = new Map();

    for (const path of paths) {
        if (baselinePaths.has(path)) {
            const baselineSource = readGitFile(repositoryRoot, config.baseline, path);
            baselineSources.set(path, baselineSource);
            baselineRuntime.push(...scanRuntimeDeclarations(baselineSource, path));
        }
        const currentPath = resolve(repositoryRoot, path);
        if (currentPaths.has(path) && (await fs.pathExists(currentPath))) {
            const currentSource = await fs.readFile(currentPath, "utf8");
            currentSources.set(path, currentSource);
            for (const declaration of scanRuntimeDeclarations(currentSource, path)) {
                currentRuntime.push(declaration);
                currentRuntimeByKey.set(declaration.key, declaration);
            }
        }
    }

    const entries = [];
    for (const owner of config.owners) {
        const ownerPaths = paths.filter(path => pathMatchesOwner(path, owner));
        const baselineOwnerSource = ownerPaths.map(path => baselineSources.get(path) ?? "").join("\n");
        const currentOwnerSource = ownerPaths.map(path => currentSources.get(path) ?? "").join("\n");
        const baselineOwnerDeclarations = ownerPaths.flatMap(path =>
            scanDeclarations(baselineSources.get(path) ?? "", path, owner.id),
        );
        const currentOwnerDeclarations = ownerPaths.flatMap(path =>
            currentSources.has(path) ? scanDeclarations(currentSources.get(path), path, owner.id) : [],
        );
        const baselineSassEvaluations = new Map(
            ownerPaths.flatMap(path => {
                const source = baselineSources.get(path);
                if (source === undefined) return [];
                const declarations = scanDeclarations(source, path, owner.id);
                return [
                    [path, evaluateDeclarations({ declarations, ownerId: owner.id, path, repositoryRoot, source })],
                ];
            }),
        );
        const currentSassEvaluations = new Map(
            ownerPaths.flatMap(path => {
                const source = currentSources.get(path);
                if (source === undefined) return [];
                const declarations = scanDeclarations(source, path, owner.id);
                return [
                    [path, evaluateDeclarations({ declarations, ownerId: owner.id, path, repositoryRoot, source })],
                ];
            }),
        );
        for (const path of ownerPaths) {
            const baselineSource = baselineSources.get(path) ?? "";
            const currentSource = currentSources.get(path);
            const baselineDeclarations = scanDeclarations(baselineSource, path, owner.id);
            const baselineDeclarationKeys = new Set(baselineDeclarations.map(item => item.key));
            const currentDeclarations = new Map(
                currentSource === undefined
                    ? []
                    : scanDeclarations(currentSource, path, owner.id).map(item => [item.key, item]),
            );
            for (const declaration of baselineDeclarations) {
                declaration.path = path;
                const currentDeclaration = currentDeclarations.get(declaration.key);
                const pattern = variablePattern(declaration.name);
                const testPattern = variablePattern(declaration.name, "");
                const baselineDeclarationCount = baselineOwnerDeclarations.filter(
                    item => item.name === declaration.name,
                ).length;
                const currentDeclarationCount = currentOwnerDeclarations.filter(
                    item => item.name === declaration.name,
                ).length;
                const useCount = Math.max(0, countMatches(baselineOwnerSource, pattern) - baselineDeclarationCount);
                const remainingUseCount = Math.max(
                    0,
                    countMatches(currentOwnerSource, pattern) - currentDeclarationCount,
                );
                const relevantRuntime = baselineRuntime.filter(
                    runtime =>
                        pathMatchesOwner(runtime.path, owner) &&
                        testPattern.test(runtime.value) &&
                        (declaration.scope.length === 1 ||
                            (runtime.path === path &&
                                declaration.scope.every((scope, index) => runtime.scope[index] === scope))),
                );
                const correspondingCurrentRuntime = relevantRuntime
                    .map(runtime => currentRuntimeByKey.get(runtime.key))
                    .filter(runtime => runtime !== undefined && testPattern.test(runtime.value));
                const currentRelevantRuntime = currentRuntime.filter(
                    runtime =>
                        pathMatchesOwner(runtime.path, owner) &&
                        testPattern.test(runtime.value) &&
                        (declaration.scope.length === 1 ||
                            (runtime.path === path &&
                                declaration.scope.every((scope, index) => runtime.scope[index] === scope))),
                );
                const candidates = relevantRuntime.flatMap(runtime =>
                    extractCssVariables(currentRuntimeByKey.get(runtime.key)?.value ?? ""),
                );
                const mappingResult = resolveMapping({
                    candidates,
                    declaration,
                    fallbackTokenNames: tokenNamesByOwner.get(owner.package) ?? new Set(),
                    manualMappings: config.manualMappings,
                    ownerId: owner.id,
                });
                if (
                    mappingResult.mapping === undefined &&
                    mappingResult.resolution.status === "not-applicable" &&
                    relevantRuntime.length > correspondingCurrentRuntime.length &&
                    declaration.initializerKind !== "map"
                ) {
                    mappingResult.resolution.status = "unresolved";
                }
                const ledgerOverride = parseObject(config.ledgerOverrides[declaration.id]);
                const migration = applyMigrationOverride(
                    mappingResult.mapping === undefined
                        ? null
                        : makeMigration(mappingResult.mapping, tokenOwners, owner.package),
                    ledgerOverride?.migration,
                    `ledgerOverrides.${declaration.id}.migration`,
                );
                const generatedMetadata = isGeneratedMetadata(path, declaration.name, owner.id);
                const sassEvaluation = baselineSassEvaluations.get(path) ?? {
                    compileError: null,
                    observations: new Map(),
                };
                const inferredDisposition = getDisposition({
                    declaration,
                    generatedMetadata,
                    migration,
                    protectedPath: protectedPaths.has(path),
                    runtimeAfter: correspondingCurrentRuntime.length,
                    runtimeBefore: relevantRuntime.length,
                    scopeKind: owner.scopeKind,
                });
                const inferredRationale = getRationale({
                    declaration,
                    generatedMetadata,
                    migration,
                    runtimeAfter: correspondingCurrentRuntime.length,
                    runtimeBefore: relevantRuntime.length,
                    scopeKind: owner.scopeKind,
                });
                const disposition =
                    typeof ledgerOverride?.disposition === "string" ? ledgerOverride.disposition : inferredDisposition;
                const rationaleOverride = parseObject(ledgerOverride?.rationale);
                const rationale =
                    typeof rationaleOverride?.code === "string" && typeof rationaleOverride.detail === "string"
                        ? { code: rationaleOverride.code, detail: rationaleOverride.detail }
                        : inferredRationale;
                entries.push({
                    compatibilityNames:
                        config.compatibilityNames[declaration.id] ??
                        config.compatibilityNames[`${owner.id}:${declaration.name}`] ??
                        [],
                    current:
                        currentDeclaration === undefined
                            ? null
                            : {
                                  declarationText: currentDeclaration.declarationText,
                                  initializer: currentDeclaration.initializer,
                                  initializerKind: currentDeclaration.initializerKind,
                                  isDefault: currentDeclaration.isDefault,
                                  line: currentDeclaration.line,
                                  sha256: currentDeclaration.sha256,
                              },
                    disposition,
                    id: declaration.id,
                    introducedAfterBaseline: null,
                    line: declaration.line,
                    migration,
                    name: declaration.name,
                    original: {
                        declarationText: declaration.declarationText,
                        initializer: declaration.initializer,
                        initializerKind: declaration.initializerKind,
                        isDefault: declaration.isDefault,
                        sha256: declaration.sha256,
                    },
                    originalRuntimeUses: relevantRuntime.map(runtime => ({
                        line: runtime.line,
                        path: runtime.path,
                        property: runtime.property,
                        value: runtime.value,
                    })),
                    owner: owner.package,
                    ownerNameUsage: {
                        ambiguityGroup:
                            baselineDeclarationCount > 1 || currentDeclarationCount > 1
                                ? `${owner.id}:${declaration.name}`
                                : null,
                        declarationCount: baselineDeclarationCount,
                        remainingDeclarationCount: currentDeclarationCount,
                        remainingUseCount,
                        useCount,
                    },
                    path,
                    rationale,
                    remainingRuntimeUseCount: currentRelevantRuntime.length,
                    remainingRuntimeUses: currentRelevantRuntime.map(runtime => ({
                        line: runtime.line,
                        path: runtime.path,
                        property: runtime.property,
                        value: runtime.value,
                    })),
                    resolution: mappingResult.resolution,
                    sassResolution: makeSassResolution({
                        compileError: sassEvaluation.compileError,
                        declaration,
                        generatedMetadata,
                        observations: sassEvaluation.observations.get(declaration.id) ?? [],
                    }),
                    scope: declaration.scope,
                    scopeKind: owner.scopeKind,
                    visibility: getVisibility(declaration, protectedPaths),
                });
            }
            for (const declaration of currentDeclarations.values()) {
                if (baselineDeclarationKeys.has(declaration.key)) continue;
                declaration.path = path;
                const pattern = variablePattern(declaration.name);
                const testPattern = variablePattern(declaration.name, "");
                const currentDeclarationCount = currentOwnerDeclarations.filter(
                    item => item.name === declaration.name,
                ).length;
                const remainingUseCount = Math.max(
                    0,
                    countMatches(currentOwnerSource, pattern) - currentDeclarationCount,
                );
                const currentRelevantRuntime = currentRuntime.filter(
                    runtime =>
                        pathMatchesOwner(runtime.path, owner) &&
                        testPattern.test(runtime.value) &&
                        (declaration.scope.length === 1 ||
                            (runtime.path === path &&
                                declaration.scope.every((scope, index) => runtime.scope[index] === scope))),
                );
                const generatedMetadata = isGeneratedMetadata(path, declaration.name, owner.id);
                const sassEvaluation = currentSassEvaluations.get(path) ?? {
                    compileError: null,
                    observations: new Map(),
                };
                const disposition =
                    owner.scopeKind === "supporting-app"
                        ? "excluded"
                        : generatedMetadata
                          ? "retained-generated-metadata"
                          : declaration.scope.length > 1
                            ? "retained-local"
                            : "retained-compile-time";
                const rationale =
                    owner.scopeKind === "supporting-app"
                        ? {
                              code: "post-baseline-supporting-app",
                              detail: "This supporting-application Sass declaration was introduced after the rollback baseline and remains outside the published-package migration scope.",
                          }
                        : generatedMetadata
                          ? {
                                code: "post-baseline-generated-metadata",
                                detail: "This generated metadata declaration was introduced after the rollback baseline and has no runtime theme value.",
                            }
                          : declaration.scope.length > 1
                            ? {
                                  code: "post-baseline-lexical-helper",
                                  detail: "This lexical Sass helper was introduced after the rollback baseline and remains compile-time state local to its scope.",
                              }
                            : {
                                  code: "post-baseline-compile-time-helper",
                                  detail: "This root Sass helper was introduced after the rollback baseline and remains compile-time state for tokenized output.",
                              };
                entries.push({
                    compatibilityNames:
                        config.compatibilityNames[declaration.id] ??
                        config.compatibilityNames[`${owner.id}:${declaration.name}`] ??
                        [],
                    current: {
                        declarationText: declaration.declarationText,
                        initializer: declaration.initializer,
                        initializerKind: declaration.initializerKind,
                        isDefault: declaration.isDefault,
                        line: declaration.line,
                        sha256: declaration.sha256,
                    },
                    disposition,
                    id: declaration.id,
                    introducedAfterBaseline: {
                        baselineCommit: config.baseline,
                        status: "introduced-after-baseline",
                    },
                    line: declaration.line,
                    migration: null,
                    name: declaration.name,
                    original: null,
                    originalRuntimeUses: [],
                    owner: owner.package,
                    ownerNameUsage: {
                        ambiguityGroup: currentDeclarationCount > 1 ? `${owner.id}:${declaration.name}` : null,
                        declarationCount: 0,
                        remainingDeclarationCount: currentDeclarationCount,
                        remainingUseCount,
                        useCount: 0,
                    },
                    path,
                    rationale,
                    remainingRuntimeUseCount: currentRelevantRuntime.length,
                    remainingRuntimeUses: currentRelevantRuntime.map(runtime => ({
                        line: runtime.line,
                        path: runtime.path,
                        property: runtime.property,
                        value: runtime.value,
                    })),
                    resolution: { candidates: [], status: "not-applicable" },
                    sassResolution: makeSassResolution({
                        compileError: sassEvaluation.compileError,
                        declaration,
                        generatedMetadata,
                        observations: sassEvaluation.observations.get(declaration.id) ?? [],
                    }),
                    scope: declaration.scope,
                    scopeKind: owner.scopeKind,
                    visibility: getVisibility(declaration, protectedPaths),
                });
            }
        }
    }
    return applySassThemePairs(
        propagateThemePairTargets(
            entries.sort((left, right) => left.id.localeCompare(right.id)),
            tokens,
        ),
    );
};

const applyGeneratedDefaults = (entries, defaults) =>
    entries.map(entry => {
        if (entry.migration === null) return entry;
        return {
            ...entry,
            migration: {
                ...entry.migration,
                targets: entry.migration.targets.map(target => {
                    const values = defaults.get(target.cssVariable);
                    return {
                        ...target,
                        resolved:
                            values === undefined
                                ? target.resolved
                                : {
                                      dark: values.dark,
                                      light: values.light,
                                      status: "resolved-token-default",
                                  },
                    };
                }),
            },
        };
    });

const validateTokenGraph = tokens => {
    const errors = [];
    const baseTokens = new Map();
    const layerTokens = new Map();
    for (const token of tokens) {
        const key = `${token.layer}:${token.cssVariable}`;
        const existing = layerTokens.get(key);
        if (existing !== undefined) {
            errors.push(`Duplicate ${token.layer} token ${token.cssVariable}: ${existing.file} and ${token.file}.`);
        } else {
            layerTokens.set(key, token);
        }
        if (token.layer === "base") baseTokens.set(token.cssVariable, token);
    }
    for (const token of tokens.filter(token => token.layer === "dark")) {
        if (!baseTokens.has(token.cssVariable)) {
            errors.push(`Dark token ${token.cssVariable} has no base declaration (${token.file}).`);
        }
    }
    const allPaths = new Set(tokens.map(token => token.path));
    for (const token of tokens) {
        if (typeof token.value !== "string") continue;
        for (const match of token.value.matchAll(TOKEN_REFERENCE_PATTERN)) {
            const reference = match[1].replace(/\.\$?value$/, "");
            if (!allPaths.has(reference)) errors.push(`Unresolved token reference {${reference}} in ${token.file}.`);
        }
    }
    const graph = new Map();
    for (const token of tokens.filter(token => token.layer === "base")) {
        const references =
            typeof token.value === "string"
                ? [...token.value.matchAll(TOKEN_REFERENCE_PATTERN)].map(match => match[1].replace(/\.\$?value$/, ""))
                : [];
        graph.set(token.path, references);
    }
    const visiting = new Set();
    const visited = new Set();
    const visit = (path, chain) => {
        if (visiting.has(path)) {
            errors.push(`Cyclic token reference: ${[...chain, path].join(" -> ")}.`);
            return;
        }
        if (visited.has(path)) return;
        visiting.add(path);
        for (const reference of graph.get(path) ?? []) visit(reference, [...chain, path]);
        visiting.delete(path);
        visited.add(path);
    };
    for (const path of graph.keys()) visit(path, []);
    return errors;
};

const validateProtectedFiles = async (repositoryRoot, protectedFiles, label = "Protected file") => {
    const errors = [];
    for (const protectedFile of protectedFiles) {
        const path = resolve(repositoryRoot, protectedFile.path);
        if (!(await fs.pathExists(path))) {
            errors.push(`${label} is missing: ${protectedFile.path}.`);
            continue;
        }
        const actual = sha256(await fs.readFile(path));
        if (actual !== protectedFile.sha256) {
            errors.push(`${label} changed: ${protectedFile.path} (expected ${protectedFile.sha256}, got ${actual}).`);
        }
    }
    return errors;
};

const countMixinArguments = parameters => {
    const openParenthesis = parameters.indexOf("(");
    if (openParenthesis === -1) return 0;
    const contents = parameters.slice(openParenthesis + 1, parameters.lastIndexOf(")")).trim();
    if (contents.length === 0) return 0;
    let count = 1;
    let depth = 0;
    for (const character of contents) {
        if (character === "(") depth++;
        else if (character === ")") depth--;
        else if (character === "," && depth === 0) count++;
    }
    return count;
};

const validateMixinCalls = async (repositoryRoot, owners, rules) => {
    const errors = [];
    const requiredRoots = owners.filter(owner => owner.scopeKind === "required").flatMap(owner => owner.roots);
    const files = await glob(
        requiredRoots.map(root => resolve(repositoryRoot, root, "**/*.scss")),
        { nodir: true },
    );
    for (const absolutePath of files) {
        const path = normalizePath(relative(repositoryRoot, absolutePath));
        const root = parseSass(await fs.readFile(absolutePath, "utf8"), path);
        root.walkAtRules("include", include => {
            const name = include.params.match(/^[a-zA-Z0-9_-]+/)?.[0];
            const rule = rules.find(item => item.name === name);
            if (rule === undefined) return;
            const line = include.source?.start?.line ?? 0;
            if (rule.forbid === true) {
                errors.push(`Sass-backed mixin ${name} must not emit Blueprint runtime CSS at ${path}:${line}.`);
            } else if (countMixinArguments(include.params) < rule.minimumArgumentCount) {
                errors.push(
                    `Mixin ${name} must receive at least ${rule.minimumArgumentCount} runtime-safe arguments at ${path}:${line}.`,
                );
            }
            for (const variable of rule.forbidVariables ?? []) {
                if (variablePattern(variable, "").test(include.params)) {
                    errors.push(`Mixin ${name} must not receive Sass variable $${variable} at ${path}:${line}.`);
                }
            }
        });
    }
    return errors;
};

const validateConfigReferences = (entries, config) => {
    const errors = [];
    const ids = new Set(entries.map(entry => entry.id));
    const names = new Set(entries.map(entry => entry.name));
    const ownerNames = new Set(entries.map(entry => `${entry.id.slice(0, entry.id.indexOf(":"))}:${entry.name}`));
    const selectedManualMappings = new Set(
        entries.map(entry => entry.resolution?.configuredBy).filter(key => typeof key === "string"),
    );
    const validatesMappingKey = key => ids.has(key) || ownerNames.has(key) || names.has(key);

    for (const key of Object.keys(config.manualMappings)) {
        if (!validatesMappingKey(key)) errors.push(`Stale manualMappings key: ${key}.`);
        else if (!selectedManualMappings.has(key)) errors.push(`Unused manualMappings key: ${key}.`);
    }
    for (const key of Object.keys(config.compatibilityNames)) {
        if (!validatesMappingKey(key)) errors.push(`Stale compatibilityNames key: ${key}.`);
    }
    for (const key of Object.keys(config.ledgerOverrides)) {
        if (!ids.has(key)) errors.push(`Stale ledgerOverrides key: ${key}.`);
    }
    for (const [index, exception] of config.runtimeExceptions.entries()) {
        if (exception.id !== undefined && !ids.has(exception.id)) {
            errors.push(`Stale runtimeExceptions[${index}].id: ${exception.id}.`);
        }
        if (exception.name !== undefined && !names.has(exception.name)) {
            errors.push(`Stale runtimeExceptions[${index}].name: ${exception.name}.`);
        }
        if (exception.id === undefined && exception.name === undefined) {
            errors.push(`runtimeExceptions[${index}] must reference an entry ID or name.`);
        }
    }
    return errors;
};

const validateEntries = (entries, tokens, config) => {
    const errors = [];
    const ids = new Set();
    const entriesById = new Map(entries.map(entry => [entry.id, entry]));
    const tokenNames = new Set(tokens.map(token => token.cssVariable));
    for (const entry of entries) {
        if (ids.has(entry.id)) errors.push(`Duplicate ledger ID: ${entry.id}.`);
        ids.add(entry.id);
        if (!DISPOSITIONS.has(entry.disposition)) errors.push(`Unclassified ledger entry: ${entry.id}.`);
        const introducedAfterBaseline = parseObject(entry.introducedAfterBaseline);
        if (entry.original === null) {
            if (
                introducedAfterBaseline === undefined ||
                introducedAfterBaseline.status !== "introduced-after-baseline" ||
                introducedAfterBaseline.baselineCommit !== config.baseline
            ) {
                errors.push(`Post-baseline declaration metadata is missing for ${entry.id}.`);
            }
            if (entry.current === null)
                errors.push(`Post-baseline declaration is missing from current Sass: ${entry.id}.`);
            if (entry.originalRuntimeUses.length !== 0 || entry.ownerNameUsage.declarationCount !== 0) {
                errors.push(`Post-baseline declaration contains baseline usage data: ${entry.id}.`);
            }
            if (!entry.rationale?.code?.startsWith("post-baseline-")) {
                errors.push(`Post-baseline declaration rationale is missing for ${entry.id}.`);
            }
        } else if (entry.introducedAfterBaseline !== null) {
            errors.push(`Baseline declaration has invalid introduction metadata: ${entry.id}.`);
        }
        const hasProtectedSassContract = config.protectedFiles.some(file => file.path === entry.path);
        const hasRootDefaultContract = entry.scope.length === 1 && entry.original?.isDefault === true;
        if (
            entry.original !== null &&
            (hasProtectedSassContract || hasRootDefaultContract) &&
            entry.scope.length === 1 &&
            entry.current !== null
        ) {
            if (entry.current.initializer !== entry.original.initializer) {
                errors.push(`Root Sass initializer changed for ${entry.id}.`);
            }
            if (entry.current.isDefault !== entry.original.isDefault) {
                errors.push(`Root Sass !default contract changed for ${entry.id}.`);
            }
            if (entry.current.initializerKind !== entry.original.initializerKind) {
                errors.push(`Root Sass initializer kind changed for ${entry.id}.`);
            }
        }
        if (
            entry.current === null &&
            entry.disposition !== "retained-local" &&
            !(entry.disposition === "migrated" && entry.scope.length > 1)
        ) {
            errors.push(`Sass declaration no longer exists: ${entry.id}.`);
        }
        if (typeof entry.resolution?.status !== "string" || !Array.isArray(entry.resolution.candidates)) {
            errors.push(`Migration resolution status is missing for ${entry.id}.`);
        }
        const sassResolution = parseObject(entry.sassResolution);
        if (sassResolution === undefined || !RESOLVED_VALUE_STATUSES.has(sassResolution.status)) {
            errors.push(`Sass resolution status is missing for ${entry.id}.`);
        } else {
            if (typeof sassResolution.provenance !== "string" || sassResolution.provenance.length === 0) {
                errors.push(`Sass resolution provenance is missing for ${entry.id}.`);
            }
            if (typeof sassResolution.note !== "string" || sassResolution.note.length === 0) {
                errors.push(`Sass resolution note is missing for ${entry.id}.`);
            }
            if (!Array.isArray(sassResolution.dependencies)) {
                errors.push(`Sass resolution dependencies are missing for ${entry.id}.`);
            }
            const declared = parseObject(sassResolution.declared);
            if (
                declared === undefined ||
                typeof declared.expression !== "string" ||
                declared.expression.length === 0 ||
                typeof declared.type !== "string" ||
                declared.type.length === 0 ||
                !Array.isArray(declared.observations)
            ) {
                errors.push(`Declared Sass resolution evidence is missing for ${entry.id}.`);
            } else {
                for (const observation of declared.observations) {
                    if (
                        typeof observation?.sassType !== "string" ||
                        observation.sassType.length === 0 ||
                        typeof observation?.value !== "string" ||
                        observation.value.length === 0
                    ) {
                        errors.push(`Invalid Dart Sass observation for ${entry.id}.`);
                    }
                }
            }
            if (sassResolution.status === "not-applicable") {
                if (sassResolution.light !== null || sassResolution.dark !== null) {
                    errors.push(`Not-applicable Sass resolution must use null theme values for ${entry.id}.`);
                }
                if (sassResolution.dependencies.length === 0) {
                    errors.push(`Not-applicable Sass resolution dependencies are missing for ${entry.id}.`);
                }
            } else {
                for (const theme of ["light", "dark"]) {
                    const value = parseObject(sassResolution[theme]);
                    if (
                        value === undefined ||
                        !["contextual", "resolved"].includes(value.status) ||
                        !Array.isArray(value.values) ||
                        value.values.length === 0 ||
                        value.values.some(
                            observation =>
                                typeof observation?.sassType !== "string" ||
                                observation.sassType.length === 0 ||
                                typeof observation?.value !== "string" ||
                                observation.value.length === 0,
                        )
                    ) {
                        errors.push(`Resolved ${theme} Sass value is missing for ${entry.id}.`);
                    }
                }
            }
            if (
                sassResolution.status === "contextual" &&
                sassResolution.dependencies.length === 0 &&
                (declared === undefined || declared.observations.length === 0)
            ) {
                errors.push(`Contextual Sass resolution has no observations or dependencies for ${entry.id}.`);
            }
            if (
                entry.scopeKind === "required" &&
                entry.scope.length === 1 &&
                entry.disposition !== "retained-generated-metadata" &&
                sassResolution.status !== "resolved"
            ) {
                errors.push(`Required root Sass declaration did not resolve with Dart Sass: ${entry.id}.`);
            }
            const pair = parseObject(sassResolution.pair);
            if (sassResolution.pair !== null && pair === undefined) {
                errors.push(`Sass theme pair metadata is invalid for ${entry.id}.`);
            } else if (pair !== undefined) {
                if (pair.lightEntryId !== entry.id && pair.darkEntryId !== entry.id) {
                    errors.push(`Sass theme pair does not include ${entry.id}.`);
                }
                const counterpartId = pair.lightEntryId === entry.id ? pair.darkEntryId : pair.lightEntryId;
                const counterpart = entriesById.get(counterpartId);
                if (
                    counterpart === undefined ||
                    JSON.stringify(counterpart.sassResolution?.pair) !== JSON.stringify(sassResolution.pair)
                ) {
                    errors.push(`Sass theme pair is not reciprocal for ${entry.id}.`);
                }
            }
        }
        if (entry.migration !== null) {
            if (typeof entry.migration.kind !== "string" || entry.migration.kind.length === 0) {
                errors.push(`Migration kind is missing for ${entry.id}.`);
            }
            if (!Array.isArray(entry.migration.targets) || entry.migration.targets.length === 0) {
                errors.push(`Migration targets are missing for ${entry.id}.`);
            }
            if (
                ["decomposed", "precomposed-fan-out", "reconstructed"].includes(entry.migration.kind) &&
                (typeof entry.migration.reconstruction !== "string" || entry.migration.reconstruction.length === 0)
            ) {
                errors.push(`Migration reconstruction is missing for ${entry.id}.`);
            }
            if (
                entry.migration.kind === "decomposed" &&
                entry.migration.targets.some(target => typeof target.role !== "string" || target.role.length === 0)
            ) {
                errors.push(`Decomposed migration target roles are missing for ${entry.id}.`);
            }
            const migrationTargets = new Set();
            for (const target of entry.migration.targets ?? []) {
                if (migrationTargets.has(target.cssVariable)) {
                    errors.push(`Duplicate migration target ${target.cssVariable} for ${entry.id}.`);
                }
                migrationTargets.add(target.cssVariable);
                if (!tokenNames.has(target.cssVariable)) {
                    errors.push(`Target token ${target.cssVariable} for ${entry.id} is not declared.`);
                }
                if (entry.disposition === "migrated" && target.resolved?.status !== "resolved-token-default") {
                    errors.push(`Resolved token defaults for ${target.cssVariable} are unavailable for ${entry.id}.`);
                }
            }
        }
        if (entry.disposition === "migrated") {
            if (entry.migration === null) errors.push(`Migrated entry has no target tokens: ${entry.id}.`);
        }
        const unapprovedUses = entry.remainingRuntimeUses.filter(use => {
            if (entry.scopeKind === "supporting-app") return false;
            if (entry.disposition === "retained-generated-metadata") return false;
            if (config.protectedFiles.some(file => file.path === use.path)) return false;
            return !config.runtimeExceptions.some(
                item =>
                    (item.id === entry.id || item.name === entry.name) &&
                    (item.path === undefined || item.path === use.path),
            );
        });
        if (unapprovedUses.length > 0) {
            const locations = unapprovedUses.map(use => `${use.path}:${use.line}`).join(", ");
            errors.push(`Eligible Sass value still reaches runtime declarations for ${entry.id}: ${locations}.`);
        }
        const noTargetException = config.runtimeExceptions.some(
            item => (item.id === entry.id || item.name === entry.name) && item.allowNoTarget === true,
        );
        if (
            entry.scopeKind === "required" &&
            entry.original !== null &&
            entry.originalRuntimeUses.length > 0 &&
            entry.remainingRuntimeUses.length === 0 &&
            entry.migration === null &&
            entry.original.initializerKind !== "map" &&
            entry.disposition !== "retained-generated-metadata" &&
            !noTargetException
        ) {
            if (entry.resolution?.status === "ambiguous") {
                errors.push(
                    `Runtime Sass declaration has ambiguous package-owned target tokens for ${entry.id}: ${entry.resolution.candidates.join(", ")}. Configure manualMappings with this stable ID.`,
                );
            } else {
                errors.push(`Runtime Sass declaration was removed without target tokens: ${entry.id}.`);
            }
        }
    }
    return errors;
};

const readConfig = async (configPath, repositoryRoot) => {
    const absoluteConfigPath = resolve(repositoryRoot, configPath);
    const raw = parseObject(await fs.readJson(absoluteConfigPath));
    if (raw === undefined) throw new Error("Migration config must be a JSON object.");
    return {
        artifactFiles: assertArray(raw.artifactFiles ?? [], "artifactFiles"),
        baseline: assertString(raw.baseline, "baseline"),
        compatibilityNames: parseObject(raw.compatibilityNames) ?? {},
        configDirectory: dirname(absoluteConfigPath),
        ledger: assertString(raw.ledger, "ledger"),
        ledgerOverrides: parseObject(raw.ledgerOverrides) ?? {},
        manualMappings: parseObject(raw.manualMappings) ?? {},
        mixinCallRules: assertArray(raw.mixinCallRules ?? [], "mixinCallRules"),
        owners: assertArray(raw.owners, "owners").map((ownerValue, index) => {
            const owner = parseObject(ownerValue);
            if (owner === undefined) throw new Error(`Migration owner ${index} must be an object.`);
            return {
                id: assertString(owner.id, `owners[${index}].id`),
                package: assertString(owner.package, `owners[${index}].package`),
                roots: assertArray(owner.roots, `owners[${index}].roots`).map(String),
                scopeKind: assertString(owner.scopeKind, `owners[${index}].scopeKind`),
            };
        }),
        protectedFiles: assertArray(raw.protectedFiles, "protectedFiles"),
        runtimeExceptions: assertArray(raw.runtimeExceptions ?? [], "runtimeExceptions"),
        tokenConfigs: assertArray(raw.tokenConfigs, "tokenConfigs"),
    };
};

/**
 * Refreshes and validates the exhaustive Sass-variable migration ledger.
 *
 * @param {string} configPath path to the migration audit config
 * @param {{ repositoryRoot: string; write?: boolean }} options validation options
 */
export const validateSassVariableMigration = async (configPath, options) => {
    const repositoryRoot = resolve(options.repositoryRoot);
    const config = await readConfig(configPath, repositoryRoot);
    const tokens = await readTokenSources(repositoryRoot, config.tokenConfigs);
    const defaults = await readGeneratedDefaults(repositoryRoot, config.tokenConfigs);
    const generatedEntries = applyGeneratedDefaults(await makeFacts(config, repositoryRoot, tokens), defaults);
    const ledgerPath = resolve(config.configDirectory, config.ledger);

    if (options.write) {
        const prettierConfig = (await resolveConfig(ledgerPath)) ?? {};
        const formattedLedger = await format(
            JSON.stringify({
                baseline: config.baseline,
                entries: generatedEntries,
                schemaVersion: LEDGER_SCHEMA_VERSION,
            }),
            { ...prettierConfig, filepath: ledgerPath },
        );
        await fs.outputFile(ledgerPath, formattedLedger);
    }

    const errors = [];
    const warnings = [];
    let entries = generatedEntries;
    if (await fs.pathExists(ledgerPath)) {
        const ledger = await fs.readJson(ledgerPath);
        const ledgerEntries = ledger.entries ?? [];
        if (ledger.schemaVersion !== LEDGER_SCHEMA_VERSION) {
            errors.push(
                `Unsupported Sass migration ledger schema ${String(ledger.schemaVersion)}; expected ${LEDGER_SCHEMA_VERSION}.`,
            );
            entries = generatedEntries;
        } else {
            entries = ledgerEntries;
        }
        if (!options.write && JSON.stringify(ledgerEntries) !== JSON.stringify(generatedEntries)) {
            errors.push(`Ledger is stale. Run validate-sass-variable-migration ${configPath} --write.`);
        }
    } else {
        errors.push(`Ledger is missing: ${normalizePath(relative(repositoryRoot, ledgerPath))}.`);
    }

    errors.push(...validateTokenGraph(tokens));
    errors.push(...(await validateProtectedFiles(repositoryRoot, config.protectedFiles)));
    errors.push(...(await validateProtectedFiles(repositoryRoot, config.artifactFiles, "Compatibility artifact")));
    errors.push(...(await validateMixinCalls(repositoryRoot, config.owners, config.mixinCallRules)));
    errors.push(...validateConfigReferences(generatedEntries, config));
    errors.push(...validateEntries(entries, tokens, config));
    if (defaults.size === 0)
        warnings.push("Generated token CSS was not found; resolved token defaults remain pending.");
    return { entries, errors, warnings };
};
