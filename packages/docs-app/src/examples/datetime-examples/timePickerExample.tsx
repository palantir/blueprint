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

import { useCallback, useState } from "react";

import { Classes, H5, HTMLSelect, Switch } from "@blueprintjs/core";
import { TimePicker, TimePrecision } from "@blueprintjs/datetime";
import { getDefaultMaxTime, getDefaultMinTime } from "@blueprintjs/datetime/lib/esm/common/timeUnit";
import {
    Example,
    type ExampleProps,
    handleBooleanChange,
    handleNumberChange,
    handleValueChange,
} from "@blueprintjs/docs-theme";

import { PrecisionSelect } from "./common/precisionSelect";

enum MinimumHours {
    NONE = 0,
    SIX_PM = 18,
}

enum MaximumHours {
    NONE = 0,
    SIX_PM = 18,
    NINE_PM = 21,
    TWO_AM = 2,
}

export const TimePickerExample: React.FC<ExampleProps> = props => {
    const [autoFocus, setAutoFocus] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [maxTime, setMaxTime] = useState<Date>(getDefaultMaxTime());
    const [minTime, setMinTime] = useState<Date>(getDefaultMinTime());
    const [precision, setPrecision] = useState<TimePrecision>(TimePrecision.MINUTE);
    const [selectAllOnFocus, setSelectAllOnFocus] = useState(false);
    const [showArrowButtons, setShowArrowButtons] = useState(false);
    const [useAmPm, setUseAmPm] = useState(false);

    const handlePrecisionChange = handleValueChange((timePrecision: TimePrecision) => setPrecision(timePrecision));

    const handleMaxChange = useCallback((hour: MaximumHours) => {
        let newMaxTime = new Date(1995, 6, 30, hour);
        if (hour === MaximumHours.NONE) {
            newMaxTime = getDefaultMaxTime();
        }
        setMaxTime(newMaxTime);
    }, []);

    const handleMinChange = useCallback((hour: MinimumHours) => {
        let newMinTime = new Date(1995, 6, 30, hour);
        if (hour === MinimumHours.NONE) {
            newMinTime = getDefaultMinTime();
        }
        setMinTime(newMinTime);
    }, []);

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={selectAllOnFocus}
                label="Select all on focus"
                onChange={handleBooleanChange(setSelectAllOnFocus)}
            />
            <Switch
                checked={showArrowButtons}
                label="Show arrow buttons"
                onChange={handleBooleanChange(setShowArrowButtons)}
            />
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={useAmPm} label="Use AM/PM" onChange={handleBooleanChange(setUseAmPm)} />
            <Switch checked={autoFocus} label="Auto focus" onChange={handleBooleanChange(setAutoFocus)} />
            <PrecisionSelect value={precision} onChange={handlePrecisionChange} />
            <label className={Classes.LABEL}>
                Minimum time
                <HTMLSelect onChange={handleNumberChange(handleMinChange)}>
                    <option value={MinimumHours.NONE}>None</option>
                    <option value={MinimumHours.SIX_PM}>6pm (18:00)</option>
                </HTMLSelect>
            </label>
            <label className={Classes.LABEL}>
                Maximum time
                <HTMLSelect onChange={handleNumberChange(handleMaxChange)}>
                    <option value={MaximumHours.NONE}>None</option>
                    <option value={MaximumHours.SIX_PM}>6pm (18:00)</option>
                    <option value={MaximumHours.NINE_PM}>9pm (21:00)</option>
                    <option value={MaximumHours.TWO_AM}>2am (02:00)</option>
                </HTMLSelect>
            </label>
        </>
    );

    return (
        <Example options={options} {...props}>
            <TimePicker
                autoFocus={autoFocus}
                disabled={disabled}
                maxTime={maxTime}
                minTime={minTime}
                precision={precision}
                selectAllOnFocus={selectAllOnFocus}
                showArrowButtons={showArrowButtons}
                useAmPm={useAmPm}
            />
        </Example>
    );
};
