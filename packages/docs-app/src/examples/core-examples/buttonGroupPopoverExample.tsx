/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Alignment, Button, ButtonGroup, H5, IconName, Popover, Position, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";

import { AlignmentSelect } from "./common/alignmentSelect";
import { FileMenu } from "./common/fileMenu";

export interface IButtonGroupPopoverExampleState {
    alignText: Alignment;
    fill: boolean;
    large: boolean;
    minimal: boolean;
    vertical: boolean;
}

export class ButtonGroupPopoverExample extends React.PureComponent<IExampleProps, IButtonGroupPopoverExampleState> {
    public state: IButtonGroupPopoverExampleState = {
        alignText: Alignment.CENTER,
        fill: false,
        large: false,
        minimal: false,
        vertical: false,
    };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Fill" checked={this.state.fill} onChange={this.handleFillChange} />
                <Switch label="Large" checked={this.state.large} onChange={this.handleLargeChange} />
                <Switch label="Minimal" checked={this.state.minimal} onChange={this.handleMinimalChange} />
                <Switch label="Vertical" checked={this.state.vertical} onChange={this.handleVerticalChange} />
                <AlignmentSelect align={this.state.alignText} label="Align text" onChange={this.handleAlignChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <ButtonGroup {...this.state} style={{ minWidth: 120 }}>
                    {this.renderButton("File", "document")}
                    {this.renderButton("Edit", "edit")}
                    {this.renderButton("View", "eye-open")}
                </ButtonGroup>
            </Example>
        );
    }

    private renderButton(text: string, iconName: IconName) {
        const { vertical } = this.state;
        const rightIconName: IconName = vertical ? "caret-right" : "caret-down";
        const position = vertical ? Position.RIGHT_TOP : Position.BOTTOM_LEFT;
        return (
            <Popover content={<FileMenu />} position={position}>
                <Button rightIcon={rightIconName} icon={iconName} text={text} />
            </Popover>
        );
    }

    private handleAlignChange = (alignText: Alignment) => this.setState({ alignText });
}
