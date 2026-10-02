/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * Regenerates `tokens/base/palette/ramp.tokens.json` from the BP6 scales in
 * `tokens/base/palette.tokens.json`, then prints the BP6 → ramp mapping as Markdown.
 *
 * Run from `packages/core` with `pnpm build:palette-ramp`.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import {
    generatePaletteRamps,
    GRAY_RAMP_FAMILY,
    LEGACY_SHADES,
    legacyPaletteFromTokens,
    legacySassName,
    type PaletteRamp,
    RAMP_STEPS,
    toRampTokens,
} from "./paletteRamp";

const TOKENS_DIR = "src/design-tokens/tokens/base";
const SOURCE_FILE = join(TOKENS_DIR, "palette.tokens.json");
const OUTPUT_FILE = join(TOKENS_DIR, "palette", "ramp.tokens.json");

const INDENT = "    ";

/** Prettier print width for this repo. */
const PRINT_WIDTH = 120;

/**
 * Serializes tokens with 4-space indentation, keeping each token on a single line when it fits,
 * matching the Prettier output of the hand-written token files.
 */
const serializeTokens = (value: unknown, depth = 0, prefix = ""): string => {
    if (typeof value !== "object" || value === null) {
        return JSON.stringify(value);
    }
    const entries = Object.entries(value);
    if ("$value" in value) {
        const fields = entries.map(([key, entry]) => `${JSON.stringify(key)}: ${JSON.stringify(entry)}`);
        const singleLine = `{ ${fields.join(", ")} }`;
        if (INDENT.length * depth + prefix.length + singleLine.length + 1 <= PRINT_WIDTH) {
            return singleLine;
        }
    }
    const inner = INDENT.repeat(depth + 1);
    const lines = entries.map(([key, entry]) => {
        const keyPrefix = `${JSON.stringify(key)}: `;
        return `${inner}${keyPrefix}${serializeTokens(entry, depth + 1, keyPrefix)}`;
    });
    return `{\n${lines.join(",\n")}\n${INDENT.repeat(depth)}}`;
};

/** Markdown table of where each BP6 chromatic shade landed in its family's ramp. */
const formatChromaticTable = (ramps: readonly PaletteRamp[]): string => {
    const shades = [...LEGACY_SHADES].reverse();
    const header = `| Family | ${shades.map(shade => `${shade} →`).join(" | ")} | Generated steps |`;
    const divider = `| --- | ${shades.map(() => "---").join(" | ")} | --- |`;
    const rows = ramps.map(ramp => {
        const stepOf = (shade: number) => ramp.legacy.find(color => color.shade === shade)?.step ?? "—";
        const generated = ramp.swatches.filter(swatch => swatch.source === undefined).map(swatch => swatch.step);
        return `| ${ramp.family} | ${shades.map(stepOf).join(" | ")} | ${generated.join(", ")} |`;
    });
    return [header, divider, ...rows].join("\n");
};

/** Markdown table of the gray ramp, plus the BP6 grays it leaves out. */
const formatGrayTable = (gray: PaletteRamp): string => {
    const header = `| Step | ${RAMP_STEPS.join(" | ")} |`;
    const divider = `| --- | ${RAMP_STEPS.map(() => "---").join(" | ")} |`;
    const row = `| BP6 gray | ${gray.swatches.map(swatch => (swatch.source === undefined ? "generated" : `\`${legacySassName(swatch.source)}\``)).join(" | ")} |`;
    const unused = gray.legacy.filter(color => color.step === undefined).map(color => `\`${legacySassName(color)}\``);
    return `${[header, divider, row].join("\n")}\n\nNot in the ramp: ${unused.join(", ")}`;
};

const generatedRamps = generatePaletteRamps(legacyPaletteFromTokens(JSON.parse(readFileSync(SOURCE_FILE, "utf8"))));

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, `${serializeTokens(toRampTokens(generatedRamps))}\n`);

const chromaticRamps = generatedRamps.filter(ramp => ramp.family !== GRAY_RAMP_FAMILY);
const grayRamp = generatedRamps.find(ramp => ramp.family === GRAY_RAMP_FAMILY);

console.info(`Wrote ${OUTPUT_FILE}\n`);
console.info(`${formatChromaticTable(chromaticRamps)}\n`);
if (grayRamp !== undefined) {
    console.info(formatGrayTable(grayRamp));
}
