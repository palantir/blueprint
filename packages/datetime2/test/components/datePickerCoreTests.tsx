/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { expect } from "chai";

import { Months } from "../../src/common/months";
import {
    combineModifiers,
    DISABLED_MODIFIER,
    getDefaultMaxDate,
    getDefaultMinDate,
} from "../../src/components/date-picker3/datePickerCore";

describe("DatePickerCore", () => {
    describe("getDefaultMaxDate", () => {
        it("returns date 6 months in the future", () => {
            const result = getDefaultMaxDate();
            const expected = new Date();
            expected.setMonth(expected.getMonth() + 6);

            expect(result.getFullYear()).to.equal(expected.getFullYear());
            expect(result.getMonth()).to.equal(expected.getMonth());
            expect(result.getDate()).to.equal(expected.getDate());
        });
    });

    describe("getDefaultMinDate", () => {
        it("returns date 20 years in the past on January 1st", () => {
            const result = getDefaultMinDate();
            const expected = new Date();
            expected.setFullYear(expected.getFullYear() - 20);
            expected.setMonth(Months.JANUARY, 1);

            expect(result.getFullYear()).to.equal(expected.getFullYear());
            expect(result.getMonth()).to.equal(Months.JANUARY);
            expect(result.getDate()).to.equal(1);
        });
    });

    describe("combineModifiers", () => {
        it("returns an empty object when both base and user modifiers are empty", () => {
            expect(combineModifiers({}, {})).to.deep.equal({});
        });

        it("returns base modifiers when user modifiers are empty", () => {
            const baseModifiers = { base: () => true };

            const result = combineModifiers(baseModifiers, {});

            expect(result).to.deep.equal(baseModifiers);
        });

        it("combines user and base modifiers while excluding disallowed modifiers", () => {
            const baseModifiers = { base: () => true };
            const userModifiers = {
                [DISABLED_MODIFIER]: () => true, // should be ignored
                user: () => true,
            };

            const result = combineModifiers(baseModifiers, userModifiers);

            expect(result).to.have.property("base");
            expect(result).to.have.property("user");
            expect(result).to.not.have.property(DISABLED_MODIFIER);
        });

        it("preserves base modifiers when conflicting with user modifiers", () => {
            const baseModifiers = { base: () => true };
            const userModifiers = {
                base: () => false, // different implementation
                user: () => true,
            };

            const result = combineModifiers(baseModifiers, userModifiers);

            expect(result.base).to.equal(baseModifiers.base); // base implementation preserved
            expect(result).to.have.property("user");
        });
    });
});
