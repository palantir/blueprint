/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { wcagContrast } from "culori";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type TokenTree = Readonly<Record<string, unknown>>;

type Theme = {
    readonly name: "light" | "dark";
    readonly tokens: TokenTree;
};

type ResolvedColor = {
    readonly hex: string;
    readonly path: string;
};

type ColorResolutionError =
    | { readonly cycle: readonly string[]; readonly tag: "circular-reference" }
    | { readonly path: string; readonly tag: "invalid-color" }
    | { readonly path: string; readonly tag: "missing-token" };

type ColorResolution =
    | { readonly hex: string; readonly tag: "resolved" }
    | { readonly error: ColorResolutionError; readonly tag: "unresolved" };

type ContrastFailure =
    | {
          readonly error: ColorResolutionError;
          readonly tag: "unresolved-color";
          readonly theme: Theme["name"];
      }
    | {
          readonly foreground: ResolvedColor;
          readonly ratio: number;
          readonly surface: ResolvedColor;
          readonly tag: "insufficient-contrast";
          readonly theme: Theme["name"];
      };

type ContrastAudit = {
    readonly failures: readonly ContrastFailure[];
    readonly pairCount: number;
};

const MINIMUM_TEXT_CONTRAST = 4.5;
const EXPECTED_SOLID_SURFACE_PAIR_COUNT = 15;
const TOKEN_REFERENCE_PATTERN = /^\{([^}]+)\}$/;

const parseObject = (value: unknown): TokenTree | undefined =>
    typeof value === "object" && value !== null && !Array.isArray(value)
        ? Object.fromEntries(Object.entries(value))
        : undefined;

const readTokenTree = (relativePath: string): TokenTree => {
    const parsed: unknown = JSON.parse(readFileSync(new URL(relativePath, import.meta.url), "utf8"));
    const tree = parseObject(parsed);
    if (tree === undefined) throw new Error(`Expected a token object in ${relativePath}`);
    return tree;
};

const mergeTokenTrees = (base: TokenTree, overrides: TokenTree): TokenTree =>
    Object.fromEntries(
        [...new Set([...Object.keys(base), ...Object.keys(overrides)])].map(key => {
            if (!Object.hasOwn(overrides, key)) return [key, base[key]];

            const baseObject = parseObject(base[key]);
            const overrideObject = parseObject(overrides[key]);
            const value =
                baseObject !== undefined && overrideObject !== undefined
                    ? mergeTokenTrees(baseObject, overrideObject)
                    : overrides[key];
            return [key, value];
        }),
    );

const getValueAtPath = (tokens: TokenTree, path: string): unknown =>
    path.split(".").reduce<unknown>((value, segment) => parseObject(value)?.[segment], tokens);

const parseTokenReference = (value: unknown): string | undefined =>
    typeof value === "string" ? value.match(TOKEN_REFERENCE_PATTERN)?.[1] : undefined;

const resolveColorHex = (tokens: TokenTree, path: string, visited: readonly string[] = []): ColorResolution => {
    if (visited.includes(path)) {
        return { error: { cycle: [...visited, path], tag: "circular-reference" }, tag: "unresolved" };
    }

    const token = parseObject(getValueAtPath(tokens, path));
    if (token === undefined) return { error: { path, tag: "missing-token" }, tag: "unresolved" };

    const value = token.$value;
    const reference = parseTokenReference(value);
    if (reference !== undefined) return resolveColorHex(tokens, reference, [...visited, path]);

    const color = parseObject(value);
    const hex = color?.hex;
    return typeof hex === "string"
        ? { hex, tag: "resolved" }
        : { error: { path, tag: "invalid-color" }, tag: "unresolved" };
};

const findSolidSurfacePairs = (
    tokens: TokenTree,
): ReadonlyArray<{ readonly foreground: string; readonly surface: string }> => {
    const backgrounds = parseObject(getValueAtPath(tokens, "surface.background-color"));
    if (backgrounds === undefined) return [];

    return Object.entries(backgrounds).flatMap(([intent, value]) => {
        const states = intent === "base" ? undefined : parseObject(value);
        if (states === undefined) return [];

        return Object.keys(states).map(state => ({
            foreground: `intent.${intent}.foreground`,
            surface: `surface.background-color.${intent}.${state}`,
        }));
    });
};

const checkPairContrast = (
    theme: Theme,
    pair: { readonly foreground: string; readonly surface: string },
): readonly ContrastFailure[] => {
    const foreground = resolveColorHex(theme.tokens, pair.foreground);
    const surface = resolveColorHex(theme.tokens, pair.surface);

    if (foreground.tag === "unresolved") {
        return [{ error: foreground.error, tag: "unresolved-color", theme: theme.name }];
    }
    if (surface.tag === "unresolved") {
        return [{ error: surface.error, tag: "unresolved-color", theme: theme.name }];
    }

    const ratio = wcagContrast(foreground.hex, surface.hex);
    return ratio < MINIMUM_TEXT_CONTRAST
        ? [
              {
                  foreground: { hex: foreground.hex, path: pair.foreground },
                  ratio,
                  surface: { hex: surface.hex, path: pair.surface },
                  tag: "insufficient-contrast",
                  theme: theme.name,
              },
          ]
        : [];
};

const auditThemeContrast = (theme: Theme): ContrastAudit => {
    const pairs = findSolidSurfacePairs(theme.tokens);
    const failures = pairs.flatMap(pair => checkPairContrast(theme, pair));

    return { failures, pairCount: pairs.length };
};

const formatColorResolutionError = (error: ColorResolutionError): string => {
    switch (error.tag) {
        case "circular-reference":
            return `Circular token reference: ${error.cycle.join(" -> ")}`;
        case "invalid-color":
            return `Token does not resolve to a color with a hex fallback: ${error.path}`;
        case "missing-token":
            return `Missing token: ${error.path}`;
    }
};

const formatContrastFailure = (failure: ContrastFailure): string => {
    if (failure.tag === "unresolved-color") {
        return `${failure.theme}: ${formatColorResolutionError(failure.error)}`;
    }

    return (
        `${failure.theme} ${failure.surface.path} (${failure.surface.hex}) with ` +
        `${failure.foreground.path} (${failure.foreground.hex}): ${failure.ratio.toFixed(2)}:1`
    );
};

const lightTokens = [
    readTokenTree("./tokens/next/palette.bp7.tokens.json"),
    readTokenTree("./tokens/next/intent.bp7.tokens.json"),
    readTokenTree("./tokens/next/surface.bp7.tokens.json"),
].reduce(mergeTokenTrees);

const darkOverrides = [
    readTokenTree("./tokens/next/palette.bp7.dark.tokens.json"),
    readTokenTree("./tokens/next/surface.bp7.dark.tokens.json"),
].reduce(mergeTokenTrees);

const THEMES: readonly Theme[] = [
    { name: "light", tokens: lightTokens },
    { name: "dark", tokens: mergeTokenTrees(lightTokens, darkOverrides) },
];

describe("BP7 solid intent surface contrast", () => {
    it.each(THEMES)("resolves and checks every $name foreground and state", theme => {
        const audit = auditThemeContrast(theme);

        expect(audit.pairCount).toBe(EXPECTED_SOLID_SURFACE_PAIR_COUNT);
        expect(audit.failures.map(formatContrastFailure)).toEqual([]);
    });
});
