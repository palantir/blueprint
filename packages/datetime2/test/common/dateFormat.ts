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

import { format, Locale, parse } from "date-fns";

import { DateFormatProps } from "../../src";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const locales: { [localeCode: string]: Locale } = require("date-fns/locale");

export const DATE_FORMAT = getDateFnsFormatter("M/d/yyyy");
export const DATETIME_FORMAT = getDateFnsFormatter("M/d/yyyy HH:mm:ss");

// N.B. duplicated in docs-app/src/examples/datetime2-examples
function getDateFnsFormatter(formatStr: string): DateFormatProps {
    return {
        formatDate: (date, localeCode) => format(date, formatStr, maybeGetLocaleOptions(localeCode)),
        parseDate: (str, localeCode) => parse(str, formatStr, new Date(), maybeGetLocaleOptions(localeCode)),
        placeholder: `${formatStr}`,
    };
}

function maybeGetLocaleOptions(localeCode: string | undefined): { locale: Locale } | undefined {
    if (localeCode !== undefined && locales[localeCode] !== undefined) {
        return { locale: locales[localeCode] };
    }
    return undefined;
}
