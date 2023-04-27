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

import {
    convertDateToLocalEquivalentOfTimezoneTime,
    convertLocalDateToTimezoneTime,
} from "../../src/common/timezoneUtils";

const OSLO_TIME = "Europe/Oslo";
const UTC_TIME = "Etc/UTC";
const LONDON_TIME = "Europe/London";
const NEW_YORK = "America/New_York";

const MOCK_SUMMER_DATE = new Date(2022, 6, 1, 12);
const MOCK_WINTER_DATE = new Date(2022, 0, 1, 12);

describe("convertLocalDateToTimezoneTime", () => {
    it("Returns the same date when current time is the same as passed", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_SUMMER_DATE, UTC_TIME);
        expect(checkIfDatesAreEqual(MOCK_SUMMER_DATE, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_WINTER_DATE, OSLO_TIME);
        const expectedReturnedDate = new Date(MOCK_WINTER_DATE);
        expectedReturnedDate.setHours(13);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_SUMMER_DATE, OSLO_TIME);
        const expectedReturnedDate = new Date(MOCK_SUMMER_DATE);
        expectedReturnedDate.setHours(14);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through 2", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_WINTER_DATE, NEW_YORK);
        const expectedReturnedDate = new Date(MOCK_WINTER_DATE);
        expectedReturnedDate.setHours(7);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings 2", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_SUMMER_DATE, NEW_YORK);
        const expectedReturnedDate = new Date(MOCK_SUMMER_DATE);
        expectedReturnedDate.setHours(8);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date that might be equal to the current time", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_WINTER_DATE, LONDON_TIME);
        expect(checkIfDatesAreEqual(MOCK_WINTER_DATE, convertedDate)).to.equal(true);
    });

    it("Returns a date that might be equal to the current time, but not during daylight savings", () => {
        const convertedDate = convertLocalDateToTimezoneTime(MOCK_SUMMER_DATE, LONDON_TIME);
        const expectedReturnedDate = new Date(MOCK_SUMMER_DATE);
        expectedReturnedDate.setHours(13);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });
});

describe("convertDateToLocalEquivalentOfTimezoneTime", () => {
    it("Returns the same date when current time is the same as passed", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_SUMMER_DATE, UTC_TIME);
        expect(checkIfDatesAreEqual(MOCK_SUMMER_DATE, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_WINTER_DATE, OSLO_TIME);
        const expectedReturnedDate = new Date(MOCK_WINTER_DATE);
        expectedReturnedDate.setHours(11);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_SUMMER_DATE, OSLO_TIME);
        const expectedReturnedDate = new Date(MOCK_SUMMER_DATE);
        expectedReturnedDate.setHours(10);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through 2", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_WINTER_DATE, NEW_YORK);
        const expectedReturnedDate = new Date(MOCK_WINTER_DATE);
        expectedReturnedDate.setHours(17);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date converted to the local timezone passed through adapting for daylight savings 2", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_SUMMER_DATE, NEW_YORK);
        const expectedReturnedDate = new Date(MOCK_SUMMER_DATE);
        expectedReturnedDate.setHours(16);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });

    it("Returns a date that might be equal to the current time", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_WINTER_DATE, LONDON_TIME);
        expect(checkIfDatesAreEqual(MOCK_WINTER_DATE, convertedDate)).to.equal(true);
    });

    it("Returns a date that might be equal to the current time, but not during daylight savings", () => {
        const convertedDate = convertDateToLocalEquivalentOfTimezoneTime(MOCK_SUMMER_DATE, LONDON_TIME);
        const expectedReturnedDate = new Date(MOCK_SUMMER_DATE);
        expectedReturnedDate.setHours(11);
        expect(checkIfDatesAreEqual(expectedReturnedDate, convertedDate)).to.equal(true);
    });
});

function checkIfDatesAreEqual(date1: Date, date2: Date) {
    return date1.getTime() === date2.getTime();
}
