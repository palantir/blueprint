/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { AnchorButton, Button, Classes, Intent, Switch } from "@blueprintjs/core";
import { removeNonHTMLProps } from "@blueprintjs/core/src/common/props";
import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";

export interface IButtonsExampleState {
    disabled?: boolean;
    intent?: Intent;
    large?: boolean;
    minimal?: boolean;
    wiggling?: boolean;
    wigglingAnchor?: boolean;
}

const INVALID_HTML_PROPS = ["large", "minimal", "wiggling", "wigglingAnchor"];

export class ButtonsExample extends BaseExample<IButtonsExampleState> {
    public state: IButtonsExampleState = {
        disabled: false,
        large: false,
        minimal: false,
        wiggling: false,
        wigglingAnchor: false,
    };

    private handleDisabledChange = handleBooleanChange((disabled) => this.setState({ disabled }));
    private handleLargeChange = handleBooleanChange((large) => this.setState({ large }));
    private handleMinimalChange = handleBooleanChange((minimal) => this.setState({ minimal }));
    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));

    private timeoutId: number;
    private timeoutIdAnchor: number;

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
                    className={classNames(classes, { "docs-wiggle": this.state.wigglingAnchor })}
                    iconName="refresh"
                    intent={this.state.intent}
                    onClick={this.beginWigglingAnchor}
                    text="Click to wiggle"
                />
            </div>
            <div className="docs-react-example-column">
                <code>AnchorButton with href</code><br/><br/>
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
                <label className={Classes.LABEL} key="label">Modifiers</label>,
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

    private beginWigglingAnchor = () => {
        clearTimeout(this.timeoutIdAnchor);
        this.setState({ wigglingAnchor: true });
        this.timeoutIdAnchor = setTimeout(() => this.setState({ wigglingAnchor: false }), 300);
    }
}
