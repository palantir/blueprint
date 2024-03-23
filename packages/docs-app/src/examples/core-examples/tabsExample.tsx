/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import {
    Alignment,
    Card,
    Classes,
    H4,
    H5,
    InputGroup,
    Navbar,
    Switch,
    Tab,
    type TabId,
    Tabs,
    TabsExpander,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

export interface TabsExampleState {
    activePanelOnly: boolean;
    animate: boolean;
    fill: boolean;
    large: boolean;
    navbarTabId: TabId;
    showIcon: boolean;
    showTags: boolean;
    useRoundTags: boolean;
    vertical: boolean;
}

export class TabsExample extends React.PureComponent<ExampleProps, TabsExampleState> {
    public state: TabsExampleState = {
        activePanelOnly: false,
        animate: true,
        fill: true,
        large: false,
        navbarTabId: "Home",
        showIcon: false,
        showTags: false,
        useRoundTags: false,
        vertical: false,
    };

    private toggleActiveOnly = handleBooleanChange(activePanelOnly => this.setState({ activePanelOnly }));

    private toggleAnimate = handleBooleanChange(animate => this.setState({ animate }));

    private toggleLarge = handleBooleanChange(large => this.setState({ large }));

    private toggleFill = handleBooleanChange(fill => this.setState({ fill }));

    private toggleIcon = handleBooleanChange(icon => this.setState({ showIcon: icon }));

    private toggleRoundTags = handleBooleanChange(useRoundTags => this.setState({ useRoundTags }));

    private toggleTag = handleBooleanChange(tag => this.setState({ showTags: tag }));

    private toggleVertical = handleBooleanChange(vertical => this.setState({ vertical }));

    public render() {
        const options = (
            <>
                <div>
                    <H5>Appearance props</H5>
                    <Switch checked={this.state.large} label="Large size" onChange={this.toggleLarge} />
                    <Switch checked={this.state.animate} label="Animate tab indicator" onChange={this.toggleAnimate} />
                    <H5>Behavior props</H5>
                    <Switch
                        checked={this.state.activePanelOnly}
                        label="Render active tab panel only"
                        onChange={this.toggleActiveOnly}
                    />
                </div>
                <div>
                    <H5>Tab content props</H5>
                    <PropCodeTooltip snippet="icon">
                        <Switch checked={this.state.showIcon} label="Show icon" onChange={this.toggleIcon} />
                    </PropCodeTooltip>
                    <PropCodeTooltip snippet="tagContent">
                        <Switch checked={this.state.showTags} label="Show tag" onChange={this.toggleTag} />
                    </PropCodeTooltip>
                    <PropCodeTooltip snippet={`tagProps={{ round: ${this.state.useRoundTags.toString()} }}`}>
                        <Switch
                            disabled={!this.state.showTags}
                            checked={this.state.useRoundTags}
                            label="Use round tags"
                            onChange={this.toggleRoundTags}
                        />
                    </PropCodeTooltip>
                </div>
            </>
        );

        return (
            <Example className="docs-tabs-example" options={options} showOptionsBelowExample={true} {...this.props}>
                <Card style={{ width: "100%" }}>
                    <H5>Tabs without panels, controlled mode</H5>
                    <Switch checked={this.state.fill} label="Fill height" onChange={this.toggleFill} />
                    <Navbar>
                        <Navbar.Group>
                            <Navbar.Heading>
                                Page: <strong>{this.state.navbarTabId}</strong>
                            </Navbar.Heading>
                        </Navbar.Group>
                        <Navbar.Group align={Alignment.RIGHT}>
                            <Tabs
                                animate={this.state.animate}
                                fill={this.state.fill}
                                id="navbar"
                                large={this.state.large}
                                onChange={this.handleNavbarTabChange}
                                selectedTabId={this.state.navbarTabId}
                            >
                                <Tab id="Home" title="Home" icon={this.state.showIcon ? "home" : undefined} />
                                <Tab id="Files" title="Files" icon={this.state.showIcon ? "folder-open" : undefined} />
                                <Tab
                                    id="Builds"
                                    title="Builds"
                                    icon={this.state.showIcon ? "build" : undefined}
                                    tagContent={this.state.showTags ? 4 : undefined}
                                    tagProps={{ round: this.state.useRoundTags }}
                                />
                            </Tabs>
                        </Navbar.Group>
                    </Navbar>
                </Card>
                <Card>
                    <H5>Tabs with panels, uncontrolled mode</H5>
                    <Switch checked={this.state.vertical} label="Use vertical tabs" onChange={this.toggleVertical} />
                    <Tabs
                        animate={this.state.animate}
                        id="TabsExample"
                        key={this.state.vertical ? "vertical" : "horizontal"}
                        large={this.state.large}
                        renderActiveTabPanelOnly={this.state.activePanelOnly}
                        vertical={this.state.vertical}
                    >
                        <Tab id="rx" title="React" panel={<ReactPanel />} />
                        <Tab
                            id="ng"
                            title="Angular"
                            panel={<AngularPanel />}
                            tagContent={this.state.showTags ? 10 : undefined}
                            tagProps={{ round: this.state.useRoundTags }}
                        />
                        <Tab id="mb" title="Ember" panel={<EmberPanel />} panelClassName="ember-panel" />
                        <Tab id="bb" disabled={true} title="Backbone" panel={<BackbonePanel />} />
                        <TabsExpander />
                        <InputGroup fill={true} type="text" placeholder="Search..." />
                    </Tabs>
                </Card>
            </Example>
        );
    }

    private handleNavbarTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });
}

const ReactPanel: React.FC = () => (
    <div>
        <H4>Example panel: React</H4>
        <p className={Classes.RUNNING_TEXT}>
            Lots of people use React as the V in MVC. Since React makes no assumptions about the rest of your technology
            stack, it's easy to try it out on a small feature in an existing project.
        </p>
    </div>
);

const AngularPanel: React.FC = () => (
    <div>
        <H4>Example panel: Angular</H4>
        <p className={Classes.RUNNING_TEXT}>
            HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic
            views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting
            environment is extraordinarily expressive, readable, and quick to develop.
        </p>
    </div>
);

const EmberPanel: React.FC = () => (
    <div>
        <H4>Example panel: Ember</H4>
        <p className={Classes.RUNNING_TEXT}>
            Ember.js is an open-source JavaScript application framework, based on the model-view-controller (MVC)
            pattern. It allows developers to create scalable single-page web applications by incorporating common idioms
            and best practices into the framework. What is your favorite JS framework?
        </p>
        <input className={Classes.INPUT} type="text" />
    </div>
);

const BackbonePanel: React.FC = () => (
    <div>
        <H4>Backbone</H4>
    </div>
);
