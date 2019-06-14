/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { Button, H5, Intent, IPanel, IPanelProps, PanelStack, Switch, UL } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IPanelStackExampleState {
    currentPanelStack: IPanel[];
    showHeader: boolean;
}

export class PanelStackExample extends React.PureComponent<IExampleProps, IPanelStackExampleState> {
    public initialPanel: IPanel = {
        component: PanelExample,
        props: {
            panelNumber: 1,
        },
        title: "Panel 1",
    };

    public state = {
        currentPanelStack: [this.initialPanel],
        showHeader: true,
    };

    private handleHeaderChange = handleBooleanChange((showHeader: boolean) => this.setState({ showHeader }));

    public render() {
        const stackList = (
            <>
                <Switch checked={this.state.showHeader} label="Show panel header" onChange={this.handleHeaderChange} />
                <H5>Current stack</H5>
                <UL>
                    {this.state.currentPanelStack.map((p, i) => (
                        <li key={i}>{p.title}</li>
                    ))}
                </UL>
            </>
        );
        return (
            <Example options={stackList} {...this.props}>
                <PanelStack
                    className="docs-panel-stack-example"
                    initialPanel={this.state.currentPanelStack[0]}
                    onOpen={this.addToPanelStack}
                    onClose={this.removeFromPanelStack}
                    showPanelHeader={this.state.showHeader}
                />
            </Example>
        );
    }

    private addToPanelStack = (newPanel: IPanel) => {
        this.setState(state => ({ currentPanelStack: [newPanel, ...state.currentPanelStack] }));
    };

    private removeFromPanelStack = (_lastPanel: IPanel) => {
        // In this example, the last panel is always the one closed.
        // Using `this.props.closePanel()` is one way to violate this.
        this.setState(state => ({ currentPanelStack: state.currentPanelStack.slice(1) }));
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
                <Button intent={Intent.PRIMARY} onClick={this.openNewPanel} text="Open new panel" />
            </div>
        );
    }

    private openNewPanel = () => {
        const panelNumber = this.props.panelNumber + 1;
        this.props.openPanel({
            component: PanelExample,
            props: { panelNumber },
            title: `Panel ${panelNumber}`,
        });
    };
}
