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

export async function loadDateFnsLocale(localeCode: string): Promise<Locale | undefined> {
    try {
        const { default: locale } = await import(`date-fns/esm/locale/${localeCode}/index.js`);
        return locale;
    } catch {
        if (!Utils.isNodeEnv("production")) {
            console.error(
                `[Blueprint] Could not load "${localeCode}" date-fns locale, please check that this locale code is supported: https://github.com/date-fns/date-fns/tree/main/src/locale`,
            );
        }
        return undefined;
    }
}

export function useDateFnsLocale(localeCode: string | undefined) {
    const [locale, setLocale] = React.useState<Locale | undefined>(undefined);
    React.useEffect(() => {
        if (localeCode === undefined) {
            return;
        } else if (locale?.code === localeCode) {
            return;
        }
        loadDateFnsLocale(localeCode).then(setLocale);
    }, [locale?.code, localeCode]);
    return locale;
}
