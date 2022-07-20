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

import classNames from "classnames";
import * as React from "react";

import { Classes, Code, H5, Icon, Switch, Tag } from "@blueprintjs/core";
import { DateFormatProps, TimePrecision } from "@blueprintjs/datetime";
import { DateInput2 } from "@blueprintjs/datetime2";
import { Example, handleBooleanChange, handleValueChange, IExampleProps } from "@blueprintjs/docs-theme";
import { Tooltip2 } from "@blueprintjs/popover2";

import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";
import { DATE_FNS_FORMATS, DateFnsFormatSelector } from "./dateFnsFormatSelector";

export interface DateInput2ExampleState {
    closeOnSelection: boolean;
    date: string | null;
    disabled: boolean;
    disableTimezoneSelect: boolean;
    fill: boolean;
    format: DateFormatProps;
    reverseMonthAndYearMenus: boolean;
    shortcuts: boolean;
    showActionsBar: boolean;
    showRightElement: boolean;
    showTimePickerArrows: boolean;
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
        format: DATE_FNS_FORMATS[0],
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showActionsBar: false,
        showRightElement: false,
        showTimePickerArrows: false,
        showTimezoneSelect: true,
        timePrecision: TimePrecision.MINUTE,
    };

    private toggleActionsBar = handleBooleanChange(showActionsBar => this.setState({ showActionsBar }));

    private toggleSelection = handleBooleanChange(closeOnSelection => this.setState({ closeOnSelection }));

    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleShowTimezoneSelect = handleBooleanChange(showTimezoneSelect => this.setState({ showTimezoneSelect }));

    private toggleDisableTimezoneSelect = handleBooleanChange(disableTimezoneSelect =>
        this.setState({ disableTimezoneSelect }),
    );

    private toggleFill = handleBooleanChange(fill => this.setState({ fill }));

    private toggleReverseMenus = handleBooleanChange(reverse => this.setState({ reverseMonthAndYearMenus: reverse }));

    private toggleRightElement = handleBooleanChange(showRightElement => this.setState({ showRightElement }));

    private toggleTimePickerArrows = handleBooleanChange(showTimePickerArrows =>
        this.setState({ showTimePickerArrows }),
    );

    private handleTimePrecisionChange = handleValueChange((timePrecision: TimePrecision | "none") =>
        this.setState({ timePrecision: timePrecision === "none" ? undefined : timePrecision }),
    );

    public render() {
        const { date, format, showRightElement, showTimePickerArrows, ...spreadProps } = this.state;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <DateInput2
                    {...spreadProps}
                    {...format}
                    onChange={this.handleDateChange}
                    popoverProps={{ placement: "bottom" }}
                    rightElement={
                        showRightElement && (
                            <Icon icon="globe" intent="primary" style={{ padding: 7, marginLeft: -5 }} />
                        )
                    }
                    timePickerProps={
                        this.state.timePrecision === undefined ? undefined : { showArrowButtons: showTimePickerArrows }
                    }
                    value={date}
                />
                {date == null ? <Tag minimal={true}>no date</Tag> : <Tag intent="primary">{date}</Tag>}
            </Example>
        );
    }

    protected renderOptions() {
        const {
            closeOnSelection,
            disabled,
            disableTimezoneSelect,
            fill,
            format,
            reverseMonthAndYearMenus: reverse,
            shortcuts,
            showActionsBar,
            showRightElement,
            showTimePickerArrows,
            showTimezoneSelect,
            timePrecision,
        } = this.state;

        return (
            <>
                <H5>Props</H5>
                <Tooltip2
                    content={<Code>closeOnSelection=&#123;{closeOnSelection.toString()}&#125;</Code>}
                    placement="left"
                >
                    <Switch label="Close on selection" checked={closeOnSelection} onChange={this.toggleSelection} />
                </Tooltip2>
                <Tooltip2 content={<Code>shortcuts=&#123;{shortcuts.toString()}&#125;</Code>} placement="left">
                    <Switch
                        checked={shortcuts}
                        disabled={showActionsBar}
                        label="Show shortcuts"
                        onChange={this.toggleShortcuts}
                    />
                </Tooltip2>
                <Tooltip2
                    content={<Code>showActionsBar=&#123;{showActionsBar.toString()}&#125;</Code>}
                    placement="left"
                >
                    <Switch
                        checked={showActionsBar}
                        disabled={shortcuts}
                        label="Show actions bar"
                        onChange={this.toggleActionsBar}
                    />
                </Tooltip2>
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    onChange={this.handleTimePrecisionChange}
                    value={timePrecision}
                />

                <H5>Appearance props</H5>
                <Switch label="Disabled" checked={disabled} onChange={this.toggleDisabled} />
                <Switch label="Fill" checked={fill} onChange={this.toggleFill} />
                <Tooltip2
                    content={<Code>reverseMonthAndYearMenus=&#123;{reverse.toString()}&#125;</Code>}
                    placement="left"
                >
                    <Switch label="Reverse month and year menus" checked={reverse} onChange={this.toggleReverseMenus} />
                </Tooltip2>
                <Tooltip2
                    content={
                        <Code>
                            timePickerProps=&#123;&#123; showArrowButtons: {showTimePickerArrows.toString()}{" "}
                            &#125;&#125;
                        </Code>
                    }
                    disabled={timePrecision === undefined}
                    placement="left"
                >
                    <Switch
                        label="Show time picker arrows"
                        checked={showTimePickerArrows}
                        disabled={timePrecision === undefined}
                        onChange={this.toggleTimePickerArrows}
                    />
                </Tooltip2>
                <Switch label="Show right element" checked={showRightElement} onChange={this.toggleRightElement} />
                <DateFnsFormatSelector format={format} onChange={this.handleFormatChange} />

                <H5 className={classNames({ [Classes.TEXT_DISABLED]: timePrecision === undefined })}>
                    TimezoneSelect props
                </H5>
                <Tooltip2
                    content={<Code>disableTimezoneSelect=&#123;{disableTimezoneSelect.toString()}&#125;</Code>}
                    disabled={timePrecision === undefined}
                    placement="left"
                >
                    <Switch
                        label="Disable timezone select"
                        checked={disableTimezoneSelect}
                        disabled={timePrecision === undefined}
                        onChange={this.toggleDisableTimezoneSelect}
                    />
                </Tooltip2>
                <Tooltip2
                    content={<Code>showTimezoneSelect=&#123;{showTimezoneSelect.toString()}&#125;</Code>}
                    disabled={timePrecision === undefined}
                    placement="left"
                >
                    <Switch
                        label="Show timezone select"
                        checked={showTimezoneSelect}
                        disabled={timePrecision === undefined}
                        onChange={this.toggleShowTimezoneSelect}
                    />
                </Tooltip2>
            </>
        );
    }

    private handleDateChange = (date: string | null) => {
        this.setState({ date });
    };

    private handleFormatChange = (format: DateFormatProps) => {
        this.setState({ format });
    };
}
