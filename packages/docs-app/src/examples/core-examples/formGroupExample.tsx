/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
