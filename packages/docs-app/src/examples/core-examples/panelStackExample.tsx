/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, H5, Intent, IPanel, IPanelProps, PanelStack, Tag } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export interface IPanelStackExampleState {
    currentPanelStack: IPanel[];
}

export class PanelStackExample extends React.PureComponent<IExampleProps> {
    public initialPanel: IPanel = {
        component: PanelExample,
        props: {
            panelNumber: 1,
        },
        title: "Panel 1",
    };

    public state = {
        currentPanelStack: [this.initialPanel],
    };

    public render() {
        return (
            <Example options={false} {...this.props}>
                <div className="docs-panel-stack-container">
                    <PanelStack
                        className="docs-panel-stack-example"
                        initialPanel={this.state.currentPanelStack[0]}
                        onOpen={this.addToPanelStack}
                        onClose={this.removeFromPanelStack}
                    />
                </div>
                <div className="docs-panel-stack-tags-container">
                    <H5> Current Panel Stack </H5>
                    <div className="docs-panel-stack-tags">{this.state.currentPanelStack.map(this.renderPanel)}</div>
                </div>
            </Example>
        );
    }

    private renderPanel(panel: IPanel) {
        return (
            <Tag className="docs-panel-stack-single-tag" key={panel.title}>
                {panel.title}
            </Tag>
        );
    }

    private addToPanelStack = (newPanel: IPanel) => {
        this.setState({ currentPanelStack: [newPanel, ...this.state.currentPanelStack] });
    };

    private removeFromPanelStack = () => {
        this.setState({ currentPanelStack: this.state.currentPanelStack.slice(1) });
    };
}

interface IPanelExampleProps {
    panelNumber: number;
}

// tslint:disable-next-line:max-classes-per-file
class PanelExample extends React.PureComponent<IPanelProps & IPanelExampleProps> {
    public render() {
        return (
            <div className="docs-panel-stack-contents-example">
                <Button
                    disabled={this.props.panelNumber >= 20}
                    intent={Intent.PRIMARY}
                    onClick={this.openNewPanel}
                    text="Open New Panel"
                />
            </div>
        );
    }

    private openNewPanel = () => {
        let newPanelNumber = this.props.panelNumber;
        ++newPanelNumber;
        this.props.openPanel(PanelExample, { panelNumber: newPanelNumber }, { title: "Panel " + newPanelNumber });
    };
}
