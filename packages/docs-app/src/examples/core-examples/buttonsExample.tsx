/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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

import { AnchorButton, Button, Code, H5, Intent, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";

import { IntentSelect } from "./common/intentSelect";

export interface IButtonsExampleState {
    active: boolean;
    disabled: boolean;
    iconOnly: boolean;
    intent: Intent;
    loading: boolean;
    large: boolean;
    minimal: boolean;
    wiggling: boolean;
}

export class ButtonsExample extends React.PureComponent<IExampleProps, IButtonsExampleState> {
    public state: IButtonsExampleState = {
        active: false,
        disabled: false,
        iconOnly: false,
        intent: Intent.NONE,
        large: false,
        loading: false,
        minimal: false,
        wiggling: false,
    };

    private handleActiveChange = handleBooleanChange(active => this.setState({ active }));
    private handleDisabledChange = handleBooleanChange(disabled => this.setState({ disabled }));
    private handleIconOnlyChange = handleBooleanChange(iconOnly => this.setState({ iconOnly }));
    private handleLargeChange = handleBooleanChange(large => this.setState({ large }));
    private handleLoadingChange = handleBooleanChange(loading => this.setState({ loading }));
    private handleMinimalChange = handleBooleanChange(minimal => this.setState({ minimal }));
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));

    private wiggleTimeoutId: number;

    public componentWillUnmount() {
        window.clearTimeout(this.wiggleTimeoutId);
    }

    public render() {
        const { iconOnly, wiggling, ...buttonProps } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Active" checked={this.state.active} onChange={this.handleActiveChange} />
                <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
                <Switch label="Large" checked={this.state.large} onChange={this.handleLargeChange} />
                <Switch label="Loading" checked={this.state.loading} onChange={this.handleLoadingChange} />
                <Switch label="Minimal" checked={this.state.minimal} onChange={this.handleMinimalChange} />
                <IntentSelect intent={this.state.intent} onChange={this.handleIntentChange} />
                <H5>Example</H5>
                <Switch label="Icons only" checked={this.state.iconOnly} onChange={this.handleIconOnlyChange} />
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <div>
                    <p>
                        <Code>Button</Code>
                    </p>
                    <Button
                        className={this.state.wiggling ? "docs-wiggle" : ""}
                        icon="refresh"
                        onClick={this.beginWiggling}
                        {...buttonProps}
                    >
                        {!iconOnly && "Click to wiggle"}
                    </Button>
                </div>
                <div>
                    <p>
                        <Code>AnchorButton</Code>
                    </p>
                    <AnchorButton
                        href="#core/components/button"
                        icon="duplicate"
                        rightIcon="share"
                        target="_blank"
                        text={iconOnly ? undefined : "Duplicate this page"}
                        {...buttonProps}
                    />
                </div>
            </Example>
        );
    }

    private beginWiggling = () => {
        window.clearTimeout(this.wiggleTimeoutId);
        this.setState({ wiggling: true });
        this.wiggleTimeoutId = window.setTimeout(() => this.setState({ wiggling: false }), 300);
    };
}
