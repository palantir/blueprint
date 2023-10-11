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

import classNames from "classnames";
import * as React from "react";

import { Classes, Code, FormGroup, H5, Icon, Switch } from "@blueprintjs/core";
import { DateInput3, TimePrecision } from "@blueprintjs/datetime2";
import { Example, ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

import { type CommonDateFnsLocale, DateFnsLocaleSelect } from "../../common/dateFnsLocaleSelect";
import { FormattedDateTag } from "../../common/formattedDateTag";
import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";
import { DATE_FNS_FORMAT_OPTIONS, DateFnsFormatSelect } from "./common/dateFnsFormatSelect";

interface DateInput3ExampleState {
    closeOnSelection: boolean;
    date: string | null;
    dateFnsFormat: string;
    disabled: boolean;
    disableTimezoneSelect: boolean;
    fill: boolean;
    localeCode: CommonDateFnsLocale;
    reverseMonthAndYearMenus: boolean;
    shortcuts: boolean;
    showActionsBar: boolean;
    showRightElement: boolean;
    showTimePickerArrows: boolean;
    showTimezoneSelect: boolean;
    timePrecision: TimePrecision | undefined;
    useAmPm: boolean;
}

export class DateInput3Example extends React.PureComponent<ExampleProps, DateInput3ExampleState> {
    public state: DateInput3ExampleState = {
        closeOnSelection: true,
        date: null,
        dateFnsFormat: DATE_FNS_FORMAT_OPTIONS[0],
        disableTimezoneSelect: false,
        disabled: false,
        fill: false,
        localeCode: DateInput3.defaultProps.locale as CommonDateFnsLocale,
        reverseMonthAndYearMenus: false,
        shortcuts: false,
        showActionsBar: false,
        showRightElement: false,
        showTimePickerArrows: false,
        showTimezoneSelect: true,
        timePrecision: TimePrecision.MINUTE,
        useAmPm: false,
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

    private toggleUseAmPm = handleBooleanChange(useAmPm => this.setState({ useAmPm }));

    private handleDateChange = (date: string | null) => this.setState({ date });

    private handleFormatChange = (dateFnsFormat: string) => this.setState({ dateFnsFormat });

    private handleLocaleCodeChange = (localeCode: CommonDateFnsLocale) => this.setState({ localeCode });

    private handleTimePrecisionChange = handleValueChange((timePrecision: TimePrecision | "none") =>
        this.setState({ timePrecision: timePrecision === "none" ? undefined : timePrecision }),
    );

    public render() {
        const { date, localeCode, showRightElement, showTimePickerArrows, useAmPm, ...spreadProps } = this.state;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <DateInput3
                    {...spreadProps}
                    locale={localeCode}
                    onChange={this.handleDateChange}
                    popoverProps={{ placement: "bottom" }}
                    rightElement={
                        showRightElement && <Icon icon="globe" intent="primary" style={{ padding: "7px 5px" }} />
                    }
                    timePickerProps={
                        this.state.timePrecision === undefined
                            ? undefined
                            : { showArrowButtons: showTimePickerArrows, useAmPm }
                    }
                    value={date}
                />
                <FormattedDateTag date={date} />
            </Example>
        );
    }

    protected renderOptions() {
        const {
            closeOnSelection,
            disabled,
            disableTimezoneSelect,
            fill,
            dateFnsFormat,
            reverseMonthAndYearMenus: reverse,
            shortcuts,
            showActionsBar,
            showRightElement,
            showTimePickerArrows,
            showTimezoneSelect,
            timePrecision,
            useAmPm,
        } = this.state;

        const isTimePickerShown = timePrecision !== undefined;

        return (
            <>
                <H5>Behavior props</H5>
                <PropCodeTooltip snippet={`closeOnSelection={${closeOnSelection.toString()}}`}>
                    <Switch label="Close on selection" checked={closeOnSelection} onChange={this.toggleSelection} />
                </PropCodeTooltip>

                <H5>Date picker props</H5>
                <PropCodeTooltip snippet={`shortcuts={${shortcuts.toString()}}`}>
                    <Switch
                        checked={shortcuts}
                        disabled={showActionsBar}
                        label="Show shortcuts"
                        onChange={this.toggleShortcuts}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`showActionsBar={${showActionsBar.toString()}}`}>
                    <Switch
                        checked={showActionsBar}
                        disabled={shortcuts}
                        label="Show actions bar"
                        onChange={this.toggleActionsBar}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`reverseMonthAndYearMenus={${reverse.toString()}}`}>
                    <Switch label="Reverse month and year menus" checked={reverse} onChange={this.toggleReverseMenus} />
                </PropCodeTooltip>
                <FormGroup inline={true} label="Locale">
                    <DateFnsLocaleSelect
                        value={this.state.localeCode}
                        onChange={this.handleLocaleCodeChange}
                        popoverProps={{ placement: "bottom-start" }}
                    />
                </FormGroup>

                <H5>Input appearance props</H5>
                <PropCodeTooltip snippet={`disabled={${disabled.toString()}}`}>
                    <Switch label="Disabled" checked={disabled} onChange={this.toggleDisabled} />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`fill={${fill.toString()}}`}>
                    <Switch label="Fill container width" checked={fill} onChange={this.toggleFill} />
                </PropCodeTooltip>
                <PropCodeTooltip
                    content={
                        <>
                            <Code>rightElement</Code> is {showRightElement ? "defined" : "undefined"}
                        </>
                    }
                >
                    <Switch label="Show right element" checked={showRightElement} onChange={this.toggleRightElement} />
                </PropCodeTooltip>
                <DateFnsFormatSelect value={dateFnsFormat} onChange={this.handleFormatChange} />

                <H5>Time picker props</H5>
                <PrecisionSelect
                    allowNone={true}
                    label="Time precision"
                    onChange={this.handleTimePrecisionChange}
                    value={timePrecision}
                />
                <PropCodeTooltip
                    snippet={`timePickerProps={{ showArrowButtons: ${showTimePickerArrows.toString()} }}`}
                    disabled={!isTimePickerShown}
                >
                    <Switch
                        label="Show time picker arrows"
                        checked={showTimePickerArrows}
                        disabled={!isTimePickerShown}
                        onChange={this.toggleTimePickerArrows}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip
                    snippet={`timePickerProps={{ useAmPm: ${useAmPm.toString()} }}`}
                    disabled={!isTimePickerShown}
                >
                    <Switch
                        label="Use AM/PM time"
                        checked={useAmPm}
                        disabled={!isTimePickerShown}
                        onChange={this.toggleUseAmPm}
                    />
                </PropCodeTooltip>

                <H5 className={classNames({ [Classes.TEXT_DISABLED]: timePrecision === undefined })}>
                    Timezone select props
                </H5>
                <PropCodeTooltip
                    snippet={`showTimezoneSelect={${showTimezoneSelect.toString()}}`}
                    disabled={!isTimePickerShown}
                >
                    <Switch
                        label={`Show timezone${disableTimezoneSelect ? "" : " select"}`}
                        checked={showTimezoneSelect}
                        disabled={!isTimePickerShown}
                        onChange={this.toggleShowTimezoneSelect}
                    />
                </PropCodeTooltip>
                <PropCodeTooltip
                    snippet={`disableTimezoneSelect={${disableTimezoneSelect.toString()}}`}
                    disabled={!isTimePickerShown || !showTimezoneSelect}
                >
                    <Switch
                        label="Disable timezone select"
                        checked={disableTimezoneSelect}
                        disabled={!isTimePickerShown || !showTimezoneSelect}
                        onChange={this.toggleDisableTimezoneSelect}
                    />
                </PropCodeTooltip>
            </>
        );
    }
}
