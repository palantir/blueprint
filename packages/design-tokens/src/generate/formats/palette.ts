/**
 * @license Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 */

import type { Dictionary, File } from "style-dictionary/types";
import { fileHeader } from "style-dictionary/utils";

interface FormatParams {
    dictionary: Dictionary;
    file: File;
    options: Record<string, any>;
}

type OutputFormat = "css" | "scss" | "less" | "typescript";

/**
 * Unified palette formatter that supports multiple output formats.
 * Processes token structure: ['palette', family, group, level]
 */
async function formatPalette({ dictionary, file, options }: FormatParams, format: OutputFormat): Promise<string> {
    const families: Record<string, Record<string, string>> = {};
    const darkOverrides: Record<string, Record<string, string>> = {};

    dictionary.allTokens.forEach(token => {
        if (token.path[0] !== "palette") return;

        const [, family, group, level] = token.path;
        if (!families[family]) families[family] = {};

        if (group === "$root" || group === "light") {
            families[family][level] = token.$value;
        } else if (group === "dark") {
            if (!darkOverrides[family]) darkOverrides[family] = {};
            darkOverrides[family][level] = token.$value;
        }
    });

    const output = await fileHeader({ file });

    if (format === "css") {
        return formatCss(output, families, darkOverrides, options);
    }

    if (format === "typescript") {
        return formatTypescript(output, families, darkOverrides);
    }

    return formatPreprocessors(output, families, darkOverrides, format);
}

function formatCss(
    output: string,
    families: Record<string, Record<string, string>>,
    darkOverrides: Record<string, Record<string, string>>,
    options: Record<string, any>,
): string {
    const { selector = ":root", darkSelector = '[data-theme="dark"]' } = options;

    output += `${selector} {\n`;
    for (const [family, colors] of Object.entries(families)) {
        for (const [level, value] of Object.entries(colors)) {
            output += `  --bp-palette-${family}-${level}: ${value};\n`;
        }
    }
    output += `}\n`;

    if (Object.keys(darkOverrides).length > 0) {
        output += `\n${darkSelector} {\n`;
        for (const [family, overrides] of Object.entries(darkOverrides)) {
            for (const [level, value] of Object.entries(overrides)) {
                output += `  --bp-palette-${family}-${level}: ${value};\n`;
            }
        }
        output += `}\n`;
    }

    return output;
}

function formatPreprocessors(
    output: string,
    families: Record<string, Record<string, string>>,
    darkOverrides: Record<string, Record<string, string>>,
    format: "scss" | "less",
): string {
    const prefix = format === "scss" ? "$" : "@";
    const suffix = format === "scss" ? " !default" : "";

    output += "\n";

    // Light mode variables
    for (const [family, colors] of Object.entries(families)) {
        for (const [level, value] of Object.entries(colors)) {
            output += `${prefix}bp-palette-${family}-${level}: ${value}${suffix};\n`;
        }
    }

    output += "\n";

    // Comprehensive dark mode variables
    for (const [family, colors] of Object.entries(families)) {
        const overrides = darkOverrides[family];
        for (const [level, value] of Object.entries(colors)) {
            const darkValue = overrides?.[level] || value;
            output += `${prefix}bp-palette-${family}-${level}-dark: ${darkValue}${suffix};\n`;
        }
    }

    return output;
}

function formatTypescript(
    output: string,
    families: Record<string, Record<string, string>>,
    darkOverrides: Record<string, Record<string, string>>,
): string {
    output += "export const palette = {\n";

    for (const [family, colors] of Object.entries(families)) {
        output += `    ${family}: {\n`;
        output += `        $root: {\n`;
        for (const [level, value] of Object.entries(colors)) {
            output += `            ${level}: "${value}",\n`;
        }
        output += `        } as const,\n`;
        output += `        light: {\n`;
        for (const [level, value] of Object.entries(colors)) {
            output += `            ${level}: "${value}",\n`;
        }
        output += `        } as const,\n`;

        output += `        dark: {\n`;
        const overrides = darkOverrides[family];
        for (const [level, value] of Object.entries(colors)) {
            const darkValue = overrides?.[level] || value;
            output += `            ${level}: "${darkValue}",\n`;
        }
        output += `        } as const,\n`;
        output += `    },\n`;
    }

    output += "} as const;\n";

    return output;
}

export async function formatCssThemed(params: FormatParams): Promise<string> {
    return formatPalette(params, "css");
}

export async function formatScssPalette(params: FormatParams): Promise<string> {
    return formatPalette(params, "scss");
}

export async function formatLessPalette(params: FormatParams): Promise<string> {
    return formatPalette(params, "less");
}

export async function formatTypescriptPalette(params: FormatParams): Promise<string> {
    return formatPalette(params, "typescript");
}
