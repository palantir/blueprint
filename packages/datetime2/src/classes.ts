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

import classNames from "classnames";
import type { StyledElement } from "react-day-picker";

import { Classes as CoreClasses } from "@blueprintjs/core";
import { Classes as DatetimeClasses } from "@blueprintjs/datetime";

export const ReactDayPickerClasses = DatetimeClasses.ReactDayPickerClasses;
export const DatePicker3CaptionClasses = DatetimeClasses.DatePickerCaptionClasses;
export const DatePicker3Classes = DatetimeClasses.DatePickerClasses;
export const DateRangePicker3Classes = DatetimeClasses.DateRangePickerClasses;

/** Class names for next-gen @blueprintjs/datetime2 "V3" components */
export const Classes = {
    ...DatetimeClasses,
    ...DatePicker3CaptionClasses,
    ...DatePicker3Classes,
    ...DateRangePicker3Classes,
};

/**
 * Class name overrides for components rendered by react-day-picker. These are helpful so that @blueprintjs/datetime2
 * can have more predictable and standard DOM selectors in custom styles & tests.
 */
export const dayPickerClassNameOverrides: Partial<StyledElement<string>> = {
    /* eslint-disable camelcase */
    button: classNames(CoreClasses.BUTTON, CoreClasses.MINIMAL),
    // no need for button "reset" styles since the core Button styles handle that for us
    button_reset: undefined,
    dropdown_month: DatePicker3CaptionClasses.DATEPICKER3_DROPDOWN_MONTH,
    dropdown_year: DatePicker3CaptionClasses.DATEPICKER3_DROPDOWN_YEAR,
    nav_button: DatePicker3CaptionClasses.DATEPICKER3_NAV_BUTTON,
    nav_button_next: DatePicker3CaptionClasses.DATEPICKER3_NAV_BUTTON_NEXT,
    nav_button_previous: DatePicker3CaptionClasses.DATEPICKER3_NAV_BUTTON_PREVIOUS,
    /* eslint-enable camelcase */
};
