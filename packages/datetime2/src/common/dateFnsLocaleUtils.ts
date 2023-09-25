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

import type { Locale } from "date-fns";
import * as React from "react";

import { Utils } from "@blueprintjs/core";

/**
 * Lazy-loads a date-fns locale for use in a datetime class component.
 */
export async function loadDateFnsLocale(localeOrCode: Locale | string | undefined): Promise<Locale | undefined> {
    if (localeOrCode === undefined) {
        return;
    } else if (typeof localeOrCode === "string") {
        try {
            const localeModule = await import(`date-fns/locale/${localeOrCode}/index.js`);
            return localeModule.default;
        } catch {
            if (!Utils.isNodeEnv("production")) {
                console.error(
                    `[Blueprint] Could not load "${localeOrCode}" date-fns locale, please check that this locale code is supported: https://github.com/date-fns/date-fns/tree/main/src/locale`,
                );
            }
            return undefined;
        }
    }

    return localeOrCode;
}

/**
 * Lazy-loads a date-fns locale for use in a datetime function component.
 */
export function useDateFnsLocale(localeOrCode: Locale | string | undefined) {
    const [locale, setLocale] = React.useState<Locale | undefined>(undefined);
    React.useEffect(() => {
        if (localeOrCode === undefined) {
            return;
        } else if (typeof localeOrCode === "string") {
            if (localeOrCode !== locale?.code) {
                loadDateFnsLocale(localeOrCode).then(setLocale);
            }
        } else {
            setLocale(localeOrCode);
        }
    }, [locale?.code, localeOrCode]);
    return locale;
}
