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

function audit(seed: string, surface: string) {
    const result = generateConsumerColors(seed, { surface });
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
    const direction = result.audit.direction === "darker" ? -1 : 1;
    for (let index = 1; index < fills.length; index++) {
        assert(contrast(fills[index - 1], fills[index]) >= 1.15);
        assert(distance(fills[index - 1], fills[index]) >= 0.04);
        assert(direction * (luminance(fills[index]) - luminance(fills[index - 1])) > 0);
        assert(direction * (readOklab(fills[index]).l - readOklab(fills[index - 1]).l) > 0);
    }
    if (solid.border) {
        assert(contrast(solid.border, surface) >= 3);
    }
    assert(contrast(result.text, surface) >= 4.5);
    assert(contrast(result.subtle.foreground, result.subtle.background) >= 4.5);
    assert.equal(ramp.length, 11);
    assert.equal(paletteColors.size, ramp.length);
    assert.equal(ramp[0].color, "#ffffff");
    assert.equal(ramp[ramp.length - 1].color, "#000000");
    assert.equal(ramp.filter(stop => stop.isAnchor).length, 1);
    assert.equal(ramp.find(stop => stop.isAnchor)?.color, seed);
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

it("places rest by lightness while preserving both endpoints, including near-endpoint inputs", () => {
    const examples = [
        ["#7961db", 500],
        ["#ffffff", 50],
        ["#000000", 950],
        ["#fffffe", 100],
        ["#000001", 900],
    ] as const;
    for (const [rest, stop] of examples) {
        const result = audit(rest, "#ffffff");
        assert.equal(result.ramp.find(value => value.isAnchor)?.stop, stop);
    }
});

it("returns a failure for incompatible locked text without silently replacing it", () => {
    assert.equal(generateConsumerColors("#ffffff", { foreground: "#ffffff" }).status, "infeasible");
    assert.equal(generateConsumerColors("#000000", { foreground: "#777777" }).status, "infeasible");
    const result = generateConsumerColors("#222222", { foreground: "#cccccc" });
    assert(result.status === "generated");
    assert.equal(result.solid.foreground, "#cccccc");
});

it("adjusts the palette when a locked foreground needs closer steps, preserving its anchors", () => {
    const result = generateConsumerColors("#000000", { foreground: "#999999" });
    assert(result.status === "generated");
    assert(result.audit.paletteSpacingPower > 1);
    assert.equal(result.ramp[0].color, "#ffffff");
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
        assert(contrast(first, second) >= 1.15);
        assert(distance(first, second) >= 0.04);
    }
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
it(
    isStress ? "stress: 33³ RGB grid and 10,000 random pairs" : "smoke: 5³ RGB grid and 25 random pairs",
    { timeout: 300000 },
    () => {
        const count = isStress ? 33 : 5;
        const levels = Array.from({ length: count }, (_, index) => Math.round((index * 255) / (count - 1)));
        for (const red of levels) {
            for (const green of levels) {
                for (const blue of levels) {
                    for (const surface of ["#ffffff", "#252a31"]) {
                        audit(hexFrom(red, green, blue), surface);
                    }
                }
            }
        }
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
