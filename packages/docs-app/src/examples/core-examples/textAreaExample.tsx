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

import { AnchorButton, Code, ControlGroup, H5, Intent, Switch, TextArea, Tooltip } from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

import { IntentSelect } from "./common/intentSelect";

const INTITIAL_CONTROLLED_TEXT = "In a galaxy far, far away...";
const CONTROLLED_TEXT_TO_APPEND =
    "The approach will not be easy. You are required to maneuver straight down this trench and skim the surface to this point. The target area is only two meters wide. It's a small thermal exhaust port, right below the main port. The shaft leads directly to the reactor system.";

interface TextAreaExampleState {
    autoResize: boolean;
    controlled: boolean;
    disabled: boolean;
    intent: Intent;
    growVertically: boolean;
    large: boolean;
    readOnly: boolean;
    small: boolean;
    value: string;
}

export class TextAreaExample extends React.PureComponent<ExampleProps, TextAreaExampleState> {
    public state: TextAreaExampleState = {
        autoResize: false,
        controlled: false,
        disabled: false,
        growVertically: false,
        intent: Intent.NONE,
        large: false,
        readOnly: false,
        small: false,
        value: INTITIAL_CONTROLLED_TEXT,
    };

    private handleControlledChange = handleBooleanChange(controlled => this.setState({ controlled }));

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleIntentChange = (intent: Intent) => this.setState({ intent });

    private handleAutoResizeChange = handleBooleanChange(autoResize => this.setState({ autoResize }));

    private handleGrowVerticallyChange = handleBooleanChange(growVertically => this.setState({ growVertically }));

    private handleLargeChange = handleBooleanChange(large => this.setState({ large, ...(large && { small: false }) }));

    private handleReadOnlyChange = handleBooleanChange(readOnly => this.setState({ readOnly }));

    private handleSmallChange = handleBooleanChange(small => this.setState({ small, ...(small && { large: false }) }));

    private appendControlledText = () =>
        this.setState(({ value }) => ({ value: value + " " + CONTROLLED_TEXT_TO_APPEND }));

    private resetControlledText = () => this.setState({ value: INTITIAL_CONTROLLED_TEXT });

    public render() {
        const { controlled, value, ...textAreaProps } = this.state;

        return (
            <Example options={this.renderOptions()} {...this.props}>
                <TextArea style={{ display: controlled ? undefined : "none" }} value={value} {...textAreaProps} />
                <TextArea
                    style={{ display: controlled ? "none" : undefined }}
                    placeholder="Type something..."
                    {...textAreaProps}
                />
            </Example>
        );
    }

    private renderOptions() {
        const { controlled, disabled, growVertically, intent, large, readOnly, small, autoResize } = this.state;
        return (
            <>
                <H5>Appearance props</H5>
                <Switch label="Large" disabled={small} onChange={this.handleLargeChange} checked={large} />
                <Switch label="Small" disabled={large} onChange={this.handleSmallChange} checked={small} />
                <IntentSelect intent={intent} onChange={this.handleIntentChange} />
                <H5>Behavior props</H5>
                <Switch label="Disabled" onChange={this.handleDisabledChange} checked={disabled} />
                <Switch label="Read-only" onChange={this.handleReadOnlyChange} checked={readOnly} />
                <PropCodeTooltip snippet={`autoResize={${autoResize}}`}>
                    <Switch label="Auto resize" onChange={this.handleAutoResizeChange} checked={autoResize} />
                </PropCodeTooltip>
                <Switch label="Controlled usage" onChange={this.handleControlledChange} checked={controlled} />
                <ControlGroup>
                    <AnchorButton
                        disabled={!controlled}
                        text="Insert more text"
                        icon="plus"
                        onClick={this.appendControlledText}
                    />
                    <Tooltip content="Reset text" placement="bottom-end">
                        <AnchorButton disabled={!controlled} icon="reset" onClick={this.resetControlledText} />
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
                        onChange={this.handleGrowVerticallyChange}
                        checked={autoResize || growVertically}
                    />
                </PropCodeTooltip>
            </>
        );
    }
}
