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

import { getTimezoneMetadata } from "../../src/common/timezoneMetadata";

const UTC_TIME = "Etc/UTC";
const LONDON_TIME = "Europe/London";
const NEW_YORK = "America/New_York";

describe("getTimezoneMetadata", () => {
    it("Returns valid metadata for common timezones", () => {
        for (const tzCode of [UTC_TIME, LONDON_TIME, NEW_YORK]) {
            const metadata = getTimezoneMetadata(tzCode);
            expect(metadata).not.to.be.undefined;
            expect(metadata?.label).to.exist;
            expect(metadata?.longName).to.exist;
            expect(metadata?.ianaCode).to.be(tzCode);
        }
    });
});
