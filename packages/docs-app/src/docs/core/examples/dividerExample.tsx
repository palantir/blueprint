/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, ButtonGroup, Divider, H5, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IDividerExampleState {
    vertical: boolean;
}

export class DividerExample extends React.PureComponent<IExampleProps, IDividerExampleState> {
    public state: IDividerExampleState = { vertical: false };

    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const { vertical } = this.state;
        const options = (
            <>
                <H5>Example props</H5>
                <Switch checked={vertical} label="Vertical" onChange={this.handleVerticalChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <ButtonGroup minimal={true} vertical={vertical}>
                    <Button text="File" />
                    <Button text="Edit" />
                    <Divider />
                    <Button text="Create" />
                    <Button text="Delete" />
                    <Divider />
                    <Button icon="add" />
                    <Button icon="remove" />
                </ButtonGroup>
            </Example>
        );
    }
}
