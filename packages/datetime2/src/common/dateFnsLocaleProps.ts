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

/**
 * @param localeCode - ISO 639-1 + optional country code
 * @returns date-fns `Locale` object
 */
export type DateFnsLocaleLoader = (localeCode: string) => Promise<Locale | undefined>;

export interface DateFnsLocaleProps {
    /**
     * Optional custom loader function for the date-fns `Locale` which will be used to localize the date picker.
     * This is useful in test environments or in build systems where you wish to customize module loading behavior.
     * If not provided, a default loader will be used which uses dynamic imports to load `date-fns/locale/${localeCode}`
     * modules.
     */
    dateFnsLocaleLoader?: DateFnsLocaleLoader;

    /**
     * date-fns `Locale` object or locale code string ((ISO 639-1 + optional country code) which will be used
     * to localize the date picker.
     *
     * If you provide a locale code string and receive a loading error, please make sure it is included in the list of
     * date-fns' [supported locales](https://github.com/date-fns/date-fns/tree/main/src/locale).
     *
     * @default "en-US"
     * @see https://date-fns.org/docs/Locale
     */
    locale?: Locale | string;
}

export function getLocaleCodeFromProps(localeOrCode: DateFnsLocaleProps["locale"]): string | undefined {
    return typeof localeOrCode === "string" ? localeOrCode : localeOrCode?.code;
}
