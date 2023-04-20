/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from "chai";
import { getTimezoneOffset } from "date-fns-tz";

import { getCurrentTimezone } from "../../src/common/getTimezone";
import {
    convertDateToLocalEquivalentOfTimezoneTime,
    convertLocalDateToTimezoneTime,
} from "../../src/common/timezoneUtils";

const CURRENT_TZ = getCurrentTimezone();
// try to pick timezones which are different from the ones where developers live and where CI tests are run (UTC)
const OSLO_TZ = "Europe/Oslo";
const HAWAII_TZ = "Pacific/Honolulu";

const MOCK_SUMMER_DATE = new Date(2022, 6, 1, 12);
const MOCK_WINTER_DATE = new Date(2022, 0, 1, 12);

// warning: this doesn't work for 1/2 hour offsets
function getTimzoneOffsetRelativeToCurrentInHours(tz: string, date: Date): number {
    const currentOffsetInMinutes = getTimezoneOffset(CURRENT_TZ, date) / 1000 / 60;
    const tzOffsetInMinutes = getTimezoneOffset(tz, date) / 1000 / 60;
    return (tzOffsetInMinutes - currentOffsetInMinutes) / 60;
}

describe("convertLocalDateToTimezoneTime", () => {
    it("Returns the same date when current tz is the same as passed", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_SUMMER_DATE, CURRENT_TZ);
        expect(checkIfDatesAreEqual(MOCK_SUMMER_DATE, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_WINTER_DATE, OSLO_TZ);
        const expectedDate = new Date(MOCK_WINTER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() + getTimzoneOffsetRelativeToCurrentInHours(OSLO_TZ, MOCK_WINTER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_SUMMER_DATE, OSLO_TZ);
        const expectedDate = new Date(MOCK_SUMMER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() + getTimzoneOffsetRelativeToCurrentInHours(OSLO_TZ, MOCK_SUMMER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through 2", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_WINTER_DATE, HAWAII_TZ);
        const expectedDate = new Date(MOCK_WINTER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() + getTimzoneOffsetRelativeToCurrentInHours(HAWAII_TZ, MOCK_WINTER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings 2", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_SUMMER_DATE, HAWAII_TZ);
        const expectedDate = new Date(MOCK_SUMMER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() + getTimzoneOffsetRelativeToCurrentInHours(HAWAII_TZ, MOCK_SUMMER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });
});

describe("convertDateToLocalEquivalentOfTimezoneTime", () => {
    it("Returns the same date when current tz is the same as passed", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_SUMMER_DATE, CURRENT_TZ);
        expect(checkIfDatesAreEqual(MOCK_SUMMER_DATE, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_WINTER_DATE, OSLO_TZ);
        const expectedDate = new Date(MOCK_WINTER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() - getTimzoneOffsetRelativeToCurrentInHours(OSLO_TZ, MOCK_WINTER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_SUMMER_DATE, OSLO_TZ);
        const expectedDate = new Date(MOCK_SUMMER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() - getTimzoneOffsetRelativeToCurrentInHours(OSLO_TZ, MOCK_SUMMER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through 2", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_WINTER_DATE, HAWAII_TZ);
        const expectedDate = new Date(MOCK_WINTER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() - getTimzoneOffsetRelativeToCurrentInHours(HAWAII_TZ, MOCK_WINTER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings 2", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_SUMMER_DATE, HAWAII_TZ);
        const expectedDate = new Date(MOCK_SUMMER_DATE);
        expectedDate.setHours(
            expectedDate.getHours() - getTimzoneOffsetRelativeToCurrentInHours(HAWAII_TZ, MOCK_SUMMER_DATE),
        );
        expect(checkIfDatesAreEqual(expectedDate, convertedDate)).to.equal(true);
    });
});

function checkIfDatesAreEqual(date1: Date, date2: Date) {
    return date1.getTime() === date2.getTime();
}
