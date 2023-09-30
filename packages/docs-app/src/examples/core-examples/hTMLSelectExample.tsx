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

import { H5, HTMLSelect, HTMLSelectIconName, Label, Switch } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";

export interface HTMLSelectExampleState {
    disabled: boolean;
    fill: boolean;
    iconName?: "double-caret-vertical" | "caret-down";
    large: boolean;
    minimal: boolean;
}

const SUPPORTED_ICON_NAMES: HTMLSelectIconName[] = ["double-caret-vertical", "caret-down"];

const SELECT_OPTIONS = ["One", "Two", "Three", "Four"];

export class HTMLSelectExample extends React.PureComponent<ExampleProps, HTMLSelectExampleState> {
    public state: HTMLSelectExampleState = {
        disabled: false,
        fill: false,
        iconName: undefined, // use component default
        large: false,
        minimal: false,
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));

    private handleIconChange = handleStringChange(iconName =>
        this.setState({ iconName: iconName as HTMLSelectIconName }),
    );

    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));

    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.fill} label="Fill" onChange={this.handleFillChange} />
                <Switch checked={this.state.large} label="Large" onChange={this.handleLargeChange} />
                <Switch checked={this.state.minimal} label="Minimal" onChange={this.handleMinimalChange} />
                <Switch checked={this.state.disabled} label="Disabled" onChange={this.handleDisabledChange} />
                <Label>
                    Icon
                    <HTMLSelect
                        placeholder="Choose an item..."
                        options={SUPPORTED_ICON_NAMES}
                        onChange={this.handleIconChange}
                    />
                </Label>
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <HTMLSelect {...this.state} options={SELECT_OPTIONS} />
            </Example>
        );
    }
}
