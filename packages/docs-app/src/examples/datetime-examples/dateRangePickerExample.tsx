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

import * as React from "react";

import { Classes, FormGroup, Switch } from "@blueprintjs/core";
import { type DateRange, DateRangePicker, type TimePrecision } from "@blueprintjs/datetime";
import { Example, type ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

import { type CommonDateFnsLocale, DateFnsLocaleSelect } from "../../common/dateFnsLocaleSelect";
import { FormattedDateRange } from "../../common/formattedDateRange";
import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { MaxDateSelect, MinDateSelect } from "./common/minMaxDateSelect";
import { PrecisionSelect } from "./common/precisionSelect";

export const DateRangePickerExample: React.FC<ExampleProps> = props => {
    const [allowSingleDayRange, setAllowSingleDayRange] = React.useState(false);
    const [contiguousCalendarMonths, setContiguousCalendarMonths] = React.useState(true);
    const [localeCode, setLocaleCode] = React.useState<CommonDateFnsLocale>("en-US");
    const [maxDate, setMaxDate] = React.useState<Date>(undefined);
    const [minDate, setMinDate] = React.useState<Date>(undefined);
    const [reverseMonthAndYearMenus, setReverseMonthAndYearMenus] = React.useState(false);
    const [shortcuts, setShortcuts] = React.useState(true);
    const [showArrowButtons, setShowArrowButtons] = React.useState(false);
    const [singleMonthOnly, setSingleMonthOnly] = React.useState(false);
    const [precision, setPrecision] = React.useState<TimePrecision>(undefined);
    const [useAmPm, setUseAmPm] = React.useState(false);
    const [value, setValue] = React.useState<DateRange>([null, null]);

    const showTimePicker = precision !== undefined;

    const handlePrecisionChange = handleValueChange((timePrecision: TimePrecision | "none") =>
        setPrecision(timePrecision === "none" ? undefined : timePrecision),
    );

    const options = (
        <>
            <div>
                <Switch
                    checked={allowSingleDayRange}
                    label="Allow single day range"
                    onChange={handleBooleanChange(setAllowSingleDayRange)}
                />
                <Switch
                    checked={singleMonthOnly}
                    label="Single month only"
                    onChange={handleBooleanChange(setSingleMonthOnly)}
                />
                <Switch
                    checked={contiguousCalendarMonths}
                    disabled={singleMonthOnly}
                    label="Constrain to contiguous months"
                    onChange={handleBooleanChange(setContiguousCalendarMonths)}
                />
                <Switch checked={shortcuts} label="Show shortcuts" onChange={handleBooleanChange(setShortcuts)} />
                <Switch
                    checked={reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    onChange={handleBooleanChange(setReverseMonthAndYearMenus)}
                />
            </div>
            <div>
                <MinDateSelect onChange={setMinDate} />
                <MaxDateSelect onChange={setMaxDate} />
                <FormGroup label="Locale">
                    <DateFnsLocaleSelect
                        onChange={setLocaleCode}
                        popoverProps={{ matchTargetWidth: true }}
                        value={localeCode}
                    />
                </FormGroup>
            </div>
            <div>
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    onChange={handlePrecisionChange}
                    value={precision}
                />
                <PropCodeTooltip
                    disabled={!showTimePicker}
                    snippet={`timePickerProps={{ showArrowButtons: ${showArrowButtons} }}`}
                >
                    <Switch
                        disabled={!showTimePicker}
                        checked={showArrowButtons}
                        label="Time picker arrows"
                        onChange={handleBooleanChange(setShowArrowButtons)}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip disabled={!showTimePicker} snippet={`timePickerProps={{ useAmPm: ${useAmPm} }}`}>
                    <Switch
                        disabled={!showTimePicker}
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
            <DateRangePicker
                allowSingleDayRange={allowSingleDayRange}
                className={Classes.ELEVATION_1}
                contiguousCalendarMonths={contiguousCalendarMonths}
                locale={localeCode}
                maxDate={maxDate}
                minDate={minDate}
                onChange={setValue}
                reverseMonthAndYearMenus={reverseMonthAndYearMenus}
                shortcuts={shortcuts}
                singleMonthOnly={singleMonthOnly}
                timePickerProps={showTimePicker ? { precision, showArrowButtons, useAmPm } : undefined}
                value={value}
            />
            <FormattedDateRange range={value} showTime={showTimePicker} />
        </Example>
    );
};
