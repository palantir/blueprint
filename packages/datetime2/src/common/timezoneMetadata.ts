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

import { TIMEZONE_ITEMS } from "./timezoneItems";
import { getTimezoneNames } from "./timezoneNameUtils";
import type { Timezone, TimezoneWithNames } from "./timezoneTypes";

/**
 * Given a timezone IANA code and an optional date object, retrieve additional metadata like its common name, offset,
 * and abbreviation.
 */
export function getTimezoneMetadata(timezoneIanaCode: string, date?: Date): TimezoneWithNames | undefined {
    const timezone = TIMEZONE_ITEMS.find((tz: Timezone) => tz.ianaCode === timezoneIanaCode);
    if (timezone === undefined) {
        return undefined;
    }
    return getTimezoneNames(timezone, date);
}
