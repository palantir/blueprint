/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import { AnchorButton, Button, Classes, Intent, Switch } from "../src";
import { removeNonHTMLProps } from "../src/common/props";
import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";;

export interface IButtonsExampleState {
    disabled?: boolean;
    intent?: Intent;
    large?: boolean;
    minimal?: boolean;
    wiggling?: boolean;
}

const INVALID_HTML_PROPS = ["large", "minimal", "wiggling"];

export class ButtonsExample extends BaseExample<IButtonsExampleState> {
    public state: IButtonsExampleState = {
        disabled: false,
        large: false,
        minimal: false,
        wiggling: false,
    };

    private handleDisabledChange = handleBooleanChange((disabled) => this.setState({ disabled }));
    private handleLargeChange = handleBooleanChange((large) => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange((minimal) => this.setState({ minimal }));
    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));

    private timeoutId: number;

    protected renderExample() {
        const classes = classNames({
            [Classes.LARGE]: this.state.large,
            [Classes.MINIMAL]: this.state.minimal,
        });

        return <div className="docs-react-example-row">
            <div className="docs-react-example-column">
                <code>Button</code><br/><br/>
                <Button
                    {...removeNonHTMLProps(this.state, INVALID_HTML_PROPS)}
                    className={classNames(classes, { "docs-wiggle": this.state.wiggling })}
                    iconName="refresh"
                    intent={this.state.intent}
                    onClick={this.beginWiggling}
                    text="Click to wiggle"
                />
            </div>
            <div className="docs-react-example-column">
                <code>AnchorButton</code><br/><br/>
                <AnchorButton
                    {...removeNonHTMLProps(this.state, INVALID_HTML_PROPS)}
                    className={classes}
                    href="/"
                    iconName="duplicate"
                    intent={this.state.intent}
                    rightIconName="share"
                    target="_blank"
                    text="Duplicate this page"
                />
            </div>
        </div>;
    }

    protected renderOptions() {
        return [
            [
                <label className="pt-label" key="label">Modifiers</label>,
                <Switch
                    checked={this.state.disabled}
                    key="disabled"
                    label="Disabled"
                    onChange={this.handleDisabledChange}
                />,
                <Switch
                    checked={this.state.large}
                    key="large"
                    label="Large"
                    onChange={this.handleLargeChange}
                />,
                <Switch
                    checked={this.state.minimal}
                    key="minimal"
                    label="Minimal"
                    onChange={this.handleMinimalChange}
                />,
            ], [
                <IntentSelect intent={this.state.intent} key="intent" onChange={this.handleIntentChange} />,
            ],
        ];
    }

    private beginWiggling = () => {
        clearTimeout(this.timeoutId);
        this.setState({ wiggling: true });
        this.timeoutId = setTimeout(() => this.setState({ wiggling: false }), 300);
    }
}
