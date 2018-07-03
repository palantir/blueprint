/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    Button,
    Intent,
    IPanel,
    IPanelProps,
    PanelStack,
    Tag,
} from "@blueprintjs/core";

export interface IPanelStackExampleState {
    currentPanelStack: IPanel[];
}

export class PanelStackExample extends React.PureComponent {
    public initialPanel: IPanel = {
        component: PanelExample,
        title: "Panel 1",
        props: {
            panelNumber: 1,
        },
    };

    public state = {
        currentPanelStack: [this.initialPanel],
    };

    public render() {
        return (
            <div className="docs-panelstack-container">
                <PanelStack
                    className="docs-panelstack-example"
                    initialPanel={this.state.currentPanelStack[0]}
                    onOpen={this.addToPanelStack}
                    onClose={this.removeFromPanelStack}
                />
                <div className="docs-panelstack-tags-container">
                    <h5> Current Panels </h5>
                    <div className="docs-panelstack-tags">
                        {this.state.currentPanelStack.map(this.renderPanel)}
                    </div>
                </div>
            </div>
        );
    }

    private renderPanel(panel: IPanel) {
        return <Tag className="docs-panelstack-tag" key={panel.title}>{panel.title}</Tag>
    }

    private addToPanelStack = (newPanel: IPanel) => {
        this.setState({ currentPanelStack: [ newPanel, ...this.state.currentPanelStack] });
    }

    private removeFromPanelStack = () => {
        this.setState({ currentPanelStack: this.state.currentPanelStack.slice(1) });
    }
}

export interface IPanelExampleProps {
    panelNumber: number;
}

class PanelExample extends React.PureComponent<IPanelProps & IPanelExampleProps> {
    public render() {
        return (
            <div className="docs-panelstack-contents-example">
                <Button intent={Intent.PRIMARY} onClick={this.openNewPanel} text="Open New Panel" />
            </div>
        );
    }

    private openNewPanel = () => {
        let newPanelNumber = this.props.panelNumber;
        ++newPanelNumber;
        this.props.openPanel(PanelExample, { panelNumber: newPanelNumber }, { title: "Panel " + newPanelNumber });
    }
}
