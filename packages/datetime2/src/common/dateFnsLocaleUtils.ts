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

import type { DateFnsLocaleLoader } from "./dateFnsLocaleProps";

/**
 * Lazy-loads a date-fns locale for use in a datetime class component.
 */
export async function loadDateFnsLocale(localeCode: string): Promise<Locale | undefined> {
    try {
        const localeModule = await import(
            /* webpackChunkName: "date-fns-locale-[request]" */
            `date-fns/locale/${localeCode}/index.js`
        );
        return localeModule.default;
    } catch {
        if (!Utils.isNodeEnv("production")) {
            console.error(
                `[Blueprint] Could not load "${localeCode}" date-fns locale, please check that this locale code is supported: https://github.com/date-fns/date-fns/tree/main/src/locale`,
            );
        }
        return undefined;
    }
}

/**
 * Lazy-loads a date-fns locale for use in a datetime function component.
 */
export function useDateFnsLocale(
    localeOrCode: Locale | string | undefined,
    dateFnsLocaleLoader: DateFnsLocaleLoader = loadDateFnsLocale,
) {
    // make sure to set the locale correctly on first render if it is available
    const [locale, setLocale] = React.useState<Locale | undefined>(
        typeof localeOrCode === "object" ? localeOrCode : undefined,
    );

    React.useEffect(() => {
        setLocale(prevLocale => {
            if (typeof localeOrCode === "string") {
                dateFnsLocaleLoader(localeOrCode).then(setLocale);
                // keep the current locale for now, it will be updated async
                return prevLocale;
            } else {
                return localeOrCode;
            }
        });
    }, [dateFnsLocaleLoader, localeOrCode]);
    return locale;
}
