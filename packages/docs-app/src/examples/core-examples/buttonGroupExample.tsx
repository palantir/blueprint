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

import * as React from "react";

import { Alignment, AnchorButton, Button, ButtonGroup, H5, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import { AlignmentSelect } from "./common/alignmentSelect";

export interface IButtonGroupExampleState {
    alignText: Alignment;
    fill: boolean;
    iconOnly: boolean;
    minimal: boolean;
    large: boolean;
    vertical: boolean;
}

export class ButtonGroupExample extends React.PureComponent<IExampleProps, IButtonGroupExampleState> {
    public state: IButtonGroupExampleState = {
        alignText: Alignment.CENTER,
        fill: false,
        iconOnly: false,
        large: false,
        minimal: false,
        vertical: false,
    };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleIconOnlyChange = handleBooleanChange(iconOnly => this.setState({ iconOnly }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const { iconOnly, ...bgProps } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.fill} label="Fill" onChange={this.handleFillChange} />
                <Switch checked={this.state.large} label="Large" onChange={this.handleLargeChange} />
                <Switch checked={this.state.minimal} label="Minimal" onChange={this.handleMinimalChange} />
                <Switch checked={this.state.vertical} label="Vertical" onChange={this.handleVerticalChange} />
                <AlignmentSelect align={this.state.alignText} onChange={this.handleAlignChange} />
                <H5>Example</H5>
                <Switch checked={this.state.iconOnly} label="Icons only" onChange={this.handleIconOnlyChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                {/* set `minWidth` so `alignText` will have an effect when vertical */}
                <ButtonGroup style={{ minWidth: 200 }} {...bgProps}>
                    <Button icon="database">{!iconOnly && "Queries"}</Button>
                    <Button icon="function">{!iconOnly && "Functions"}</Button>
                    <AnchorButton icon="cog" rightIcon="settings">
                        {!iconOnly && "Options"}
                    </AnchorButton>
                </ButtonGroup>
            </Example>
        );
    }

    private handleAlignChange = (alignText: Alignment) => this.setState({ alignText });
}
