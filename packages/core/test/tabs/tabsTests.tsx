/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { assert } from "chai";
import { ReactWrapper, mount } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Errors from "../../src/common/errors";
import * as Keys from "../../src/common/keys";
import { Tab, TabList, TabPanel, Tabs } from "../../src/index";

describe("<Tabs>", () => {
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("renders its template", () => {
        const wrapper = mount(
            <Tabs>
                {getTabsContents()}
            </Tabs>
        );

        assert.lengthOf(wrapper.find(Tab), 3);
        assert.lengthOf(wrapper.find(TabList), 1);
        assert.lengthOf(wrapper.find(TabPanel), 1);
    });

    it("throws error if TabList is not the first child", () => {
        assert.throws(() => mount(<Tabs><span/></Tabs>), Errors.TABS_FIRST_CHILD);
    });

    it("throws error if number of Tabs and TabPanels don't match", () => {
        assert.throws(() => mount(
            <Tabs>
                <TabList>
                    <Tab>foo</Tab>
                    <Tab>bar</Tab>
                </TabList>
                <TabPanel />
            </Tabs>
        ), Errors.TABS_MISMATCH);
    });

    it("changes tab focus when arrow keys are pressed", () => {
        const wrapper = mount(
            <Tabs>
                <TabList>
                    <Tab>foo</Tab>
                    <Tab isDisabled={true}>bar</Tab>
                    <Tab>bax</Tab>
                    <Tab isDisabled={true}>bar</Tab>
                </TabList>
                <TabPanel/>
                <TabPanel/>
                <TabPanel/>
                <TabPanel/>
            </Tabs>,
            { attachTo: testsContainerElement }
        );

        // tslint:disable-next-line:no-unused-variable
        const [tab0, tab1, tab2, tab3] = testsContainerElement.queryAll(".pt-tab");
        (tab0 as HTMLElement).focus();
        wrapper.simulate("keydown", { target: tab0, which: Keys.ARROW_RIGHT });
        assert.equal(tab2, document.activeElement);

        wrapper.simulate("keydown", { target: tab2, which: Keys.ARROW_RIGHT });
        assert.equal(tab2, document.activeElement);

        wrapper.simulate("keydown", { target: tab2, which: Keys.ARROW_LEFT });
        assert.equal(tab0, document.activeElement);

        wrapper.simulate("keydown", { target: tab0, which: Keys.ARROW_LEFT });
        assert.equal(tab0, document.activeElement);
    });

    it("only renders one TabPanel at a time", () => {
        const wrapper = mount(<Tabs>{getTabsContents()}</Tabs>);
        // always renders exactly one TabPanel
        for (let i = 0; i < 3; i++) {
            wrapper.setState({ selectedTabIndex: i });
            assert.lengthOf(wrapper.find(TabPanel), 1);
        }
    });

    describe("when state is managed internally", () => {
        it("sets initialSelectedTabIndex", () => {
            const TAB_INDEX_TO_SELECT = 2;
            const wrapper = mount(
                <Tabs initialSelectedTabIndex={TAB_INDEX_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>
            );
            assert.isTrue(wrapper.find(Tab).at(TAB_INDEX_TO_SELECT).prop("isSelected"));
        });

        it("invokes onChange() callback", () => {
            const TAB_INDEX_TO_SELECT = 1;
            const onChangeSpy = sinon.spy();
            const wrapper = mount(
                <Tabs onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>
            );

            wrapper.ref(`tabs-${TAB_INDEX_TO_SELECT}`).simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            // previous selection is 0
            assert.isTrue(onChangeSpy.calledWith(TAB_INDEX_TO_SELECT, 0));
        });
    });

    it("clicking nested tab should not affect parent", () => {
        const wrapper = mount(
            <Tabs initialSelectedTabIndex={0}>
                <TabList>
                    <Tab>React</Tab>
                    <Tab>Angular</Tab>
                    <Tab>Ember</Tab>
                </TabList>
                <TabPanel>
                    <Tabs>{getTabsContents()}</Tabs>
                </TabPanel>
                <TabPanel>
                    <Tabs>{getTabsContents()}</Tabs>
                </TabPanel>
                <TabPanel>
                    <Tabs>{getTabsContents()}</Tabs>
                </TabPanel>
            </Tabs>,
            { attachTo: testsContainerElement }
        );
        assert.equal(wrapper.state("selectedTabIndex"), 0);
        // 3 tabs in parent + 3 in child = 6 tabs. click last and verify unchanged
        wrapper.find(Tab).last().simulate("click");
        assert.equal(wrapper.state("selectedTabIndex"), 0);
    });

    describe("when state is managed externally (selectedTabIndex prop is provided)", () => {
        it("prefers selectedTabIndex over initialSelectedTabIndex", () => {
            const tabs = mount(
                <Tabs initialSelectedTabIndex={1} selectedTabIndex={0}>
                    {getTabsContents()}
                </Tabs>
            );
            assert.strictEqual(tabs.state("selectedTabIndex"), 0);
        });

        it("defaults to first tab if invalid index provided", () => {
            const tabs = mount(
                <Tabs selectedTabIndex={7}>
                    {getTabsContents()}
                </Tabs>
            );

            assert.strictEqual(tabs.state("selectedTabIndex"), 0);
        });

        it("invokes onChange() callback", () => {
            const TAB_INDEX_TO_SELECT = 1;
            const onChangeSpy = sinon.spy();
            const tabs = mount(
                <Tabs selectedTabIndex={0} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>
            );

            tabs.ref(`tabs-${TAB_INDEX_TO_SELECT}`).simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            // old selection is 0
            assert.isTrue(onChangeSpy.calledWith(TAB_INDEX_TO_SELECT, 0));
        });

        it("doesn't switch tabs automatically", () => {
            const TAB_INDEX_TO_SELECT = 1;
            const tabs = mount(
                <Tabs selectedTabIndex={0}>
                    {getTabsContents()}
                </Tabs>
            );

            tabs.ref(`tabs-${TAB_INDEX_TO_SELECT}`).simulate("click");
            assert.strictEqual(tabs.state("selectedTabIndex"), 0);
        });

        it("does switch tabs if the user hooks up onChange() to do so", () => {
            const TAB_INDEX_TO_SELECT = 1;
            class TestComponent extends React.Component<{}, any> {
                public state = {
                    mySelectedTab: 0,
                };

                public render() {
                    return (
                        <Tabs selectedTabIndex={this.state.mySelectedTab} onChange={this.handleChange}>
                            {getTabsContents()}
                        </Tabs>
                    );
                }

                private handleChange = (selectedTabIndex: number) => {
                    this.setState({ mySelectedTab: selectedTabIndex });
                }
            }

            const wrapper = mount(<TestComponent />);
            wrapper.find(Tab).at(TAB_INDEX_TO_SELECT).simulate("click");
            assert.strictEqual(wrapper.find(TabPanel).text(), "second panel");
        });

        it("indicator moves correctly if tabs switch externally via the selectedTabIndex prop", (done) => {
            const TAB_INDEX_TO_SELECT = 1;
            const wrapper = mount(
                <Tabs selectedTabIndex={0}>
                    {getTabsContents()}
                </Tabs>,
                { attachTo: testsContainerElement }
            );
            wrapper.setProps({ selectedTabIndex: TAB_INDEX_TO_SELECT });
            // indicator moves via componentDidUpdate
            setTimeout(() => {
                assertIndicatorPosition(wrapper, TAB_INDEX_TO_SELECT);
                done();
            });
        });

        it("indicator moves correctly if the user switches tabs and Tab children change simulatenously", (done) => {
            const TAB_INDEX_TO_SELECT = 1;
            class TestComponent extends React.Component<{}, any> {
                public state = {
                    mySelectedTab: 0,
                };

                public render() {
                    return (
                        <Tabs selectedTabIndex={this.state.mySelectedTab} onChange={this.handleChange}>
                            {this.children()}
                        </Tabs>
                    );
                }

                private handleChange = (selectedTabIndex: number) => {
                    this.setState({ mySelectedTab: selectedTabIndex });
                }

                private children = () => [
                    <TabList key={0}>
                        <Tab>{this.state.mySelectedTab === 1 ? "first (unsaved)" : "first"}</Tab>
                        <Tab>second</Tab>
                    </TabList>,
                    <TabPanel key={1} />,
                    <TabPanel key={2} />,
                ];
            }
            const wrapper = mount(<TestComponent />, { attachTo: testsContainerElement });
            wrapper.find(Tab).at(TAB_INDEX_TO_SELECT).simulate("click");
            // indicator moves via componentDidUpdate
            setTimeout(() => {
                assertIndicatorPosition(wrapper, TAB_INDEX_TO_SELECT);
                done();
            });
        });
    });

    function assertIndicatorPosition(wrapper: ReactWrapper<any, {}>, selectedTabIndex: number) {
        const style = wrapper.find(TabList).props().indicatorWrapperStyle;
        assert.isDefined(style, "TabList should have a indicatorWrapperStyle prop set");
        const node = ReactDOM.findDOMNode(wrapper.instance());
        const expected = (node.queryAll(".pt-tab")[selectedTabIndex] as HTMLLIElement).offsetLeft;
        assert.isTrue(style.transform.indexOf(`${expected}px`) !== -1, "indicator has not moved correctly");
    }

    function getTabsContents(): React.ReactElement<any>[] {
        // keys are just to avoid React warnings; they're not used in tests
        return [
            <TabList key={0}>
                <Tab>first</Tab>
                <Tab>second</Tab>
                <Tab>third</Tab>
            </TabList>,
            <TabPanel key={1}>
                first panel
            </TabPanel>,
            <TabPanel key={2}>
                second panel
            </TabPanel>,
            <TabPanel key={3}>
                third panel
            </TabPanel>,
        ];
    }
});
