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

import * as Keys from "../../src/common/keys";
import { Tab2 } from "../../src/components/tabs2/tab2";
import { ITabs2Props, ITabs2State, Tabs2 } from "../../src/components/tabs2/tabs2";

describe("<Tabs2>", () => {
    const ID = "tabsTests";
    // default tabs content is generated from these IDs in each test
    const TAB_IDS = ["first", "second", "third"];

    // selectors using ARIA role
    const TAB = "[role='tab']";
    const TAB_LIST = "[role='tablist']";
    const TAB_PANEL = "[role='tabpanel']";

    let testsContainerElement: HTMLElement;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => testsContainerElement.remove());

    it("gets by without children", () => {
        assert.doesNotThrow(() => mount(<Tabs2 id="childless" />));
    });

    it("supports non-existent children", () => {
        assert.doesNotThrow(() => mount(
            <Tabs2 id={ID}>
                {null}
                <Tab2 id="one" />
                {undefined}
                <Tab2 id="two" />
            </Tabs2>,
        ));
    });

    it("default selectedTabId is first non-null Tab id", () => {
        const wrapper = mount(
            <Tabs2 id={ID}>
                {null}
                {<button id="btn" />}
                {getTabsContents()}
            </Tabs2>,
        );
        assert.lengthOf(wrapper.find(TAB), 3);
        assert.strictEqual(wrapper.state("selectedTabId"), TAB_IDS[0]);
    });

    it("renders one TabTitle for each Tab", () => {
        const wrapper = mount(<Tabs2 id={ID}>{getTabsContents()}</Tabs2>);
        assert.lengthOf(wrapper.find(TAB), 3);
    });

    it("renders all Tab children, but active is not aria-hidden", () => {
        const activeIndex = 1;
        const wrapper = mount(<Tabs2 id={ID}>{getTabsContents()}</Tabs2>);
        wrapper.setState({ selectedTabId: TAB_IDS[activeIndex] });
        const tabs = wrapper.find(TAB_PANEL);
        assert.lengthOf(tabs, 3);
        for (let i = 0; i < TAB_IDS.length; i++) {
            // hidden unless it is active
            assert.equal(tabs.at(i).prop("aria-hidden"), i !== activeIndex);
        }
    });

    it("renderActiveTabPanelOnly only renders active tab panel", () => {
        const wrapper = mount(<Tabs2 id={ID} renderActiveTabPanelOnly>{getTabsContents()}</Tabs2>);
        for (const selectedTabId of TAB_IDS) {
            wrapper.setState({ selectedTabId });
            assert.lengthOf(wrapper.find("strong"), 1);
        }
    });

    it("sets aria-* attributes with matching IDs", () => {
        const wrapper = mount(<Tabs2 id={ID}>{getTabsContents()}</Tabs2>);
        wrapper.find(TAB).forEach((title) => {
            // title "controls" tab element
            const titleControls = title.prop("aria-controls");
            const tab = wrapper.find(`#${titleControls}`);
            // tab element "labelled by" title element
            assert.isTrue(tab.is(TAB_PANEL), "aria-controls isn't TAB_PANEL");
            assert.deepEqual(tab.prop("aria-labelledby"), title.prop("id"), "mismatched IDs");
        });
    });

    it("clicking selected tab still fires onChange", () => {
        const tabId = TAB_IDS[0];
        const changeSpy = sinon.spy();
        const wrapper = mount(
            <Tabs2 defaultSelectedTabId={tabId} id={ID} onChange={changeSpy}>{getTabsContents()}</Tabs2>,
            { attachTo: testsContainerElement },
        );
        findTabById(wrapper, tabId).simulate("click");
        assert.isTrue(changeSpy.calledWith(tabId, tabId));
    });

    it("clicking nested tab should not affect parent", () => {
        const changeSpy = sinon.spy();
        const wrapper = mount(
            <Tabs2 id={ID} onChange={changeSpy}>
                {getTabsContents()}
                <Tabs2 id="nested">
                    <Tab2 id="last" title="Click me" />
                </Tabs2>
            </Tabs2>,
            { attachTo: testsContainerElement },
        );
        assert.equal(wrapper.state("selectedTabId"), TAB_IDS[0]);
        // last Tab is inside nested
        wrapper.find(TAB).last().simulate("click");
        assert.equal(wrapper.state("selectedTabId"), TAB_IDS[0]);
        assert.isTrue(changeSpy.notCalled, "onChange invoked");
    });

    it("changes tab focus when arrow keys are pressed", () => {
        const wrapper = mount(
            <Tabs2 id={ID}>
                <Tab2 id="first" title="First" panel={<Panel title="first" />} />,
                <Tab2 disabled id="second" title="Second" panel={<Panel title="second" />} />,
                <Tab2 id="third" title="Third" panel={<Panel title="third" />} />,
            </Tabs2>,
            { attachTo: testsContainerElement },
        );

        const tabList = wrapper.find(TAB_LIST);
        const tabElements = testsContainerElement.queryAll(TAB);
        (tabElements[0] as HTMLElement).focus();

        tabList.simulate("keydown", { which: Keys.ARROW_RIGHT });
        assert.equal(document.activeElement, tabElements[2], "move right and skip disabled");
        tabList.simulate("keydown", { which: Keys.ARROW_RIGHT });
        assert.equal(document.activeElement, tabElements[0], "wrap around to first tab");
        tabList.simulate("keydown", { which: Keys.ARROW_LEFT });
        assert.equal(document.activeElement, tabElements[2], "wrap around to last tab");
        tabList.simulate("keydown", { which: Keys.ARROW_LEFT });
        assert.equal(document.activeElement, tabElements[0], "move left and skip disabled");
    });

    it("enter and space keys click focused tab", () => {
        const changeSpy = sinon.spy();
        const wrapper = mount(
            <Tabs2 id={ID} onChange={changeSpy}>{getTabsContents()}</Tabs2>,
            { attachTo: testsContainerElement },
        );
        const tabList = wrapper.find(TAB_LIST);
        const tabElements = testsContainerElement.queryAll(TAB);

        // must target different elements each time as onChange is only called when id changes
        tabList.simulate("keypress", { target: tabElements[1], which: Keys.ENTER });
        tabList.simulate("keypress", { target: tabElements[2], which: Keys.SPACE });

        assert.equal(changeSpy.callCount, 2);
        assert.deepEqual(changeSpy.args, [
            [TAB_IDS[1], TAB_IDS[0]],
            [TAB_IDS[2], TAB_IDS[1]],
        ]);
    });

    it("animate=false removes moving indicator element", () => {
        const wrapper = mount(<Tabs2 id={ID} animate={false}>{getTabsContents()}</Tabs2>);
        assertIndicatorPosition(wrapper, TAB_IDS[0]);
        assert.equal(wrapper.find(".pt-tab-indicator").length, 0);
    });

    describe("when state is managed internally", () => {
        const TAB_ID_TO_SELECT = TAB_IDS[1];

        it("defaultSelectedTabId is initially selected", () => {
            const wrapper = mount(
                <Tabs2 id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs2>,
            );
            assert.isTrue(findTabById(wrapper, TAB_ID_TO_SELECT).prop("selected"));
        });

        it("unknown tab ID hides moving indicator element", () => {
            const wrapper = mount(<Tabs2 id={ID} defaultSelectedTabId="unknown">{getTabsContents()}</Tabs2>);
            const style = wrapper.state().indicatorWrapperStyle;
            assert.deepEqual(style, { display: "none" });
        });

        it("does not reset selected tab to defaultSelectedTabId after a selection is made", () => {
            const wrapper = mount(
                <Tabs2 id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs2>,
            );
            findTabById(wrapper, TAB_ID_TO_SELECT).simulate("click");
            wrapper.update();
            assert.isTrue(findTabById(wrapper, TAB_ID_TO_SELECT).prop("selected"));
        });

        it("invokes onChange() callback", () => {
            const onChangeSpy = sinon.spy();
            const wrapper = mount(
                <Tabs2 id={ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs2>,
            );

            findTabById(wrapper, TAB_ID_TO_SELECT).simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            // initial selection is first tab
            assert.isTrue(onChangeSpy.calledWith(TAB_ID_TO_SELECT, TAB_IDS[0]));
        });

        it("moves indicator as expected", () => {
            const wrapper = mount(<Tabs2 id={ID}>{getTabsContents()}</Tabs2>);
            assertIndicatorPosition(wrapper, TAB_IDS[0]);

            wrapper.setProps({ selectedTabId: TAB_ID_TO_SELECT });
            assertIndicatorPosition(wrapper, TAB_ID_TO_SELECT);
        });
    });

    describe("when state is managed externally (selectedTabId prop is provided)", () => {
        const TAB_ID_TO_SELECT = TAB_IDS[1];
        const SELECTED_TAB_ID = TAB_IDS[2];

        it("prefers selectedTabId over defaultSelectedTabId", () => {
            const tabs = mount(
                <Tabs2 id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs2>,
            );
            assert.strictEqual(tabs.state("selectedTabId"), SELECTED_TAB_ID);
        });

        it("selects nothing if invalid id provided", () => {
            const tabs = mount(
                <Tabs2 id={ID} selectedTabId="unknown">
                    {getTabsContents()}
                </Tabs2>,
            );

            assert.strictEqual(tabs.state("selectedTabId"), "unknown");
            assert.isTrue(tabs.find("[aria-selected=true]").isEmpty(), "a tab was selected");
        });

        it("invokes onChange() callback but does not change state", () => {
            const onChangeSpy = sinon.spy();
            const tabs = mount(
                <Tabs2 id={ID} selectedTabId={SELECTED_TAB_ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs2>,
            );

            findTabById(tabs, TAB_ID_TO_SELECT).simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            // old selection is 0
            assert.deepEqual(onChangeSpy.args[0], [TAB_ID_TO_SELECT, SELECTED_TAB_ID]);
            assert.deepEqual(tabs.state("selectedTabId"), SELECTED_TAB_ID);
        });

        it("state is synced with selectedTabId prop", () => {
            const tabs = mount(<Tabs2 id={ID} selectedTabId={SELECTED_TAB_ID}>{getTabsContents()}</Tabs2>);
            assert.deepEqual(tabs.state("selectedTabId"), SELECTED_TAB_ID);
            tabs.setProps({ selectedTabId: TAB_ID_TO_SELECT });
            assert.deepEqual(tabs.state("selectedTabId"), TAB_ID_TO_SELECT);
        });

        it("indicator moves correctly if tabs switch externally via the selectedTabId prop", (done) => {
            const wrapper = mount(
                <Tabs2 id={ID} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs2>,
                { attachTo: testsContainerElement },
            );
            wrapper.setProps({ selectedTabId: TAB_ID_TO_SELECT });
            // indicator moves via componentDidUpdate
            setTimeout(() => {
                assertIndicatorPosition(wrapper, TAB_ID_TO_SELECT);
                done();
            });
        });
    });

    function findTabById(wrapper: ReactWrapper<ITabs2Props, {}>, id: string) {
        return wrapper.find(TAB).filter({ "data-tab-id": id });
    }

    function assertIndicatorPosition(wrapper: ReactWrapper<ITabs2Props, ITabs2State>, selectedTabId: string) {
        const style = wrapper.state().indicatorWrapperStyle;
        assert.isDefined(style, "Tabs should have a indicatorWrapperStyle prop set");
        const node = ReactDOM.findDOMNode(wrapper.instance());
        const expected = (node.query(`${TAB}[data-tab-id='${selectedTabId}']`) as HTMLLIElement).offsetLeft;
        assert.isTrue(style.transform.indexOf(`${expected}px`) !== -1, "indicator has not moved correctly");
    }

    function getTabsContents(): Array<React.ReactElement<any>> {
        return TAB_IDS.map((id) => <Tab2 id={id} key={id} panel={<Panel title={id} />} title={id} />);
    }
});

const Panel: React.SFC<{ title: string }> = ({ title }) => <strong>{title} panel</strong>;
