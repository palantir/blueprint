/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

// @ts-check

import "@blueprintjs/test-commons/bootstrap";

import { generateIsomorphicTests } from "@blueprintjs/test-commons";

import DateTime2 from "../lib/cjs/index.js";

describe("@blueprintjs/datetime2 isomorphic rendering", () => {
    generateIsomorphicTests(
        DateTime2,
        {
            DatePicker3: {},
            DateInput3: {},
            DateRangeInput3: {},
            DateRangePicker3: {},
        },
        {
            excludedSymbols: ["DateInput2", "DateInput2MigrationUtils", "DateRangeInput2", "TimezoneSelect"],
        },
    );
});
