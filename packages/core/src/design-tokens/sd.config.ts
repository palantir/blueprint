/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */

/**
 * @module sd.config
 * @layer Infrastructure
 *
 * Style Dictionary v5 configuration for DTCG token format to CSS variables.
 * Transforms handle OKLCH colors, dimensions, shadows, and Blueprint's derive extension.
 */

import { register } from "@tokens-studio/sd-transforms";
import { formatHex, formatHex8, oklch, parse } from "culori";
import StyleDictionary from "style-dictionary";
import type { Config, TransformedToken } from "style-dictionary/types";

// -- Types --------------------------------------------------------------------

/**
 * A DTCG-format color value with a color space, component channels, and optional alpha/hex.
 *
 * @see https://tr.designtokens.org/format/#color
 */
type DTCGColor = {
    readonly colorSpace: "oklch" | "srgb";
    readonly components: readonly [number, number, number];
    readonly alpha?: number;
    readonly hex?: string;
};

/** A DTCG-format dimension value consisting of a numeric value and CSS unit. */
type DTCGDimension = {
    readonly value: number;
    readonly unit: string;
};

/** A DTCG-format shadow value with color, offsets, blur, and optional spread/inset. */
type DTCGShadow = {
    readonly color: DTCGColor;
    readonly offsetX: DTCGDimension;
    readonly offsetY: DTCGDimension;
    readonly blur: DTCGDimension;
    readonly spread?: DTCGDimension;
    readonly inset?: boolean;
};

/**
 * A discriminated union representing a modification to a single OKLCH color channel.
 * - `"Offset"`: adds a fixed value to the channel (e.g. lightness + 0.1).
 * - `"Scale"`: multiplies the channel by a factor (e.g. chroma * 0.5).
 */
type ChannelModification =
    | { readonly tag: "Offset"; readonly value: number }
    | { readonly tag: "Scale"; readonly factor: number };

/**
 * Describes how to derive a new color from a base token using OKLCH channel modifications.
 * Parsed from the `com.blueprint.derive` token extension. Alpha can be a literal number
 * or a token reference string (e.g. `"{opacity.50}"`).
 */
type ColorDerivation = {
    readonly alpha?: number | string;
    readonly lightness?: ChannelModification;
    readonly chroma?: ChannelModification;
    readonly hue?: ChannelModification;
};

/** Known Blueprint role tags that modify how a token's CSS value is emitted. */
type BlueprintRoleTag = "stackable-layer";

/** A tagged wrapper for a Blueprint role parsed from the `com.blueprint.role` extension. */
type BlueprintRole = {
    readonly tag: "BlueprintRole";
    readonly role: BlueprintRoleTag;
};

/** An OKLCH color representation compatible with the culori library. */
type OklchColor = {
    readonly mode: "oklch";
    readonly l: number;
    readonly c: number;
    readonly h: number;
    readonly alpha?: number;
};

/**
 * The result of classifying a token for progressive enhancement output.
 * - `fallbackValue`: the fallback hex value (for browsers without relative color syntax).
 * - `modernValue`: the relative color syntax value (emitted inside `@supports`), or
 *   `undefined` if the token does not require progressive enhancement.
 */
type TokenClassification = {
    readonly name: string;
    readonly fallbackValue: string;
    readonly modernValue: string | undefined;
    readonly description: string | undefined;
};

/**
 * A generic definition for a Style Dictionary value transform.
 * Pairs a parser (unknown → TValue) with a formatter (TValue → CSS string) for a given token type.
 *
 * @template TValue - The intermediate parsed representation of the token value.
 */
type TransformDefinition<TValue> = {
    readonly name: string;
    readonly tokenType: string;
    readonly parse: (value: unknown) => TValue | undefined;
    readonly format: (value: TValue) => string;
};

/** Options passed to the `bp/css/variables` custom format via Style Dictionary's `options` bag. */
type FormatOptions = {
    readonly outputReferences: boolean;
    readonly selector: string;
    readonly onlySourceTokens: boolean;
};

/**
 * Configuration for a single theme (e.g. "light" or "dark").
 * Maps to a Style Dictionary `Config` via {@link makeThemeConfig}.
 */
type ThemeConfig = {
    readonly name: string;
    readonly include?: readonly string[];
    readonly sources: readonly [string, ...string[]];
    readonly selector: string;
    readonly destination: string;
};

/** A resolved build plan pairing a theme name with its Style Dictionary {@link Config}. */
type BuildPlan = {
    readonly themeName: string;
    readonly config: Config;
};

// -- Constants ----------------------------------------------------------------

/** CSS `@supports` query for relative color syntax, used for progressive enhancement. */
const SUPPORTS_RELATIVE_COLOR = "@supports (color: oklch(from var(--any-color) l c h))";

/** All theme configurations to build. Light is the base; dark overrides via `include`. */
const THEMES: readonly ThemeConfig[] = [
    {
        name: "light",
        sources: ["src/design-tokens/tokens/base/**/*.tokens.json"],
        selector: ":root",
        destination: "tokens.css",
    },
    {
        name: "dark",
        include: ["src/design-tokens/tokens/base/**/*.tokens.json"],
        sources: ["src/design-tokens/tokens/themes/dark/**/*.tokens.json"],
        selector: '[data-bp-color-scheme=\"dark\"],\n.bp6-dark',
        destination: "tokens-dark.css",
    },
];

// -- Parsers ------------------------------------------------------------------

/** Narrows an unknown value to a plain object, returning `undefined` for arrays and primitives. */
const parseObject = (value: unknown): Record<string, unknown> | undefined => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return undefined;
    }
    return value as Record<string, unknown>;
};

/** Validates that a value is an array of numbers. */
const parseNumberTuple = (value: unknown): readonly number[] | undefined =>
    Array.isArray(value) && value.every(v => typeof v === "number") ? value : undefined;

/** Validates that a value is an array of strings. */
const parseStringTuple = (value: unknown): readonly string[] | undefined =>
    Array.isArray(value) && value.every(v => typeof v === "string") ? value : undefined;

/** Parses a raw DTCG color object, validating colorSpace, components, and optional alpha/hex. */
const parseDTCGColor = (value: unknown): DTCGColor | undefined => {
    const obj = parseObject(value);
    if (obj === undefined) return undefined;

    const colorSpace = obj.colorSpace;
    if (colorSpace !== "oklch" && colorSpace !== "srgb") return undefined;

    const components = parseNumberTuple(obj.components);
    if (components === undefined || components.length !== 3) return undefined;

    const alpha = obj.alpha;
    if (alpha !== undefined && typeof alpha !== "number") return undefined;

    const hex = obj.hex;
    if (hex !== undefined && typeof hex !== "string") return undefined;

    return {
        colorSpace,
        components: [components[0], components[1], components[2]] as const,
        alpha,
        hex,
    };
};

/** Parses a raw DTCG dimension object, validating value (number) and unit (string). */
const parseDTCGDimension = (value: unknown): DTCGDimension | undefined => {
    const obj = parseObject(value);
    if (obj === undefined) return undefined;

    const numValue = obj.value;
    const unit = obj.unit;

    if (typeof numValue !== "number" || typeof unit !== "string") return undefined;

    return { value: numValue, unit };
};

/** Parses a raw DTCG shadow object, validating color, offsets, blur, and optional spread/inset. */
const parseDTCGShadow = (value: unknown): DTCGShadow | undefined => {
    const obj = parseObject(value);
    if (obj === undefined) return undefined;

    const color = parseDTCGColor(obj.color);
    const offsetX = parseDTCGDimension(obj.offsetX);
    const offsetY = parseDTCGDimension(obj.offsetY);
    const blur = parseDTCGDimension(obj.blur);

    if (color === undefined || offsetX === undefined || offsetY === undefined || blur === undefined) {
        return undefined;
    }

    const spread = parseDTCGDimension(obj.spread);
    const inset = obj.inset;

    return {
        color,
        offsetX,
        offsetY,
        blur,
        spread,
        inset: typeof inset === "boolean" ? inset : undefined,
    };
};

/** Parses a DTCG cubic-bezier value, expecting exactly 4 numbers. */
const parseCubicBezier = (value: unknown): readonly [number, number, number, number] | undefined => {
    const arr = parseNumberTuple(value);
    if (arr === undefined || arr.length !== 4) return undefined;
    return [arr[0], arr[1], arr[2], arr[3]] as const;
};

/** Parses a DTCG fontFamily value, expecting an array of font family strings. */
const parseFontFamily = (value: unknown): readonly string[] | undefined => parseStringTuple(value);

/** Returns the value if it is a DTCG token reference string (e.g. `"{color.primary}"`). */
const parseTokenReference = (value: unknown): string | undefined =>
    typeof value === "string" && value.startsWith("{") && value.endsWith("}") ? value : undefined;

/**
 * Parses an offset or scale channel modification from a derive extension object.
 * Checks the `offsetKey` first; if not found, falls back to `scaleKey`.
 */
const parseChannelModification = (
    derive: Record<string, unknown>,
    offsetKey: string,
    scaleKey: string,
): ChannelModification | undefined => {
    const offset = derive[offsetKey];
    if (typeof offset === "number") {
        return { tag: "Offset", value: offset };
    }
    const scale = derive[scaleKey];
    if (typeof scale === "number") {
        return { tag: "Scale", factor: scale };
    }
    return undefined;
};

/** Parses a {@link ColorDerivation} from a token's `$extensions` object (`com.blueprint.derive`). */
const parseColorDerivation = (ext: unknown): ColorDerivation | undefined => {
    const extObj = parseObject(ext);
    if (extObj === undefined) return undefined;

    const derive = parseObject(extObj["com.blueprint.derive"]);
    if (derive === undefined) return undefined;

    const alpha = derive.alpha;
    const parsedAlpha = typeof alpha === "number" ? alpha : parseTokenReference(alpha);

    return {
        alpha: parsedAlpha,
        lightness: parseChannelModification(derive, "lightnessOffset", "lightnessScale"),
        chroma: parseChannelModification(derive, "chromaOffset", "chromaScale"),
        hue: typeof derive.hueOffset === "number" ? { tag: "Offset", value: derive.hueOffset } : undefined,
    };
};

/** Parses a {@link BlueprintRole} from a token's `$extensions` object (`com.blueprint.role`). */
const parseRole = (ext: unknown): BlueprintRole | undefined => {
    const extObj = parseObject(ext);
    if (extObj === undefined) return undefined;

    const role = extObj["com.blueprint.role"];
    if (role === "stackable-layer") {
        return { tag: "BlueprintRole", role };
    }

    return undefined;
};

/** Parses any CSS color string into an {@link OklchColor} via culori. Returns `undefined` on failure. */
const parseColorToOklch = (cssValue: string): OklchColor | undefined => {
    const parsed = parse(cssValue);
    if (parsed === undefined) return undefined;

    const converted = oklch(parsed);
    if (converted === undefined) return undefined;

    return {
        mode: "oklch",
        l: converted.l ?? 0,
        c: converted.c ?? 0,
        h: converted.h ?? 0,
        alpha: converted.alpha,
    };
};

// -- Formatters ---------------------------------------------------------------

/** Formats a DTCG OKLCH color as a CSS `oklch()` function string. */
const formatOklchToCss = (color: DTCGColor): string => {
    const [l, c, h] = color.components;
    return color.alpha !== undefined && color.alpha < 1
        ? `oklch(${l} ${c} ${h} / ${color.alpha})`
        : `oklch(${l} ${c} ${h})`;
};

/** Formats a DTCG sRGB color as a CSS `rgb()`/`rgba()` function string. */
const formatSrgbToCss = (color: DTCGColor): string => {
    const [r, g, b] = color.components.map(comp => Math.round(comp * 255));
    return color.alpha !== undefined && color.alpha < 1
        ? `rgba(${r}, ${g}, ${b}, ${color.alpha})`
        : `rgb(${r}, ${g}, ${b})`;
};

/** Dispatches color formatting to the appropriate CSS function based on the color space. */
const formatColorToCss = (color: DTCGColor): string => {
    switch (color.colorSpace) {
        case "oklch":
            return formatOklchToCss(color);
        case "srgb":
            return formatSrgbToCss(color);
    }
};

/** Formats a dimension as a CSS value string (e.g. `"16px"`, `"1.5rem"`). */
const formatDimensionToCss = (dim: DTCGDimension): string => `${dim.value}${dim.unit}`;

/** Formats a DTCG shadow as a CSS `box-shadow` value string. */
const formatShadowToCss = (shadow: DTCGShadow): string => {
    const parts: string[] = [];

    if (shadow.inset) parts.push("inset");
    parts.push(formatDimensionToCss(shadow.offsetX));
    parts.push(formatDimensionToCss(shadow.offsetY));
    parts.push(formatDimensionToCss(shadow.blur));
    if (shadow.spread) parts.push(formatDimensionToCss(shadow.spread));
    parts.push(formatColorToCss(shadow.color));

    return parts.join(" ");
};

/** Formats a 4-point tuple as a CSS `cubic-bezier()` function string. */
const formatCubicBezierToCss = (points: readonly [number, number, number, number]): string =>
    `cubic-bezier(${points.join(", ")})`;

/** Formats font family names as a CSS `font-family` value, quoting names that contain spaces. */
const formatFontFamilyToCss = (families: readonly string[]): string =>
    families.map(f => (f.includes(" ") ? `"${f}"` : f)).join(", ");

/**
 * Wraps an OKLCH channel identifier (e.g. `"l"`) in a CSS `calc()` expression
 * based on the given modification, or returns it unchanged if no modification is needed.
 */
const formatChannelModification = (channel: string, mod: ChannelModification | undefined): string => {
    if (mod === undefined) return channel;

    switch (mod.tag) {
        case "Offset":
            return `calc(${channel} + ${mod.value})`;
        case "Scale":
            return `calc(${channel} * ${mod.factor})`;
    }
};

/** Converts a DTCG token reference (e.g. `"{color.primary}"`) to a CSS `var()` expression. */
const tokenReferenceToVar = (ref: string): string => {
    const path = ref.slice(1, -1).split(".");
    return `var(--bp-${path.join("-")})`;
};

/** Formats an alpha value as a CSS string — either a literal number or a resolved `var()` reference. */
const formatAlpha = (alpha: number | string): string =>
    typeof alpha === "number" ? String(alpha) : tokenReferenceToVar(alpha);

/**
 * Produces a CSS relative color syntax expression: `oklch(from <baseVar> <l> <c> <h> [/ <alpha>])`.
 * Channel modifications are applied as `calc()` wrappers around the implicit `l`, `c`, `h` keywords.
 */
const formatDerivedColorToCss = (baseVar: string, derivation: ColorDerivation): string => {
    const l = formatChannelModification("l", derivation.lightness);
    const c = formatChannelModification("c", derivation.chroma);
    const h = formatChannelModification("h", derivation.hue);

    return derivation.alpha !== undefined
        ? `oklch(from ${baseVar} ${l} ${c} ${h} / ${formatAlpha(derivation.alpha)})`
        : `oklch(from ${baseVar} ${l} ${c} ${h})`;
};

/** Converts an OKLCH color to a hex string (`#RRGGBB` or `#RRGGBBAA`) via culori. */
const formatOklchToHex = (color: OklchColor): string => {
    const hasAlpha = color.alpha !== undefined && color.alpha < 1;
    const formatter = hasAlpha ? formatHex8 : formatHex;
    return formatter(color) ?? formatHex({ mode: "rgb", r: 0, g: 0, b: 0 });
};

// -- Token Accessors ----------------------------------------------------------

/** Retrieves the resolved value from a token, preferring `$value` (DTCG) over `value` (legacy). */
const getTokenValue = (token: TransformedToken): unknown => token.$value ?? token.value;

/** Retrieves the resolved token value coerced to a string. */
const getTokenValueAsString = (token: TransformedToken): string => {
    const value = getTokenValue(token);
    return typeof value === "string" ? value : String(value);
};

/** Attempts to extract a finite number from a token's value. */
const parseTokenValueAsNumber = (token: TransformedToken): number | undefined => {
    const value = getTokenValue(token);
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
};

// -- Fallback Computation -----------------------------------------------------

/** Returns `true` if the CSS value contains `oklch(from ...)` relative color syntax. */
const containsRelativeColorSyntax = (value: string): boolean => value.includes("oklch(from");

/** Returns `true` if the token has a `com.blueprint.derive` extension. */
const hasDeriveExtension = (token: TransformedToken): boolean => {
    const ext = parseObject(token.$extensions ?? token.extensions);
    return ext !== undefined && ext["com.blueprint.derive"] !== undefined;
};

/** Applies an offset or scale modification to a numeric channel value. */
const applyChannelModification = (value: number, mod: ChannelModification | undefined): number => {
    if (mod === undefined) return value;

    switch (mod.tag) {
        case "Offset":
            return value + mod.value;
        case "Scale":
            return value * mod.factor;
    }
};

/**
 * Resolves an alpha value that may be a literal number or a token reference string.
 * Token references are looked up in the provided map and their numeric value is extracted.
 */
const resolveAlphaValue = (
    alpha: number | string | undefined,
    tokenMap: ReadonlyMap<string, TransformedToken>,
): number | undefined => {
    if (alpha === undefined) return undefined;
    if (typeof alpha === "number") return alpha;

    const tokenRef = parseTokenReference(alpha);
    if (tokenRef === undefined) return undefined;

    const refPath = tokenRef.slice(1, -1);
    const referencedToken = tokenMap.get(refPath);
    if (referencedToken === undefined) return undefined;

    return parseTokenValueAsNumber(referencedToken);
};

/** Applies a {@link ColorDerivation} to a base OKLCH color, producing a new OKLCH color. */
const applyDerivationToOklch = (
    base: OklchColor,
    derivation: ColorDerivation,
    resolvedAlpha: number | undefined,
): OklchColor => ({
    mode: "oklch",
    l: applyChannelModification(base.l, derivation.lightness),
    c: applyChannelModification(base.c, derivation.chroma),
    h: applyChannelModification(base.h, derivation.hue),
    alpha: resolvedAlpha ?? base.alpha,
});

/**
 * Computes a static hex fallback for a token that uses `com.blueprint.derive`.
 * Resolves the base token reference, parses it to OKLCH, applies the derivation,
 * and converts the result to hex — used for browsers without relative color syntax.
 */
const computeStaticFallbackForDerivedToken = (
    token: TransformedToken,
    tokenMap: ReadonlyMap<string, TransformedToken>,
): string | undefined => {
    const original = token.original ?? {};
    const originalExt = original.$extensions ?? original.extensions;
    const derivation = parseColorDerivation(originalExt);
    if (derivation === undefined) return undefined;

    const originalValue = original.$value ?? original.value;
    const tokenRef = parseTokenReference(originalValue);
    if (tokenRef === undefined) return undefined;

    const refPath = tokenRef.slice(1, -1);
    const baseToken = tokenMap.get(refPath);
    if (baseToken === undefined) return undefined;

    const fallbackValue = getTokenValue(baseToken);
    if (typeof fallbackValue !== "string") return undefined;

    const baseOklch = parseColorToOklch(fallbackValue);
    if (baseOklch === undefined) return undefined;

    const resolvedAlpha = resolveAlphaValue(derivation.alpha, tokenMap);
    const derivedOklch = applyDerivationToOklch(baseOklch, derivation, resolvedAlpha);
    return formatOklchToHex(derivedOklch);
};

/**
 * Computes a static hex fallback for tokens that reference derived tokens transitively.
 * Walks the reference chain using the fallback cache to find an already-computed hex value.
 */
const computeStaticFallbackForReferencingToken = (
    token: TransformedToken,
    tokenMap: ReadonlyMap<string, TransformedToken>,
    fallbackCache: ReadonlyMap<string, string>,
): string | undefined => {
    const original = token.original ?? {};
    const originalValue = original.$value ?? original.value;
    const tokenRef = parseTokenReference(originalValue);
    if (tokenRef === undefined) return undefined;

    const refPath = tokenRef.slice(1, -1);

    const cachedFallback = fallbackCache.get(refPath);
    if (cachedFallback !== undefined) {
        return cachedFallback;
    }

    const referencedToken = tokenMap.get(refPath);
    if (referencedToken === undefined) return undefined;

    return computeStaticFallbackForReferencingToken(referencedToken, tokenMap, fallbackCache);
};

/** Pass 1: collects hex fallbacks for all tokens with `com.blueprint.derive`. */
const collectDerivedFallbacks = (
    tokens: readonly TransformedToken[],
    tokenMap: ReadonlyMap<string, TransformedToken>,
    fallbacks: Map<string, string>,
): void => {
    for (const token of tokens) {
        if (!hasDeriveExtension(token)) continue;
        const fallback = computeStaticFallbackForDerivedToken(token, tokenMap);
        if (fallback !== undefined) {
            fallbacks.set(token.path.join("."), fallback);
        }
    }
};

/** Pass 2: collects hex fallbacks for tokens that transitively reference derived tokens. */
const collectReferencingFallbacks = (
    tokens: readonly TransformedToken[],
    tokenMap: ReadonlyMap<string, TransformedToken>,
    fallbacks: Map<string, string>,
): void => {
    for (const token of tokens) {
        const tokenPath = token.path.join(".");
        if (fallbacks.has(tokenPath)) continue;
        if (!containsRelativeColorSyntax(getTokenValueAsString(token))) continue;
        const fallback = computeStaticFallbackForReferencingToken(token, tokenMap, fallbacks);
        if (fallback !== undefined) {
            fallbacks.set(tokenPath, fallback);
        }
    }
};

/**
 * Builds a map of token path → static hex fallback for all tokens that use relative color syntax.
 * Two-pass: derived tokens first, then referencing tokens (order matters for cache hits).
 */
const makeFallbackMap = (
    tokens: readonly TransformedToken[],
    tokenMap: ReadonlyMap<string, TransformedToken>,
): ReadonlyMap<string, string> => {
    const fallbacks = new Map<string, string>();
    collectDerivedFallbacks(tokens, tokenMap, fallbacks);
    collectReferencingFallbacks(tokens, tokenMap, fallbacks);
    return fallbacks;
};

/**
 * Classifies a token for progressive enhancement output. Tokens with a fallback get
 * the hex value as `fallbackValue` and the relative color syntax as `modernValue`.
 */
const classifyToken = (token: TransformedToken, fallbackMap: ReadonlyMap<string, string>): TokenClassification => {
    const tokenPath = token.path.join(".");
    const currentValue = getTokenValueAsString(token);
    const fallback = fallbackMap.get(tokenPath);

    if (fallback !== undefined) {
        return {
            name: token.name,
            fallbackValue: fallback,
            modernValue: currentValue,
            description: token.$description,
        };
    }

    return {
        name: token.name,
        fallbackValue: currentValue,
        modernValue: undefined,
        description: token.$description,
    };
};

// -- Transform Definitions ----------------------------------------------------

/**
 * Converts a {@link TransformDefinition} into a Style Dictionary transform registration object.
 * The resulting transform is transitive and filters tokens by `$type` or `type`.
 */
const makeTransformConfig = <TValue>(
    def: TransformDefinition<TValue>,
): Parameters<typeof StyleDictionary.registerTransform>[0] => ({
    name: def.name,
    type: "value",
    transitive: true,
    filter: token => token.$type === def.tokenType || token.type === def.tokenType,
    transform: token => {
        const value = getTokenValue(token);
        if (typeof value === "string") return value;

        const parsed = def.parse(value);
        return parsed !== undefined ? def.format(parsed) : value;
    },
});

/** Transform for DTCG `color` tokens → CSS color functions. */
const colorTransform: TransformDefinition<DTCGColor> = {
    name: "dtcg/color/css",
    tokenType: "color",
    parse: parseDTCGColor,
    format: formatColorToCss,
};

/** Transform for DTCG `dimension` tokens → CSS dimension values. */
const dimensionTransform: TransformDefinition<DTCGDimension> = {
    name: "dtcg/dimension/css",
    tokenType: "dimension",
    parse: parseDTCGDimension,
    format: formatDimensionToCss,
};

/** Transform for DTCG `duration` tokens → CSS duration values. */
const durationTransform: TransformDefinition<DTCGDimension> = {
    name: "dtcg/duration/css",
    tokenType: "duration",
    parse: parseDTCGDimension,
    format: formatDimensionToCss,
};

/** Transform for DTCG `fontFamily` tokens → CSS font-family values. */
const fontFamilyTransform: TransformDefinition<readonly string[]> = {
    name: "dtcg/fontFamily/css",
    tokenType: "fontFamily",
    parse: parseFontFamily,
    format: formatFontFamilyToCss,
};

/** Transform for DTCG `fontWeight` tokens → CSS numeric font-weight values. */
const fontWeightTransform: TransformDefinition<number> = {
    name: "dtcg/fontWeight/css",
    tokenType: "fontWeight",
    parse: v => (typeof v === "number" ? v : undefined),
    format: String,
};

/** Transform for DTCG `number` tokens → plain numeric CSS values. */
const numberTransform: TransformDefinition<number> = {
    name: "dtcg/number/css",
    tokenType: "number",
    parse: v => (typeof v === "number" ? v : undefined),
    format: String,
};

/** Transform for DTCG `cubicBezier` tokens → CSS `cubic-bezier()` values. */
const cubicBezierTransform: TransformDefinition<readonly [number, number, number, number]> = {
    name: "dtcg/cubicBezier/css",
    tokenType: "cubicBezier",
    parse: parseCubicBezier,
    format: formatCubicBezierToCss,
};

/**
 * Transform for DTCG `shadow` tokens → CSS `box-shadow` values.
 * Handles both single shadows and arrays of shadows (comma-separated).
 */
const shadowTransformConfig: Parameters<typeof StyleDictionary.registerTransform>[0] = {
    name: "dtcg/shadow/css",
    type: "value",
    transitive: true,
    filter: token => token.$type === "shadow" || token.type === "shadow",
    transform: token => {
        const value = getTokenValue(token);
        if (typeof value === "string") return value;
        if (!value) return value;

        const shadows = Array.isArray(value) ? value : [value];
        const parsedShadows = shadows.map(parseDTCGShadow);
        const validShadows = parsedShadows.flatMap(s => (s !== undefined ? [s] : []));

        return validShadows.length > 0 ? validShadows.map(formatShadowToCss).join(", ") : value;
    },
};

/**
 * Blueprint-specific transform for tokens with `com.blueprint.derive` extensions.
 * Produces CSS relative color syntax (`oklch(from <base> ...)`) from original token references.
 * Must run after `dtcg/color/css` to override resolved color references.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#using_relative_colors_with_oklch
 */
const deriveTransformConfig: Parameters<typeof StyleDictionary.registerTransform>[0] = {
    name: "bp/derive/css",
    type: "value",
    transitive: true,
    filter: hasDeriveExtension,
    transform: token => {
        // Use original extensions to preserve token references (before tokens-studio resolves them)
        const original = token.original ?? {};
        const originalExt = original.$extensions ?? original.extensions;
        const derivation = parseColorDerivation(originalExt);
        if (derivation === undefined) {
            const value = getTokenValue(token);
            return typeof value === "string" ? value : JSON.stringify(value);
        }

        const originalValue = original.$value ?? original.value;
        const tokenRef = parseTokenReference(originalValue);

        if (tokenRef === undefined) {
            const value = getTokenValue(token);
            return typeof value === "string" ? value : JSON.stringify(value);
        }

        const refPath = tokenRef.slice(1, -1).split(".");
        const baseVar = `var(--bp-${refPath.join("-")})`;

        return formatDerivedColorToCss(baseVar, derivation);
    },
};

/** Name transform that prefixes all token CSS custom properties with `--bp-` and kebab-cases the path. */
const nameTransformConfig: Parameters<typeof StyleDictionary.registerTransform>[0] = {
    name: "name/bp/kebab",
    type: "name",
    transform: token => "bp-" + token.path.join("-"),
};

/** All standard DTCG type transforms registered via {@link makeTransformConfig}. */
const standardTransforms = [
    colorTransform,
    dimensionTransform,
    durationTransform,
    fontFamilyTransform,
    fontWeightTransform,
    numberTransform,
    cubicBezierTransform,
] as const;

// -- Format Definition --------------------------------------------------------

/** Parses and validates the options bag passed to the `bp/css/variables` format. */
const parseFormatOptions = (options: unknown): FormatOptions => {
    const obj = parseObject(options);
    const outputReferences = obj?.outputReferences;
    const selector = obj?.selector;
    const onlySourceTokens = obj?.onlySourceTokens;

    return {
        outputReferences: typeof outputReferences === "boolean" ? outputReferences : false,
        selector: typeof selector === "string" ? selector : ":root",
        onlySourceTokens: typeof onlySourceTokens === "boolean" ? onlySourceTokens : false,
    };
};

/**
 * Wraps a CSS value according to its Blueprint role.
 * For `stackable-layer`, wraps the color in a `linear-gradient()` for use as a compositable layer.
 */
const applyRoleForCss = (value: string, role: BlueprintRole): string => {
    switch (role.role) {
        case "stackable-layer":
            return `linear-gradient(${value} 0 0)`;
    }
};

/** Builds a lookup map of dot-joined token path → token for reference resolution. */
const buildTokenMap = (tokens: readonly TransformedToken[]): ReadonlyMap<string, TransformedToken> =>
    new Map(tokens.map(token => [token.path.join("."), token]));

/** Applies the token's Blueprint role (if any) to transform its CSS value. */
const applyRoleToValue = (value: string, token: TransformedToken): string => {
    const ext = parseObject(token.$extensions ?? token.extensions);
    const role = parseRole(ext);
    return role !== undefined ? applyRoleForCss(value, role) : value;
};

/** Formats a CSS custom property declaration for the base (fallback) block. */
const formatBaseDeclaration = (classification: TokenClassification, token: TransformedToken): string => {
    const finalValue = applyRoleToValue(classification.fallbackValue, token);
    const comment = classification.description !== undefined ? ` /** ${classification.description} */` : "";
    return `  --${classification.name}: ${finalValue};${comment}`;
};

/** Formats a CSS custom property declaration for the `@supports` enhanced block. */
const formatEnhancedDeclaration = (classification: TokenClassification, token: TransformedToken): string => {
    const modernValue = classification.modernValue;
    if (modernValue === undefined) return "";
    const finalValue = applyRoleToValue(modernValue, token);
    return `  --${classification.name}: ${finalValue};`;
};

/**
 * Generates the full CSS output with progressive enhancement.
 * Emits a base block with hex fallbacks for all tokens, followed by an `@supports`
 * block that overrides derived tokens with relative color syntax for capable browsers.
 */
const formatProgressiveEnhancementCss = (
    tokens: readonly TransformedToken[],
    selector: string,
    onlySourceTokens: boolean,
): string => {
    // Build the full token map and fallback map from ALL tokens (including non-source)
    // so that reference resolution and derived-color fallback computation works correctly.
    const tokenMap = buildTokenMap(tokens);
    const fallbackMap = makeFallbackMap(tokens, tokenMap);

    // Filter to only source tokens for output when requested.
    const outputTokens = onlySourceTokens ? tokens.filter(t => t.isSource) : tokens;
    const classifications = outputTokens.map(token => classifyToken(token, fallbackMap));

    const header = `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n${selector} {`;
    const baseDeclarations = classifications.map((classification, index) =>
        formatBaseDeclaration(classification, outputTokens[index]),
    );

    const enhancedTokens = classifications
        .map((classification, index) => ({ classification, token: outputTokens[index] }))
        .filter(({ classification }) => classification.modernValue !== undefined);

    const baseBlock = [header, ...baseDeclarations, "}"].join("\n");

    if (enhancedTokens.length === 0) {
        return baseBlock + "\n";
    }

    const supportsHeader = `\n${SUPPORTS_RELATIVE_COLOR} {\n  ${selector} {`;
    const enhancedDeclarations = enhancedTokens.map(
        ({ classification, token }) => "  " + formatEnhancedDeclaration(classification, token),
    );
    const supportsFooter = "  }\n}";

    const supportsBlock = [supportsHeader, ...enhancedDeclarations, supportsFooter].join("\n");

    return baseBlock + "\n" + supportsBlock + "\n";
};

// -- Initialization -----------------------------------------------------------

/**
 * Registers all custom transforms, the `bp/css` transform group, and the `bp/css/variables`
 * format with the given Style Dictionary instance. Must be called once before building.
 */
const initializeStyleDictionary = (sd: typeof StyleDictionary): void => {
    register(sd);

    standardTransforms.forEach(def => sd.registerTransform(makeTransformConfig(def)));
    sd.registerTransform(shadowTransformConfig);
    sd.registerTransform(deriveTransformConfig);
    sd.registerTransform(nameTransformConfig);

    // bp/derive/css must run after dtcg/color/css to override resolved color references
    sd.registerTransformGroup({
        name: "bp/css",
        transforms: [
            "name/bp/kebab",
            "dtcg/color/css",
            "dtcg/dimension/css",
            "dtcg/duration/css",
            "dtcg/fontFamily/css",
            "dtcg/fontWeight/css",
            "dtcg/number/css",
            "dtcg/cubicBezier/css",
            "dtcg/shadow/css",
            "bp/derive/css",
        ],
    });

    sd.registerFormat({
        name: "bp/css/variables",
        format: ({ dictionary, options }) => {
            const { selector, onlySourceTokens } = parseFormatOptions(options);
            return formatProgressiveEnhancementCss(dictionary.allTokens, selector, onlySourceTokens);
        },
    });
};

// -- Theme Configuration ------------------------------------------------------

/** Converts a {@link ThemeConfig} into a full Style Dictionary {@link Config} object. */
const makeThemeConfig = (theme: ThemeConfig): Config => ({
    include: theme.include ? [...theme.include] : undefined,
    source: [...theme.sources],
    preprocessors: ["tokens-studio"],
    platforms: {
        css: {
            transformGroup: "bp/css",
            buildPath: "src/design-tokens/build/",
            files: [
                {
                    destination: theme.destination,
                    format: "bp/css/variables",
                    options: {
                        outputReferences: true,
                        selector: theme.selector,
                        onlySourceTokens: theme.include !== undefined,
                    },
                },
            ],
        },
    },
});

// -- Build Execution ----------------------------------------------------------

/** Creates a {@link BuildPlan} for each theme configuration. */
const planBuilds = (themes: readonly ThemeConfig[]): readonly BuildPlan[] =>
    themes.map(theme => ({
        themeName: theme.name,
        config: makeThemeConfig(theme),
    }));

/** Executes a single build plan by instantiating Style Dictionary and building all platforms. */
const executeBuildPlan = async (plan: BuildPlan): Promise<void> => {
    const sd = new StyleDictionary(plan.config);
    try {
        await sd.buildAllPlatforms();
    } catch (error) {
        console.error(`Error building theme "${plan.themeName}":`, error);
        throw error;
    }
};

/**
 * Entry point: initializes Style Dictionary, plans builds for all themes, and
 * executes them sequentially. This is the main export consumed by the build script.
 */
export const buildAllThemes = async (): Promise<void> => {
    initializeStyleDictionary(StyleDictionary);
    const plans = planBuilds(THEMES);

    for (const plan of plans) {
        console.info(`Planned build for theme: ${plan.themeName}`);
        await executeBuildPlan(plan);
    }
};
