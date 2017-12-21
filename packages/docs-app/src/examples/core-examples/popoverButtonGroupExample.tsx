/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Button, ButtonGroup, Classes, Intent, Popover, Position, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs";
import * as classNames from "classnames";
import * as React from "react";

import { FileMenu } from "./common/fileMenu";
import { IntentSelect } from "./common/intentSelect";

export interface IPopoverButtonGroupExampleState {
    intent?: Intent;
    large?: boolean;
    vertical?: boolean;
}

export class PopoverButtonGroupExample extends BaseExample<IPopoverButtonGroupExampleState> {
    public state: IPopoverButtonGroupExampleState = {
        intent: Intent.NONE,
        large: false,
        vertical: false,
    };

    protected className = "docs-popover-button-group-example";

    private handleIntentChange = handleNumberChange(intent => this.setState({ intent }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    protected renderExample() {
        const { intent, large, vertical } = this.state;
        const menuContent = <FileMenu />;
        const rightIconName = vertical ? "caret-right" : "caret-down";
        const position = vertical ? Position.RIGHT_TOP : Position.BOTTOM_LEFT;
        return (
            <ButtonGroup {...{ large, vertical }} className={classNames({ [Classes.ALIGN_LEFT]: vertical })}>
                <Popover content={menuContent} {...{ position }}>
                    <Button intent={intent} iconName="document" {...{ rightIconName }}>
                        File
                    </Button>
                </Popover>
                <Popover content={menuContent} {...{ position }}>
                    <Button intent={intent} iconName="edit" {...{ rightIconName }}>
                        Edit
                    </Button>
                </Popover>
                <Popover content={menuContent} {...{ position }}>
                    <Button intent={intent} iconName="eye-open" {...{ rightIconName }}>
                        View
                    </Button>
                </Popover>
            </ButtonGroup>
        );
    }

    protected renderOptions() {
        return [
            [
                <IntentSelect intent={this.state.intent} key="intent" onChange={this.handleIntentChange} />,
                <Switch checked={this.state.large} onChange={this.handleLargeChange} label="Large" />,
                <Switch checked={this.state.vertical} onChange={this.handleVerticalChange} label="Vertical" />,
            ],
        ];
    }
}
