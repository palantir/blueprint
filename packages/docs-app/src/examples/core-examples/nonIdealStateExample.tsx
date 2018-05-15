/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, InputGroup, NonIdealState, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs-theme";

export interface INonIdealStateExampleState {
    action?: boolean;
    description?: boolean;
    icon?: boolean;
}

export class NonIdealStateExample extends BaseExample<INonIdealStateExampleState> {
    public state: INonIdealStateExampleState = {
        action: true,
        description: true,
        icon: true,
    };

    private toggleAction = handleBooleanChange(action => this.setState({ action }));
    private toggleIcon = handleBooleanChange(icon => this.setState({ icon }));
    private toggleDescription = handleBooleanChange(description => this.setState({ description }));

    protected renderExample() {
        const action = <InputGroup className={Classes.ROUND} leftIcon="search" placeholder="Search..." />;
        const description = (
            <div>
                Your search didn't match any files.<br />Try searching for something else.
            </div>
        );
        return (
            <NonIdealState
                icon={this.state.icon ? "search" : undefined}
                title="No search results"
                description={this.state.description ? description : undefined}
                action={this.state.action ? action : undefined}
            />
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch checked={this.state.icon} label="Show icon" key="icon" onChange={this.toggleIcon} />,
                <Switch
                    checked={this.state.description}
                    label="Show description"
                    key="description"
                    onChange={this.toggleDescription}
                />,
                <Switch checked={this.state.action} label="Show action" key="action" onChange={this.toggleAction} />,
            ],
        ];
    }
}
