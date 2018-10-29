/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { FormGroup, H5, InputGroup, Intent, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { IntentSelect } from "./common/intentSelect";

export interface IFormGroupExampleState {
    disabled: boolean;
    helperText: boolean;
    inline: boolean;
    intent: Intent;
    label: boolean;
    requiredLabel: boolean;
}

export class FormGroupExample extends React.PureComponent<IExampleProps, IFormGroupExampleState> {
    public state: IFormGroupExampleState = {
        disabled: false,
        helperText: false,
        inline: false,
        intent: Intent.NONE,
        label: true,
        requiredLabel: true,
    };

    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleHelperTextChange = handleBooleanChange(helperText => this.setState({ helperText }));
    private handleInlineChange = handleBooleanChange(inline => this.setState({ inline }));
    private handleLabelChange = handleBooleanChange(label => this.setState({ label }));
    private handleRequiredLabelChange = handleBooleanChange(requiredLabel => this.setState({ requiredLabel }));
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));

    public render() {
        const { disabled, helperText, inline, intent, label, requiredLabel } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Disabled" checked={disabled} onChange={this.handleDisabledChange} />
                <Switch label="Inline" checked={inline} onChange={this.handleInlineChange} />
                <Switch label="Show helper text" checked={helperText} onChange={this.handleHelperTextChange} />
                <Switch label="Show label" checked={label} onChange={this.handleLabelChange} />
                <Switch label="Show label info" checked={requiredLabel} onChange={this.handleRequiredLabelChange} />
                <IntentSelect intent={intent} onChange={this.handleIntentChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <FormGroup
                    disabled={disabled}
                    helperText={helperText && "Helper text with details..."}
                    inline={inline}
                    intent={intent}
                    label={label && "Label"}
                    labelFor="text-input"
                    labelInfo={requiredLabel && "(required)"}
                >
                    <InputGroup id="text-input" placeholder="Placeholder text" disabled={disabled} intent={intent} />
                </FormGroup>
                <FormGroup
                    disabled={disabled}
                    helperText={helperText && "Helper text with details..."}
                    inline={inline}
                    intent={intent}
                    label={label && "Label"}
                    labelFor="text-input"
                    labelInfo={requiredLabel && "(required)"}
                >
                    <Switch id="text-input" label="Engage the hyperdrive" disabled={disabled} />
                    <Switch id="text-input" label="Initiate thrusters" disabled={disabled} />
                </FormGroup>
            </Example>
        );
    }
}
