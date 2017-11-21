/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, ControlGroup, InputGroup, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface IControlGroupExampleState {
    fill?: boolean;
    vertical?: boolean;
}

export class ControlGroupExample extends BaseExample<IControlGroupExampleState> {
    public state: IControlGroupExampleState = {
        fill: false,
        vertical: false,
    };

    private toggleFill = handleBooleanChange(fill => this.setState({ fill }));
    private toggleVertical = handleBooleanChange(fill => this.setState({ fill }));

    protected renderExample() {
        return (
            <ControlGroup {...this.state}>
                <Button iconName="filter">Filter</Button>
                <InputGroup placeholder="Find filters..." />
            </ControlGroup>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch checked={this.state.fill} key="fill" label="Fill" onChange={this.toggleFill} />,
                <Switch checked={this.state.vertical} key="vertical" label="Vertical" onChange={this.toggleVertical} />,
            ],
        ];
    }
}
