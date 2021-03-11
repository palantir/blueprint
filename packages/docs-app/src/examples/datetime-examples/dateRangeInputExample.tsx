/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { H5, Switch } from "@blueprintjs/core";
import { DateRange, DateRangeInput, DateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { Example, handleBooleanChange, ExampleProps } from "@blueprintjs/docs-theme";

import { FORMATS, FormatSelect } from "./common/formatSelect";
import { MomentDateRange } from "./common/momentDate";

export interface DateRangeInputExampleState {
    allowSingleDayRange: boolean;
    closeOnSelection: boolean;
    contiguousCalendarMonths: boolean;
    disabled: boolean;
    enableTimePicker: boolean;
    format: DateFormatProps;
    range: DateRange;
    reverseMonthAndYearMenus: boolean;
    selectAllOnFocus: boolean;
    shortcuts: boolean;
    singleMonthOnly: boolean;
    showTimeArrowButtons: boolean;
}

export class DateRangeInputExample extends React.PureComponent<ExampleProps, DateRangeInputExampleState> {
    public state: DateRangeInputExampleState = {
        allowSingleDayRange: false,
        closeOnSelection: false,
        contiguousCalendarMonths: true,
        disabled: false,
        enableTimePicker: false,
        format: FORMATS[0],
        range: [null, null],
        reverseMonthAndYearMenus: false,
        selectAllOnFocus: false,
        shortcuts: true,
        showTimeArrowButtons: false,
        singleMonthOnly: false,
    };

    private toggleContiguous = handleBooleanChange(contiguous => {
        this.setState({ contiguousCalendarMonths: contiguous });
    });

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleReverseMonthAndYearMenus = handleBooleanChange(reverseMonthAndYearMenus =>
        this.setState({ reverseMonthAndYearMenus }),
    );

    private toggleSelection = handleBooleanChange(closeOnSelection => this.setState({ closeOnSelection }));

    private toggleSelectAllOnFocus = handleBooleanChange(selectAllOnFocus => this.setState({ selectAllOnFocus }));

    private toggleSingleDay = handleBooleanChange(allowSingleDayRange => this.setState({ allowSingleDayRange }));

    private toggleSingleMonth = handleBooleanChange(singleMonthOnly => this.setState({ singleMonthOnly }));

    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));

    private toggleTimePicker = handleBooleanChange(enableTimePicker => this.setState({ enableTimePicker }));

    private toggleTimepickerArrowButtons = handleBooleanChange(showTimeArrowButtons =>
        this.setState({ showTimeArrowButtons }),
    );

    public render() {
        const { enableTimePicker, format, range, showTimeArrowButtons, ...spreadProps } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <DateRangeInput
                    {...spreadProps}
                    {...format}
                    onChange={this.handleRangeChange}
                    timePickerProps={
                        enableTimePicker
                            ? { precision: TimePrecision.MINUTE, showArrowButtons: showTimeArrowButtons }
                            : undefined
                    }
                />
                <MomentDateRange range={range} />
            </Example>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch
                    checked={this.state.allowSingleDayRange}
                    label="Allow single day range"
                    onChange={this.toggleSingleDay}
                />
                <Switch
                    checked={this.state.singleMonthOnly}
                    label="Single month only"
                    onChange={this.toggleSingleMonth}
                />
                <Switch checked={this.state.shortcuts} label="Show shortcuts" onChange={this.toggleShortcuts} />
                <Switch
                    checked={this.state.closeOnSelection}
                    label="Close on selection"
                    onChange={this.toggleSelection}
                />
                <Switch
                    checked={this.state.contiguousCalendarMonths}
                    label="Constrain calendar to contiguous months"
                    onChange={this.toggleContiguous}
                />
                <Switch checked={this.state.disabled} label="Disabled" onChange={this.toggleDisabled} />
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    onChange={this.toggleSelectAllOnFocus}
                />
                <Switch
                    checked={this.state.reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    onChange={this.toggleReverseMonthAndYearMenus}
                />
                <Switch
                    checked={this.state.enableTimePicker}
                    label="Enable time picker"
                    onChange={this.toggleTimePicker}
                />
                <Switch
                    disabled={!this.state.enableTimePicker}
                    checked={this.state.showTimeArrowButtons}
                    label="Show timepicker arrow buttons"
                    onChange={this.toggleTimepickerArrowButtons}
                />
                <FormatSelect key="Format" format={this.state.format} onChange={this.handleFormatChange} />
            </>
        );
    }

    private handleFormatChange = (format: DateFormatProps) => this.setState({ format });

    private handleRangeChange = (range: DateRange) => this.setState({ range });
}
