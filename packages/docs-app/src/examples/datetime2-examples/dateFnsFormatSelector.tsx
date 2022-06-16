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
import * as React from "react";

import { DateFormatProps } from "@blueprintjs/datetime";

import { DateFormatSelector, DateFormatSelectorProps } from "../../common/dateFormatSelector";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const locales: { [localeCode: string]: Locale } = require("date-fns/locale");

export const DateFnsFormatSelector: React.FC<Omit<DateFormatSelectorProps, "formatOptions">> = props => {
    return (
        <DateFormatSelector
            formatOptions={DATE_FNS_FORMATS}
            label={
                <span>
                    <a href="https://date-fns.org/">date-fns</a> format
                </span>
            }
            {...props}
        />
    );
};

export const DATE_FNS_FORMATS: DateFormatProps[] = [
    getDateFnsFormatter("MM/dd/yyyy"),
    getDateFnsFormatter("yyyy-MM-dd"),
    getDateFnsFormatter("yyyy-MM-dd HH:mm:ss"),
    getDateFnsFormatter("LLL do, yyyy 'at' K:mm a"),
];

function getDateFnsFormatter(formatStr: string): DateFormatProps {
    return {
        formatDate: (date, localeCode) => format(date, formatStr, maybeGetLocaleOptions(localeCode)),
        parseDate: (str, localeCode) => parse(str, formatStr, new Date(), maybeGetLocaleOptions(localeCode)),
        placeholder: `${formatStr}`,
    };
}

function maybeGetLocaleOptions(localeCode: string): { locale: Locale } | undefined {
    if (locales[localeCode] !== undefined) {
        return { locale: locales[localeCode] };
    }
    return undefined;
}
