/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/* eslint-disable sort-keys */
import { register } from "@tokens-studio/sd-transforms";
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

type TransformDefinition<TValue> = {
    readonly name: string;
    readonly tokenType: string;
    readonly parse: (value: unknown) => TValue | undefined;
    readonly format: (value: TValue) => string;
};

// -- Parsers ------------------------------------------------------------------

const parseObject = (value: unknown): Record<string, unknown> | undefined =>
    typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;

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

const parseColorDerivation = (ext: unknown): ColorDerivation | undefined => {
    const extObj = parseObject(ext);
    if (extObj === undefined) return undefined;

    const derive = parseObject(extObj["com.blueprint.derive"]);
    if (derive === undefined) return undefined;

    const alpha = derive.alpha;
    const parsedAlpha = typeof alpha === "number" ? alpha : parseTokenReference(alpha);

    return {
        alpha: parsedAlpha,
        lightness:
            typeof derive.lightnessOffset === "number"
                ? { _tag: "Offset", value: derive.lightnessOffset }
                : typeof derive.lightnessScale === "number"
                  ? { _tag: "Scale", factor: derive.lightnessScale }
                  : undefined,
        chroma:
            typeof derive.chromaOffset === "number"
                ? { _tag: "Offset", value: derive.chromaOffset }
                : typeof derive.chromaScale === "number"
                  ? { _tag: "Scale", factor: derive.chromaScale }
                  : undefined,
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

// -- Transform Definitions ----------------------------------------------------

const getTokenValue = (token: TransformedToken): unknown => token.$value ?? token.value;

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
        const formatted = shadows
            .map(parseDTCGShadow)
            .filter((s): s is DTCGShadow => s !== undefined)
            .map(formatShadowToCss);

        return formatted.length > 0 ? formatted.join(", ") : value;
    },
};

// @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#using_relative_colors_with_oklch
const deriveTransformConfig: Parameters<typeof StyleDictionary.registerTransform>[0] = {
    name: "bp/derive/css",
    type: "value",
    transitive: true,
    filter: token => {
        const ext = parseObject(token.$extensions ?? token.extensions);
        return ext !== undefined && ext["com.blueprint.derive"] !== undefined;
    },
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

const applyRoleForCss = (value: string, role: BlueprintRole): string => {
    switch (role.role) {
        case "stackable-layer":
            return `linear-gradient(${value} 0 0)`;
    }
};

const formatCssLine = (token: TransformedToken, outputReferences: boolean): string => {
    const getValue = (): string => {
        const value = token.value ?? token.$value;
        return typeof value === "string" ? value : String(value);
    };

    const formatValue = (): string => {
        const ext = parseObject(token.$extensions ?? token.extensions);
        if (ext !== undefined && ext["com.blueprint.derive"] !== undefined) {
            return getValue();
        }

        if (outputReferences) {
            const originalValue = token.original?.$value ?? token.original?.value;
            if (typeof originalValue === "string" && originalValue.includes("{")) {
                return originalValue.replace(
                    /\{([^}]+)\}/g,
                    (_, path: string) => `var(--bp-${path.replace(/\./g, "-")})`,
                );
            }
        }

        return getValue();
    };

    const formattedValue = formatValue();

    // Apply role-based transformations from com.blueprint.role extension
    const extension = parseObject(token.$extensions ?? token.extensions);
    const role = parseRole(extension);
    const finalValue = role !== undefined ? applyRoleForCss(formattedValue, role) : formattedValue;

    const comment = token.$description ? ` /** ${token.$description} */` : "";
    return `  --${token.name}: ${finalValue};${comment}`;
};

const formatCssVariables = (tokens: readonly TransformedToken[], outputReferences: boolean): string => {
    const header =
        "/**\n * Do not edit directly, this file was auto-generated.\n */\n\n/* stylelint-disable @blueprintjs/no-color-literal */\n\n:root {";
    const footer = "}";
    const lines = tokens.map(token => formatCssLine(token, outputReferences));
    return [header, ...lines, footer].join("\n") + "\n";
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
            const outputReferences = (options?.outputReferences as boolean) ?? false;
            return formatCssVariables(dictionary.allTokens, outputReferences);
        },
    });
};

// -- Config -------------------------------------------------------------------

const config: Config = {
    source: ["src/design-tokens/tokens/**/*.tokens.json"],
    preprocessors: ["tokens-studio"],
    platforms: {
        css: {
            transformGroup: "bp/css",
            buildPath: "src/design-tokens/dist/",
            files: [
                {
                    destination: "_tokens.scss",
                    format: "bp/css/variables",
                    options: {
                        outputReferences: true,
                    },
                },
            ],
        },
    },
};

initializeStyleDictionary(StyleDictionary);

export { config };
