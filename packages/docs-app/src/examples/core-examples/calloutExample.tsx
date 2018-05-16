/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Callout, Code, Intent, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, handleStringChange, IDocsExampleProps } from "@blueprintjs/docs-theme";
import { IconName } from "@blueprintjs/icons";
import { IconSelect } from "./common/iconSelect";
import { IntentSelect } from "./common/intentSelect";

export interface ICalloutExampleState {
    icon?: IconName;
    intent?: Intent;
    showHeader: boolean;
}

export class CalloutExample extends React.PureComponent<IDocsExampleProps, ICalloutExampleState> {
    public state: ICalloutExampleState = { showHeader: true };

    private handleHeaderChange = handleBooleanChange((showHeader: boolean) => this.setState({ showHeader }));
    private handleIntentChange = handleStringChange((intent: Intent) => this.setState({ intent }));

    public render() {
        const { showHeader, ...calloutProps } = this.state;
        const options = (
            <>
                <IntentSelect intent={calloutProps.intent} onChange={this.handleIntentChange} />
                <Switch checked={showHeader} label="Show header" onChange={this.handleHeaderChange} />
                <IconSelect iconName={calloutProps.icon} onChange={this.handleIconNameChange} />
            </>
        );
        return (
            <Example options={options} {...this.props}>
                <Callout {...calloutProps} title={showHeader ? "Visually important content" : undefined}>
                    The component is a simple wrapper around the CSS API that provides props for modifiers and optional
                    title element. Any additional HTML props will be spread to the rendered <Code>{"<div>"}</Code>{" "}
                    element.
                </Callout>
            </Example>
        );
    }

    private handleIconNameChange = (icon: IconName) => this.setState({ icon });
}
