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

import { add } from "date-fns";
import * as React from "react";

import { Classes, FormGroup, H5, HTMLSelect, Label, Switch } from "@blueprintjs/core";
import { DateRange, TimePrecision } from "@blueprintjs/datetime";
import { DateRangePicker3 } from "@blueprintjs/datetime2";
import {
    Example,
    ExampleProps,
    handleBooleanChange,
    handleNumberChange,
    handleValueChange,
} from "@blueprintjs/docs-theme";

import { CommonDateFnsLocale, DateFnsLocaleSelect } from "../../common/dateFnsLocaleSelect";
import { DateRangeTag } from "../../common/dateRangeTag";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";

interface DateRangePicker3ExampleState {
    allowSingleDayRange?: boolean;
    singleMonthOnly?: boolean;
    contiguousCalendarMonths?: boolean;
    dateRange?: DateRange;
    localeCode: CommonDateFnsLocale;
    maxDateIndex?: number;
    minDateIndex?: number;
    reverseMonthAndYearMenus?: boolean;
    shortcuts?: boolean;
    timePrecision?: TimePrecision;
}

interface DateOption {
    label: string;
    value?: Date;
}

const today = new Date();

const MIN_DATE_OPTIONS: DateOption[] = [
    { label: "None", value: undefined },
    {
        label: "1 week ago",
        value: add(today, { weeks: -1 }),
    },
    {
        label: "4 months ago",
        value: add(today, { months: -4 }),
    },
    {
        label: "1 year ago",
        value: add(today, { years: -1 }),
    },
];

const MAX_DATE_OPTIONS: DateOption[] = [
    { label: "None", value: undefined },
    {
        label: "Today",
        value: today,
    },
    {
        label: "1 week from now",
        value: add(today, { weeks: 1 }),
    },
    {
        label: "4 months from now",
        value: add(today, { months: 4 }),
    },
    {
        label: "1 year from now",
        value: add(today, { years: 1 }),
    },
];

export class DateRangePicker3Example extends React.PureComponent<ExampleProps, DateRangePicker3ExampleState> {
    public state: DateRangePicker3ExampleState = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        dateRange: [null, null],
        localeCode: DateRangePicker3.defaultProps.locale as CommonDateFnsLocale,
        maxDateIndex: 0,
        minDateIndex: 0,
        reverseMonthAndYearMenus: false,
        shortcuts: true,
        singleMonthOnly: false,
    };

    private handleDateRangeChange = (dateRange: DateRange) => this.setState({ dateRange });

    private handleLocaleCodeChange = (localeCode: CommonDateFnsLocale) => this.setState({ localeCode });

    private handleMaxDateIndexChange = handleNumberChange(maxDateIndex => this.setState({ maxDateIndex }));

    private handleMinDateIndexChange = handleNumberChange(minDateIndex => this.setState({ minDateIndex }));

    private handlePrecisionChange = handleValueChange((timePrecision: TimePrecision | undefined) =>
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
        const { dateRange, localeCode, minDateIndex, maxDateIndex, ...props } = this.state;
        const minDate = MIN_DATE_OPTIONS[minDateIndex].value;
        const maxDate = MAX_DATE_OPTIONS[maxDateIndex].value;
        return (
            <Example options={this.renderOptions()} showOptionsBelowExample={true} {...this.props}>
                <DateRangePicker3
                    {...props}
                    className={Classes.ELEVATION_1}
                    locale={localeCode}
                    maxDate={maxDate}
                    minDate={minDate}
                    onChange={this.handleDateRangeChange}
                />
                <DateRangeTag range={dateRange} showTime={props.timePrecision !== undefined} />
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
                        disabled={this.state.singleMonthOnly}
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
                    <FormGroup label="Locale">
                        <DateFnsLocaleSelect value={this.state.localeCode} onChange={this.handleLocaleCodeChange} />
                    </FormGroup>
                </div>
            </>
        );
    }

    private renderSelectMenu(
        label: string,
        selectedValue: number | string,
        options: DateOption[],
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
