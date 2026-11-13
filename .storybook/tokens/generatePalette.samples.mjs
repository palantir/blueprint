/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { generatePalette } from "./generatePalette.ts";

const samples = [
    { label: "BP6 default", seed: "#5f6b7c" },
    { label: "BP6 primary", seed: "#2d72d2" },
    { label: "BP6 success", seed: "#238551" },
    { label: "BP6 warning", seed: "#c87619" },
    { label: "BP6 danger", seed: "#cd4246" },
    { label: "Saturated red", seed: "#ff0000" },
    { label: "Saturated green", seed: "#00ff00" },
    { label: "Saturated blue", seed: "#0000ff" },
    { label: "Achromatic", seed: "#808080" },
    { label: "Tinted neutral", seed: "#7c6a59" },
    { label: "Bright yellow", seed: "#ffff00" },
    { label: "Black", seed: "#000000" },
    { label: "Near black", seed: "#010101" },
    { label: "Near black tinted", seed: "#010002" },
    { label: "Near white", seed: "#fefefe" },
    { label: "Near white tinted", seed: "#fffffe" },
    { label: "White", seed: "#ffffff" },
].map(sample => {
    const palette = generatePalette(sample.seed);
    if (palette === undefined) {
        throw new Error(`Invalid sample seed: ${sample.seed}`);
    }
    return { ...sample, palette };
});

process.stdout.write(`${JSON.stringify(samples, null, 2)}\n`);
