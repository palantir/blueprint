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

import * as React from "react";

import { Callout, Classes, H5, Switch } from "@blueprintjs/core";
import { DatePicker3, type TimePrecision } from "@blueprintjs/datetime2";
import { Example, type ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

import { FormattedDateTag } from "../../common/formattedDateTag";
import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";
import { MaxDateSelect, MinDateSelect } from "./common/minMaxDateSelect";

const exampleFooterElement = <Callout>This additional footer component can be displayed below the date picker</Callout>;

interface DatePicker3ExampleState {
    date: Date | null;
    highlightCurrentDay: boolean;
    maxDate: Date | undefined;
    minDate: Date | undefined;
    reverseMonthAndYearMenus: boolean;
    shortcuts: boolean;
    showActionsBar: boolean;
    showFooterElement: boolean;
    showOutsideDays: boolean;
    showTimeArrowButtons: boolean;
    showWeekNumber: boolean;
    timePrecision: TimePrecision | undefined;
    useAmPm?: boolean;
}

export class DatePicker3Example extends React.PureComponent<ExampleProps, DatePicker3ExampleState> {
    public state: DatePicker3ExampleState = {
        date: null,
        highlightCurrentDay: false,
        maxDate: undefined,
        minDate: undefined,
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showActionsBar: true,
        showFooterElement: false,
        showOutsideDays: true,
        showTimeArrowButtons: false,
        showWeekNumber: false,
        timePrecision: undefined,
        useAmPm: false,
    };

    private toggleHighlight = handleBooleanChange(highlightCurrentDay => this.setState({ highlightCurrentDay }));

    private toggleActionsBar = handleBooleanChange(showActionsBar => this.setState({ showActionsBar }));

    private toggleShowFooterElement = handleBooleanChange(showFooterElement => this.setState({ showFooterElement }));

    private toggleShowOutsideDays = handleBooleanChange(showOutsideDays => this.setState({ showOutsideDays }));

    private toggleShowWeekNumber = handleBooleanChange(showWeekNumber => this.setState({ showWeekNumber }));

    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));

    private toggleReverseMenus = handleBooleanChange(reverse => this.setState({ reverseMonthAndYearMenus: reverse }));

    private handleMaxDateChange = (maxDate: Date) => this.setState({ maxDate });

    private handleMinDateChange = (minDate: Date) => this.setState({ minDate });

    private handlePrecisionChange = handleValueChange((p: TimePrecision | "none") =>
        this.setState({ timePrecision: p === "none" ? undefined : p }),
    );

    private toggleTimepickerArrowButtons = handleBooleanChange(showTimeArrowButtons =>
        this.setState({ showTimeArrowButtons }),
    );

    private toggleUseAmPm = handleBooleanChange(useAmPm => this.setState({ useAmPm }));

    public render() {
        const { date, showTimeArrowButtons, showOutsideDays, showWeekNumber, useAmPm, ...props } = this.state;
        const showTimePicker = this.state.timePrecision !== undefined;

        const options = (
            <>
                <H5>Props</H5>
                <PropCodeTooltip snippet={`showActionsBar={${props.showActionsBar.toString()}}`}>
                    <Switch checked={props.showActionsBar} label="Show actions bar" onChange={this.toggleActionsBar} />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`shortcuts={${props.shortcuts.toString()}}`}>
                    <Switch checked={props.shortcuts} label="Show shortcuts" onChange={this.toggleShortcuts} />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`highlightCurrentDay={${props.highlightCurrentDay.toString()}}`}>
                    <Switch
                        checked={props.highlightCurrentDay}
                        label="Highlight current day"
                        onChange={this.toggleHighlight}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`reverseMonthAndYearMenus={${props.reverseMonthAndYearMenus.toString()}}`}>
                    <Switch
                        checked={props.reverseMonthAndYearMenus}
                        label="Reverse month and year menus"
                        onChange={this.toggleReverseMenus}
                    />
                </PropCodeTooltip>
                <Switch
                    checked={this.state.showFooterElement}
                    label="Show custom footer element"
                    onChange={this.toggleShowFooterElement}
                />
                <MinDateSelect onChange={this.handleMinDateChange} />
                <MaxDateSelect onChange={this.handleMaxDateChange} />
                <H5>react-day-picker props</H5>
                <PropCodeTooltip snippet={`dayPickerProps={{ showWeekNumber: ${showWeekNumber.toString()} }}`}>
                    <Switch checked={showWeekNumber} label="Show week numbers" onChange={this.toggleShowWeekNumber} />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`dayPickerProps={{ showOutsideDays: ${showOutsideDays.toString()} }}`}>
                    <Switch checked={showOutsideDays} label="Show outside days" onChange={this.toggleShowOutsideDays} />
                </PropCodeTooltip>

                <H5>Time picker props</H5>
                <PrecisionSelect
                    allowNone={true}
                    label="Precision"
                    value={props.timePrecision}
                    onChange={this.handlePrecisionChange}
                />
                <PropCodeTooltip
                    snippet={`timePickerProps={{ showArrowButtons: ${showTimeArrowButtons.toString()} }}`}
                    disabled={!showTimePicker}
                >
                    <Switch
                        disabled={!showTimePicker}
                        checked={showTimeArrowButtons}
                        label="Show timepicker arrow buttons"
                        onChange={this.toggleTimepickerArrowButtons}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip
                    snippet={`timePickerProps={{ useAmPm: ${useAmPm.toString()} }}`}
                    disabled={!showTimePicker}
                >
                    <Switch
                        disabled={!showTimePicker}
                        checked={useAmPm}
                        label="Use AM/PM"
                        onChange={this.toggleUseAmPm}
                    />
                </PropCodeTooltip>
            </>
        );

        const timePickerProps = showTimePicker
            ? {
                  showArrowButtons: showTimeArrowButtons,
                  useAmPm,
              }
            : undefined;

        return (
            <Example options={options} {...this.props}>
                <DatePicker3
                    className={Classes.ELEVATION_1}
                    dayPickerProps={{ showOutsideDays, showWeekNumber }}
                    footerElement={this.state.showFooterElement ? exampleFooterElement : undefined}
                    onChange={this.handleDateChange}
                    timePickerProps={timePickerProps}
                    {...props}
                />
                <FormattedDateTag date={date} showTime={showTimePicker} />
            </Example>
        );
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
