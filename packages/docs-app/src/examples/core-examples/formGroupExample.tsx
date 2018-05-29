/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { FormGroup, InputGroup, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

export interface IFormGroupExampleState {
    disabled: boolean;
    helperText: boolean;
    inline: boolean;
    requiredLabel: boolean;
}

export class FormGroupExample extends BaseExample<IFormGroupExampleState> {
    public state: IFormGroupExampleState = {
        disabled: false,
        helperText: false,
        inline: false,
        requiredLabel: true,
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleHelperTextChange = handleBooleanChange(helperText => this.setState({ helperText }));
    private handleInlineChange = handleBooleanChange(inline => this.setState({ inline }));
    private handleRequiredLabelChange = handleBooleanChange(requiredLabel => this.setState({ requiredLabel }));

    protected renderExample() {
        const { disabled, helperText, inline, requiredLabel } = this.state;
        return (
            <FormGroup
                disabled={disabled}
                helperText={helperText ? "Helper text with details..." : undefined}
                inline={inline}
                label="Label"
                requiredLabel={requiredLabel}
                labelFor="text-input"
            >
                <InputGroup id="text-input" placeholder="Placeholder text" disabled={disabled} />
            </FormGroup>
        );
    }

    protected renderOptions() {
        const { disabled, helperText, inline, requiredLabel } = this.state;
        return [
            [
                <Switch key="disabled" label="Disabled" checked={disabled} onChange={this.handleDisabledChange} />,
                <Switch key="inline" label="Inline" checked={inline} onChange={this.handleInlineChange} />,
                <Switch
                    key="requiredLabel"
                    label="Show required label"
                    checked={requiredLabel}
                    onChange={this.handleRequiredLabelChange}
                />,
                <Switch
                    key="helperText"
                    label="Show helper text"
                    checked={helperText}
                    onChange={this.handleHelperTextChange}
                />,
            ],
        ];
    }
}
