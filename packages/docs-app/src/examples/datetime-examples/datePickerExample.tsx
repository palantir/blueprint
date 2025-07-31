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

import { Callout, Classes, H5, Switch } from "@blueprintjs/core";
import { DatePicker, type TimePrecision } from "@blueprintjs/datetime";
import { Example, type ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

import { FormattedDateTag } from "../../common/formattedDateTag";
import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";

import { MaxDateSelect, MinDateSelect } from "./common/minMaxDateSelect";

export const DatePickerExample: React.FC<ExampleProps> = props => {
    const [highlightCurrentDay, setHighlightCurrentDay] = useState(false);
    const [maxDate, setMaxDate] = useState<Date>(undefined);
    const [minDate, setMinDate] = useState<Date>(undefined);
    const [reverseMonthAndYearMenus, setReverseMonthAndYearMenus] = useState(false);
    const [shortcuts, setShortcuts] = useState(false);
    const [showActionsBar, setShowActionsBar] = useState(true);
    const [showFooterElement, setShowFooterElement] = useState(false);
    const [showOutsideDays, setShowOutsideDays] = useState(true);
    const [showArrowButtons, setShowArrowButtons] = useState(false);
    const [showWeekNumber, setShowWeekNumber] = useState(false);
    const [timePrecision, setTimePrecision] = useState<TimePrecision>(undefined);
    const [useAmPm, setUseAmPm] = useState(false);
    const [value, setValue] = useState<Date>(null);

    const showTimePicker = timePrecision !== undefined;

    const handlePrecisionChange = handleValueChange((precision: TimePrecision | "none") =>
        setTimePrecision(precision === "none" ? undefined : precision),
    );

    const options = (
        <>
            <H5>Props</H5>
            <PropCodeTooltip snippet={`showActionsBar={${showActionsBar}}`}>
                <Switch
                    checked={showActionsBar}
                    label="Show actions bar"
                    onChange={handleBooleanChange(setShowActionsBar)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`shortcuts={${shortcuts}}`}>
                <Switch checked={shortcuts} label="Show shortcuts" onChange={handleBooleanChange(setShortcuts)} />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`highlightCurrentDay={${highlightCurrentDay}}`}>
                <Switch
                    checked={highlightCurrentDay}
                    label="Highlight current day"
                    onChange={handleBooleanChange(setHighlightCurrentDay)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`reverseMonthAndYearMenus={${reverseMonthAndYearMenus}}`}>
                <Switch
                    checked={reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    onChange={handleBooleanChange(setReverseMonthAndYearMenus)}
                />
            </PropCodeTooltip>
            <Switch
                checked={showFooterElement}
                label="Show custom footer element"
                onChange={handleBooleanChange(setShowFooterElement)}
            />
            <MinDateSelect onChange={setMinDate} />
            <MaxDateSelect onChange={setMaxDate} />
            <H5>react-day-picker props</H5>
            <PropCodeTooltip snippet={`dayPickerProps={{ showWeekNumber: ${showWeekNumber} }}`}>
                <Switch
                    checked={showWeekNumber}
                    label="Show week numbers"
                    onChange={handleBooleanChange(setShowWeekNumber)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`dayPickerProps={{ showOutsideDays: ${showOutsideDays} }}`}>
                <Switch
                    checked={showOutsideDays}
                    label="Show outside days"
                    onChange={handleBooleanChange(setShowOutsideDays)}
                />
            </PropCodeTooltip>

            <H5>Time picker props</H5>
            <PrecisionSelect
                allowNone={true}
                label="Precision"
                onChange={handlePrecisionChange}
                value={timePrecision}
            />
            <PropCodeTooltip
                disabled={!showTimePicker}
                snippet={`timePickerProps={{ showArrowButtons: ${showArrowButtons} }}`}
            >
                <Switch
                    checked={showArrowButtons}
                    disabled={!showTimePicker}
                    label="Show timepicker arrow buttons"
                    onChange={handleBooleanChange(setShowArrowButtons)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip disabled={!showTimePicker} snippet={`timePickerProps={{ useAmPm: ${useAmPm} }}`}>
                <Switch
                    checked={useAmPm}
                    disabled={!showTimePicker}
                    label="Use AM/PM"
                    onChange={handleBooleanChange(setUseAmPm)}
                />
            </PropCodeTooltip>
        </>
    );

    return (
        <Example options={options} {...props}>
            <DatePicker
                className={Classes.ELEVATION_1}
                dayPickerProps={{ showOutsideDays, showWeekNumber }}
                footerElement={showFooterElement ? exampleFooterElement : undefined}
                highlightCurrentDay={highlightCurrentDay}
                maxDate={maxDate}
                minDate={minDate}
                onChange={setValue}
                reverseMonthAndYearMenus={reverseMonthAndYearMenus}
                shortcuts={shortcuts}
                showActionsBar={showActionsBar}
                timePickerProps={showTimePicker ? { showArrowButtons, useAmPm } : undefined}
                timePrecision={timePrecision}
                value={value}
            />
            <FormattedDateTag date={value} showTime={showTimePicker} />
        </Example>
    );
};

const exampleFooterElement = <Callout>This additional footer component can be displayed below the date picker</Callout>;
