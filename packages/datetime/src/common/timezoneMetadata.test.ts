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

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { UTC_TIME } from "./timezoneItems";
import { getTimezoneMetadata } from "./timezoneMetadata";
import { lookupTimezoneOffset } from "./timezoneOffsetUtils";
import type { TimezoneWithoutOffset } from "./timezoneTypes";

const LONDON_TZ_IANA = "Europe/London";
const NEW_YORK_TZ_IANA = "America/New_York";
const NEW_YORK_TIMEZONE: TimezoneWithoutOffset = { ianaCode: NEW_YORK_TZ_IANA, label: "New York" };
const TOKYO_TIMEZONE: TimezoneWithoutOffset = { ianaCode: "Asia/Tokyo", label: "Tokyo" };
const NEPAL_TIMEZONE: TimezoneWithoutOffset = { ianaCode: "Asia/Kathmandu", label: "Kathmandu" };

describe("getTimezoneMetadata", () => {
    it("should return valid metadata for common timezones", () => {
        for (const tzCode of [UTC_TIME.ianaCode, LONDON_TZ_IANA, NEW_YORK_TZ_IANA]) {
            const metadata = getTimezoneMetadata(tzCode);
            expect(metadata).toBeDefined();
            expect(metadata?.label).toBeTruthy();
            expect(metadata?.longName).toBeTruthy();
            expect(metadata?.ianaCode).toBe(tzCode);
        }
    });
});

describe("lookupTimezoneOffset", () => {
    const WINTER_DATE = new Date(2023, 0, 1, 12);
    const SUMMER_DATE = new Date(2023, 6, 1, 12);

    it("should get the correct offset for New York during standard time", () => {
        const { offset } = lookupTimezoneOffset(NEW_YORK_TIMEZONE, WINTER_DATE);
        expect(offset).toBe("-05:00");
    });

    it("should get the correct offset for New York during daylight saving time", () => {
        const { offset } = lookupTimezoneOffset(NEW_YORK_TIMEZONE, SUMMER_DATE);
        expect(offset).toBe("-04:00");
    });

    it("should get the correct offset for a timezone that doesn't use daylight saving", () => {
        const { offset } = lookupTimezoneOffset(TOKYO_TIMEZONE, SUMMER_DATE);
        expect(offset).toBe("+09:00");
    });

    it("should get the correct offset for non-standard offset timezones", () => {
        const { offset } = lookupTimezoneOffset(NEPAL_TIMEZONE, SUMMER_DATE);
        expect(offset).toBe("+05:45");
    });
});
