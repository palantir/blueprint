/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import * as jstz from "jstimezonedetect";

export function guessTimezone(): string {
    // Getting timezone from the Intl api is not supported in IE (it returns undefined)
    let timezone: string | undefined = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone == null) {
        // Fall back to manual guessing. According to types this returns a string, but it could
        // in theory return an undefined (not very likely but we err on the side of caution here).
        timezone = jstz.determine().name() as string | undefined;
    }
    return timezone != null ? timezone : "";
}
