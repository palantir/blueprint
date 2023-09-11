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

import type { DayModifiers, DayPickerRangeProps, ModifiersClassNames } from "react-day-picker";

import type { DateRange } from "@blueprintjs/datetime";
// tslint:disable no-submodule-imports
import type { MonthAndYear } from "@blueprintjs/datetime/lib/esm/common/monthAndYear";
// tslint:enable no-submodule-imports

import type { DateRangePicker3Props } from "./dateRangePicker3Props";
import type { DateRangePicker3State } from "./dateRangePicker3State";

/**
 * Props used to render an interactive single- or double-calendar day range picker.
 * This is the core UI of DateRangePicker3.
 */
export interface DayRangePickerProps
    extends Omit<DateRangePicker3Props, "initialMonth" | "locale" | "value">,
        Pick<DateRangePicker3State, "locale" | "value"> {
    /** Initial month computed in DateRangePicker3 constructor. */
    initialMonthAndYear: MonthAndYear;

    /** DateRangePicker3's custom modifiers */
    modifiers: DayModifiers;

    /** DateRangePicker3's custom modifier class names */
    modifiersClassNames: ModifiersClassNames;

    /** DateRangePicker3's range selection handler */
    updateSelectedRange: (nextValue: DateRange) => void;

    /** react-day-picker event handlers */
    dayPickerEventHandlers: Required<Pick<DayPickerRangeProps, "onDayMouseEnter" | "onDayMouseLeave">>;
}
