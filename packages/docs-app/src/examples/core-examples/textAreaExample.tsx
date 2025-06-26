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

import {
    AnchorButton,
    ControlGroup,
    H5,
    Intent,
    type Size,
    Switch,
    TextArea,
    type TextAreaProps,
    Tooltip,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { IntentSelect } from "./common/intentSelect";
import { SizeSelect } from "./common/sizeSelect";

const INTITIAL_CONTROLLED_TEXT = "In a galaxy far, far away...";
const CONTROLLED_TEXT_TO_APPEND =
    "The approach will not be easy. You are required to maneuver straight down this trench and skim the surface to this point. The target area is only two meters wide. It's a small thermal exhaust port, right below the main port. The shaft leads directly to the reactor system.";

export const TextAreaExample: React.FC<ExampleProps> = props => {
    const [autoResize, setAutoResize] = React.useState(false);
    const [controlled, setControlled] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>(Intent.NONE);
    const [readOnly, setReadOnly] = React.useState(false);
    const [size, setSize] = React.useState<Size>("medium");
    const [value, setValue] = React.useState(INTITIAL_CONTROLLED_TEXT);

    const appendControlledText = React.useCallback(() => setValue(prev => prev + " " + CONTROLLED_TEXT_TO_APPEND), []);

    const resetControlledText = React.useCallback(() => setValue(INTITIAL_CONTROLLED_TEXT), []);

    const options = (
        <>
            <H5>Appearance props</H5>
            <IntentSelect intent={intent} onChange={setIntent} />
            <SizeSelect onChange={setSize} size={size} />
            <H5>Behavior props</H5>
            <Switch checked={disabled} label="Disabled" onChange={handleBooleanChange(setDisabled)} />
            <Switch checked={readOnly} label="Read-only" onChange={handleBooleanChange(setReadOnly)} />
            <PropCodeTooltip snippet={`autoResize={${autoResize}}`}>
                <Switch checked={autoResize} label="Auto resize" onChange={handleBooleanChange(setAutoResize)} />
            </PropCodeTooltip>
            <Switch checked={controlled} label="Controlled usage" onChange={handleBooleanChange(setControlled)} />
            <ControlGroup>
                <AnchorButton
                    disabled={!controlled}
                    icon="plus"
                    onClick={appendControlledText}
                    text="Insert more text"
                />
                <Tooltip content="Reset text" placement="bottom-end">
                    <AnchorButton disabled={!controlled} icon="reset" onClick={resetControlledText} />
                </Tooltip>
            </ControlGroup>
        </>
    );

    const textAreaProps: TextAreaProps = {
        autoResize,
        disabled,
        intent,
        readOnly,
        size,
    };

    return (
        <Example options={options} {...props}>
            <TextArea style={{ display: controlled ? undefined : "none" }} value={value} {...textAreaProps} />
            <TextArea
                placeholder="Type something..."
                style={{ display: controlled ? "none" : undefined }}
                {...textAreaProps}
            />
        </Example>
    );
};
