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

import { Callout, Code, H5, Switch } from "@blueprintjs/core";
import { DateFormatProps, DateRange, TimePrecision } from "@blueprintjs/datetime";
import { DateRangeInput3 } from "@blueprintjs/datetime2";
import { Example, ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

import { FormattedDateRange } from "../../common/formattedDateRange";
import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { DATE_FNS_FORMATS, DateFnsFormatSelector } from "../datetime-examples/common/dateFnsFormatSelector";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";

const exampleFooterElement = (
    <Callout style={{ maxWidth: 460 }}>
        A custom footer element may be displayed below the date range picker calendars using the{" "}
        <Code>footerElement</Code> prop.
    </Callout>
);

interface DateRangeInput3ExampleState {
    allowSingleDayRange: boolean;
    closeOnSelection: boolean;
    contiguousCalendarMonths: boolean;
    disabled: boolean;
    enableTimePicker: boolean;
    fill: boolean;
    format: DateFormatProps;
    range: DateRange;
    reverseMonthAndYearMenus: boolean;
    selectAllOnFocus: boolean;
    shortcuts: boolean;
    showFooterElement: boolean;
    showTimeArrowButtons: boolean;
    singleMonthOnly: boolean;
    timePrecision: TimePrecision | undefined;
}

export class DateRangeInput3Example extends React.PureComponent<ExampleProps, DateRangeInput3ExampleState> {
    public state: DateRangeInput3ExampleState = {
        allowSingleDayRange: false,
        closeOnSelection: false,
        contiguousCalendarMonths: true,
        disabled: false,
        enableTimePicker: false,
        fill: false,
        format: DATE_FNS_FORMATS[0],
        range: [null, null],
        reverseMonthAndYearMenus: false,
        selectAllOnFocus: false,
        shortcuts: true,
        showFooterElement: false,
        showTimeArrowButtons: false,
        singleMonthOnly: false,
        timePrecision: TimePrecision.MINUTE,
    };

    private toggleContiguous = handleBooleanChange(contiguous => {
        this.setState({ contiguousCalendarMonths: contiguous });
    });

    private toggleDisabled = handleBooleanChange(disabled => this.setState({ disabled }));

    private toggleFill = handleBooleanChange(fill => this.setState({ fill }));

    private toggleReverseMonthAndYearMenus = handleBooleanChange(reverseMonthAndYearMenus =>
        this.setState({ reverseMonthAndYearMenus }),
    );

    private toggleSelection = handleBooleanChange(closeOnSelection => this.setState({ closeOnSelection }));

    private toggleSelectAllOnFocus = handleBooleanChange(selectAllOnFocus => this.setState({ selectAllOnFocus }));

    private toggleShowFooterElement = handleBooleanChange(showFooterElement => this.setState({ showFooterElement }));

    private toggleSingleDay = handleBooleanChange(allowSingleDayRange => this.setState({ allowSingleDayRange }));

    private toggleSingleMonth = handleBooleanChange(singleMonthOnly => this.setState({ singleMonthOnly }));

    private toggleShortcuts = handleBooleanChange(shortcuts => this.setState({ shortcuts }));

    private toggleTimePicker = handleBooleanChange(enableTimePicker => this.setState({ enableTimePicker }));

    private toggleTimepickerArrowButtons = handleBooleanChange(showTimeArrowButtons =>
        this.setState({ showTimeArrowButtons }),
    );

    private handleTimePrecisionChange = handleValueChange((timePrecision: TimePrecision | "none") =>
        this.setState({ timePrecision: timePrecision === "none" ? undefined : timePrecision }),
    );

    public render() {
        const {
            enableTimePicker,
            format,
            range,
            showFooterElement,
            showTimeArrowButtons,
            timePrecision,
            ...spreadProps
        } = this.state;
        return (
            <Example options={this.renderOptions()} showOptionsBelowExample={true} {...this.props}>
                <DateRangeInput3
                    {...spreadProps}
                    {...format}
                    value={range}
                    onChange={this.handleRangeChange}
                    footerElement={showFooterElement ? exampleFooterElement : undefined}
                    timePickerProps={
                        enableTimePicker
                            ? { precision: timePrecision, showArrowButtons: showTimeArrowButtons }
                            : undefined
                    }
                />
                <FormattedDateRange range={range} showTime={enableTimePicker} />
            </Example>
        );
    }

    protected renderOptions() {
        const {
            allowSingleDayRange,
            closeOnSelection,
            contiguousCalendarMonths,
            enableTimePicker,
            disabled,
            fill,
            reverseMonthAndYearMenus,
            selectAllOnFocus,
            shortcuts,
            showFooterElement,
            showTimeArrowButtons,
            singleMonthOnly,
            timePrecision,
        } = this.state;
        return (
            <>
                <div>
                    <H5>Behavior props</H5>
                    <PropCodeTooltip snippet={`closeOnSelection={${closeOnSelection.toString()}}`}>
                        <Switch checked={closeOnSelection} label="Close on selection" onChange={this.toggleSelection} />
                    </PropCodeTooltip>
                    <PropCodeTooltip snippet={`selectAllOnFocus={${selectAllOnFocus.toString()}}`}>
                        <Switch
                            checked={selectAllOnFocus}
                            label="Select all text on input focus"
                            onChange={this.toggleSelectAllOnFocus}
                        />
                    </PropCodeTooltip>
                    <br />

                    <H5>Date range picker props</H5>
                    <PropCodeTooltip snippet={`shortcuts={${shortcuts.toString()}}`}>
                        <Switch checked={shortcuts} label="Show shortcuts" onChange={this.toggleShortcuts} />
                    </PropCodeTooltip>
                    <PropCodeTooltip snippet={`allowSingleDayRange={${allowSingleDayRange.toString()}}`}>
                        <Switch
                            checked={allowSingleDayRange}
                            label="Allow single day range"
                            onChange={this.toggleSingleDay}
                        />
                    </PropCodeTooltip>
                    <PropCodeTooltip snippet={`singleMonthOnly={${singleMonthOnly.toString()}}`}>
                        <Switch checked={singleMonthOnly} label="Single month only" onChange={this.toggleSingleMonth} />
                    </PropCodeTooltip>
                    <PropCodeTooltip snippet={`contiguousCalendarMonths={${contiguousCalendarMonths.toString()}}`}>
                        <Switch
                            checked={contiguousCalendarMonths}
                            label="Constrain calendar to contiguous months"
                            onChange={this.toggleContiguous}
                        />
                    </PropCodeTooltip>
                    <Switch
                        checked={reverseMonthAndYearMenus}
                        label="Reverse month and year menus"
                        onChange={this.toggleReverseMonthAndYearMenus}
                    />
                    <Switch
                        checked={showFooterElement}
                        label="Show custom footer element"
                        onChange={this.toggleShowFooterElement}
                    />
                </div>

                <div>
                    <H5>Input appearance props</H5>
                    <PropCodeTooltip snippet={`disabled={${disabled.toString()}}`}>
                        <Switch checked={disabled} label="Disabled" onChange={this.toggleDisabled} />
                    </PropCodeTooltip>
                    <PropCodeTooltip snippet={`fill={${fill.toString()}}`}>
                        <Switch label="Fill container width" checked={fill} onChange={this.toggleFill} />
                    </PropCodeTooltip>
                    <DateFnsFormatSelector format={this.state.format} onChange={this.handleFormatChange} />
                    <br />

                    <H5>Time picker props</H5>
                    <Switch checked={enableTimePicker} label="Enable time picker" onChange={this.toggleTimePicker} />
                    <PrecisionSelect
                        allowNone={false}
                        disabled={!enableTimePicker}
                        label="Time precision"
                        onChange={this.handleTimePrecisionChange}
                        value={timePrecision}
                    />
                    <PropCodeTooltip
                        snippet={`timePickerProps={{ showArrowButtons: ${showTimeArrowButtons.toString()} }}`}
                        disabled={!enableTimePicker}
                    >
                        <Switch
                            disabled={!enableTimePicker}
                            checked={showTimeArrowButtons}
                            label="Show timepicker arrow buttons"
                            onChange={this.toggleTimepickerArrowButtons}
                        />
                    </PropCodeTooltip>
                </div>
            </>
        );
    }

    private handleFormatChange = (format: DateFormatProps) => this.setState({ format });

    private handleRangeChange = (range: DateRange) => this.setState({ range });
}
