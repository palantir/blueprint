/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert, expect } from "chai";

import { DateRange } from "../../src/";
import * as DateUtils from "../../src/common/dateUtils";
import { Months } from "../../src/common/months";

describe("dateUtils", () => {
    describe("areRangesEqual", () => {
        const DATE_1 = new Date(2017, Months.JANUARY, 1);
        const DATE_2 = new Date(2017, Months.JANUARY, 2);
        const DATE_3 = new Date(2017, Months.JANUARY, 3);
        const DATE_4 = new Date(2017, Months.JANUARY, 4);

        describe("returns true for", () => {
            runTest("null and null", null, null, true);
            runTest("[null, null] and [null, null]", [null, null], [null, null], true);
            runTest("[DATE_1, DATE_2] and [DATE_1, DATE_2]", [DATE_1, DATE_2], [DATE_1, DATE_2], true);
        });

        describe("returns false for", () => {
            runTest("null and [null, null]", null, [null, null], false);
            runTest("[DATE_1, null] and [DATE_2, null]", [DATE_1, null], [DATE_2, null], false);
            runTest("[DATE_1, null] and [null, null]", [DATE_1, null], [null, null], false);
            runTest("[DATE_1, DATE_2] and [DATE_1, DATE_4]", [DATE_1, DATE_2], [DATE_1, DATE_4], false);
            runTest("[DATE_1, DATE_4] and [DATE_2, DATE_4]", [DATE_1, DATE_4], [DATE_2, DATE_4], false);
            runTest("[DATE_1, DATE_2] and [DATE_3, DATE_4]", [DATE_1, DATE_2], [DATE_3, DATE_4], false);
        });

        function runTest(description: string, dateRange1: DateRange, dateRange2: DateRange, expectedResult: boolean) {
            it(description, () => {
                expect(DateUtils.areRangesEqual(dateRange1, dateRange2)).to.equal(expectedResult);
            });
        }
    });

    it("getDateOnlyWithTime returns Date object with constant year, month, and day", () => {
        const date = new Date(1995, 6, 30, 14, 10, 10, 600);

        const time = DateUtils.getDateOnlyWithTime(date);

        assert.equal(time.getFullYear(), 1899);
        assert.equal(time.getMonth(), 11);
        assert.equal(time.getDay(), 0);

        assert.equal(time.getHours(), 14);
        assert.equal(time.getMinutes(), 10);
        assert.equal(time.getSeconds(), 10);
        assert.equal(time.getMilliseconds(), 600);
    });

    describe("isTimeGreaterThan", () => {
        it("returns true if given time is greater than another time", () => {
            const date = new Date(1995, 6, 30, 14, 22, 30, 600);
            const date2 = new Date(1995, 6, 30, 14, 20, 30, 600);

            assert.isTrue(DateUtils.isTimeGreaterThan(date, date2));
        });

        it("returns false if given time is smaller than another time", () => {
            const date = new Date(1995, 6, 30, 14, 10, 50, 900);
            const date2 = new Date(1995, 6, 30, 14, 20, 30, 600);

            assert.isFalse(DateUtils.isTimeGreaterThan(date, date2));
        });
    });

    describe("isTimeInRange", () => {
        const minTime = new Date(1995, 6, 30, 14, 20, 30, 600);
        const maxTime = new Date(1995, 6, 30, 18, 40, 10, 200);

        it("returns true if given time is in range", () => {
            const time = new Date(1995, 6, 30, 17, 0, 0, 0);
            assert.isTrue(DateUtils.isTimeInRange(time, minTime, maxTime));
        });

        it("returns false if given time is smaller than minTime", () => {
            const time = new Date(1995, 6, 30, 13, 10, 50, 900);
            assert.isFalse(DateUtils.isTimeInRange(time, minTime, maxTime));
        });

        it("returns false if given time is greater than maxTime", () => {
            const time = new Date(1995, 6, 30, 18, 41, 9, 50);
            assert.isFalse(DateUtils.isTimeInRange(time, minTime, maxTime));
        });
    });
});
