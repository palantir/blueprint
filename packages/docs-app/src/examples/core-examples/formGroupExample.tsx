/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
}

export class FormGroupExample extends BaseExample<IFormGroupExampleState> {
    public state: IFormGroupExampleState = {
        disabled: false,
        helperText: false,
        inline: false,
    };

    protected className = "docs-label-example";

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleHelperTextChange = handleBooleanChange(helperText => this.setState({ helperText }));
    private handleInlineChange = handleBooleanChange(inline => this.setState({ inline }));

    protected renderExample() {
        const { disabled, helperText, inline } = this.state;
        return (
            <FormGroup
                disabled={disabled}
                helperText={helperText ? "Helper text with details..." : undefined}
                inline={inline}
                label="Label"
                requiredLabel={true}
                labelFor="text-input"
            >
                <InputGroup id="text-input" placeholder="Placeholder text" disabled={disabled} />
            </FormGroup>
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
