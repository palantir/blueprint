/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Errors from "../../src/common/errors";
import * as Keys from "../../src/common/keys";
import { Tab } from "../../src/components/tabs2/tab";
import { ITabsProps, ITabsState, Tabs } from "../../src/components/tabs2/tabs";
import { TabTitle } from "../../src/components/tabs2/tabTitle";

describe.only("<Tabs2>", () => {
    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("renders one TabTitle for each Tab", () => {
        const wrapper = mount(<Tabs>{getTabsContents()}</Tabs>);
        assert.lengthOf(wrapper.find("li"), 3);
    });

    it("only renders the active tab's children", () => {
        const wrapper = mount(<Tabs>{getTabsContents()}</Tabs>);
        for (let i = 0; i < 3; i++) {
            wrapper.setState({ selectedTabIndex: i });
            assert.lengthOf(wrapper.find("strong"), 1);
        }
    });

    it("clicking nested tab should not affect parent", () => {
        const wrapper = mount(
            <Tabs>
                {getTabsContents()}
                <Tab title="nested">
                    {getTabsContents()}
                </Tab>
            </Tabs>,
            { attachTo: testsContainerElement },
        );
        assert.equal(wrapper.state("selectedTabIndex"), 0);
        // last Tab is inside nested
        wrapper.find(Tab).last().simulate("click");
        assert.equal(wrapper.state("selectedTabIndex"), 0);
    });

    describe("when state is managed internally", () => {
        it("defaultSelectedTabIndex is initially selected", () => {
            const TAB_INDEX_TO_SELECT = 2;
            const wrapper = mount(
                <Tabs defaultSelectedTabIndex={TAB_INDEX_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.isTrue(findTabAt(wrapper, TAB_INDEX_TO_SELECT).prop("selected"));
        });

        it("does not reset selected tab to defaultSelectedTabIndex after a selection is made", () => {
            const TAB_INDEX_TO_SELECT = 2;
            const wrapper = mount(
                <Tabs defaultSelectedTabIndex={1}>
                    {getTabsContents()}
                </Tabs>,
            );
            findTabAt(wrapper, TAB_INDEX_TO_SELECT).simulate("click");
            wrapper.update();
            assert.isTrue(findTabAt(wrapper, TAB_INDEX_TO_SELECT).prop("selected"));
        });

        it("invokes onChange() callback", () => {
            const TAB_INDEX_TO_SELECT = 1;
            const onChangeSpy = sinon.spy();
            const wrapper = mount(
                <Tabs onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>,
            );

            findTabAt(wrapper, TAB_INDEX_TO_SELECT).simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            // previous selection is 0
            assert.isTrue(onChangeSpy.calledWith(TAB_INDEX_TO_SELECT, 0));
        });
    });

    // describe("when state is managed externally (selectedTabIndex prop is provided)", () => {
    //     it("prefers selectedTabIndex over defaultSelectedTabIndex", () => {
    //         const tabs = mount(
    //             <Tabs defaultSelectedTabIndex={1} selectedTabIndex={0}>
    //                 {getTabsContents()}
    //             </Tabs>,
    //         );
    //         assert.strictEqual(tabs.state("selectedTabIndex"), 0);
    //     });

    //     it("defaults to first tab if invalid index provided", () => {
    //         const tabs = mount(
    //             <Tabs selectedTabIndex={7}>
    //                 {getTabsContents()}
    //             </Tabs>,
    //         );

    //         assert.strictEqual(tabs.state("selectedTabIndex"), 0);
    //     });

    //     it("invokes onChange() callback", () => {
    //         const TAB_INDEX_TO_SELECT = 1;
    //         const onChangeSpy = sinon.spy();
    //         const tabs = mount(
    //             <Tabs selectedTabIndex={0} onChange={onChangeSpy}>
    //                 {getTabsContents()}
    //             </Tabs>,
    //         );

    //         tabs.ref(`tabs-${TAB_INDEX_TO_SELECT}`).simulate("click");
    //         assert.isTrue(onChangeSpy.calledOnce);
    //         // old selection is 0
    //         assert.isTrue(onChangeSpy.calledWith(TAB_INDEX_TO_SELECT, 0));
    //     });

    //     it("doesn't switch tabs automatically", () => {
    //         const TAB_INDEX_TO_SELECT = 1;
    //         const tabs = mount(
    //             <Tabs selectedTabIndex={0}>
    //                 {getTabsContents()}
    //             </Tabs>,
    //         );

    //         tabs.ref(`tabs-${TAB_INDEX_TO_SELECT}`).simulate("click");
    //         assert.strictEqual(tabs.state("selectedTabIndex"), 0);
    //     });

    //     it("does switch tabs if the user hooks up onChange() to do so", () => {
    //         const TAB_INDEX_TO_SELECT = 1;
    //         class TestComponent extends React.Component<{}, any> {
    //             public state = {
    //                 mySelectedTab: 0,
    //             };

    //             public render() {
    //                 return (
    //                     <Tabs selectedTabIndex={this.state.mySelectedTab} onChange={this.handleChange}>
    //                         {getTabsContents()}
    //                     </Tabs>
    //                 );
    //             }

    //             private handleChange = (selectedTabIndex: number) => {
    //                 this.setState({ mySelectedTab: selectedTabIndex });
    //             }
    //         }

    //         const wrapper = mount(<TestComponent />);
    //         wrapper.find(Tab).at(TAB_INDEX_TO_SELECT).simulate("click");
    //         assert.strictEqual(wrapper.find(TabPanel).text(), "second panel");
    //     });

    //     it("indicator moves correctly if tabs switch externally via the selectedTabIndex prop", (done) => {
    //         const TAB_INDEX_TO_SELECT = 1;
    //         const wrapper = mount(
    //             <Tabs selectedTabIndex={0}>
    //                 {getTabsContents()}
    //             </Tabs>,
    //             { attachTo: testsContainerElement },
    //         );
    //         wrapper.setProps({ selectedTabIndex: TAB_INDEX_TO_SELECT });
    //         // indicator moves via componentDidUpdate
    //         setTimeout(() => {
    //             assertIndicatorPosition(wrapper, TAB_INDEX_TO_SELECT);
    //             done();
    //         });
    //     });

    //     it("indicator moves correctly if the user switches tabs and Tab children change simulatenously", (done) => {
    //         const TAB_INDEX_TO_SELECT = 1;
    //         class TestComponent extends React.Component<{}, any> {
    //             public state = {
    //                 mySelectedTab: 0,
    //             };

    //             public render() {
    //                 return (
    //                     <Tabs selectedTabIndex={this.state.mySelectedTab} onChange={this.handleChange}>
    //                         {this.children()}
    //                     </Tabs>
    //                 );
    //             }

    //             private handleChange = (selectedTabIndex: number) => {
    //                 this.setState({ mySelectedTab: selectedTabIndex });
    //             }

    //             private children = () => [
    //                 <TabList key={0}>
    //                     <Tab>{this.state.mySelectedTab === 1 ? "first (unsaved)" : "first"}</Tab>
    //                     <Tab>second</Tab>
    //                 </TabList>,
    //                 <TabPanel key={1} />,
    //                 <TabPanel key={2} />,
    //             ]
    //         }
    //         const wrapper = mount(<TestComponent />, { attachTo: testsContainerElement });
    //         wrapper.find(Tab).at(TAB_INDEX_TO_SELECT).simulate("click");
    //         // indicator moves via componentDidUpdate
    //         setTimeout(() => {
    //             assertIndicatorPosition(wrapper, TAB_INDEX_TO_SELECT);
    //             done();
    //         });
    //     });
    // });

    function findTabAt(wrapper: ReactWrapper<ITabsProps, {}>, index: number) {
        return wrapper.find("li").at(index);
    }

    function assertIndicatorPosition(wrapper: ReactWrapper<ITabsProps, ITabsState>, selectedTabIndex: number) {
        const style = wrapper.state().indicatorWrapperStyle;
        assert.isDefined(style, "TabList should have a indicatorWrapperStyle prop set");
        const node = ReactDOM.findDOMNode(wrapper.instance());
        const expected = (node.queryAll(".pt-tab")[selectedTabIndex] as HTMLLIElement).offsetLeft;
        assert.isTrue(style.transform.indexOf(`${expected}px`) !== -1, "indicator has not moved correctly");
    }

    function getTabsContents(): Array<React.ReactElement<any>> {
        // keys are just to avoid React warnings; they're not used in tests
        return [
            // wrap content in a tag so we can `.find()` it
            <Tab key={0} title="first"><strong>first panel</strong></Tab>,
            <Tab key={1} title="second"><strong>second panel</strong></Tab>,
            <Tab key={2} title="third"><strong>third panel</strong></Tab>,
        ];
    }
});
