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

import { H5, Switch } from "@blueprintjs/core";
import { DateRange, DateRangeInput, IDateFormatProps } from "@blueprintjs/datetime";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";

import { FORMATS, FormatSelect } from "./common/formatSelect";
import { MomentDateRange } from "./common/momentDate";

export interface IDateRangeInputExampleState {
    allowSingleDayRange: boolean;
    closeOnSelection: boolean;
    contiguousCalendarMonths: boolean;
    disabled: boolean;
    format: IDateFormatProps;
    range: DateRange;
    reverseMonthAndYearMenus: boolean;
    selectAllOnFocus: boolean;
    shortcuts: boolean;
    singleMonthOnly: boolean;
}

export class DateRangeInputExample extends React.PureComponent<IExampleProps, IDateRangeInputExampleState> {
    public state: IDateRangeInputExampleState = {
        allowSingleDayRange: false,
        closeOnSelection: false,
        contiguousCalendarMonths: true,
        disabled: false,
        format: FORMATS[0],
        range: [null, null],
        reverseMonthAndYearMenus: false,
        selectAllOnFocus: false,
        shortcuts: true,
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

    public render() {
        const { format, range, ...spreadProps } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <DateRangeInput {...spreadProps} {...format} onChange={this.handleRangeChange} />
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
                <FormatSelect key="Format" format={this.state.format} onChange={this.handleFormatChange} />
            </>
        );
    }

    private handleFormatChange = (format: IDateFormatProps) => this.setState({ format });
    private handleRangeChange = (range: DateRange) => this.setState({ range });
}
