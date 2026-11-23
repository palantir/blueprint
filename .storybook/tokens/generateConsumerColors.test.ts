/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

/**
 * @module generateConsumerColors.test
 * @layer Shared
 * Checks the emitted colors independently of the generator's reported audit.
 */

import { converter } from "culori";
import assert from "node:assert/strict";
import { it } from "vitest";

import { generateConsumerColors } from "./generateConsumerColors";

// -- Independent Measurements -------------------------------------------------

const toOklab = converter("oklab");

function luminance(hex: string): number {
    const channels = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
    const linear = channels.map(value => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(first: string, second: string): number {
    const values = [luminance(first), luminance(second)].sort((a, b) => a - b);
    return (values[1] + 0.05) / (values[0] + 0.05);
}

function readOklab(hex: string) {
    const color = toOklab(hex);
    assert(color !== undefined);
    return color;
}

function distance(first: string, second: string): number {
    const a = readOklab(first);
    const b = readOklab(second);
    return Math.sqrt((a.l - b.l) ** 2 + (a.a - b.a) ** 2 + (a.b - b.b) ** 2);
}

function hexFrom(...channels: number[]): string {
    return `#${channels.map(value => value.toString(16).padStart(2, "0")).join("")}`;
}

function audit(seed: string, surface: string, mode: "light" | "dark" = "light") {
    const result = generateConsumerColors(seed, { mode, surface });
    assert(result.status === "generated", `${seed} on ${surface}: ${JSON.stringify(result)}`);
    assert.equal(result.solid.rest, seed);
    assert.equal(result.surface, surface);
    const { solid, ramp } = result;
    const fills = [solid.rest, solid.hover, solid.selected];
    const colors = [
        ...fills,
        solid.foreground,
        result.text,
        result.subtle.background,
        result.subtle.foreground,
        ...ramp.map(stop => stop.color),
    ];
    if (solid.border) {
        colors.push(solid.border);
    }
    const paletteColors = new Set(ramp.map(stop => stop.color));
    for (const color of colors) {
        assert.match(color, /^#[0-9a-f]{6}$/);
        assert(paletteColors.has(color), `${color} is missing from the palette for ${seed}`);
    }
    for (const state of ["rest", "hover", "selected"] as const) {
        assert.equal(ramp.find(stop => stop.stop === solid.stops[state])?.color, solid[state]);
    }
    for (const fill of fills) {
        assert(contrast(fill, solid.foreground) >= 4.5);
        if (contrast(fill, surface) < 3) {
            assert(solid.border !== null);
        }
    }
    assert.equal(result.audit.mode, mode);
    const sameDirection = result.audit.directions.hover === result.audit.directions.selected;
    const selectedReference = sameDirection ? solid.hover : solid.rest;
    assert.equal(result.audit.selectedReference, sameDirection ? "hover" : "rest");
    for (const [first, second, direction] of [
        [solid.rest, solid.hover, result.audit.directions.hover],
        [selectedReference, solid.selected, result.audit.directions.selected],
    ] as const) {
        const sign = direction === "darker" ? -1 : 1;
        assert(contrast(first, second) >= 1.08);
        assert(contrast(first, second) <= 1.5);
        assert(distance(first, second) >= 0.055);
        assert(sign * (luminance(second) - luminance(first)) > 0);
        assert(sign * (readOklab(second).l - readOklab(first).l) > 0);
    }
    const preferred =
        mode === "dark"
            ? { hover: "lighter", selected: "darker" }
            : readOklab(seed).l <= 0.3
              ? { hover: "lighter", selected: "lighter" }
              : { hover: "darker", selected: "darker" };
    assert.equal(
        result.audit.directionException,
        preferred.hover !== result.audit.directions.hover || preferred.selected !== result.audit.directions.selected,
    );
    assert.equal(
        result.audit.usesAdjacentStates,
        Math.abs(solid.stops.hover - solid.stops.rest) === 1 &&
            Math.abs(solid.stops.selected - (sameDirection ? solid.stops.hover : solid.stops.rest)) === 1,
    );
    if (solid.border) {
        assert(contrast(solid.border, surface) >= 3);
    }
    assert(contrast(result.text, surface) >= 4.5);
    assert(contrast(result.subtle.foreground, result.subtle.background) >= 4.5);
    assert.deepEqual(
        ramp.map(stop => stop.stop),
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    assert.equal(paletteColors.size, ramp.length);
    assert.equal(ramp[0].color === "#ffffff", seed === "#ffffff");
    assert.equal(ramp[ramp.length - 1].color === "#000000", seed === "#000000");
    assert.equal(ramp.filter(stop => stop.isAnchor).length, 1);
    assert.equal(ramp.find(stop => stop.isAnchor)?.color, seed);
    assert(readOklab(ramp[0].color).l >= 0.96);
    for (const [index, maximumChroma] of [0.024, 0.044].entries()) {
        const color = readOklab(ramp[index].color);
        assert(Math.hypot(color.a, color.b) <= maximumChroma);
    }
    for (let index = 1; index < ramp.length; index++) {
        assert(readOklab(ramp[index - 1].color).l > readOklab(ramp[index].color).l);
    }
    if (seed.slice(1, 3) === seed.slice(3, 5) && seed.slice(3, 5) === seed.slice(5, 7)) {
        for (const color of colors) {
            assert.equal(color.slice(1, 3), color.slice(3, 5));
            assert.equal(color.slice(3, 5), color.slice(5, 7));
        }
    }
    return result;
}

// -- Contracts ----------------------------------------------------------------

it("normalizes opaque HEX input and rejects unsupported values", () => {
    for (const input of ["", "red", "transparent", "#ffffff00", "#gggggg", "rgb(255,0,0)"]) {
        assert.equal(generateConsumerColors(input).status, "invalid-input");
    }
    assert.equal(generateConsumerColors("#fff", { surface: "invalid" }).status, "invalid-input");
    assert.equal(generateConsumerColors("#fff", { foreground: "invalid" }).status, "invalid-input");
    const shorthand = generateConsumerColors("#ABC");
    assert(shorthand.status === "generated");
    assert.equal(shorthand.solid.rest, "#aabbcc");
});

it("places very light and dark inputs at the ends without adding white or black", () => {
    const examples = [
        ["#ffffff", 0],
        ["#000000", 9],
        ["#fffffe", 0],
        ["#000001", 9],
    ] as const;
    for (const [rest, stop] of examples) {
        const result = audit(rest, "#ffffff");
        assert.equal(result.ramp.find(value => value.isAnchor)?.stop, stop);
    }
});

it("carries the seed's hue into tinted endpoints and keeps achromatic inputs neutral", () => {
    const toOklch = converter("oklch");
    for (const seed of ["#5f6b7c", "#7961db", "#a08060", "#cd4246"]) {
        const result = audit(seed, "#ffffff");
        const input = toOklch(seed);
        assert(input?.h !== undefined);
        for (const stop of [result.ramp[0], result.ramp[result.ramp.length - 1]]) {
            const endpoint = toOklch(stop.color);
            assert(endpoint?.h !== undefined && endpoint.c > 0.002);
            const hueDifference = Math.abs(endpoint.h - input.h);
            assert(Math.min(hueDifference, 360 - hueDifference) < 20);
        }
    }
    for (const seed of ["#ffffff", "#000000", "#808080"]) {
        audit(seed, "#ffffff");
    }
});

it("reserves the lightest shades for pale backgrounds across saturated hues", () => {
    const toOklch = converter("oklch");
    for (const seed of ["#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff0000", "#0000ff"]) {
        const result = audit(seed, "#ffffff");
        assert(result.solid.stops.rest >= 4);
        for (const [index, maximumChroma] of [0.025, 0.045].entries()) {
            const color = toOklch(result.ramp[index].color);
            assert(color !== undefined);
            assert(color.l >= (index === 0 ? 0.97 : 0.9));
            assert(color.c <= maximumChroma);
            assert.notEqual(result.ramp[index].color, seed);
        }
    }
});

it("places a pale yellow before a vivid yellow despite their similarly high lightness", () => {
    const pale = audit("#ffffee", "#ffffff");
    const vivid = audit("#ffff00", "#ffffff");
    assert(pale.solid.stops.rest < vivid.solid.stops.rest);
    assert(
        vivid.ramp.slice(
            0,
            vivid.ramp.findIndex(stop => stop.isAnchor),
        ).length >= 4,
    );
});

it("handles every eight-bit tint from bright yellow, cyan, and magenta to white", { timeout: 30000 }, () => {
    for (let channel = 0; channel <= 255; channel++) {
        for (const seed of [hexFrom(255, 255, channel), hexFrom(channel, 255, 255), hexFrom(255, channel, 255)]) {
            for (const surface of ["#ffffff", "#252a31"]) {
                audit(seed, surface);
            }
        }
    }
});

it("returns a failure for incompatible locked text without silently replacing it", () => {
    assert.equal(generateConsumerColors("#ffffff", { foreground: "#ffffff" }).status, "infeasible");
    assert.equal(generateConsumerColors("#000000", { foreground: "#777777" }).status, "infeasible");
    const result = generateConsumerColors("#222222", { foreground: "#cccccc" });
    assert(result.status === "generated");
    assert.equal(result.solid.foreground, "#cccccc");
});

it("keeps a lighter tint available when a pale rest cannot supply readable text on the surface", () => {
    const result = audit("#f0fbd9", "#128502");
    assert(result.ramp[0].color !== result.solid.rest);
    assert(readOklab(result.ramp[0].color).l > readOklab(result.solid.rest).l);
});

it("adjusts the palette when a locked foreground needs closer steps, preserving its anchors", () => {
    const result = generateConsumerColors("#000000", { foreground: "#999999" });
    assert(result.status === "generated");
    assert(result.audit.paletteSpacingBias > 1);
    assert.notEqual(result.ramp[0].color, "#ffffff");
    assert.equal(result.ramp[result.ramp.length - 1].color, "#000000");
    assert.equal(result.solid.rest, "#000000");
    for (const state of ["rest", "hover", "selected"] as const) {
        assert.equal(result.ramp.find(stop => stop.stop === result.solid.stops[state])?.color, result.solid[state]);
        assert(contrast(result.solid[state], "#999999") >= 4.5);
    }
    for (const [first, second] of [
        [result.solid.rest, result.solid.hover],
        [result.solid.hover, result.solid.selected],
    ]) {
        assert(contrast(first, second) >= 1.08);
        assert(contrast(first, second) <= 1.5);
        assert(distance(first, second) >= 0.055);
    }
});

it("bounds state differences for vivid colors, white, and blue-gray", () => {
    for (const seed of ["#ffff00", "#00ff00", "#00ffff", "#ff0000", "#ff00ff", "#7961db", "#ffffff", "#5f6b7c"]) {
        const result = audit(seed, "#ffffff");
        assert(distance(result.solid.rest, result.solid.hover) <= 0.105);
        assert(distance(result.solid.hover, result.solid.selected) <= 0.105);
    }
});

it("keeps generated steps close to Greg's blue and Ryan's documented orange reference", () => {
    const blue = audit("#2d72d2", "#ffffff");
    for (const [actual, reference] of [
        [distance(blue.solid.rest, blue.solid.hover), distance("#2d72d2", "#215db0")],
        [distance(blue.solid.hover, blue.solid.selected), distance("#215db0", "#184a90")],
    ]) {
        assert(Math.abs(actual - reference) < 0.015);
    }
    const orange = audit("#bd5200", "#ffffff");
    assert(Math.abs(distance(orange.solid.rest, orange.solid.hover) - distance("#bd5200", "#9e3600")) < 0.02);
});

it("starts different hues from shared lightness targets before fitting the exact input", () => {
    const targets = [0.98, 0.94, 0.86, 0.76, 0.66, 0.56, 0.46, 0.35, 0.23, 0.12];
    for (const seed of ["#7961db", "#2d72d2", "#ffff00", "#5f6b7c", "#cd4246"]) {
        const result = audit(seed, "#ffffff");
        assert.equal(result.template.length, 10);
        for (let index = 1; index < 9; index++) {
            assert(Math.abs(readOklab(result.template[index].color).l - targets[index]) < 0.004);
        }
        assert.equal(result.ramp.find(stop => stop.isAnchor)?.color, seed);
    }
});

it("reduces the large dark-end cliff for saturated yellow while keeping gentle palette states", () => {
    const result = audit("#ffff00", "#ffffff");
    const gaps = result.ramp.slice(1).map((stop, index) => distance(result.ramp[index].color, stop.color));
    assert(Math.max(...gaps) < 0.42);
    assert(result.solid.stops.selected < 9);
    assert(distance(result.solid.rest, result.solid.hover) < 0.1);
    assert(distance(result.solid.hover, result.solid.selected) < 0.1);
});

it("prefers adjacent darker states in light mode and lighter states for very dark inputs", () => {
    for (const seed of ["#7961db", "#2d72d2", "#5f6b7c", "#ffff00", "#ffffff", "#222222", "#000000"]) {
        const result = audit(seed, "#ffffff");
        const direction = ["#222222", "#000000"].includes(seed) ? "lighter" : "darker";
        assert.deepEqual(result.audit.directions, { hover: direction, selected: direction });
        assert.equal(result.audit.directionException, false);
        assert.equal(result.audit.usesAdjacentStates, true);
    }
});

it("uses lighter hover and darker selected around rest in dark mode", () => {
    for (const seed of ["#222222", "#333333", "#aaaaaa"]) {
        const result = audit(seed, "#252a31", "dark");
        assert.deepEqual(result.audit.directions, { hover: "lighter", selected: "darker" });
        assert.equal(result.audit.directionException, false);
        assert.equal(result.audit.usesAdjacentStates, true);
        assert(result.solid.stops.hover < result.solid.stops.rest);
        assert(result.solid.stops.selected > result.solid.stops.rest);
    }
});

it("reports direction exceptions at endpoints and when one label cannot stay readable", () => {
    for (const [seed, direction] of [
        ["#000000", "lighter"],
        ["#ffffff", "darker"],
        ["#2d72d2", "darker"],
    ] as const) {
        const result = audit(seed, "#252a31", "dark");
        assert.equal(result.audit.directionException, true);
        assert.deepEqual(result.audit.directions, { hover: direction, selected: direction });
    }
    const red = audit("#ff0000", "#ffffff");
    assert.equal(red.audit.directionException, true);
    assert.deepEqual(red.audit.directions, { hover: "lighter", selected: "lighter" });
});

it("is deterministic and keeps solid fills stable across surrounding surfaces", () => {
    for (const seed of ["#7961db", "#000000", "#ffffff", "#c87619", "#00ff00"]) {
        const light = audit(seed, "#ffffff");
        const dark = audit(seed, "#252a31");
        assert.deepEqual(light, generateConsumerColors(seed));
        for (const role of ["rest", "hover", "selected", "foreground"] as const) {
            assert.equal(light.solid[role], dark.solid[role]);
        }
        assert.deepEqual(light.ramp, dark.ramp);
        assert.deepEqual(light.solid.stops, dark.solid.stops);
    }
});

it("checks neutral, near-endpoint, saturated, and brand colors on varied surfaces", { timeout: 30000 }, () => {
    const seeds = new Set(["#7961db", "#2d72d2", "#238551", "#c87619", "#cd4246", "#5f6b7c", "#7c6a59", "#f8f4e8"]);
    for (let channel = 0; channel <= 255; channel++) {
        seeds.add(hexFrom(channel, channel, channel));
    }
    for (const red of [0, 1, 2, 253, 254, 255]) {
        for (const green of [0, 1, 2, 253, 254, 255]) {
            for (const blue of [0, 1, 2, 253, 254, 255]) {
                seeds.add(hexFrom(red, green, blue));
            }
        }
    }
    for (const seed of seeds) {
        for (const surface of ["#ffffff", "#252a31", "#808080", seed]) {
            audit(seed, surface);
        }
    }
});

const isStress = process.env.COLOR_STRESS === "1";
it.each([0, 1, 2])(isStress ? "stress: RGB grid slice %s" : "smoke: RGB grid slice %s", { timeout: 300000 }, slice => {
    const count = isStress ? 33 : 5;
    const levels = Array.from({ length: count }, (_, index) => Math.round((index * 255) / (count - 1)));
    for (const red of levels.filter((_, index) => index % 3 === slice)) {
        for (const green of levels) {
            for (const blue of levels) {
                for (const surface of ["#ffffff", "#252a31"]) {
                    audit(hexFrom(red, green, blue), surface);
                }
            }
        }
    }
});

it(
    isStress ? "stress: 10,000 random color and surface pairs" : "smoke: 25 random color and surface pairs",
    { timeout: 300000 },
    () => {
        let randomState = 0x20261120;
        const nextChannel = () => {
            // eslint-disable-next-line no-bitwise -- Unsigned arithmetic keeps the seeded stress sample reproducible.
            randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
            return Math.floor(randomState / 0x1000000);
        };
        for (let index = 0; index < (isStress ? 10000 : 25); index++) {
            audit(
                hexFrom(nextChannel(), nextChannel(), nextChannel()),
                hexFrom(nextChannel(), nextChannel(), nextChannel()),
            );
        }
    },
);

it("checks dark-mode direction and fallback contracts across hues and surfaces", { timeout: 300000 }, () => {
    const count = isStress ? 13 : 5;
    const levels = Array.from({ length: count }, (_, index) => Math.round((index * 255) / (count - 1)));
    for (const red of levels) {
        for (const green of levels) {
            for (const blue of levels) {
                for (const surface of ["#252a31", "#ffffff"]) {
                    audit(hexFrom(red, green, blue), surface, "dark");
                }
            }
        }
    }
});
