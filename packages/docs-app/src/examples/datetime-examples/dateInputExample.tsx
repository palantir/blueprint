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

import * as React from "react";

import { H5, Position, Switch } from "@blueprintjs/core";
import { DateFormatProps, DateInput, TimePrecision } from "@blueprintjs/datetime";
import { Example, handleBooleanChange, handleValueChange, IExampleProps } from "@blueprintjs/docs-theme";

import { MomentDate } from "./common/momentDate";
import { MOMENT_FORMATS, MomentFormatSelector } from "./common/momentFormats";
import { PrecisionSelect } from "./common/precisionSelect";

export interface IDateInputExampleState {
    closeOnSelection: boolean;
    date: Date | null;
    disabled: boolean;
    fill: boolean;
    format: DateFormatProps;
    reverseMonthAndYearMenus: boolean;
    shortcuts: boolean;
    timePrecision: TimePrecision | undefined;
    showTimeArrowButtons: boolean;
}

export class DateInputExample extends React.PureComponent<IExampleProps, IDateInputExampleState> {
    public state: IDateInputExampleState = {
        closeOnSelection: true,
        date: null,
        disabled: false,
        fill: false,
        format: MOMENT_FORMATS[0],
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showTimeArrowButtons: false,
        timePrecision: undefined,
    };

    private toggleSelection = handleBooleanChange(closeOnSelection => this.setState({ closeOnSelection }));

    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleFill = handleBooleanChange(fill => this.setState({ fill }));

    private toggleReverseMenus = handleBooleanChange(reverseMonthAndYearMenus =>
        this.setState({ reverseMonthAndYearMenus }),
    );

    private toggleTimePrecision = handleValueChange((timePrecision: TimePrecision | "none") =>
        this.setState({ timePrecision: timePrecision === "none" ? undefined : timePrecision }),
    );

    private toggleTimepickerArrowButtons = handleBooleanChange(showTimeArrowButtons =>
        this.setState({ showTimeArrowButtons }),
    );

    public render() {
        const { date, format, showTimeArrowButtons, timePrecision, ...spreadProps } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                {/* eslint-disable-next-line deprecation/deprecation */}
                <DateInput
                    {...spreadProps}
                    {...format}
                    defaultValue={new Date()}
                    onChange={this.handleDateChange}
                    popoverProps={{ position: Position.BOTTOM }}
                    timePickerProps={
                        timePrecision === undefined
                            ? undefined
                            : { showArrowButtons: showTimeArrowButtons, precision: timePrecision }
                    }
                />
                <MomentDate date={date} />
            </Example>
        );
    }

    protected renderOptions() {
        const {
            closeOnSelection,
            disabled,
            fill,
            reverseMonthAndYearMenus,
            format,
            timePrecision,
            shortcuts,
            showTimeArrowButtons,
        } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch label="Close on selection" checked={closeOnSelection} onChange={this.toggleSelection} />
                <Switch checked={shortcuts} label="Show shortcuts" onChange={this.toggleShortcuts} />
                <Switch label="Disabled" checked={disabled} onChange={this.toggleDisabled} />
                <Switch label="Fill" checked={fill} onChange={this.toggleFill} />
                <Switch
                    label="Reverse month and year menus"
                    checked={reverseMonthAndYearMenus}
                    onChange={this.toggleReverseMenus}
                />
                <MomentFormatSelector format={format} onChange={this.handleFormatChange} />
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    onChange={this.toggleTimePrecision}
                    value={timePrecision}
                />
                <Switch
                    disabled={this.state.timePrecision === undefined}
                    checked={showTimeArrowButtons}
                    label="Show timepicker arrow buttons"
                    onChange={this.toggleTimepickerArrowButtons}
                />
            </>
        );
    }

    private handleDateChange = (date: Date | null) => this.setState({ date });

    private handleFormatChange = (format: DateFormatProps) => this.setState({ format });
}
