/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { shiftDateByDays, shiftDateByWeeks } from "./dateRangeInputUilts";

describe("DateRangeInput calendar arithmetic", () => {
    // Run with TZ=America/New_York to exercise both DST transitions. These calendar expectations also apply in UTC.
    const cases = [
        { amount: 1, from: [2025, 2, 9], name: "spring day forward", shift: shiftDateByDays, to: [2025, 2, 10] },
        { amount: -1, from: [2025, 2, 10], name: "spring day backward", shift: shiftDateByDays, to: [2025, 2, 9] },
        { amount: 1, from: [2025, 2, 3], name: "spring week forward", shift: shiftDateByWeeks, to: [2025, 2, 10] },
        { amount: -1, from: [2025, 2, 10], name: "spring week backward", shift: shiftDateByWeeks, to: [2025, 2, 3] },
        { amount: 1, from: [2025, 10, 2], name: "fall day forward", shift: shiftDateByDays, to: [2025, 10, 3] },
        { amount: -1, from: [2025, 10, 3], name: "fall day backward", shift: shiftDateByDays, to: [2025, 10, 2] },
        { amount: 1, from: [2025, 9, 27], name: "fall week forward", shift: shiftDateByWeeks, to: [2025, 10, 3] },
        { amount: -1, from: [2025, 10, 3], name: "fall week backward", shift: shiftDateByWeeks, to: [2025, 9, 27] },
        { amount: 1, from: [2025, 5, 15], name: "ordinary day", shift: shiftDateByDays, to: [2025, 5, 16] },
        { amount: 1, from: [2024, 1, 28], name: "leap day", shift: shiftDateByDays, to: [2024, 1, 29] },
        { amount: -1, from: [2024, 2, 1], name: "month rollover", shift: shiftDateByDays, to: [2024, 1, 29] },
        { amount: 1, from: [2025, 11, 31], name: "year rollover", shift: shiftDateByDays, to: [2026, 0, 1] },
        { amount: -1, from: [2026, 0, 3], name: "week year rollover", shift: shiftDateByWeeks, to: [2025, 11, 27] },
    ];

    for (const [hours, minutes, seconds, milliseconds] of [
        [0, 0, 0, 0],
        [12, 34, 56, 789],
    ]) {
        it.each(cases)(
            `$name preserves local time ${hours}:${minutes}:${seconds}.${milliseconds}`,
            ({ from, to, amount, shift }) => {
                const input = new Date(from[0], from[1], from[2], hours, minutes, seconds, milliseconds);
                const original = input.valueOf();
                const shifted = shift(input, amount);

                expect(shifted).toEqual(new Date(to[0], to[1], to[2], hours, minutes, seconds, milliseconds));
                expect(shifted).not.toBe(input);
                expect(input.valueOf()).toBe(original);
            },
        );
    }

    it.each([shiftDateByDays, shiftDateByWeeks])("clones dates for a zero shift", shift => {
        const input = new Date(2025, 5, 15, 12, 34, 56, 789);
        expect(shift(input, 0)).toEqual(input);
        expect(shift(input, 0)).not.toBe(input);
    });

    it.each([shiftDateByDays, shiftDateByWeeks])("keeps invalid dates invalid", shift => {
        const input = new Date(NaN);
        expect(Number.isNaN(shift(input, 1).valueOf())).toBe(true);
        expect(Number.isNaN(input.valueOf())).toBe(true);
    });
});
