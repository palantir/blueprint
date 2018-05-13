/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { AnchorButton, Button, Classes, Code, Intent, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";

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

export class ButtonsExample extends BaseExample<IButtonsExampleState> {
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

    protected renderExample() {
        const { iconOnly, wiggling, ...buttonProps } = this.state;

        return (
            <>
                <div className="docs-react-example-column">
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
                <div className="docs-react-example-column">
                    <p>
                        <Code>AnchorButton</Code>
                    </p>
                    <AnchorButton
                        href="./#core/components/button.javascript-api"
                        icon="duplicate"
                        rightIcon="share"
                        target="_blank"
                        text={iconOnly ? undefined : "Duplicate this page"}
                        {...buttonProps}
                    />
                </div>
            </>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch checked={this.state.active} key="active" label="Active" onChange={this.handleActiveChange} />,
                <Switch
                    checked={this.state.disabled}
                    key="disabled"
                    label="Disabled"
                    onChange={this.handleDisabledChange}
                />,
                <Switch checked={this.state.large} key="large" label="Large" onChange={this.handleLargeChange} />,
                <Switch
                    checked={this.state.loading}
                    key="loading"
                    label="Loading"
                    onChange={this.handleLoadingChange}
                />,
                <Switch
                    checked={this.state.minimal}
                    key="minimal"
                    label="Minimal"
                    onChange={this.handleMinimalChange}
                />,
            ],
            [
                <IntentSelect intent={this.state.intent} key="intent" onChange={this.handleIntentChange} />,
                <Switch
                    checked={this.state.iconOnly}
                    key="icon"
                    label="Icons only"
                    onChange={this.handleIconOnlyChange}
                />,
            ],
        ];
    }

    private beginWiggling = () => {
        window.clearTimeout(this.wiggleTimeoutId);
        this.setState({ wiggling: true });
        this.wiggleTimeoutId = window.setTimeout(() => this.setState({ wiggling: false }), 300);
    };
}
