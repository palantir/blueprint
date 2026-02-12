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

type DTCGColor = {
    readonly colorSpace: "oklch" | "srgb";
    readonly components: readonly [number, number, number];
    readonly alpha?: number;
    readonly hex?: string;
};

type DTCGDimension = {
    readonly value: number;
    readonly unit: string;
};

type DTCGShadow = {
    readonly color: DTCGColor;
    readonly offsetX: DTCGDimension;
    readonly offsetY: DTCGDimension;
    readonly blur: DTCGDimension;
    readonly spread?: DTCGDimension;
    readonly inset?: boolean;
};

type ChannelModification =
    | { readonly _tag: "Offset"; readonly value: number }
    | { readonly _tag: "Scale"; readonly factor: number };

type ColorDerivation = {
    readonly alpha?: number | string;
    readonly lightness?: ChannelModification;
    readonly chroma?: ChannelModification;
    readonly hue?: ChannelModification;
};

type BlueprintRoleTag = "stackable-layer";

type BlueprintRole = {
    readonly _tag: "BlueprintRole";
    readonly role: BlueprintRoleTag;
};

type OklchColor = {
    readonly mode: "oklch";
    readonly l: number;
    readonly c: number;
    readonly h: number;
    readonly alpha?: number;
};

type TokenClassification = {
    readonly name: string;
    readonly baseValue: string;
    readonly enhancedValue: string | undefined;
    readonly description: string | undefined;
};

type TransformDefinition<TValue> = {
    readonly name: string;
    readonly tokenType: string;
    readonly parse: (value: unknown) => TValue | undefined;
    readonly format: (value: TValue) => string;
};

type FormatOptions = {
    readonly outputReferences: boolean;
    readonly selector: string;
    readonly onlySourceTokens: boolean;
};

type ThemeConfig = {
    readonly name: string;
    readonly include?: readonly string[];
    readonly sources: readonly [string, ...string[]];
    readonly selector: string;
    readonly destination: string;
};

type BuildPlan = {
    readonly themeName: string;
    readonly config: Config;
};

// -- Constants ----------------------------------------------------------------

const SUPPORTS_RELATIVE_COLOR = "@supports (color: oklch(from var(--any-color) l c h))";

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

const parseObject = (value: unknown): Record<string, unknown> | undefined => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return undefined;
    }
    return value as Record<string, unknown>;
};

const parseNumberTuple = (value: unknown): readonly number[] | undefined =>
    Array.isArray(value) && value.every(v => typeof v === "number") ? value : undefined;

const parseStringTuple = (value: unknown): readonly string[] | undefined =>
    Array.isArray(value) && value.every(v => typeof v === "string") ? value : undefined;

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

const parseDTCGDimension = (value: unknown): DTCGDimension | undefined => {
    const obj = parseObject(value);
    if (obj === undefined) return undefined;

    const numValue = obj.value;
    const unit = obj.unit;

    if (typeof numValue !== "number" || typeof unit !== "string") return undefined;

    return { value: numValue, unit };
};

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

const parseCubicBezier = (value: unknown): readonly [number, number, number, number] | undefined => {
    const arr = parseNumberTuple(value);
    if (arr === undefined || arr.length !== 4) return undefined;
    return [arr[0], arr[1], arr[2], arr[3]] as const;
};

const parseFontFamily = (value: unknown): readonly string[] | undefined => parseStringTuple(value);

const parseTokenReference = (value: unknown): string | undefined =>
    typeof value === "string" && value.startsWith("{") && value.endsWith("}") ? value : undefined;

const parseChannelModification = (
    derive: Record<string, unknown>,
    offsetKey: string,
    scaleKey: string,
): ChannelModification | undefined => {
    const offset = derive[offsetKey];
    if (typeof offset === "number") {
        return { _tag: "Offset", value: offset };
    }
    const scale = derive[scaleKey];
    if (typeof scale === "number") {
        return { _tag: "Scale", factor: scale };
    }
    return undefined;
};

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
        hue: typeof derive.hueOffset === "number" ? { _tag: "Offset", value: derive.hueOffset } : undefined,
    };
};

const parseRole = (ext: unknown): BlueprintRole | undefined => {
    const extObj = parseObject(ext);
    if (extObj === undefined) return undefined;

    const role = extObj["com.blueprint.role"];
    if (role === "stackable-layer") {
        return { _tag: "BlueprintRole", role };
    }

    return undefined;
};

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

const formatOklchToCss = (color: DTCGColor): string => {
    const [l, c, h] = color.components;
    return color.alpha !== undefined && color.alpha < 1
        ? `oklch(${l} ${c} ${h} / ${color.alpha})`
        : `oklch(${l} ${c} ${h})`;
};

const formatSrgbToCss = (color: DTCGColor): string => {
    const [r, g, b] = color.components.map(comp => Math.round(comp * 255));
    return color.alpha !== undefined && color.alpha < 1
        ? `rgba(${r}, ${g}, ${b}, ${color.alpha})`
        : `rgb(${r}, ${g}, ${b})`;
};

const formatColorToCss = (color: DTCGColor): string => {
    switch (color.colorSpace) {
        case "oklch":
            return formatOklchToCss(color);
        case "srgb":
            return formatSrgbToCss(color);
    }
};

const formatDimensionToCss = (dim: DTCGDimension): string => `${dim.value}${dim.unit}`;

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

const formatCubicBezierToCss = (points: readonly [number, number, number, number]): string =>
    `cubic-bezier(${points.join(", ")})`;

const formatFontFamilyToCss = (families: readonly string[]): string =>
    families.map(f => (f.includes(" ") ? `"${f}"` : f)).join(", ");

const formatChannelModification = (channel: string, mod: ChannelModification | undefined): string => {
    if (mod === undefined) return channel;

    // eslint-disable-next-line no-underscore-dangle
    switch (mod._tag) {
        case "Offset":
            return `calc(${channel} + ${mod.value})`;
        case "Scale":
            return `calc(${channel} * ${mod.factor})`;
    }
};

const tokenReferenceToVar = (ref: string): string => {
    const path = ref.slice(1, -1).split(".");
    return `var(--bp-${path.join("-")})`;
};

const formatAlpha = (alpha: number | string): string =>
    typeof alpha === "number" ? String(alpha) : tokenReferenceToVar(alpha);

const formatDerivedColorToCss = (baseVar: string, derivation: ColorDerivation): string => {
    const l = formatChannelModification("l", derivation.lightness);
    const c = formatChannelModification("c", derivation.chroma);
    const h = formatChannelModification("h", derivation.hue);

    return derivation.alpha !== undefined
        ? `oklch(from ${baseVar} ${l} ${c} ${h} / ${formatAlpha(derivation.alpha)})`
        : `oklch(from ${baseVar} ${l} ${c} ${h})`;
};

const formatOklchToHex = (color: OklchColor): string => {
    const hasAlpha = color.alpha !== undefined && color.alpha < 1;
    const formatter = hasAlpha ? formatHex8 : formatHex;
    return formatter(color) ?? formatHex({ mode: "rgb", r: 0, g: 0, b: 0 });
};

// -- Token Accessors ----------------------------------------------------------

const getTokenValue = (token: TransformedToken): unknown => token.$value ?? token.value;

const getTokenValueAsString = (token: TransformedToken): string => {
    const value = getTokenValue(token);
    return typeof value === "string" ? value : String(value);
};

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

// Browsers without relative color syntax need static hex fallbacks
const containsRelativeColorSyntax = (value: string): boolean => value.includes("oklch(from");

const hasDeriveExtension = (token: TransformedToken): boolean => {
    const ext = parseObject(token.$extensions ?? token.extensions);
    return ext !== undefined && ext["com.blueprint.derive"] !== undefined;
};

const applyChannelModification = (value: number, mod: ChannelModification | undefined): number => {
    if (mod === undefined) return value;

    // eslint-disable-next-line no-underscore-dangle
    switch (mod._tag) {
        case "Offset":
            return value + mod.value;
        case "Scale":
            return value * mod.factor;
    }
};

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

    const baseValue = getTokenValue(baseToken);
    if (typeof baseValue !== "string") return undefined;

    const baseOklch = parseColorToOklch(baseValue);
    if (baseOklch === undefined) return undefined;

    const resolvedAlpha = resolveAlphaValue(derivation.alpha, tokenMap);
    const derivedOklch = applyDerivationToOklch(baseOklch, derivation, resolvedAlpha);
    return formatOklchToHex(derivedOklch);
};

// Tokens referencing derived tokens inherit the fallback transitively
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

// Two-pass: derived tokens first, then referencing tokens (order matters for cache hits)
const makeFallbackMap = (
    tokens: readonly TransformedToken[],
    tokenMap: ReadonlyMap<string, TransformedToken>,
): ReadonlyMap<string, string> => {
    const fallbacks = new Map<string, string>();
    collectDerivedFallbacks(tokens, tokenMap, fallbacks);
    collectReferencingFallbacks(tokens, tokenMap, fallbacks);
    return fallbacks;
};

const classifyToken = (token: TransformedToken, fallbackMap: ReadonlyMap<string, string>): TokenClassification => {
    const tokenPath = token.path.join(".");
    const currentValue = getTokenValueAsString(token);
    const fallback = fallbackMap.get(tokenPath);

    if (fallback !== undefined) {
        return {
            name: token.name,
            baseValue: fallback,
            enhancedValue: currentValue,
            description: token.$description,
        };
    }

    return {
        name: token.name,
        baseValue: currentValue,
        enhancedValue: undefined,
        description: token.$description,
    };
};

// -- Transform Definitions ----------------------------------------------------

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

const colorTransform: TransformDefinition<DTCGColor> = {
    name: "dtcg/color/css",
    tokenType: "color",
    parse: parseDTCGColor,
    format: formatColorToCss,
};

const dimensionTransform: TransformDefinition<DTCGDimension> = {
    name: "dtcg/dimension/css",
    tokenType: "dimension",
    parse: parseDTCGDimension,
    format: formatDimensionToCss,
};

const durationTransform: TransformDefinition<DTCGDimension> = {
    name: "dtcg/duration/css",
    tokenType: "duration",
    parse: parseDTCGDimension,
    format: formatDimensionToCss,
};

const fontFamilyTransform: TransformDefinition<readonly string[]> = {
    name: "dtcg/fontFamily/css",
    tokenType: "fontFamily",
    parse: parseFontFamily,
    format: formatFontFamilyToCss,
};

const fontWeightTransform: TransformDefinition<number> = {
    name: "dtcg/fontWeight/css",
    tokenType: "fontWeight",
    parse: v => (typeof v === "number" ? v : undefined),
    format: String,
};

const numberTransform: TransformDefinition<number> = {
    name: "dtcg/number/css",
    tokenType: "number",
    parse: v => (typeof v === "number" ? v : undefined),
    format: String,
};

const cubicBezierTransform: TransformDefinition<readonly [number, number, number, number]> = {
    name: "dtcg/cubicBezier/css",
    tokenType: "cubicBezier",
    parse: parseCubicBezier,
    format: formatCubicBezierToCss,
};

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

// @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#using_relative_colors_with_oklch
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

const nameTransformConfig: Parameters<typeof StyleDictionary.registerTransform>[0] = {
    name: "name/bp/kebab",
    type: "name",
    transform: token => "bp-" + token.path.join("-"),
};

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

const applyRoleForCss = (value: string, role: BlueprintRole): string => {
    switch (role.role) {
        case "stackable-layer":
            return `linear-gradient(${value} 0 0)`;
    }
};

const buildTokenMap = (tokens: readonly TransformedToken[]): ReadonlyMap<string, TransformedToken> =>
    new Map(tokens.map(token => [token.path.join("."), token]));

const applyRoleToValue = (value: string, token: TransformedToken): string => {
    const ext = parseObject(token.$extensions ?? token.extensions);
    const role = parseRole(ext);
    return role !== undefined ? applyRoleForCss(value, role) : value;
};

const formatBaseDeclaration = (classification: TokenClassification, token: TransformedToken): string => {
    const finalValue = applyRoleToValue(classification.baseValue, token);
    const comment = classification.description !== undefined ? ` /** ${classification.description} */` : "";
    return `  --${classification.name}: ${finalValue};${comment}`;
};

const formatEnhancedDeclaration = (classification: TokenClassification, token: TransformedToken): string => {
    const enhancedValue = classification.enhancedValue;
    if (enhancedValue === undefined) return "";
    const finalValue = applyRoleToValue(enhancedValue, token);
    return `  --${classification.name}: ${finalValue};`;
};

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
        .filter(({ classification }) => classification.enhancedValue !== undefined);

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

const planBuilds = (themes: readonly ThemeConfig[]): readonly BuildPlan[] =>
    themes.map(theme => ({
        themeName: theme.name,
        config: makeThemeConfig(theme),
    }));

const executeBuildPlan = async (plan: BuildPlan): Promise<void> => {
    const sd = new StyleDictionary(plan.config);
    try {
        await sd.buildAllPlatforms();
    } catch (error) {
        console.error(`Error building theme "${plan.themeName}":`, error);
        throw error;
    }
};

export const buildAllThemes = async (): Promise<void> => {
    initializeStyleDictionary(StyleDictionary);
    const plans = planBuilds(THEMES);

    for (const plan of plans) {
        console.info(`Planned build for theme: ${plan.themeName}`);
        await executeBuildPlan(plan);
    }
};
