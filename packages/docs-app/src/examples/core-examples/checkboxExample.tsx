/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment, Checkbox, H5, Label, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import { AlignmentSelect } from "./common/alignmentSelect";

export interface ICheckboxExampleState {
    alignIndicator: Alignment;
    disabled: boolean;
    inline: boolean;
    large: boolean;
    value?: string;
}

export class CheckboxExample extends React.PureComponent<IExampleProps, ICheckboxExampleState> {
    public state: ICheckboxExampleState = {
        alignIndicator: Alignment.LEFT,
        disabled: false,
        inline: false,
        large: false,
    };

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.disabled} label="Disabled" onChange={this.handleDisabledChange} />
                <Switch checked={this.state.inline} label="Inline" onChange={this.handleInlineChange} />
                <Switch checked={this.state.large} label="Large" onChange={this.handleLargeChange} />
                <AlignmentSelect
                    align={this.state.alignIndicator}
                    allowCenter={false}
                    label="Align indicator"
                    onChange={this.handleAlignChange}
                />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                {this.renderExample()}
            </Example>
        );
    }

    protected renderExample() {
        return (
            <div>
                <Label>Assign responsibility</Label>
                <Checkbox {...this.state} label="Gilad Gray" defaultIndeterminate={true} />
                <Checkbox {...this.state} label="Jason Killian" />
                <Checkbox {...this.state} label="Antoine Llorca" />
            </div>
        );
    }

    // tslint:disable:member-ordering
    private handleAlignChange = (alignIndicator: Alignment) => this.setState({ alignIndicator });
    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleInlineChange = handleBooleanChange(inline => this.setState({ inline }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
}
