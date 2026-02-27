/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { add } from "date-fns";
import { describe } from "vitest";

import { generateIsomorphicTestsVitest, type IsomorphicTestConfig } from "@blueprintjs/test-commons";

import * as DateTime from "./index";

const formatProps = {
    formatDate: (date: Date) => date.toLocaleString(),
    parseDate: (str: string) => new Date(Date.parse(str)),
    placeholder: "enter date",
};

const today = new Date();
const maxDate = add(today, { days: 1 });
const minDate = add(today, { years: -4 });

const config: Record<string, IsomorphicTestConfig> = {
    DateInput: { props: formatProps },
    DatePickerShortcutMenu: {
        className: false,
        props: {
            allowSingleDayRange: true,
            maxDate,
            minDate,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onShortcutClick: () => {},
            shortcuts: true,
            timePrecision: "second",
        },
    },
    DateRangeInput: { props: formatProps },
};

describe("@blueprintjs/datetime isomorphic rendering", () => {
    generateIsomorphicTestsVitest(DateTime, config, {
        excludedSymbols: ["DateRangeSelectionStrategy", "MonthAndYear"],
    });
});
