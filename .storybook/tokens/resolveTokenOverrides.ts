/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import {
    GENERATED_TOKEN_NAMES,
    type GeneratedTokenName,
    type GeneratedTokens,
    generateTokens,
    type GeneratorInputs,
} from "./generateTokens";
import { TOKEN_NAMES } from "./tokens";

/** A null value explicitly restores Blueprint's default instead of falling back to generation. */
export type ManualTokenOverrides = Partial<Record<GeneratedTokenName, string | null>>;

const OVERRIDE_TOKEN_NAMES = [...new Set([...TOKEN_NAMES, ...GENERATED_TOKEN_NAMES])];

/** Recompute automatic values from the current recipe before applying deliberate user choices. */
export function resolveTokenOverrides(
    inputs: GeneratorInputs | undefined,
    manualOverrides: ManualTokenOverrides | undefined,
    theme: "light" | "dark",
): GeneratedTokens["light"] {
    const overrides = { ...generateTokens(inputs ?? {})?.[theme] };
    if (manualOverrides?.["--bp-intent-warning-rest"] !== undefined) {
        // A manual rest edit/reset releases the generated Button override and restores its normal CSS recipe.
        delete overrides["--bp6-button-warning-rest"];
    }
    for (const name of OVERRIDE_TOKEN_NAMES) {
        const value = manualOverrides?.[name];
        if (value === null) {
            delete overrides[name];
        } else if (value !== undefined) {
            overrides[name] = value;
        }
    }
    return overrides;
}
