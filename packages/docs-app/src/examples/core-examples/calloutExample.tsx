/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Callout, Intent, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange, handleStringChange } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";
import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

export interface ICalloutExampleState {
    iconName?: IconName;
    intent?: Intent;
    showHeader: boolean;
}

export class CalloutExample extends BaseExample<ICalloutExampleState> {
    public state: ICalloutExampleState = { showHeader: true };

    protected renderExample() {
        const { showHeader, ...calloutProps } = this.state;
        return (
            <Callout {...calloutProps} title={showHeader ? "Visually important content" : undefined}>
                The component is a simple wrapper around the CSS API that provides props for modifiers and optional
                title element. Any additional HTML props will be spread to the rendered <code>{"<div>"}</code> element.
            </Callout>
        );
    }

    protected renderOptions() {
        const { iconName, intent, showHeader } = this.state;
        return [
            [
                <IntentSelect key="intent" intent={intent} onChange={this.handleIntentChange} />,
                <Switch key="header" checked={showHeader} label="Show header" onChange={this.handleHeaderChange} />,
            ],
            [<IconSelect key="icon-name" iconName={iconName} onChange={this.handleIconNameChange} />],
        ];
    }

    // tslint:disable-next-line:member-ordering
    private handleHeaderChange = handleBooleanChange((showHeader: boolean) => this.setState({ showHeader }));

    private handleIconNameChange = (iconName: IconName) => this.setState({ iconName });

    // tslint:disable-next-line:member-ordering
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));
}
