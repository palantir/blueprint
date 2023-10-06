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

const RDP = "rdp";
const RDP_DAY = `${RDP}-day`;

/** Class names applied by react-day-picker v8.x */
export const ReactDayPickerClasses = {
    RDP,
    RDP_CAPTION: `${RDP}-caption`,
    RDP_CAPTION_DROPDOWNS: `${RDP}-caption_dropdowns`,
    RDP_CAPTION_LABEL: `${RDP}-caption_label`,
    RDP_DAY,
    RDP_DAY_DISABLED: `${RDP_DAY}_disabled`,
    RDP_DAY_HOVERED_RANGE: `${RDP_DAY}_hovered`,
    RDP_DAY_HOVERED_RANGE_END: `${RDP_DAY}_hovered_end`,
    RDP_DAY_HOVERED_RANGE_START: `${RDP_DAY}_hovered_start`,
    RDP_DAY_OUTSIDE: `${RDP_DAY}_outside`,
    RDP_DAY_RANGE_END: `${RDP_DAY}_range_end`,
    RDP_DAY_RANGE_MIDDLE: `${RDP_DAY}_range_middle`,
    RDP_DAY_RANGE_START: `${RDP_DAY}_range_start`,
    RDP_DAY_SELECTED: `${RDP_DAY}_selected`,
    RDP_DAY_TODAY: `${RDP_DAY}_today`,
    RDP_MONTH: `${RDP}-month`,
    RDP_NAV: `${RDP}-nav`,
    RDP_TABLE: `${RDP}-table`,
    RDP_VHIDDEN: `${RDP}-vhidden`,
};

export const DatePicker3CaptionClasses = {
    DATEPICKER3_CAPTION: DatetimeClasses.DATEPICKER_CAPTION,
    DATEPICKER3_DROPDOWN_MONTH: DatetimeClasses.DATEPICKER_MONTH_SELECT,
    DATEPICKER3_DROPDOWN_YEAR: DatetimeClasses.DATEPICKER_YEAR_SELECT,
    DATEPICKER3_NAV_BUTTON: `${DatetimeClasses.DATEPICKER}-nav-button`,
    DATEPICKER3_NAV_BUTTON_NEXT: `${DatetimeClasses.DATEPICKER}-nav-button-next`,
    DATEPICKER3_NAV_BUTTON_PREVIOUS: `${DatetimeClasses.DATEPICKER}-nav-button-previous`,
};

export const DatePicker3Classes = {
    DATEPICKER3_DAY: RDP_DAY,
    DATEPICKER3_DAY_DISABLED: ReactDayPickerClasses.RDP_DAY_DISABLED,
    DATEPICKER3_DAY_IS_TODAY: ReactDayPickerClasses.RDP_DAY_TODAY,
    DATEPICKER3_DAY_OUTSIDE: ReactDayPickerClasses.RDP_DAY_OUTSIDE,
    DATEPICKER3_DAY_SELECTED: ReactDayPickerClasses.RDP_DAY_SELECTED,
    DATEPICKER3_HIGHLIGHT_CURRENT_DAY: `${DatetimeClasses.DATEPICKER}-highlight-current-day`,
    DATEPICKER3_REVERSE_MONTH_AND_YEAR: `${DatetimeClasses.DATEPICKER}-reverse-month-and-year`,
};

export const DateRangePicker3Classes = {
    DATERANGEPICKER3_HOVERED_RANGE: ReactDayPickerClasses.RDP_DAY_HOVERED_RANGE,
    DATERANGEPICKER3_HOVERED_RANGE_END: ReactDayPickerClasses.RDP_DAY_HOVERED_RANGE_END,
    DATERANGEPICKER3_HOVERED_RANGE_START: ReactDayPickerClasses.RDP_DAY_HOVERED_RANGE_START,
    DATERANGEPICKER3_REVERSE_MONTH_AND_YEAR: `${DatetimeClasses.DATERANGEPICKER}-reverse-month-and-year`,
    DATERANGEPICKER3_SELECTED_RANGE_END: ReactDayPickerClasses.RDP_DAY_RANGE_END,
    DATERANGEPICKER3_SELECTED_RANGE_MIDDLE: ReactDayPickerClasses.RDP_DAY_RANGE_MIDDLE,
    DATERANGEPICKER3_SELECTED_RANGE_START: ReactDayPickerClasses.RDP_DAY_RANGE_START,
    DATERANGEPICKER3_TIMEPICKERS_STACKED: `${DatetimeClasses.DATERANGEPICKER_TIMEPICKERS}-stacked`,
};

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
