/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Button, ButtonGroup, Classes, IconName, Intent, Popover, Position, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleNumberChange } from "@blueprintjs/docs";
import * as classNames from "classnames";
import * as React from "react";

import { FileMenu } from "./common/fileMenu";
import { IntentSelect } from "./common/intentSelect";

export interface IButtonGroupPopoverExampleState {
    intent?: Intent;
    large?: boolean;
    minimal?: boolean;
    vertical?: boolean;
}

export class ButtonGroupPopoverExample extends BaseExample<IButtonGroupPopoverExampleState> {
    public state: IButtonGroupPopoverExampleState = {
        intent: Intent.NONE,
        large: false,
        minimal: false,
        vertical: false,
    };

    protected className = "docs-popover-button-group-example";

    private handleIntentChange = handleNumberChange(intent => this.setState({ intent }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    protected renderExample() {
        const { large, minimal, vertical } = this.state;

        return (
            <ButtonGroup
                large={large}
                minimal={minimal}
                vertical={vertical}
                className={classNames({ [Classes.ALIGN_LEFT]: vertical })}
            >
                {this.renderButton("File", "document")}
                {this.renderButton("Edit", "edit")}
                {this.renderButton("View", "eye-open")}
            </ButtonGroup>
        );
    }

    protected renderOptions() {
        return [
            [
                <IntentSelect key="intent" intent={this.state.intent} onChange={this.handleIntentChange} />,
                <Switch key="large" checked={this.state.large} onChange={this.handleLargeChange} label="Large" />,
                <Switch
                    key="minimal"
                    checked={this.state.minimal}
                    onChange={this.handleMinimalChange}
                    label="Minimal"
                />,
                <Switch
                    key="vertical"
                    checked={this.state.vertical}
                    onChange={this.handleVerticalChange}
                    label="Vertical"
                />,
            ],
        ];
    }

    private renderButton(text: string, iconName: IconName) {
        const { intent, vertical } = this.state;
        const rightIconName: IconName = vertical ? "caret-right" : "caret-down";
        const position = vertical ? Position.RIGHT_TOP : Position.BOTTOM_LEFT;
        return (
            <Popover content={<FileMenu />} position={position}>
                <Button intent={intent} rightIconName={rightIconName} iconName={iconName} text={text} />
            </Popover>
        );
    }
}
