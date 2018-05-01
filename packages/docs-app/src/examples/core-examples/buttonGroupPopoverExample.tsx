/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Alignment, Button, ButtonGroup, IconName, Intent, Popover, Position, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import * as React from "react";

import { AlignmentSelect } from "./common/alignmentSelect";
import { FileMenu } from "./common/fileMenu";
import { IntentSelect } from "./common/intentSelect";

export interface IButtonGroupPopoverExampleState {
    alignText: Alignment;
    intent: Intent;
    large: boolean;
    minimal: boolean;
    vertical: boolean;
}

export class ButtonGroupPopoverExample extends BaseExample<IButtonGroupPopoverExampleState> {
    public state: IButtonGroupPopoverExampleState = {
        alignText: Alignment.CENTER,
        intent: Intent.NONE,
        large: false,
        minimal: false,
        vertical: false,
    };

    protected className = "docs-popover-button-group-example";

    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleVerticalChange = handleBooleanChange(vertical => this.setState({ vertical }));

    protected renderExample() {
        const { intent, ...bgProps } = this.state;

        return (
            <ButtonGroup {...bgProps} style={{ minWidth: 120 }}>
                {this.renderButton("File", "document")}
                {this.renderButton("Edit", "edit")}
                {this.renderButton("View", "eye-open")}
            </ButtonGroup>
        );
    }

    protected renderOptions() {
        const { alignText } = this.state;
        return [
            [
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
            [<AlignmentSelect key="align" align={alignText} onChange={this.handleAlignChange} />],
            [<IntentSelect key="intent" intent={this.state.intent} onChange={this.handleIntentChange} />],
        ];
    }

    private renderButton(text: string, iconName: IconName) {
        const { intent, vertical } = this.state;
        const rightIconName: IconName = vertical ? "caret-right" : "caret-down";
        const position = vertical ? Position.RIGHT_TOP : Position.BOTTOM_LEFT;
        return (
            <Popover content={<FileMenu />} position={position}>
                <Button intent={intent} rightIcon={rightIconName} icon={iconName} text={text} />
            </Popover>
        );
    }

    private handleAlignChange = (alignText: Alignment) => this.setState({ alignText });
}
