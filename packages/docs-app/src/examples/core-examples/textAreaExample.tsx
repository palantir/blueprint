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
    Code,
    ControlGroup,
    H5,
    Intent,
    Switch,
    TextArea,
    type TextAreaProps,
    Tooltip,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { IntentSelect } from "./common/intentSelect";

const INTITIAL_CONTROLLED_TEXT = "In a galaxy far, far away...";
const CONTROLLED_TEXT_TO_APPEND =
    "The approach will not be easy. You are required to maneuver straight down this trench and skim the surface to this point. The target area is only two meters wide. It's a small thermal exhaust port, right below the main port. The shaft leads directly to the reactor system.";

export const TextAreaExample: React.FC<ExampleProps> = props => {
    const [autoResize, setAutoResize] = React.useState(false);
    const [controlled, setControlled] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [growVertically, setGrowVertically] = React.useState(false);
    const [intent, setIntent] = React.useState<Intent>(Intent.NONE);
    const [large, setLarge] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(false);
    const [small, setSmall] = React.useState(false);
    const [value, setValue] = React.useState(INTITIAL_CONTROLLED_TEXT);

    const handleLargeChange = handleBooleanChange(isLarge => {
        setLarge(isLarge);
        if (isLarge) setSmall(false);
    });

    const handleSmallChange = handleBooleanChange(isSmall => {
        setSmall(isSmall);
        if (isSmall) setLarge(false);
    });

    const appendControlledText = () => setValue(prev => prev + " " + CONTROLLED_TEXT_TO_APPEND);
    const resetControlledText = () => setValue(INTITIAL_CONTROLLED_TEXT);

    const options = (
        <>
            <H5>Appearance props</H5>
            <Switch label="Large" disabled={small} onChange={handleLargeChange} checked={large} />
            <Switch label="Small" disabled={large} onChange={handleSmallChange} checked={small} />
            <IntentSelect intent={intent} onChange={setIntent} />
            <H5>Behavior props</H5>
            <Switch label="Disabled" onChange={handleBooleanChange(setDisabled)} checked={disabled} />
            <Switch label="Read-only" onChange={handleBooleanChange(setReadOnly)} checked={readOnly} />
            <PropCodeTooltip snippet={`autoResize={${autoResize}}`}>
                <Switch label="Auto resize" onChange={handleBooleanChange(setAutoResize)} checked={autoResize} />
            </PropCodeTooltip>
            <Switch label="Controlled usage" onChange={handleBooleanChange(setControlled)} checked={controlled} />
            <ControlGroup>
                <AnchorButton
                    disabled={!controlled}
                    text="Insert more text"
                    icon="plus"
                    onClick={appendControlledText}
                />
                <Tooltip content="Reset text" placement="bottom-end">
                    <AnchorButton disabled={!controlled} icon="reset" onClick={resetControlledText} />
                </Tooltip>
            </ControlGroup>
            <H5>Deprecated props</H5>
            <PropCodeTooltip
                content={
                    <span>
                        This behavior is enabled by the new <Code>autoResize</Code> prop
                    </span>
                }
                disabled={!autoResize}
            >
                <Switch
                    disabled={autoResize}
                    label="Grow vertically"
                    onChange={handleBooleanChange(setGrowVertically)}
                    checked={autoResize || growVertically}
                />
            </PropCodeTooltip>
        </>
    );

    const textAreaProps: TextAreaProps = {
        autoResize,
        disabled,
        growVertically,
        intent,
        large,
        readOnly,
        small,
    };

    return (
        <Example options={options} {...props}>
            <TextArea style={{ display: controlled ? undefined : "none" }} value={value} {...textAreaProps} />
            <TextArea
                style={{ display: controlled ? "none" : undefined }}
                placeholder="Type something..."
                {...textAreaProps}
            />
        </Example>
    );
};
