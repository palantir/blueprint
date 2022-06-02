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

import { memoize } from "lodash-es";

/**
 * Gets the users current time zone, such as `"Europe/Oslo"`.
 *
 * At the time of this writing, this is backed by the browser or user computer's currently
 * configured time zone information,
 */
export const getTimezone: () => string = memoize(guessTimezone);

function guessTimezone(): string {
    // Getting time zone from the Intl api is not supported in IE (it returns undefined)
    const timezone: string | undefined = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone != null ? timezone : "";
}
