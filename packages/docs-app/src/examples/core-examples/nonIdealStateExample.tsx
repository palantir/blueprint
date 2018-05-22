/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, H5, InputGroup, NonIdealState, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface INonIdealStateExampleState {
    action: boolean;
    description: boolean;
    icon: boolean;
}

export class NonIdealStateExample extends React.PureComponent<IExampleProps, INonIdealStateExampleState> {
    public state: INonIdealStateExampleState = {
        action: true,
        description: true,
        icon: true,
    };

    private toggleAction = handleBooleanChange(action => this.setState({ action }));
    private toggleIcon = handleBooleanChange(icon => this.setState({ icon }));
    private toggleDescription = handleBooleanChange(description => this.setState({ description }));

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Show icon" checked={this.state.icon} onChange={this.toggleIcon} />
                <Switch label="Show description" checked={this.state.description} onChange={this.toggleDescription} />
                <Switch label="Show action" checked={this.state.action} onChange={this.toggleAction} />
            </>
        );

        const action = <InputGroup className={Classes.ROUND} leftIcon="search" placeholder="Search..." />;
        const description = (
            <>
                Your search didn't match any files.<br />Try searching for something else.
            </>
        );

        return (
            <Example options={options} {...this.props}>
                <NonIdealState
                    icon={this.state.icon ? "search" : undefined}
                    title="No search results"
                    description={this.state.description ? description : undefined}
                    action={this.state.action ? action : undefined}
                />
            </Example>
        );
    }
}
