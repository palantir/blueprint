/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import {
    Alignment,
    Classes,
    H3,
    H5,
    InputGroup,
    Label,
    Navbar,
    Slider,
    Switch,
    Tab,
    TabId,
    Tabs,
} from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";

export interface ITabsExampleState {
    activePanelOnly: boolean;
    animate: boolean;
    navbarTabId: TabId;
    vertical: boolean;
    overflow: boolean;
    overflowWidth: number;
}

export class TabsExample extends React.PureComponent<IExampleProps, ITabsExampleState> {
    public state: ITabsExampleState = {
        activePanelOnly: false,
        animate: true,
        navbarTabId: "Home",
        overflow: false,
        overflowWidth: 100,
        vertical: false,
    };

    private toggleActiveOnly = handleBooleanChange(activePanelOnly => this.setState({ activePanelOnly }));
    private toggleAnimate = handleBooleanChange(animate => this.setState({ animate }));
    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));
    private toggleOverflow = handleBooleanChange(overflow => this.setState({ overflow }));

    public render() {
        const options = (
            <>
                <H5>Props</H5>
                <Switch checked={this.state.animate} label="Animate indicator" onChange={this.toggleAnimate} />
                <Switch checked={this.state.vertical} label="Use vertical tabs" onChange={this.toggleVertical} />
                <Switch
                    checked={this.state.activePanelOnly}
                    label="Render active tab panel only"
                    onChange={this.toggleActiveOnly}
                />
                <Switch checked={this.state.overflow} label="Overflow" onChange={this.toggleOverflow} />
                <Label>Overflow Width</Label>
                <Slider
                    labelRenderer={this.renderLabel}
                    labelStepSize={25}
                    max={100}
                    onChange={this.handleChangeWidth}
                    showTrackFill={false}
                    value={this.state.overflowWidth}
                />
            </>
        );

        return (
            <Example className="docs-tabs-example" options={options} {...this.props}>
                <Navbar>
                    <Navbar.Group>
                        <Navbar.Heading>
                            Current page: <strong>{this.state.navbarTabId}</strong>
                        </Navbar.Heading>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        {/* controlled mode & no panels (see h1 below): */}
                        <Tabs
                            animate={this.state.animate}
                            id="navbar"
                            large={true}
                            overflow={this.state.overflow}
                            onChange={this.handleNavbarTabChange}
                            selectedTabId={this.state.navbarTabId}
                        >
                            <Tab id="Home" title="Home" />
                            <Tab id="Files" title="Files" />
                            <Tab id="Builds" title="Builds" />
                        </Tabs>
                    </Navbar.Group>
                </Navbar>
                {/* uncontrolled mode & each Tab has a panel: */}
                <div style={{ width: `${this.state.overflowWidth}%`, marginRight: "auto" }}>
                    <Tabs
                        animate={this.state.animate}
                        id="TabsExample"
                        key={this.state.vertical ? "vertical" : "horizontal"}
                        renderActiveTabPanelOnly={this.state.activePanelOnly}
                        vertical={this.state.vertical}
                        overflow={this.state.overflow}
                        overflowListProps={{ collapseFrom: "start" }}
                    >
                        <Tab id="rx" title="React" panel={<ReactPanel />} />
                        <Tab id="ng" title="Angular" panel={<AngularPanel />} />
                        <Tab id="mb" title="Ember" panel={<EmberPanel />} />
                        <Tab id="bb" title="Backbone" panel={<BackbonePanel />} />
                        <Tabs.Expander />
                        <InputGroup type="text" placeholder="Search..." />
                    </Tabs>
                </div>
            </Example>
        );
    }

    private renderLabel(value: number) {
        return `${value}%`;
    }

    private handleChangeWidth = (overflowWidth: number) => this.setState({ overflowWidth });
    private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });
}

const ReactPanel: React.SFC<{}> = () => (
    <div>
        <H3>Example panel: React</H3>
        <p className={Classes.RUNNING_TEXT}>
            Lots of people use React as the V in MVC. Since React makes no assumptions about the rest of your technology
            stack, it's easy to try it out on a small feature in an existing project.
        </p>
    </div>
);

const AngularPanel: React.SFC<{}> = () => (
    <div>
        <H3>Example panel: Angular</H3>
        <p className={Classes.RUNNING_TEXT}>
            HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic
            views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting
            environment is extraordinarily expressive, readable, and quick to develop.
        </p>
    </div>
);

const EmberPanel: React.SFC<{}> = () => (
    <div>
        <H3>Example panel: Ember</H3>
        <p className={Classes.RUNNING_TEXT}>
            Ember.js is an open-source JavaScript application framework, based on the model-view-controller (MVC)
            pattern. It allows developers to create scalable single-page web applications by incorporating common idioms
            and best practices into the framework. What is your favorite JS framework?
        </p>
        <input className={Classes.INPUT} type="text" />
    </div>
);

const BackbonePanel: React.SFC<{}> = () => (
    <div>
        <H3>Backbone</H3>
    </div>
);
