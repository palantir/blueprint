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

export { DatePicker3, DatePicker3Props } from "./components/date-picker3/datePicker3";
export { DateInput3, DateInput3Props } from "./components/date-input3/dateInput3";
export { DateRangeInput3, DateRangeInput3Props } from "./components/date-range-input3/dateRangeInput3";
export { DateRangePicker3, DateRangePicker3Props } from "./components/date-range-picker3/dateRangePicker3";
import * as DateInput2MigrationUtils from "./dateInput2MigrationUtils";

export { DateInput2MigrationUtils };
export { Classes as Datetime2Classes, ReactDayPickerClasses } from "./classes";

/* eslint-disable deprecation/deprecation */

export {
    /** @deprecated import from `@blueprintjs/datetime` or use `Datetime2Classes` instead */
    Classes,
    DateFormatProps,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    DateInput as DateInput2,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    DateInputProps as DateInput2Props,
    DateRange,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    DateRangeInput as DateRangeInput2,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    DateRangeInputProps as DateRangeInput2Props,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    getTimezoneMetadata,
    TimePrecision,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    TimezoneSelect,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    TimezoneSelectProps,
    /** @deprecated import from `@blueprintjs/datetime` instead */
    TimezoneDisplayFormat,
} from "@blueprintjs/datetime";
