/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { InputGroup, Label, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

export interface ILabelExampleState {
    disabled: boolean;
    helperText: boolean;
    inline: boolean;
}

export class LabelExample extends BaseExample<ILabelExampleState> {
    public state: ILabelExampleState = {
        disabled: false,
        helperText: false,
        inline: false,
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleHelperTextChange = handleBooleanChange(helperText => this.setState({ helperText }));
    private handleInlineChange = handleBooleanChange(inline => this.setState({ inline }));

    protected renderExample() {
        const { disabled, helperText, inline, ...labelProps } = this.state;
        return (
            <Label
                disabled={disabled}
                helperText={helperText ? "(required)" : undefined}
                inline={inline}
                text="Label"
                {...labelProps}
            >
                <InputGroup type="text" placeholder="Input with icon" leftIcon="text-highlight" disabled={disabled} />
            </Label>
        );
    }

    protected renderOptions() {
        const { disabled, helperText, inline } = this.state;
        return [
            [
                <Switch key="inline" label="Inline" checked={inline} onChange={this.handleInlineChange} />,
                <Switch
                    key="helperText"
                    label="Show helper text"
                    checked={helperText}
                    onChange={this.handleHelperTextChange}
                />,
                <Switch key="disabled" label="Disabled" checked={disabled} onChange={this.handleDisabledChange} />,
            ],
        ];
    }
}
