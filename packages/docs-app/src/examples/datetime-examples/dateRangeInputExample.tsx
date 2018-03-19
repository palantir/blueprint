/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, IPopoverProps, Switch } from "@blueprintjs/core";
import { DateRange, DateRangeInput, IDateFormatProps } from "@blueprintjs/datetime";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";
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

    isPopoverOpen: boolean;
}

export class DateRangeInputExample extends BaseExample<IDateRangeInputExampleState> {
    public state: IDateRangeInputExampleState = {
        allowSingleDayRange: false,
        closeOnSelection: false,
        contiguousCalendarMonths: true,
        disabled: false,
        format: FORMATS[0],
        isPopoverOpen: false,
        range: [null, null],
        reverseMonthAndYearMenus: false,
        selectAllOnFocus: false,
    };

    private popoverProps: Partial<IPopoverProps> = {
        popoverWillClose: () => this.setState({ isPopoverOpen: false }),
        popoverWillOpen: () => this.setState({ isPopoverOpen: true }),
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

    protected renderExample() {
        const { format, range, ...spreadProps } = this.state;
        return (
            <div>
                <DateRangeInput
                    {...spreadProps}
                    {...format}
                    onChange={this.handleRangeChange}
                    popoverProps={this.popoverProps}
                />
                <MomentDateRange className={this.state.isPopoverOpen ? Classes.INLINE : ""} range={range} />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <label className={Classes.LABEL} key="modifierslabel">
                    Modifiers
                </label>,
                <Switch
                    checked={this.state.allowSingleDayRange}
                    label="Allow single day range"
                    key="Allow single day range"
                    onChange={this.toggleSingleDay}
                />,
                <Switch
                    checked={this.state.closeOnSelection}
                    label="Close on selection"
                    key="Selection"
                    onChange={this.toggleSelection}
                />,
                <Switch
                    checked={this.state.contiguousCalendarMonths}
                    label="Constrain calendar to contiguous months"
                    key="Constraint calendar to contiguous months"
                    onChange={this.toggleContiguous}
                />,
                <Switch checked={this.state.disabled} label="Disabled" key="Disabled" onChange={this.toggleDisabled} />,
                <Switch
                    checked={this.state.selectAllOnFocus}
                    label="Select all on focus"
                    key="Select all on focus"
                    onChange={this.toggleSelectAllOnFocus}
                />,
                <Switch
                    checked={this.state.reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    key="Reverse month and year menus"
                    onChange={this.toggleReverseMonthAndYearMenus}
                />,
            ],
            [<FormatSelect key="Format" format={this.state.format} onChange={this.handleFormatChange} />],
        ];
    }

    private handleFormatChange = (format: IDateFormatProps) => this.setState({ format });
    private handleRangeChange = (range: DateRange) => this.setState({ range });
}
