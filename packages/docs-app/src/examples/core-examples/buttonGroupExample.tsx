/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { AnchorButton, Button, ButtonGroup, Classes, Icon, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface IButtonGroupExampleState {
    fill?: boolean;
    minimal?: boolean;
    large?: boolean;
    vertical?: boolean;
}

export class ButtonGroupExample extends BaseExample<IButtonGroupExampleState> {
    public state: IButtonGroupExampleState = {
        fill: false,
        large: false,
        minimal: false,
        vertical: false,
    };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    protected renderExample() {
        // have the container take up the full-width if `fill` is true;
        // otherwise, disable full-width styles to keep a vertical button group
        // from taking up the full width.
        const style: React.CSSProperties = { flexGrow: this.state.fill ? 1 : undefined };
        return (
            <ButtonGroup style={style} {...this.state}>
                <Button iconName="database">Queries</Button>
                <Button iconName="function">Functions</Button>
                <AnchorButton rightIconName="caret-down">Options</AnchorButton>
            </ButtonGroup>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch checked={this.state.fill} key="fill" label="Fill" onChange={this.handleFillChange} />,
                <Switch checked={this.state.large} key="large" label="Large" onChange={this.handleLargeChange} />,
                <Switch
                    checked={this.state.minimal}
                    key="minimal"
                    label="Minimal"
                    onChange={this.handleMinimalChange}
                />,
                <Switch
                    checked={this.state.vertical}
                    key="vertical"
                    label="Vertical"
                    onChange={this.handleVerticalChange}
                />,
            ],
        ];
    }
}
