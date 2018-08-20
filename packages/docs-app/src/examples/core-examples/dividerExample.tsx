/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, ButtonGroup, Divider, H5, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IDividerExampleState {
    fill: boolean;
    vertical: boolean;
}

export class DividerExample extends React.PureComponent<IExampleProps, IDividerExampleState> {
    public state: IDividerExampleState = { fill: false, vertical: false };

    private handleFillChange = handleBooleanChange(fill => this.setState({ fill }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const { fill, vertical } = this.state;
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={fill} label="Fill" onChange={this.handleFillChange} />
                <Switch checked={vertical} label="Vertical" onChange={this.handleVerticalChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <ButtonGroup minimal={true} vertical={vertical}>
                    <Button text="File" />
                    <Button text="Edit" />
                    <Divider fill={fill} />
                    <Button text="Create" />
                    <Button text="Delete" />
                    <Divider fill={fill} />
                    <Button icon="add" />
                    <Button icon="remove" />
                </ButtonGroup>
            </Example>
        );
    }
}
