/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
import { useState } from "react";

import { Classes, Code, FormGroup, H5, Icon, Switch } from "@blueprintjs/core";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";
import { Example, type ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

import { type CommonDateFnsLocale, DateFnsLocaleSelect } from "../../common/dateFnsLocaleSelect";
import { FormattedDateTag } from "../../common/formattedDateTag";
import { PropCodeTooltip } from "../../common/propCodeTooltip";
import { PrecisionSelect } from "../datetime-examples/common/precisionSelect";

import { DATE_FNS_FORMAT_OPTIONS, DateFnsFormatSelect } from "./common/dateFnsFormatSelect";

export const DateInputExample: React.FC<ExampleProps> = props => {
    const [closeOnSelection, setCloseOnSelection] = useState(true);
    const [dateFnsFormat, setDateFnsFormat] = useState(DATE_FNS_FORMAT_OPTIONS[0]);
    const [disableTimezoneSelect, setDisableTimezoneSelect] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [fill, setFill] = useState(false);
    const [localeCode, setLocaleCode] = useState<CommonDateFnsLocale>("en-US");
    const [reverseMonthAndYearMenus, setReverseMonthAndYearMenus] = useState(false);
    const [shortcuts, setShortcuts] = useState(false);
    const [showActionsBar, setShowActionsBar] = useState(false);
    const [showRightElement, setShowRightElement] = useState(false);
    const [showArrowButtons, setShowArrowButtons] = useState(false);
    const [showTimezoneSelect, setShowTimezoneSelect] = useState(true);
    const [timePrecision, setTimePrecision] = useState<TimePrecision | undefined>(TimePrecision.MINUTE);
    const [useAmPm, setUseAmPm] = useState(false);
    const [value, setValue] = useState<string>(null);

    const showTimePicker = timePrecision !== undefined;

    const handleTimePrecisionChange = handleValueChange((precision: TimePrecision | "none") =>
        setTimePrecision(precision === "none" ? undefined : precision),
    );

    const options = (
        <>
            <H5>Behavior props</H5>
            <PropCodeTooltip snippet={`closeOnSelection={${closeOnSelection}}`}>
                <Switch
                    checked={closeOnSelection}
                    label="Close on selection"
                    onChange={handleBooleanChange(setCloseOnSelection)}
                />
            </PropCodeTooltip>

            <H5>Date picker props</H5>
            <PropCodeTooltip snippet={`shortcuts={${shortcuts}}`}>
                <Switch
                    checked={shortcuts}
                    disabled={showActionsBar}
                    label="Show shortcuts"
                    onChange={handleBooleanChange(setShortcuts)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`showActionsBar={${showActionsBar}}`}>
                <Switch
                    checked={showActionsBar}
                    disabled={shortcuts}
                    label="Show actions bar"
                    onChange={handleBooleanChange(setShowActionsBar)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`reverseMonthAndYearMenus={${reverseMonthAndYearMenus}}`}>
                <Switch
                    checked={reverseMonthAndYearMenus}
                    label="Reverse month and year menus"
                    onChange={handleBooleanChange(setReverseMonthAndYearMenus)}
                />
            </PropCodeTooltip>
            <FormGroup inline={true} label="Locale">
                <DateFnsLocaleSelect
                    onChange={setLocaleCode}
                    popoverProps={{ placement: "bottom-start" }}
                    value={localeCode}
                />
            </FormGroup>

            <H5>Input appearance props</H5>
            <PropCodeTooltip snippet={`disabled={${disabled}}`}>
                <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            </PropCodeTooltip>
            <PropCodeTooltip snippet={`fill={${fill}}`}>
                <Switch checked={fill} label="Fill container width" onChange={handleBooleanChange(setFill)} />
            </PropCodeTooltip>
            <PropCodeTooltip
                content={
                    <>
                        <Code>rightElement</Code> is {showRightElement ? "defined" : "undefined"}
                    </>
                }
            >
                <Switch
                    checked={showRightElement}
                    label="Show right element"
                    onChange={handleBooleanChange(setShowRightElement)}
                />
            </PropCodeTooltip>
            <DateFnsFormatSelect onChange={setDateFnsFormat} value={dateFnsFormat} />

            <H5>Time picker props</H5>
            <PrecisionSelect
                allowNone={true}
                label="Time precision"
                onChange={handleTimePrecisionChange}
                value={timePrecision}
            />
            <PropCodeTooltip
                disabled={!showTimePicker}
                snippet={`timePickerProps={{ showArrowButtons: ${showArrowButtons} }}`}
            >
                <Switch
                    checked={showArrowButtons}
                    disabled={!showTimePicker}
                    label="Show time picker arrow buttons"
                    onChange={handleBooleanChange(setShowArrowButtons)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip disabled={!showTimePicker} snippet={`timePickerProps={{ useAmPm: ${useAmPm} }}`}>
                <Switch
                    checked={useAmPm}
                    disabled={!showTimePicker}
                    label="Use AM/PM time"
                    onChange={handleBooleanChange(setUseAmPm)}
                />
            </PropCodeTooltip>

            <H5 className={classNames({ [Classes.TEXT_DISABLED]: !showTimePicker })}>Timezone select props</H5>
            <PropCodeTooltip disabled={!showTimePicker} snippet={`showTimezoneSelect={${showTimezoneSelect}}`}>
                <Switch
                    checked={showTimezoneSelect}
                    disabled={!showTimePicker}
                    label={`Show timezone${disableTimezoneSelect ? "" : " select"}`}
                    onChange={handleBooleanChange(setShowTimezoneSelect)}
                />
            </PropCodeTooltip>
            <PropCodeTooltip
                disabled={!showTimePicker || !showTimezoneSelect}
                snippet={`disableTimezoneSelect={${disableTimezoneSelect}}`}
            >
                <Switch
                    checked={disableTimezoneSelect}
                    disabled={!showTimePicker || !showTimezoneSelect}
                    label="Disable timezone select"
                    onChange={handleBooleanChange(setDisableTimezoneSelect)}
                />
            </PropCodeTooltip>
        </>
    );

    return (
        <Example options={options} {...props}>
            <DateInput
                closeOnSelection={closeOnSelection}
                dateFnsFormat={dateFnsFormat}
                disabled={disabled}
                disableTimezoneSelect={disableTimezoneSelect}
                fill={fill}
                locale={localeCode}
                onChange={setValue}
                popoverProps={{ placement: "bottom" }}
                reverseMonthAndYearMenus={reverseMonthAndYearMenus}
                rightElement={showRightElement && <Icon icon="globe" intent="primary" style={{ padding: "7px 5px" }} />}
                shortcuts={shortcuts}
                showActionsBar={showActionsBar}
                showTimezoneSelect={showTimezoneSelect}
                timePickerProps={showTimePicker ? { showArrowButtons, useAmPm } : undefined}
                timePrecision={timePrecision}
                value={value}
            />
            <FormattedDateTag date={value} />
        </Example>
    );
};
