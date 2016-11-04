/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { Button, EditableText, Switch, Tab, TabList, TabPanel, Tabs } from "@blueprint/core";
import * as React from "react";

import BaseExample, { handleBooleanChange } from "./baseExample";

interface ITabsExampleState {
    isVertical?: boolean;
    report?: string;
    selectedTabIndex?: number;
};

export class TabsExample extends BaseExample<ITabsExampleState> {
    public state = {
        isVertical: false,
        report: "Fixes bug #93. Does not reproduce in Firefox, but please test in IE11 and ",
        selectedTabIndex: 0,
    };

    private toggleIsVertical = handleBooleanChange((isVertical) => this.setState({ isVertical }));

    protected renderExample() {
        return (
            <div>
                <h2>Uncontrolled</h2>
                <Tabs
                    className={this.state.isVertical ? "pt-vertical" : null}
                    key={this.state.isVertical ? "vertical-uncontrolled" : "horizontal-uncontrolled"}
                >
                    <TabList>
                        <Tab>React</Tab>
                        <Tab>Angular</Tab>
                        <Tab>Ember</Tab>
                        <Tab isDisabled={true}>Backbone</Tab>
                    </TabList>
                    <TabPanel>
                        <h3>Example panel: React</h3>
                        <p className="pt-running-text">
                            Lots of people use React as the V in MVC. Since React makes no assumptions about the
                            rest of your technology stack, it's easy to try it out on a small feature in an existing
                            project.
                        </p>
                    </TabPanel>
                    <TabPanel>
                        <h3>Example panel: Angular</h3>
                        <p className="pt-running-text">
                            HTML is great for declaring static documents, but it falters when we try to use it for
                            declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary
                            for your application. The resulting environment is extraordinarily expressive, readable,
                            and quick to develop.
                        </p>
                    </TabPanel>
                    <TabPanel>
                        <h3>Example panel: Ember</h3>
                        <p className="pt-running-text">
                            Ember.js is an open-source JavaScript application framework, based on the
                            model-view-controller (MVC) pattern. It allows developers to create scalable single-page
                            web applications by incorporating common idioms and best practices into the framework.
                            What is your favorite JS framework?
                        </p>
                        <input className="pt-input" type="text"/>
                    </TabPanel>
                    <TabPanel>
                        <h3>Backbone</h3>
                    </TabPanel>
                </Tabs>
                <br /><br />
                <h2>Controlled</h2>
                <Tabs
                    className={this.state.isVertical ? "pt-vertical" : null}
                    key={this.state.isVertical ? "vertical-controlled" : "horizontal-controlled"}
                    onChange={this.handleChange}
                    selectedTabIndex={this.state.selectedTabIndex}
                >
                    <TabList>
                        <Tab>{this.state.selectedTabIndex === 1 ? "Write (Unsaved)" : "Write"}</Tab>
                        <Tab>Preview</Tab>
                    </TabList>
                    <TabPanel>
                        <h3>Write panel</h3>
                        <div style={{ width: 300 }}>
                            <EditableText
                                onChange={this.handleReportChange}
                                placeholder="Leave a comment"
                                value={this.state.report}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h3>Preview panel</h3>
                        <div style={{ width: 300 }}>
                            <EditableText
                                disabled={true}
                                maxLines={3}
                                minLines={3}
                                multiline
                                placeholder="Nothing to preview"
                                value={this.state.report}
                            />
                        </div>
                    </TabPanel>
                </Tabs>
                <br />
                <Button onClick={this.handleClick} text="Change tab externally"/>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.isVertical}
                    label="Use vertical tabs"
                    key="Vertical"
                    onChange={this.toggleIsVertical}
                />,
            ],
        ];
    }

    private handleClick = () => {
        this.setState({ selectedTabIndex: (this.state.selectedTabIndex + 1) % 2 });
    }

    private handleChange = (selectedTabIndex: number) => {
        this.setState({ selectedTabIndex });
    }

    private handleReportChange = (report: string) => this.setState({ report });
}
