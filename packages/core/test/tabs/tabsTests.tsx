/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import * as Classes from "../../src/common/classes";
import * as Keys from "../../src/common/keys";
import { Tab } from "../../src/components/tabs/tab";
import { ITabsProps, ITabsState, Tabs } from "../../src/components/tabs/tabs";

describe("<Tabs>", () => {
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
        assert.doesNotThrow(() => mount(<Tabs id="childless" />));
    });

    it("supports non-existent children", () => {
        assert.doesNotThrow(() =>
            mount(
                <Tabs id={ID}>
                    {null}
                    <Tab id="one" />
                    {undefined}
                    <Tab id="two" />
                </Tabs>,
            ),
        );
    });

    it("default selectedTabId is first non-null Tab id", () => {
        const wrapper = mount(
            <Tabs id={ID}>
                {null}
                {<button id="btn" />}
                {getTabsContents()}
            </Tabs>,
        );
        assert.lengthOf(wrapper.find(TAB), 3);
        assert.strictEqual(wrapper.state("selectedTabId"), TAB_IDS[0]);
    });

    it("renders one TabTitle for each Tab", () => {
        const wrapper = mount(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        assert.lengthOf(wrapper.find(TAB), 3);
    });

    it("renders all Tab children, but active is not aria-hidden", () => {
        const activeIndex = 1;
        const wrapper = mount(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        wrapper.setState({ selectedTabId: TAB_IDS[activeIndex] });
        const tabs = wrapper.find(TAB_PANEL);
        assert.lengthOf(tabs, 3);
        for (let i = 0; i < TAB_IDS.length; i++) {
            // hidden unless it is active
            assert.equal(tabs.at(i).prop("aria-hidden"), i !== activeIndex);
        }
    });

    it(`renders without ${Classes.LARGE} when by default`, () => {
        const wrapper = mount(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        assert.lengthOf(wrapper.find(`.${Classes.TAB_LIST}.${Classes.LARGE}`), 0);
    });

    it(`renders using ${Classes.LARGE} when large={true}`, () => {
        const wrapper = mount(
            <Tabs id={ID} large={true}>
                {getTabsContents()}
            </Tabs>,
        );
        assert.lengthOf(wrapper.find(`.${Classes.TAB_LIST}.${Classes.LARGE}`), 1);
    });

    it("attaches className to both tab and panel container if set", () => {
        const tabClassName = "tabClassName";
        const wrapper = mount(
            <Tabs id={ID}>
                <Tab id="first" title="First" className={tabClassName} panel={<Panel title="first" />} />,
                <Tab id="second" title="Second" className={tabClassName} panel={<Panel title="second" />} />,
                <Tab id="third" title="Third" className={tabClassName} panel={<Panel title="third" />} />,
            </Tabs>,
        );
        assert.lengthOf(wrapper.find(`.${tabClassName}`), 9);
    });

    it("attaches panelClassName to panel container if set", () => {
        const panelClassName = "secondPanelClassName";
        const wrapper = mount(
            <Tabs id={ID}>
                <Tab id="first" title="First" panel={<Panel title="first" />} />,
                <Tab id="second" title="Second" panelClassName={panelClassName} panel={<Panel title="second" />} />,
                <Tab id="third" title="Third" panel={<Panel title="third" />} />,
            </Tabs>,
        );
        assert.lengthOf(wrapper.find(`.${panelClassName}`), 1);
    });

    it("renderActiveTabPanelOnly only renders active tab panel", () => {
        const wrapper = mount(
            <Tabs id={ID} renderActiveTabPanelOnly={true}>
                {getTabsContents()}
            </Tabs>,
        );
        for (const selectedTabId of TAB_IDS) {
            wrapper.setState({ selectedTabId });
            assert.lengthOf(wrapper.find("strong"), 1);
        }
    });

    it("sets aria-* attributes with matching IDs", () => {
        const wrapper = mount(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        wrapper.find(TAB).forEach(title => {
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
        const changeSpy = spy();
        const wrapper = mount(
            <Tabs defaultSelectedTabId={tabId} id={ID} onChange={changeSpy}>
                {getTabsContents()}
            </Tabs>,
            { attachTo: testsContainerElement },
        );
        findTabById(wrapper, tabId).simulate("click");
        assert.isTrue(changeSpy.calledWith(tabId, tabId));
    });

    it("clicking nested tab should not affect parent", () => {
        const changeSpy = spy();
        const wrapper = mount(
            <Tabs id={ID} onChange={changeSpy}>
                {getTabsContents()}
                <Tabs id="nested">
                    <Tab id="last" title="Click me" />
                </Tabs>
            </Tabs>,
            { attachTo: testsContainerElement },
        );
        assert.equal(wrapper.state("selectedTabId"), TAB_IDS[0]);
        // last Tab is inside nested
        wrapper
            .find(TAB)
            .last()
            .simulate("click");
        assert.equal(wrapper.state("selectedTabId"), TAB_IDS[0]);
        assert.isTrue(changeSpy.notCalled, "onChange invoked");
    });

    it("changes tab focus when arrow keys are pressed", () => {
        const wrapper = mount(
            <Tabs id={ID}>
                <Tab id="first" title="First" panel={<Panel title="first" />} />,
                <Tab disabled={true} id="second" title="Second" panel={<Panel title="second" />} />,
                <Tab id="third" title="Third" panel={<Panel title="third" />} />,
            </Tabs>,
            { attachTo: testsContainerElement },
        );

        const tabList = wrapper.find(TAB_LIST);
        const tabElements = testsContainerElement.querySelectorAll(TAB);
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
        const changeSpy = spy();
        const wrapper = mount(
            <Tabs id={ID} onChange={changeSpy}>
                {getTabsContents()}
            </Tabs>,
            { attachTo: testsContainerElement },
        );
        const tabList = wrapper.find(TAB_LIST);
        const tabElements = testsContainerElement.querySelectorAll(TAB);

        // must target different elements each time as onChange is only called when id changes
        tabList.simulate("keypress", { target: tabElements[1], which: Keys.ENTER });
        tabList.simulate("keypress", { target: tabElements[2], which: Keys.SPACE });

        assert.equal(changeSpy.callCount, 2);
        assert.includeDeepMembers(changeSpy.args[0], [TAB_IDS[1], TAB_IDS[0]]);
        assert.includeDeepMembers(changeSpy.args[1], [TAB_IDS[2], TAB_IDS[1]]);
    });

    it("animate=false removes moving indicator element", () => {
        const wrapper = mount<Tabs>(
            <Tabs id={ID} animate={false}>
                {getTabsContents()}
            </Tabs>,
        );
        assert.isUndefined(wrapper.state().indicatorWrapperStyle);
        assert.equal(wrapper.find("." + Classes.TAB_INDICATOR).length, 0);
    });

    it("removes indicator element when selected tab is removed", () => {
        const wrapper = mount<Tabs>(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        // first tab is selected by default. now remove it.
        const tabIdsWithoutFirstTab = TAB_IDS.slice(1);
        wrapper.setProps({ children: getTabsContents(tabIdsWithoutFirstTab) });
        const indicatorStyle = wrapper.state().indicatorWrapperStyle;
        assert.deepEqual(indicatorStyle, { display: "none" }, "indicator should be hidden");
    });

    it("leaves indicator element in place when non-selected tab is removed", () => {
        const wrapper = mount(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        // first tab is selected by default. now remove the last one.
        const lastTabIndex = TAB_IDS.length - 1;
        const tabIdsWithoutLastTab = TAB_IDS.slice(0, lastTabIndex - 1);
        wrapper.setProps({ children: getTabsContents(tabIdsWithoutLastTab) });
        assertIndicatorPosition(wrapper, "first");
    });

    describe("when state is managed internally", () => {
        const TAB_ID_TO_SELECT = TAB_IDS[1];

        it("defaultSelectedTabId is initially selected", () => {
            const wrapper = mount(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.isTrue(findTabById(wrapper, TAB_ID_TO_SELECT).prop("aria-selected"));
        });

        it("unknown tab ID hides moving indicator element", () => {
            const wrapper = mount<Tabs>(
                <Tabs id={ID} defaultSelectedTabId="unknown">
                    {getTabsContents()}
                </Tabs>,
            );
            const style = wrapper.state().indicatorWrapperStyle;
            assert.deepEqual(style, { display: "none" });
        });

        it("does not reset selected tab to defaultSelectedTabId after a selection is made", () => {
            const wrapper = mount(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            findTabById(wrapper, TAB_ID_TO_SELECT).simulate("click");
            wrapper.update();
            assert.isTrue(findTabById(wrapper, TAB_ID_TO_SELECT).prop("aria-selected"));
        });

        it("invokes onChange() callback", () => {
            const onChangeSpy = spy();
            const wrapper = mount(
                <Tabs id={ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>,
            );

            findTabById(wrapper, TAB_ID_TO_SELECT).simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            // initial selection is first tab
            assert.isTrue(onChangeSpy.calledWith(TAB_ID_TO_SELECT, TAB_IDS[0]));
        });

        it("moves indicator as expected", () => {
            const wrapper = mount(<Tabs id={ID}>{getTabsContents()}</Tabs>);
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
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.strictEqual(tabs.state("selectedTabId"), SELECTED_TAB_ID);
        });

        it("selects nothing if invalid id provided", () => {
            const tabs = mount(
                <Tabs id={ID} selectedTabId="unknown">
                    {getTabsContents()}
                </Tabs>,
            );

            assert.strictEqual(tabs.state("selectedTabId"), "unknown");
            assert.isFalse(tabs.find("[aria-selected=true]").exists(), "a tab was selected");
        });

        it("invokes onChange() callback but does not change state", () => {
            const onChangeSpy = spy();
            const tabs = mount(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>,
            );

            findTabById(tabs, TAB_ID_TO_SELECT).simulate("click");
            assert.isTrue(onChangeSpy.calledOnce);
            // old selection is 0
            assert.includeDeepMembers(onChangeSpy.args[0], [TAB_ID_TO_SELECT, SELECTED_TAB_ID]);
            assert.deepEqual(tabs.state("selectedTabId"), SELECTED_TAB_ID);
        });

        it("state is synced with selectedTabId prop", () => {
            const tabs = mount(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.deepEqual(tabs.state("selectedTabId"), SELECTED_TAB_ID);
            tabs.setProps({ selectedTabId: TAB_ID_TO_SELECT });
            assert.deepEqual(tabs.state("selectedTabId"), TAB_ID_TO_SELECT);
        });

        it("indicator moves correctly if tabs switch externally via the selectedTabId prop", done => {
            const wrapper = mount(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
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

    function findTabById(wrapper: ReactWrapper<ITabsProps, {}>, id: string) {
        // Need this to get the right overload signature
        // tslint:disable-next-line:no-object-literal-type-assertion
        return wrapper.find(TAB).filter({ "data-tab-id": id } as React.HTMLAttributes<{}>);
    }

    function assertIndicatorPosition(wrapper: ReactWrapper<ITabsProps, ITabsState>, selectedTabId: string) {
        const style = wrapper.state().indicatorWrapperStyle;
        assert.isDefined(style, "Tabs should have a indicatorWrapperStyle prop set");
        const node = wrapper.getDOMNode();
        const expected = (node.querySelector(`${TAB}[data-tab-id='${selectedTabId}']`) as HTMLLIElement).offsetLeft;
        assert.isTrue(style.transform.indexOf(`${expected}px`) !== -1, "indicator has not moved correctly");
    }

    function getTabsContents(tabIds: string[] = TAB_IDS): Array<React.ReactElement<any>> {
        return tabIds.map(id => <Tab id={id} key={id} panel={<Panel title={id} />} title={id} />);
    }
});

const Panel: React.SFC<{ title: string }> = ({ title }) => <strong>{title} panel</strong>;
