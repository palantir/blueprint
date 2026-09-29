/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

// @ts-check

import { register } from "@tokens-studio/sd-transforms";
import { formatHex, formatHex8, oklch, parse } from "culori";
import fs from "fs-extra";
import { dirname, isAbsolute, resolve } from "node:path";
import StyleDictionary from "style-dictionary";

const SUPPORTS_RELATIVE_COLOR = "@supports (color: oklch(from var(--any-color) l c h))";
const TOKEN_REFERENCE_PATTERN = /\{([^}]+)\}/g;

let isStyleDictionaryInitialized = false;

const parseObject = value => (typeof value === "object" && value !== null && !Array.isArray(value) ? value : undefined);

const parseNumberTuple = value =>
    Array.isArray(value) && value.every(item => typeof item === "number") ? value : undefined;

const parseStringTuple = value =>
    Array.isArray(value) && value.every(item => typeof item === "string") ? value : undefined;

const parseDTCGColor = value => {
    const object = parseObject(value);
    if (object === undefined || (object.colorSpace !== "oklch" && object.colorSpace !== "srgb")) {
        return undefined;
    }

    const components = parseNumberTuple(object.components);
    if (components === undefined || components.length !== 3) {
        return undefined;
    }

    if (object.alpha !== undefined && typeof object.alpha !== "number") {
        return undefined;
    }

    return {
        colorSpace: object.colorSpace,
        components,
        alpha: object.alpha,
    };
};

const parseDTCGDimension = value => {
    const object = parseObject(value);
    return object !== undefined && typeof object.value === "number" && typeof object.unit === "string"
        ? { value: object.value, unit: object.unit }
        : undefined;
};

const parseDTCGShadow = value => {
    const object = parseObject(value);
    if (object === undefined) {
        return undefined;
    }

    const color = parseDTCGColor(object.color);
    const offsetX = parseDTCGDimension(object.offsetX);
    const offsetY = parseDTCGDimension(object.offsetY);
    const blur = parseDTCGDimension(object.blur);
    if (color === undefined || offsetX === undefined || offsetY === undefined || blur === undefined) {
        return undefined;
    }

    return {
        color,
        offsetX,
        offsetY,
        blur,
        spread: parseDTCGDimension(object.spread),
        inset: typeof object.inset === "boolean" ? object.inset : undefined,
    };
};

const parseCubicBezier = value => {
    const tuple = parseNumberTuple(value);
    return tuple !== undefined && tuple.length === 4 ? tuple : undefined;
};

const parseTokenReference = value =>
    typeof value === "string" && value.startsWith("{") && value.endsWith("}") ? value : undefined;

const parseChannelModification = (derive, offsetKey, scaleKey) => {
    if (typeof derive[offsetKey] === "number") {
        return { tag: "Offset", value: derive[offsetKey] };
    }
    if (typeof derive[scaleKey] === "number") {
        return { tag: "Scale", factor: derive[scaleKey] };
    }
    return undefined;
};

const parseColorDerivation = extensions => {
    const extensionObject = parseObject(extensions);
    const derive = parseObject(extensionObject?.["com.blueprint.derive"]);
    if (derive === undefined) {
        return undefined;
    }

    const alpha = derive.alpha;
    return {
        alpha: typeof alpha === "number" ? alpha : parseTokenReference(alpha),
        lightness: parseChannelModification(derive, "lightnessOffset", "lightnessScale"),
        chroma: parseChannelModification(derive, "chromaOffset", "chromaScale"),
        hue: typeof derive.hueOffset === "number" ? { tag: "Offset", value: derive.hueOffset } : undefined,
    };
};

const parseRole = extensions => {
    const extensionObject = parseObject(extensions);
    return extensionObject?.["com.blueprint.role"] === "stackable-layer" ? "stackable-layer" : undefined;
};

const formatColorToCss = color => {
    const [first, second, third] = color.components;
    if (color.colorSpace === "oklch") {
        return color.alpha !== undefined && color.alpha < 1
            ? `oklch(${first} ${second} ${third} / ${color.alpha})`
            : `oklch(${first} ${second} ${third})`;
    }

    const [red, green, blue] = color.components.map(component => Math.round(component * 255));
    return color.alpha !== undefined && color.alpha < 1
        ? `rgba(${red}, ${green}, ${blue}, ${color.alpha})`
        : `rgb(${red}, ${green}, ${blue})`;
};

const formatDimensionToCss = dimension => `${dimension.value}${dimension.unit}`;

const formatShadowToCss = shadow => {
    const parts = [];
    if (shadow.inset) {
        parts.push("inset");
    }
    parts.push(formatDimensionToCss(shadow.offsetX));
    parts.push(formatDimensionToCss(shadow.offsetY));
    parts.push(formatDimensionToCss(shadow.blur));
    if (shadow.spread !== undefined) {
        parts.push(formatDimensionToCss(shadow.spread));
    }
    parts.push(formatColorToCss(shadow.color));
    return parts.join(" ");
};

const formatChannelModification = (channel, modification) => {
    if (modification === undefined) {
        return channel;
    }
    return modification.tag === "Offset"
        ? `calc(${channel} + ${modification.value})`
        : `calc(${channel} * ${modification.factor})`;
};

const tokenReferenceToVar = reference => `var(--bp-${reference.slice(1, -1).split(".").join("-")})`;

const formatDerivedColorToCss = (baseVariable, derivation) => {
    const lightness = formatChannelModification("l", derivation.lightness);
    const chroma = formatChannelModification("c", derivation.chroma);
    const hue = formatChannelModification("h", derivation.hue);
    const alpha =
        derivation.alpha === undefined
            ? ""
            : ` / ${typeof derivation.alpha === "number" ? derivation.alpha : tokenReferenceToVar(derivation.alpha)}`;
    return `oklch(from ${baseVariable} ${lightness} ${chroma} ${hue}${alpha})`;
};

const getTokenValue = token => token.$value ?? token.value;
const getTokenValueAsString = token => String(getTokenValue(token));
const getOriginalValue = token => token.original?.$value ?? token.original?.value;
const getTokenPath = token => token.path.join(".");

const parseTokenValueAsNumber = token => {
    const value = getTokenValue(token);
    if (typeof value === "number") {
        return value;
    }
    const parsed = typeof value === "string" ? Number.parseFloat(value) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : undefined;
};

const hasDeriveExtension = token =>
    parseObject(token.$extensions ?? token.extensions)?.["com.blueprint.derive"] !== undefined;

const makeTransform = definition => ({
    name: definition.name,
    type: "value",
    transitive: true,
    filter: token => token.$type === definition.tokenType || token.type === definition.tokenType,
    transform: token => {
        const value = getTokenValue(token);
        if (typeof value === "string") {
            return value;
        }
        const parsed = definition.parse(value);
        return parsed === undefined ? value : definition.format(parsed);
    },
});

const initializeStyleDictionary = () => {
    if (isStyleDictionaryInitialized) {
        return;
    }

    register(StyleDictionary);
    [
        { name: "dtcg/color/css", tokenType: "color", parse: parseDTCGColor, format: formatColorToCss },
        { name: "dtcg/dimension/css", tokenType: "dimension", parse: parseDTCGDimension, format: formatDimensionToCss },
        { name: "dtcg/duration/css", tokenType: "duration", parse: parseDTCGDimension, format: formatDimensionToCss },
        {
            name: "dtcg/fontFamily/css",
            tokenType: "fontFamily",
            parse: parseStringTuple,
            format: families => families.map(family => (family.includes(" ") ? `"${family}"` : family)).join(", "),
        },
        { name: "dtcg/fontWeight/css", tokenType: "fontWeight", parse: Number, format: String },
        { name: "dtcg/number/css", tokenType: "number", parse: Number, format: String },
        {
            name: "dtcg/cubicBezier/css",
            tokenType: "cubicBezier",
            parse: parseCubicBezier,
            format: points => `cubic-bezier(${points.join(", ")})`,
        },
    ].forEach(definition => StyleDictionary.registerTransform(makeTransform(definition)));

    StyleDictionary.registerTransform({
        name: "dtcg/shadow/css",
        type: "value",
        transitive: true,
        filter: token => token.$type === "shadow" || token.type === "shadow",
        transform: token => {
            const value = getTokenValue(token);
            if (typeof value === "string") {
                return value;
            }
            const shadows = (Array.isArray(value) ? value : [value]).map(parseDTCGShadow);
            return shadows.every(shadow => shadow !== undefined) ? shadows.map(formatShadowToCss).join(", ") : value;
        },
    });

    StyleDictionary.registerTransform({
        name: "bp/derive/css",
        type: "value",
        transitive: true,
        filter: hasDeriveExtension,
        transform: token => {
            const original = token.original ?? {};
            const derivation = parseColorDerivation(original.$extensions ?? original.extensions);
            const reference = parseTokenReference(original.$value ?? original.value);
            return derivation === undefined || reference === undefined
                ? getTokenValueAsString(token)
                : formatDerivedColorToCss(tokenReferenceToVar(reference), derivation);
        },
    });

    StyleDictionary.registerTransform({
        name: "name/bp/kebab",
        type: "name",
        transform: token => `bp-${token.path.join("-")}`,
    });

    StyleDictionary.registerTransformGroup({
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

    isStyleDictionaryInitialized = true;
};

const parseColorToOklch = cssValue => {
    const converted = oklch(parse(cssValue));
    return converted === undefined
        ? undefined
        : {
              mode: "oklch",
              l: converted.l ?? 0,
              c: converted.c ?? 0,
              h: converted.h ?? 0,
              alpha: converted.alpha,
          };
};

const applyChannelModification = (value, modification) => {
    if (modification === undefined) {
        return value;
    }
    return modification.tag === "Offset" ? value + modification.value : value * modification.factor;
};

const resolveAlphaValue = (alpha, tokenMap) => {
    if (alpha === undefined || typeof alpha === "number") {
        return alpha;
    }
    const referencedToken = tokenMap.get(alpha.slice(1, -1));
    return referencedToken === undefined ? undefined : parseTokenValueAsNumber(referencedToken);
};

const computeDerivedFallback = (token, tokenMap) => {
    const derivation = parseColorDerivation(token.original?.$extensions ?? token.original?.extensions);
    const reference = parseTokenReference(getOriginalValue(token));
    if (derivation === undefined || reference === undefined) {
        return undefined;
    }

    const baseToken = tokenMap.get(reference.slice(1, -1));
    if (baseToken === undefined) {
        return undefined;
    }
    const baseColor = parseColorToOklch(getTokenValueAsString(baseToken));
    if (baseColor === undefined) {
        return undefined;
    }

    const derivedColor = {
        mode: "oklch",
        l: applyChannelModification(baseColor.l, derivation.lightness),
        c: applyChannelModification(baseColor.c, derivation.chroma),
        h: applyChannelModification(baseColor.h, derivation.hue),
        alpha: resolveAlphaValue(derivation.alpha, tokenMap) ?? baseColor.alpha,
    };
    const formatter = derivedColor.alpha !== undefined && derivedColor.alpha < 1 ? formatHex8 : formatHex;
    return formatter(derivedColor) ?? formatHex({ mode: "rgb", r: 0, g: 0, b: 0 });
};

const replaceTokenReferences = (token, tokenMap) => {
    const originalValue = getOriginalValue(token);
    if (typeof originalValue !== "string" || !TOKEN_REFERENCE_PATTERN.test(originalValue)) {
        TOKEN_REFERENCE_PATTERN.lastIndex = 0;
        return undefined;
    }
    TOKEN_REFERENCE_PATTERN.lastIndex = 0;
    return originalValue.replace(TOKEN_REFERENCE_PATTERN, (_match, path) => {
        const referencedToken = tokenMap.get(path.replace(/\.\$?value$/, ""));
        if (referencedToken === undefined) {
            throw new Error(`Unable to resolve token reference "${path}" used by "${getTokenPath(token)}".`);
        }
        return `var(--${referencedToken.name})`;
    });
};

const applyRole = (value, token) =>
    parseRole(token.$extensions ?? token.extensions) === "stackable-layer" ? `linear-gradient(${value} 0 0)` : value;

const classifyToken = (token, tokenMap) => {
    if (!hasDeriveExtension(token)) {
        const referenceValue = replaceTokenReferences(token, tokenMap);
        if (referenceValue !== undefined) {
            return { fallbackValue: referenceValue, modernValue: undefined };
        }
    }

    const currentValue = getTokenValueAsString(token);
    const fallback = hasDeriveExtension(token) ? computeDerivedFallback(token, tokenMap) : undefined;
    return {
        fallbackValue: fallback ?? currentValue,
        modernValue: fallback === undefined ? undefined : currentValue,
    };
};

const formatBaseDeclaration = (token, classification) => {
    const description = token.$description ?? token.description;
    const comment = typeof description === "string" ? ` /** ${description} */` : "";
    return `  --${token.name}: ${applyRole(classification.fallbackValue, token)};${comment}`;
};

const formatModernDeclaration = (token, classification) =>
    `  --${token.name}: ${applyRole(classification.modernValue, token)};`;

const buildSection = (selector, dictionary, tokens) => {
    const tokenMap = new Map(dictionary.allTokens.map(token => [getTokenPath(token), token]));
    const classifiedTokens = tokens.map(token => ({ token, classification: classifyToken(token, tokenMap) }));
    return {
        selector,
        base: classifiedTokens.map(({ token, classification }) => formatBaseDeclaration(token, classification)),
        modern: classifiedTokens
            .filter(({ classification }) => classification.modernValue !== undefined)
            .map(({ token, classification }) => formatModernDeclaration(token, classification)),
    };
};

const formatRule = (selector, declarations, indentation = "") =>
    [
        `${indentation}${selector} {`,
        ...declarations.map(declaration => indentation + declaration),
        `${indentation}}`,
    ].join("\n");

const formatCss = sections => {
    const baseRules = sections.map(section => formatRule(section.selector, section.base));
    const modernRules = sections
        .filter(section => section.modern.length > 0)
        .map(section => formatRule(section.selector, section.modern, "  "));
    const supports = modernRules.length === 0 ? [] : [`${SUPPORTS_RELATIVE_COLOR} {\n${modernRules.join("\n\n")}\n}`];
    const header = "/**\n * Do not edit directly, this file was auto-generated.\n */";
    return [header, ...baseRules, ...supports].join("\n\n") + "\n";
};

const assertStringArray = (value, label, allowEmpty) => {
    if (!Array.isArray(value) || value.some(item => typeof item !== "string") || (!allowEmpty && value.length === 0)) {
        throw new Error(
            `Design token config field "${label}" must be ${allowEmpty ? "an" : "a non-empty"} array of strings.`,
        );
    }
    return value;
};

const readConfig = async configPath => {
    const absoluteConfigPath = resolve(configPath);
    const configDirectory = dirname(absoluteConfigPath);
    const rawConfig = parseObject(await fs.readJson(absoluteConfigPath));
    const source = parseObject(rawConfig?.source);
    const include = parseObject(rawConfig?.include);
    if (rawConfig === undefined || source === undefined || typeof rawConfig.output !== "string") {
        throw new Error("Design token config must define a source object and output path.");
    }
    if (isAbsolute(rawConfig.output)) {
        throw new Error('Design token config field "output" must be relative to the config file.');
    }

    const resolveGlobs = globs => globs.map(glob => resolve(configDirectory, glob));
    return {
        output: resolve(configDirectory, rawConfig.output),
        source: {
            base: resolveGlobs(assertStringArray(source.base, "source.base", false)),
            dark: resolveGlobs(assertStringArray(source.dark ?? [], "source.dark", true)),
        },
        include: {
            base: resolveGlobs(assertStringArray(include?.base ?? [], "include.base", true)),
            dark: resolveGlobs(assertStringArray(include?.dark ?? [], "include.dark", true)),
        },
    };
};

const buildDictionary = async (include, source) => {
    const dictionary = new StyleDictionary({
        include,
        source,
        preprocessors: ["tokens-studio"],
        log: {
            warnings: "error",
            errors: { brokenReferences: "throw" },
        },
        platforms: {
            css: { transformGroup: "bp/css" },
        },
    });
    return dictionary.getPlatformTokens("css");
};

/**
 * Builds a package's DTCG token sources into one CSS file containing Blueprint's ordered theme selectors.
 *
 * @param {string} configPath path to the package-local design token config
 */
export const buildDesignTokens = async configPath => {
    initializeStyleDictionary();
    const config = await readConfig(configPath);
    const baseDictionary = await buildDictionary(config.include.base, config.source.base);
    const baseTokens = baseDictionary.allTokens.filter(token => token.isSource);
    const baseTokenPaths = new Set(baseTokens.map(getTokenPath));

    let darkDictionary = baseDictionary;
    let darkOverrideTokens = [];
    if (config.source.dark.length > 0) {
        darkDictionary = await buildDictionary(
            [...config.include.base, ...config.include.dark, ...config.source.base],
            config.source.dark,
        );
        darkOverrideTokens = darkDictionary.allTokens.filter(token => token.isSource);
    }

    const ownedTokenPaths = new Set([...baseTokenPaths, ...darkOverrideTokens.map(getTokenPath)]);
    const explicitDarkTokens = darkDictionary.allTokens.filter(token => ownedTokenPaths.has(getTokenPath(token)));
    const sections = [
        buildSection(":root", baseDictionary, baseTokens),
        buildSection(".bp6-dark", darkDictionary, darkOverrideTokens),
        buildSection('[data-bp-color-scheme="light"]', baseDictionary, baseTokens),
        buildSection('[data-bp-color-scheme="dark"]', darkDictionary, explicitDarkTokens),
    ];

    await fs.outputFile(config.output, formatCss(sections));
    return config.output;
};
