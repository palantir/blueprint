/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
    NavbarGroup,
    NavbarHeading,
    Switch,
    Tab,
    type TabId,
    TabPanel,
    Tabs,
    TabsExpander,
} from "@blueprintjs/core";
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

import { PropCodeTooltip } from "../../common/propCodeTooltip";

const NAVBAR_PARENT_ID = "navbar";

export const TabsExample: React.FC<ExampleProps> = props => {
    const [activePanelOnly, setActivePanelOnly] = React.useState(false);
    const [animate, setAnimate] = React.useState(true);
    const [fill, setFill] = React.useState(true);
    const [large, setLarge] = React.useState(false);
    const [navbarTabId, setNavbarTabId] = React.useState<TabId>("Home");
    const [showIcon, setShowIcon] = React.useState(false);
    const [showTags, setShowTags] = React.useState(false);
    const [useRoundTags, setUseRoundTags] = React.useState(false);
    const [vertical, setVertical] = React.useState(false);

    const options = (
        <>
            <div>
                <H5>Appearance props</H5>
                <Switch checked={large} label="Large size" onChange={handleBooleanChange(setLarge)} />
                <Switch checked={animate} label="Animate tab indicator" onChange={handleBooleanChange(setAnimate)} />
                <H5>Behavior props</H5>
                <Switch
                    checked={activePanelOnly}
                    label="Render active tab panel only"
                    onChange={handleBooleanChange(setActivePanelOnly)}
                />
            </div>
            <div>
                <H5>Tab content props</H5>
                <PropCodeTooltip snippet="icon">
                    <Switch checked={showIcon} label="Show icon" onChange={handleBooleanChange(setShowIcon)} />
                </PropCodeTooltip>
                <PropCodeTooltip snippet="tagContent">
                    <Switch checked={showTags} label="Show tag" onChange={handleBooleanChange(setShowTags)} />
                </PropCodeTooltip>
                <PropCodeTooltip snippet={`tagProps={{ round: ${useRoundTags.toString()} }}`}>
                    <Switch
                        checked={useRoundTags}
                        disabled={!showTags}
                        label="Use round tags"
                        onChange={handleBooleanChange(setUseRoundTags)}
                    />
                </PropCodeTooltip>
            </div>
        </>
    );

    return (
        <Example className="docs-tabs-example" options={options} showOptionsBelowExample={true} {...props}>
            <Card style={{ width: "100%" }}>
                <H5>Tabs with passed panels, uncontrolled mode</H5>
                <Switch checked={vertical} label="Use vertical tabs" onChange={handleBooleanChange(setVertical)} />
                <Tabs
                    key={vertical ? "vertical" : "horizontal"}
                    animate={animate}
                    id="TabsExample"
                    large={large}
                    renderActiveTabPanelOnly={activePanelOnly}
                    vertical={vertical}
                >
                    <Tab id="rx" title="React" panel={<ReactPanel />} />
                    <Tab
                        id="ng"
                        panel={<AngularPanel />}
                        tagContent={showTags ? 10 : undefined}
                        tagProps={{ round: useRoundTags }}
                        title="Angular"
                    />
                    <Tab id="mb" panel={<EmberPanel />} panelClassName="ember-panel" title="Ember" />
                    <Tab disabled={true} id="bb" panel={<BackbonePanel />} title="Backbone" />
                    <TabsExpander />
                    <InputGroup fill={true} placeholder="Search..." type="text" />
                </Tabs>
            </Card>
            <Card style={{ width: "100%" }}>
                <H5>Tabs with separately rendered panels, controlled mode</H5>
                <Switch checked={fill} label="Fill height" onChange={handleBooleanChange(setFill)} />
                <div className={Classes.SECTION}>
                    <Navbar>
                        <NavbarGroup>
                            <NavbarHeading>
                                Page: <strong>{navbarTabId}</strong>
                            </NavbarHeading>
                        </NavbarGroup>
                        <NavbarGroup align={Alignment.END}>
                            <Tabs
                                animate={animate}
                                fill={fill}
                                id={NAVBAR_PARENT_ID}
                                large={large}
                                onChange={setNavbarTabId}
                                selectedTabId={navbarTabId}
                            >
                                <Tab icon={showIcon ? "home" : undefined} id="Home" title="Home" />
                                <Tab icon={showIcon ? "folder-open" : undefined} id="Files" title="Files" />
                                <Tab
                                    icon={showIcon ? "build" : undefined}
                                    id="Builds"
                                    tagContent={showTags ? 4 : undefined}
                                    tagProps={{ round: useRoundTags }}
                                    title="Builds"
                                />
                            </Tabs>
                        </NavbarGroup>
                    </Navbar>
                    <TabPanel
                        id={navbarTabId}
                        selectedTabId={navbarTabId}
                        parentId={NAVBAR_PARENT_ID}
                        panel={
                            <>
                                <H4>Example panel: {navbarTabId}</H4>
                                <p>The current panel is: "{navbarTabId}"</p>
                            </>
                        }
                    />
                </div>
            </Card>
        </Example>
    );
};

const ReactPanel = () => (
    <div>
        <H4>Example panel: React</H4>
        <p className={Classes.RUNNING_TEXT}>
            Lots of people use React as the V in MVC. Since React makes no assumptions about the rest of your technology
            stack, it's easy to try it out on a small feature in an existing project.
        </p>
    </div>
);

const AngularPanel = () => (
    <div>
        <H4>Example panel: Angular</H4>
        <p className={Classes.RUNNING_TEXT}>
            HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic
            views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting
            environment is extraordinarily expressive, readable, and quick to develop.
        </p>
    </div>
);

const EmberPanel = () => (
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

const BackbonePanel = () => (
    <div>
        <H4>Backbone</H4>
    </div>
);
