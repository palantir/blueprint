/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as React from "react";

import { Classes, Switch, Tab2, Tabs2 } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface ITabs2ExampleState {
    activeTabId?: string;
    activePanelOnly?: boolean;
    animate?: boolean;
    navbarTabId?: string;
    vertical?: boolean;
}

export class Tabs2Example extends BaseExample<ITabs2ExampleState> {
    public state: ITabs2ExampleState = {
        activePanelOnly: false,
        animate: true,
        navbarTabId: "Home",
        vertical: false,
    };

    private toggleActiveOnly = handleBooleanChange((activePanelOnly) => this.setState({ activePanelOnly }));
    private toggleAnimate = handleBooleanChange((animate) => this.setState({ animate }));
    private toggleVertical = handleBooleanChange((vertical) => this.setState({ vertical }));

    protected renderExample() {
        return (
            <div className="docs-tabs2-example">
                <div className={Classes.NAVBAR}>
                    <div className={classNames(Classes.NAVBAR_GROUP, Classes.ALIGN_LEFT)}>
                        <div className={Classes.NAVBAR_HEADING}>Tabs Example</div>
                    </div>
                    <div className={classNames(Classes.NAVBAR_GROUP, Classes.ALIGN_LEFT)}>
                        {/* controlled mode & no panels (see h1 below): */}
                        <Tabs2
                            animate={this.state.animate}
                            id="navbar"
                            onChange={this.handleNavbarTabChange}
                            selectedTabId={this.state.navbarTabId}
                        >
                            <Tab2 id="Home" title="Home" />
                            <Tab2 id="Files" title="Files" />
                            <Tab2 id="Builds" title="Builds" />
                        </Tabs2>
                    </div>
                </div>
                <h1 style={{ marginTop: 30, marginBottom: 30 }}>{this.state.navbarTabId}</h1>
                {/* uncontrolled mode & each Tab has a panel: */}
                <Tabs2
                    animate={this.state.animate}
                    id="Tabs2Example"
                    key={this.state.vertical ? "vertical" : "horizontal"}
                    onChange={this.handleTabChange}
                    renderActiveTabPanelOnly={this.state.activePanelOnly}
                    vertical={this.state.vertical}
                >
                    <Tab2 id="rx" title="React" panel={<ReactPanel />} />
                    <Tab2 id="ng" title="Angular" panel={<AngularPanel />} />
                    <Tab2 id="mb" title="Ember" panel={<EmberPanel />} />
                    <Tab2 id="bb" disabled title="Backbone" panel={<BackbonePanel />} />
                    <Tabs2.Expander />
                    <input className="pt-input" type="text" placeholder="Search..." />
                </Tabs2>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.animate}
                    label="Animate indicator"
                    key="animate"
                    onChange={this.toggleAnimate}
                />,
                <Switch
                    checked={this.state.vertical}
                    label="Use vertical tabs"
                    key="vertical"
                    onChange={this.toggleVertical}
                />,
                <Switch
                    checked={this.state.activePanelOnly}
                    label="Render active tab panel only"
                    key="active"
                    onChange={this.toggleActiveOnly}
                />,
            ],
        ];
    }

    private handleNavbarTabChange = (navbarTabId: string) => this.setState({ navbarTabId });
    private handleTabChange = (activeTabId: string) => this.setState({ activeTabId });
}

const ReactPanel: React.SFC<{}> = () => (
    <div>
        <h3>Example panel: React</h3>
        <p className="pt-running-text">
            Lots of people use React as the V in MVC. Since React makes no assumptions about the
            rest of your technology stack, it's easy to try it out on a small feature in an existing
            project.
        </p>
    </div>
);

const AngularPanel: React.SFC<{}> = () => (
    <div>
        <h3>Example panel: Angular</h3>
        <p className="pt-running-text">
            HTML is great for declaring static documents, but it falters when we try to use it for
            declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary
            for your application. The resulting environment is extraordinarily expressive, readable,
            and quick to develop.
        </p>
    </div>
);

const EmberPanel: React.SFC<{}> = () => (
    <div>
        <h3>Example panel: Ember</h3>
        <p className="pt-running-text">
            Ember.js is an open-source JavaScript application framework, based on the
            model-view-controller (MVC) pattern. It allows developers to create scalable single-page
            web applications by incorporating common idioms and best practices into the framework.
            What is your favorite JS framework?
        </p>
        <input className="pt-input" type="text" />
    </div>
);

const BackbonePanel: React.SFC<{}> = () => (
    <div>
        <h3>Backbone</h3>
    </div>
);
