/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { expect } from "chai";
import { format } from "date-fns";

import { getFormattedDateString } from "../../src/common/dateFormatProps";
import { Months } from "../../src/common/months";
import { OUT_OF_RANGE_MESSAGE } from "../../src/components/dateConstants";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

describe("DateFormatProps", () => {
    describe("getFormattedDateString", () => {
        it("should return an empty string for null date", () => {
            const testDate: Date | null = null;

            expect(getFormattedDateString(testDate, { formatDate })).to.equal("");
        });

        it("should return an invalid date message for invalid date", () => {
            const invalidDate = new Date("invalid-date");
            const invalidDateMessage = "INVALID";

            expect(getFormattedDateString(invalidDate, { formatDate, invalidDateMessage })).to.equal(
                invalidDateMessage,
            );
        });

        it("should format an in range date with default format", () => {
            const testDate = new Date(2025, Months.DECEMBER, 15);
            const minDate = new Date(2025, Months.DECEMBER, 1);
            const maxDate = new Date(2025, Months.DECEMBER, 31);

            expect(getFormattedDateString(testDate, { formatDate, maxDate, minDate })).to.equal("2025-12-15");
        });

        it("should return out of range message for out of range date", () => {
            const testDate = new Date(2025, Months.DECEMBER, 31);
            const minDate = new Date(2025, Months.DECEMBER, 1);
            const maxDate = new Date(2025, Months.DECEMBER, 30);
            const outOfRangeMessage = OUT_OF_RANGE_MESSAGE;

            expect(getFormattedDateString(testDate, { formatDate, maxDate, minDate, outOfRangeMessage })).to.equal(
                outOfRangeMessage,
            );
        });

        it("should format an in range date with ignoreRange set to true", () => {
            const testDate = new Date(2025, Months.DECEMBER, 31);
            const minDate = new Date(2025, Months.DECEMBER, 1);
            const maxDate = new Date(2025, Months.DECEMBER, 30);
            const ignoreRange = true;

            expect(getFormattedDateString(testDate, { formatDate, maxDate, minDate }, ignoreRange)).to.equal(
                "2025-12-31",
            );
        });
    });
});
