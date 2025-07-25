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

import * as React from "react";

import { H5, Position, Radio, RadioGroup, Switch } from "@blueprintjs/core";
import { TimezoneDisplayFormat, TimezoneSelect } from "@blueprintjs/datetime";
import { Example, type ExampleProps, handleBooleanChange, handleValueChange } from "@blueprintjs/docs-theme";

export const TimezoneSelectExample: React.FC<ExampleProps> = props => {
    const [disabled, setDisabled] = React.useState(false);
    const [displayFormat, setDisplayFormat] = React.useState(TimezoneDisplayFormat.COMPOSITE);
    const [fill, setFill] = React.useState(false);
    const [showLocalTimezone, setShowLocalTimezone] = React.useState(true);
    const [value, setValue] = React.useState("");

    const options = (
        <>
            <H5>Props</H5>
            <Switch
                checked={showLocalTimezone}
                label="Show local timezone"
                onChange={handleBooleanChange(setShowLocalTimezone)}
            />
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch label="Fill container width" checked={fill} onChange={handleBooleanChange(setFill)} />
            <RadioGroup
                label="Display format"
                onChange={handleValueChange(setDisplayFormat)}
                selectedValue={displayFormat}
            >
                <Radio label="Composite" value={TimezoneDisplayFormat.COMPOSITE} />
                <Radio label="Abbreviation" value={TimezoneDisplayFormat.ABBREVIATION} />
                <Radio label="Long Name" value={TimezoneDisplayFormat.LONG_NAME} />
                <Radio label="IANA Code" value={TimezoneDisplayFormat.CODE} />
                <Radio label="Offset" value={TimezoneDisplayFormat.OFFSET} />
            </RadioGroup>
        </>
    );

    return (
        <Example options={options} {...props}>
            <TimezoneSelect
                disabled={disabled}
                fill={fill}
                onChange={setValue}
                popoverProps={{ position: Position.BOTTOM }}
                showLocalTimezone={showLocalTimezone}
                value={value}
                valueDisplayFormat={displayFormat}
            />
        </Example>
    );
};
