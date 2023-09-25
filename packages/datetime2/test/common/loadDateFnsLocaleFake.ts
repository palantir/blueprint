/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import * as Locales from "date-fns/locale";

export async function loadDateFnsLocaleFake(localeOrCode: Locale | string | undefined) {
    if (localeOrCode === undefined) {
        return undefined;
    } else if (typeof localeOrCode === "string") {
        const localeKey = localeCodeToKey(localeOrCode);
        return Locales[localeKey];
    } else {
        return localeOrCode;
    }
}

/**
 * Converts "en-US" to "enUS" which can be used to index into locales export object
 */
function localeCodeToKey(localeCode: string): keyof typeof Locales {
    let localeKey = localeCode as keyof typeof Locales;
    // convert "en-US" to "enUS" which can be used to index into locales export object
    if (localeKey.includes("-")) {
        const splits = localeKey.split("-");
        localeKey = `${splits[0]}${splits[1].toUpperCase()}` as keyof typeof Locales;
    }
    return localeKey;
}
