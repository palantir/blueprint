/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import { useState } from "react";

import { Callout, Code, FormGroup, H5, Switch } from "@blueprintjs/core";
import { type DateRange, DateRangeInput, TimePrecision } from "@blueprintjs/datetime";
import {
    Example,
    type ExampleProps,
    handleBooleanChange,
    handleValueChange,
} from "@blueprintjs/docs-theme";

import { type CommonDateFnsLocale, DateFnsLocaleSelect } from "../../common/dateFnsLocaleSelect";
import { FormattedDateRange } from "../../common/formattedDateRange";
import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { DATE_FNS_FORMAT_OPTIONS, DateFnsFormatSelect } from "./common/dateFnsFormatSelect";
import { PrecisionSelect } from "./common/precisionSelect";

export const DateRangeInputExample: React.FC<ExampleProps> = props => {
    const [allowSingleDayRange, setAllowSingleDayRange] = useState(false);
    const [closeOnSelection, setCloseOnSelection] = useState(false);
    const [contiguousCalendarMonths, setContiguousCalendarMonths] = useState(true);
    const [dateFnsFormat, setDateFnsFormat] = useState(DATE_FNS_FORMAT_OPTIONS[0]);
    const [disabled, setDisabled] = useState(false);
    const [enableTimePicker, setEnableTimePicker] = useState(false);
    const [fill, setFill] = useState(false);
    const [localeCode, setLocaleCode] = useState<CommonDateFnsLocale>("en-US");
    const [reverseMonthAndYearMenus, setReverseMonthAndYearMenus] = useState(false);
    const [selectAllOnFocus, setSelectAllOnFocus] = useState(false);
    const [shortcuts, setShortcuts] = useState(true);
    const [showFooterElement, setShowFooterElement] = useState(false);
    const [showArrowButtons, setShowArrowButtons] = useState(false);
    const [singleMonthOnly, setSingleMonthOnly] = useState(false);
    const [precision, setPrecision] = useState<TimePrecision>(TimePrecision.MINUTE);
    const [useAmPm, setUseAmPm] = useState(false);
    const [value, setValue] = useState<DateRange>([null, null]);

    const handlePrecisionChange = handleValueChange((timePrecision: TimePrecision | "none") =>
        setPrecision(timePrecision === "none" ? undefined : timePrecision),
    );

    const options = (
        <>
            <div>
                <H5>Behavior props</H5>
                <PropCodeTooltip snippet={`closeOnSelection={${closeOnSelection}}`}>
                    <Switch
                        checked={closeOnSelection}
                        label="Close on selection"
                        onChange={handleBooleanChange(setCloseOnSelection)}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`selectAllOnFocus={${selectAllOnFocus}}`}>
                    <Switch
                        checked={selectAllOnFocus}
                        label="Select all text on input focus"
                        onChange={handleBooleanChange(setSelectAllOnFocus)}
                    />
                </PropCodeTooltip>
                <br />

                <H5>Date range picker props</H5>
                <PropCodeTooltip snippet={`shortcuts={${shortcuts}}`}>
                    <Switch
                        checked={shortcuts}
                        label="Show shortcuts"
                        onChange={handleBooleanChange(setShortcuts)}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`allowSingleDayRange={${allowSingleDayRange}}`}>
                    <Switch
                        checked={allowSingleDayRange}
                        label="Allow single day range"
                        onChange={handleBooleanChange(setAllowSingleDayRange)}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`singleMonthOnly={${singleMonthOnly}}`}>
                    <Switch
                        checked={singleMonthOnly}
                        label="Single month only"
                        onChange={handleBooleanChange(setSingleMonthOnly)}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`contiguousCalendarMonths={${contiguousCalendarMonths}}`}>
                    <Switch
                        checked={contiguousCalendarMonths}
                        label="Constrain calendar to contiguous months"
                        onChange={handleBooleanChange(setContiguousCalendarMonths)}
                    />
                </PropCodeTooltip>
                <Switch
                    checked={reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    onChange={handleBooleanChange(setReverseMonthAndYearMenus)}
                />
                <Switch
                    checked={showFooterElement}
                    label="Show custom footer element"
                    onChange={handleBooleanChange(setShowFooterElement)}
                />
                <FormGroup inline={true} label="Locale">
                    <DateFnsLocaleSelect
                        onChange={setLocaleCode}
                        popoverProps={{ placement: "bottom-start" }}
                        value={localeCode}
                    />
                </FormGroup>
            </div>

            <div>
                <H5>Input appearance props</H5>
                <PropCodeTooltip snippet={`disabled={${disabled}}`}>
                    <Switch
                        checked={disabled}
                        label="Disabled"
                        onChange={handleBooleanChange(setDisabled)}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`fill={${fill}}`}>
                    <Switch
                        checked={fill}
                        label="Fill container width"
                        onChange={handleBooleanChange(setFill)}
                    />
                </PropCodeTooltip>
                <DateFnsFormatSelect value={dateFnsFormat} onChange={setDateFnsFormat} />
                <br />

                <H5>Time picker props</H5>
                <Switch
                    checked={enableTimePicker}
                    label="Enable time picker"
                    onChange={handleBooleanChange(setEnableTimePicker)}
                />
                <PrecisionSelect
                    allowNone={false}
                    disabled={!enableTimePicker}
                    label="Time precision"
                    onChange={handlePrecisionChange}
                    value={precision}
                />
                <PropCodeTooltip
                    disabled={!enableTimePicker}
                    snippet={`timePickerProps={{ showArrowButtons: ${showArrowButtons} }}`}
                >
                    <Switch
                        disabled={!enableTimePicker}
                        checked={showArrowButtons}
                        label="Show timepicker arrow buttons"
                        onChange={handleBooleanChange(setShowArrowButtons)}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip
                    disabled={!enableTimePicker}
                    snippet={`timePickerProps={{ useAmPm: ${useAmPm} }}`}
                >
                    <Switch
                        disabled={!enableTimePicker}
                        checked={useAmPm}
                        label="Use AM/PM"
                        onChange={handleBooleanChange(setUseAmPm)}
                    />
                </PropCodeTooltip>
            </div>
        </>
    );

    return (
        <Example options={options} showOptionsBelowExample={true} {...props}>
            <DateRangeInput
                allowSingleDayRange={allowSingleDayRange}
                closeOnSelection={closeOnSelection}
                contiguousCalendarMonths={contiguousCalendarMonths}
                dateFnsFormat={dateFnsFormat}
                disabled={disabled}
                fill={fill}
                footerElement={showFooterElement ? exampleFooterElement : undefined}
                locale={localeCode}
                onChange={setValue}
                reverseMonthAndYearMenus={reverseMonthAndYearMenus}
                selectAllOnFocus={selectAllOnFocus}
                shortcuts={shortcuts}
                singleMonthOnly={singleMonthOnly}
                timePickerProps={
                    enableTimePicker ? { precision, showArrowButtons, useAmPm } : undefined
                }
                value={value}
            />
            <FormattedDateRange range={value} showTime={enableTimePicker} />
        </Example>
    );
};

const exampleFooterElement = (
    <Callout style={{ maxWidth: 460 }}>
        A custom footer element may be displayed below the date range picker calendars using the{" "}
        <Code>footerElement</Code> prop.
    </Callout>
);
