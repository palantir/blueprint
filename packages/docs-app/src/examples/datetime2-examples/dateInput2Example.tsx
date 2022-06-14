/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
import { DateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { DateInput2 } from "@blueprintjs/datetime2";
import { Example, handleBooleanChange, handleValueChange, IExampleProps } from "@blueprintjs/docs-theme";

import { FORMATS, FormatSelect } from "../datetime-examples/common/formatSelect";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";

export interface DateInput2ExampleState {
    closeOnSelection: boolean;
    date: string | null;
    disabled: boolean;
    disableTimezoneSelect: boolean;
    fill: boolean;
    format: DateFormatProps;
    reverseMonthAndYearMenus: boolean;
    shortcuts: boolean;
    showTimezoneSelect: boolean;
    timePrecision: TimePrecision | undefined;
}

export class DateInput2Example extends React.PureComponent<IExampleProps, DateInput2ExampleState> {
    public state: DateInput2ExampleState = {
        closeOnSelection: true,
        date: null,
        disableTimezoneSelect: false,
        disabled: false,
        fill: false,
        format: FORMATS[0],
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showTimezoneSelect: true,
        timePrecision: TimePrecision.MINUTE,
    };

    private toggleSelection = handleBooleanChange(closeOnSelection => this.setState({ closeOnSelection }));

    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleShowTimezoneSelect = handleBooleanChange(showTimezoneSelect => this.setState({ showTimezoneSelect }));

    private toggleDisableTimezoneSelect = handleBooleanChange(disableTimezoneSelect =>
        this.setState({ disableTimezoneSelect }),
    );

    private toggleFill = handleBooleanChange(fill => this.setState({ fill }));

    private toggleReverseMenus = handleBooleanChange(reverse => this.setState({ reverseMonthAndYearMenus: reverse }));

    private handleTimePrecisionChange = handleValueChange((timePrecision: TimePrecision | "none") =>
        this.setState({ timePrecision: timePrecision === "none" ? undefined : timePrecision }),
    );

    public render() {
        const { date, format, timePrecision, ...spreadProps } = this.state;
        return (
            <Example options={this.renderOptions()} {...this.props}>
                <DateInput2
                    {...spreadProps}
                    {...format}
                    onChange={this.handleDateChange}
                    popoverProps={{ position: Position.BOTTOM }}
                    timePrecision={timePrecision}
                    value={date}
                />
                {date}
            </Example>
        );
    }

    protected renderOptions() {
        const {
            closeOnSelection,
            disabled,
            fill,
            reverseMonthAndYearMenus: reverse,
            format,
            timePrecision,
            shortcuts,
            disableTimezoneSelect,
            showTimezoneSelect,
        } = this.state;
        return (
            <>
                <H5>Props</H5>
                <Switch label="Close on selection" checked={closeOnSelection} onChange={this.toggleSelection} />
                <Switch checked={shortcuts} label="Show shortcuts" onChange={this.toggleShortcuts} />
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    onChange={this.handleTimePrecisionChange}
                    value={timePrecision}
                />

                <H5>Appearance props</H5>
                <Switch label="Disabled" checked={disabled} onChange={this.toggleDisabled} />
                <Switch label="Fill" checked={fill} onChange={this.toggleFill} />
                <Switch label="Reverse month and year menus" checked={reverse} onChange={this.toggleReverseMenus} />
                <FormatSelect format={format} onChange={this.handleFormatChange} />

                <H5>Timezone props</H5>
                <Switch
                    label="Disable timezone select"
                    checked={disableTimezoneSelect}
                    onChange={this.toggleDisableTimezoneSelect}
                />
                <Switch
                    label="Show timezone select"
                    checked={showTimezoneSelect}
                    onChange={this.toggleShowTimezoneSelect}
                />
            </>
        );
    }

    private handleDateChange = (date: string) => this.setState({ date });

    private handleFormatChange = (format: DateFormatProps) => this.setState({ format });
}
