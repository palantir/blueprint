/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import React from "react";

import { Classes, H5, Switch } from "@blueprintjs/core";
import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
import { Example, handleBooleanChange, handleValueChange, ExampleProps } from "@blueprintjs/docs-theme";

import { MomentDate } from "./common/momentDate";
import { PrecisionSelect } from "./common/precisionSelect";

export interface DatePickerExampleState {
    date: Date | null;
    highlightCurrentDay: boolean;
    reverseMonthAndYearMenus: boolean;
    shortcuts: boolean;
    showActionsBar: boolean;
    timePrecision: TimePrecision | undefined;
    showTimeArrowButtons: boolean;
    useAmPm?: boolean;
}

export class DatePickerExample extends React.PureComponent<ExampleProps, DatePickerExampleState> {
    public state: DatePickerExampleState = {
        date: null,
        highlightCurrentDay: false,
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showActionsBar: false,
        showTimeArrowButtons: false,
        timePrecision: undefined,
        useAmPm: false,
    };

    private toggleHighlight = handleBooleanChange(highlightCurrentDay => this.setState({ highlightCurrentDay }));

    private toggleActionsBar = handleBooleanChange(showActionsBar => this.setState({ showActionsBar }));

    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));

    private toggleReverseMenus = handleBooleanChange(reverse => this.setState({ reverseMonthAndYearMenus: reverse }));

    private handlePrecisionChange = handleValueChange((p: TimePrecision | "none") =>
        this.setState({ timePrecision: p === "none" ? undefined : p }),
    );

    private toggleTimepickerArrowButtons = handleBooleanChange(showTimeArrowButtons =>
        this.setState({ showTimeArrowButtons }),
    );

    private toggleUseAmPm = handleBooleanChange(useAmPm => this.setState({ useAmPm }));

    public render() {
        const { date, showTimeArrowButtons, useAmPm, ...props } = this.state;
        const showTimePicker = this.state.timePrecision !== undefined;

        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={props.showActionsBar} label="Show actions bar" onChange={this.toggleActionsBar} />
                <Switch checked={props.shortcuts} label="Show shortcuts" onChange={this.toggleShortcuts} />
                <Switch
                    checked={props.highlightCurrentDay}
                    label="Highlight current day"
                    onChange={this.toggleHighlight}
                />
                <Switch
                    checked={props.reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    onChange={this.toggleReverseMenus}
                />
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    value={props.timePrecision}
                    onChange={this.handlePrecisionChange}
                />
                <Switch
                    disabled={!showTimePicker}
                    checked={showTimeArrowButtons}
                    label="Show timepicker arrow buttons"
                    onChange={this.toggleTimepickerArrowButtons}
                />
                <Switch
                    disabled={!showTimePicker}
                    checked={this.state.useAmPm}
                    label="Use AM/PM"
                    onChange={this.toggleUseAmPm}
                />
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
                <DatePicker
                    className={Classes.ELEVATION_1}
                    onChange={this.handleDateChange}
                    timePickerProps={timePickerProps}
                    {...props}
                />
                <MomentDate date={date} withTime={props.timePrecision !== undefined} />
            </Example>
        );
    }

    private handleDateChange = (date: Date) => this.setState({ date });
}
