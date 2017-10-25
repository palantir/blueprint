/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { Switch, Tab, TabList, TabPanel, Tabs } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export class TabsExample extends BaseExample<{ isVertical?: boolean }> {
    public state = {
        isVertical: false,
    };

    private toggleIsVertical = handleBooleanChange(isVertical => this.setState({ isVertical }));

    protected renderExample() {
        return (
            <Tabs
                className={this.state.isVertical ? "pt-vertical" : null}
                key={this.state.isVertical ? "vertical" : "horizontal"}
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
                        Lots of people use React as the V in MVC. Since React makes no assumptions about the rest of
                        your technology stack, it's easy to try it out on a small feature in an existing project.
                    </p>
                </TabPanel>
                <TabPanel>
                    <h3>Example panel: Angular</h3>
                    <p className="pt-running-text">
                        HTML is great for declaring static documents, but it falters when we try to use it for declaring
                        dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your
                        application. The resulting environment is extraordinarily expressive, readable, and quick to
                        develop.
                    </p>
                </TabPanel>
                <TabPanel>
                    <h3>Example panel: Ember</h3>
                    <p className="pt-running-text">
                        Ember.js is an open-source JavaScript application framework, based on the model-view-controller
                        (MVC) pattern. It allows developers to create scalable single-page web applications by
                        incorporating common idioms and best practices into the framework. What is your favorite JS
                        framework?
                    </p>
                    <input className="pt-input" type="text" />
                </TabPanel>
                <TabPanel>
                    <h3>Backbone</h3>
                </TabPanel>
            </Tabs>
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
}
