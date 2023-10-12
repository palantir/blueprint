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

import { Classes, FormGroup, Switch } from "@blueprintjs/core";
import type { DateRange, TimePrecision } from "@blueprintjs/datetime";
import { DateRangePicker3 } from "@blueprintjs/datetime2";
import { Example, ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

import { CommonDateFnsLocale, DateFnsLocaleSelect } from "../../common/dateFnsLocaleSelect";
import { FormattedDateRange } from "../../common/formattedDateRange";
import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";
import { MaxDateSelect, MinDateSelect } from "./common/minMaxDateSelect";

interface DateRangePicker3ExampleState {
    allowSingleDayRange?: boolean;
    singleMonthOnly?: boolean;
    contiguousCalendarMonths?: boolean;
    dateRange?: DateRange;
    localeCode: CommonDateFnsLocale;
    maxDate: Date | undefined;
    minDate: Date | undefined;
    reverseMonthAndYearMenus?: boolean;
    shortcuts?: boolean;
    showTimeArrowButtons: boolean;
    timePrecision?: TimePrecision;
    useAmPm?: boolean;
}

export class DateRangePicker3Example extends React.PureComponent<ExampleProps, DateRangePicker3ExampleState> {
    public state: DateRangePicker3ExampleState = {
        allowSingleDayRange: false,
        contiguousCalendarMonths: true,
        dateRange: [null, null],
        localeCode: DateRangePicker3.defaultProps.locale as CommonDateFnsLocale,
        maxDate: undefined,
        minDate: undefined,
        reverseMonthAndYearMenus: false,
        shortcuts: true,
        showTimeArrowButtons: false,
        singleMonthOnly: false,
        useAmPm: false,
    };

    private handleDateRangeChange = (dateRange: DateRange) => this.setState({ dateRange });

    private handleLocaleCodeChange = (localeCode: CommonDateFnsLocale) => this.setState({ localeCode });

    private handleMaxDateChange = (maxDate: Date) => this.setState({ maxDate });

    private handleMinDateChange = (minDate: Date) => this.setState({ minDate });

    private handlePrecisionChange = handleValueChange((timePrecision: TimePrecision | undefined) =>
        this.setState({ timePrecision }),
    );

    private toggleTimepickerArrowButtons = handleBooleanChange(showTimeArrowButtons =>
        this.setState({ showTimeArrowButtons }),
    );

    private toggleUseAmPm = handleBooleanChange(useAmPm => this.setState({ useAmPm }));

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
        const { dateRange, localeCode, maxDate, minDate, showTimeArrowButtons, timePrecision, useAmPm, ...props } =
            this.state;
        const showTimePicker = timePrecision !== undefined;

        return (
            <Example options={this.renderOptions()} showOptionsBelowExample={true} {...this.props}>
                <DateRangePicker3
                    {...props}
                    className={Classes.ELEVATION_1}
                    locale={localeCode}
                    maxDate={maxDate}
                    minDate={minDate}
                    onChange={this.handleDateRangeChange}
                    timePickerProps={
                        showTimePicker
                            ? {
                                  precision: timePrecision,
                                  showArrowButtons: showTimeArrowButtons,
                                  useAmPm,
                              }
                            : undefined
                    }
                />
                <FormattedDateRange range={dateRange} showTime={showTimePicker} />
            </Example>
        );
    }

    private renderOptions() {
        const showTimePicker = this.state.timePrecision !== undefined;
        return (
            <>
                <div>
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
                    <MinDateSelect onChange={this.handleMinDateChange} />
                    <MaxDateSelect onChange={this.handleMaxDateChange} />
                    <FormGroup label="Locale">
                        <DateFnsLocaleSelect
                            value={this.state.localeCode}
                            onChange={this.handleLocaleCodeChange}
                            popoverProps={{ matchTargetWidth: true }}
                        />
                    </FormGroup>
                </div>
                <div>
                    <PrecisionSelect
                        allowNone={true}
                        label="Time precision"
                        value={this.state.timePrecision}
                        onChange={this.handlePrecisionChange}
                    />
                    <PropCodeTooltip
                        snippet={`timePickerProps={{ showArrowButtons: ${this.state.showTimeArrowButtons.toString()} }}`}
                        disabled={!showTimePicker}
                    >
                        <Switch
                            disabled={!showTimePicker}
                            checked={this.state.showTimeArrowButtons}
                            label="Time picker arrows"
                            onChange={this.toggleTimepickerArrowButtons}
                        />
                    </PropCodeTooltip>
                    <PropCodeTooltip
                        snippet={`timePickerProps={{ useAmPm: ${this.state.useAmPm.toString()} }}`}
                        disabled={!showTimePicker}
                    >
                        <Switch
                            disabled={!showTimePicker}
                            checked={this.state.useAmPm}
                            label="Use AM/PM"
                            onChange={this.toggleUseAmPm}
                        />
                    </PropCodeTooltip>
                </div>
            </>
        );
    }
}
