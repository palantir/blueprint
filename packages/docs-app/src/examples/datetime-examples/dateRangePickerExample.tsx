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

import { Classes, H5, HTMLSelect, Label, Switch } from "@blueprintjs/core";
import {
    Example,
    handleBooleanChange,
    handleNumberChange,
    handleStringChange,
    IExampleProps,
} from "@blueprintjs/docs-theme";
import moment from "moment";
import * as React from "react";

import { DateRange, DateRangePicker, TimePrecision } from "@blueprintjs/datetime";
import { MomentDateRange } from "./common/momentDate";
import { PrecisionSelect } from "./common/precisionSelect";

export interface IDateRangePickerExampleState {
    allowSingleDayRange?: boolean;
    singleMonthOnly?: boolean;
    contiguousCalendarMonths?: boolean;
    dateRange?: DateRange;
    maxDateIndex?: number;
    minDateIndex?: number;
    reverseMonthAndYearMenus?: boolean;
    shortcuts?: boolean;
    timePrecision?: TimePrecision;
}

interface IDateOption {
    label: string;
    value?: Date;
}

const MIN_DATE_OPTIONS: IDateOption[] = [
    { label: "None", value: undefined },
    {
        label: "4 months ago",
        value: moment()
            .add(-4, "months")
            .toDate(),
    },
    {
        label: "1 year ago",
        value: moment()
            .add(-1, "years")
            .toDate(),
    },
];

const MAX_DATE_OPTIONS: IDateOption[] = [
    { label: "None", value: undefined },
    {
        label: "1 month ago",
        value: moment()
            .add(-1, "months")
            .toDate(),
    },
];

export class DateRangePickerExample extends React.PureComponent<IExampleProps, IDateRangePickerExampleState> {
    public state: IDateRangePickerExampleState = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        dateRange: [null, null],
        maxDateIndex: 0,
        minDateIndex: 0,
        reverseMonthAndYearMenus: false,
        shortcuts: true,
        singleMonthOnly: false,
    };

    private handleMaxDateIndexChange = handleNumberChange(maxDateIndex => this.setState({ maxDateIndex }));
    private handleMinDateIndexChange = handleNumberChange(minDateIndex => this.setState({ minDateIndex }));
    private handlePrecisionChange = handleStringChange((timePrecision: TimePrecision | undefined) =>
        this.setState({ timePrecision }),
    );

    private toggleReverseMonthAndYearMenus = handleBooleanChange(reverseMonthAndYearMenus =>
        this.setState({ reverseMonthAndYearMenus }),
    );
    private toggleSingleDay = handleBooleanChange(allowSingleDayRange => this.setState({ allowSingleDayRange }));
    private toggleSingleMonth = handleBooleanChange(singleMonthOnly => this.setState({ singleMonthOnly }));
    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));
    private toggleContiguousCalendarMonths = handleBooleanChange(contiguousCalendarMonths => {
        this.setState({ contiguousCalendarMonths });
    });

    public render() {
        const { minDateIndex, maxDateIndex, ...props } = this.state;
        const minDate = MIN_DATE_OPTIONS[minDateIndex].value;
        const maxDate = MAX_DATE_OPTIONS[maxDateIndex].value;
        return (
            <Example options={this.renderOptions()} showOptionsBelowExample={true} {...this.props}>
                <DateRangePicker
                    {...props}
                    className={Classes.ELEVATION_1}
                    maxDate={maxDate}
                    minDate={minDate}
                    onChange={this.handleDateChange}
                />
                <MomentDateRange withTime={props.timePrecision !== undefined} range={this.state.dateRange} />
            </Example>
        );
    }

    private renderOptions() {
        return (
            <>
                <div>
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
                    <Switch
                        checked={this.state.contiguousCalendarMonths}
                        label="Constrain to contiguous months"
                        onChange={this.toggleContiguousCalendarMonths}
                    />
                    <Switch checked={this.state.shortcuts} label="Show shortcuts" onChange={this.toggleShortcuts} />
                    <Switch
                        checked={this.state.reverseMonthAndYearMenus}
                        label="Reverse month and year menus"
                        onChange={this.toggleReverseMonthAndYearMenus}
                    />
                </div>
                <div>
                    {this.renderSelectMenu(
                        "Minimum date",
                        this.state.minDateIndex,
                        MIN_DATE_OPTIONS,
                        this.handleMinDateIndexChange,
                    )}
                    {this.renderSelectMenu(
                        "Maximum date",
                        this.state.maxDateIndex,
                        MAX_DATE_OPTIONS,
                        this.handleMaxDateIndexChange,
                    )}
                </div>
                <div>
                    <PrecisionSelect
                        allowNone={true}
                        label="Time precision"
                        value={this.state.timePrecision}
                        onChange={this.handlePrecisionChange}
                    />
                </div>
            </>
        );
    }

    private handleDateChange = (dateRange: DateRange) => this.setState({ dateRange });

    private renderSelectMenu(
        label: string,
        selectedValue: number | string,
        options: IDateOption[],
        onChange: React.FormEventHandler<HTMLElement>,
    ) {
        return (
            <Label>
                {label}
                <HTMLSelect value={selectedValue} onChange={onChange}>
                    {options.map((opt, i) => (
                        <option key={i} value={i} label={opt.label} />
                    ))}
                </HTMLSelect>
            </Label>
        );
    }
}
