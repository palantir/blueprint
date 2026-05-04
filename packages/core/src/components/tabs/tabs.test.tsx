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

import { fireEvent, render, waitFor } from "@testing-library/react";
import { cloneElement, createRef } from "react";

import { afterEach, assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Tab } from "./tab";
import { Tabs } from "./tabs";
import { generateTabIds } from "./tabTitle";

type RenderResult = ReturnType<typeof render>;

describe("<Tabs>", () => {
    const ID = "tabsTests";
    const TAB_IDS = ["first", "second", "third"];

    const TAB_SELECTOR = "[role='tab']";
    const TAB_LIST_SELECTOR = "[role='tablist']";
    const TAB_PANEL_SELECTOR = "[role='tabpanel']";

    let containerElement: HTMLElement;
    let result: RenderResult | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        result?.unmount();
        result = undefined;
        containerElement.remove();
    });

    function renderTabs(ui: React.ReactElement) {
        const ref = createRef<Tabs>();
        const cloned = ui.type === Tabs ? cloneElement(ui, { ref } as any) : ui;
        const r = render(cloned, { container: containerElement });
        result = r;
        return { container: r.container, instance: ref.current!, rerender: r.rerender };
    }

    function findTabs(container: HTMLElement) {
        return Array.from(container.querySelectorAll<HTMLElement>(TAB_SELECTOR));
    }

    function findTabPanels(container: HTMLElement) {
        return Array.from(container.querySelectorAll<HTMLElement>(TAB_PANEL_SELECTOR));
    }

    function findTabById(container: HTMLElement, id: string): HTMLElement | null {
        return container.querySelector<HTMLElement>(`${TAB_SELECTOR}[data-tab-id='${id}']`);
    }

    function getSelectedTabId(instance: Tabs): string | undefined {
        return instance.state.selectedTabId as string | undefined;
    }

    it("gets by without children", () => {
        assert.doesNotThrow(() => render(<Tabs id="childless" />));
    });

    it("supports non-existent children", () => {
        assert.doesNotThrow(() =>
            render(
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
        const { container, instance } = renderTabs(
            <Tabs id={ID}>
                {null}
                <button id="btn" />
                {getTabsContents()}
            </Tabs>,
        );
        assert.lengthOf(findTabs(container), 3);
        assert.strictEqual(getSelectedTabId(instance), TAB_IDS[0]);
    });

    it("renders one TabTitle and one TabPanel for each Tab, aria roles are correct", () => {
        const { container } = renderTabs(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        assert.lengthOf(findTabs(container), 3);
        assert.lengthOf(container.querySelectorAll(TAB_LIST_SELECTOR), 1);
        assert.lengthOf(findTabPanels(container), 3);
    });

    it("renders all Tab children, active is not aria-hidden", () => {
        const activeIndex = 1;
        const { container, rerender } = renderTabs(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        rerender(
            <Tabs id={ID} selectedTabId={TAB_IDS[activeIndex]}>
                {getTabsContents()}
            </Tabs>,
        );
        const tabPanels = findTabPanels(container);
        assert.lengthOf(tabPanels, 3);
        for (let i = 0; i < TAB_IDS.length; i++) {
            assert.equal(tabPanels[i].getAttribute("aria-hidden"), String(i !== activeIndex));
        }
    });

    it(`renders without ${Classes.LARGE} when by default`, () => {
        const { container } = renderTabs(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        assert.lengthOf(container.querySelectorAll(`${TAB_LIST_SELECTOR}.${Classes.LARGE}`), 0);
    });

    it(`renders using ${Classes.LARGE} when size="large"`, () => {
        const { container } = renderTabs(
            <Tabs id={ID} size="large">
                {getTabsContents()}
            </Tabs>,
        );
        assert.lengthOf(container.querySelectorAll(`${TAB_LIST_SELECTOR}.${Classes.LARGE}`), 1);
    });

    it("attaches className to both tab and panel container if set", () => {
        const tabClassName = "tabClassName";
        const { container } = renderTabs(
            <Tabs id={ID}>
                <Tab id="first" title="First" className={tabClassName} panel={<Panel title="first" />} />
                <Tab id="second" title="Second" className={tabClassName} panel={<Panel title="second" />} />
                <Tab id="third" title="Third" className={tabClassName} panel={<Panel title="third" />} />
            </Tabs>,
        );
        const NUM_TABS = 3;
        assert.lengthOf(findTabs(container), NUM_TABS);
        assert.lengthOf(findTabPanels(container), NUM_TABS);
        assert.lengthOf(container.querySelectorAll(`.${tabClassName}`), NUM_TABS * 2);
    });

    it("attaches panelClassName to panel container if set", () => {
        const panelClassName = "secondPanelClassName";
        const { container } = renderTabs(
            <Tabs id={ID}>
                <Tab id="first" title="First" panel={<Panel title="first" />} />
                <Tab id="second" title="Second" panelClassName={panelClassName} panel={<Panel title="second" />} />
                <Tab id="third" title="Third" panel={<Panel title="third" />} />
            </Tabs>,
        );
        assert.lengthOf(container.querySelectorAll(`.${panelClassName}`), 1);
    });

    it("passes correct tabTitleId and tabPanelId to panel renderer", () => {
        const expectedIds = generateTabIds(ID, "first");
        render(
            <Tabs id={ID}>
                <Tab
                    id="first"
                    panel={({ tabTitleId, tabPanelId }) => {
                        assert.equal(tabTitleId, expectedIds.tabTitleId);
                        assert.equal(tabPanelId, expectedIds.tabPanelId);
                        return <Panel title="a" />;
                    }}
                />
            </Tabs>,
        );
    });

    it("renderActiveTabPanelOnly only renders active tab panel", () => {
        const { container, rerender } = renderTabs(
            <Tabs id={ID} renderActiveTabPanelOnly={true}>
                {getTabsContents()}
            </Tabs>,
        );
        for (const selectedTabId of TAB_IDS) {
            rerender(
                <Tabs id={ID} renderActiveTabPanelOnly={true} selectedTabId={selectedTabId}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.lengthOf(container.querySelectorAll("strong"), 1);
        }
    });

    it("sets aria-* attributes with matching IDs", () => {
        const { container } = renderTabs(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        findTabs(container).forEach(title => {
            const titleControls = title.getAttribute("aria-controls");
            const tab = container.querySelector(`#${titleControls}`)!;
            assert.isTrue(tab.matches(TAB_PANEL_SELECTOR), "aria-controls isn't TAB_PANEL");
            assert.deepEqual(tab.getAttribute("aria-labelledby"), title.getAttribute("id"), "mismatched IDs");
        });
    });

    it("sets arbitrary data-* attributes on Tab elements", () => {
        const tabs = TAB_IDS.map(id => (
            <Tab id={id} key={id} panel={<Panel title={id} />} title={id} data-arbitrary-attr="foo" />
        ));
        const { container } = renderTabs(<Tabs id={ID}>{tabs}</Tabs>);
        findTabs(container).forEach(title => {
            assert.strictEqual(title.getAttribute("data-arbitrary-attr"), "foo");
        });
    });

    it("clicking selected tab still fires onChange", () => {
        const tabId = TAB_IDS[0];
        const changeSpy = vi.fn();
        const { container } = renderTabs(
            <Tabs defaultSelectedTabId={tabId} id={ID} onChange={changeSpy}>
                {getTabsContents()}
            </Tabs>,
        );
        fireEvent.click(findTabById(container, tabId)!);
        expect(changeSpy).toHaveBeenCalledWith(tabId, tabId, expect.anything());
    });

    it("clicking nested tab should not affect parent", () => {
        const changeSpy = vi.fn();
        const { container, instance } = renderTabs(
            <Tabs id={ID} onChange={changeSpy}>
                {getTabsContents()}
                <Tabs id="nested">
                    <Tab id="last" title="Click me" />
                </Tabs>
            </Tabs>,
        );
        assert.equal(getSelectedTabId(instance), TAB_IDS[0]);
        const tabs = findTabs(container);
        fireEvent.click(tabs[tabs.length - 1]);
        assert.equal(getSelectedTabId(instance), TAB_IDS[0]);
        expect(changeSpy).not.toHaveBeenCalled();
    });

    it("changes tab focus when arrow keys are pressed", () => {
        const { container } = renderTabs(
            <Tabs id={ID}>
                <Tab id="first" title="First" panel={<Panel title="first" />} />
                <Tab disabled={true} id="second" title="Second" panel={<Panel title="second" />} />
                <Tab id="third" title="Third" panel={<Panel title="third" />} />
            </Tabs>,
        );

        const tabList = container.querySelector(TAB_LIST_SELECTOR)!;
        const tabElements = container.querySelectorAll<HTMLElement>(TAB_SELECTOR);
        tabElements[0].focus();

        fireEvent.keyDown(tabList, { key: "ArrowRight" });
        assert.equal(document.activeElement, tabElements[2], "move right and skip disabled");
        fireEvent.keyDown(tabList, { key: "ArrowRight" });
        assert.equal(document.activeElement, tabElements[0], "wrap around to first tab");
        fireEvent.keyDown(tabList, { key: "ArrowLeft" });
        assert.equal(document.activeElement, tabElements[2], "wrap around to last tab");
        fireEvent.keyDown(tabList, { key: "ArrowLeft" });
        assert.equal(document.activeElement, tabElements[0], "move left and skip disabled");
    });

    it("enter and space keys click focused tab", () => {
        const changeSpy = vi.fn();
        const { container } = renderTabs(
            <Tabs id={ID} onChange={changeSpy}>
                {getTabsContents()}
            </Tabs>,
        );
        const tabElements = container.querySelectorAll<HTMLElement>(TAB_SELECTOR);

        // Fire keyPress directly on the target tabs so it bubbles up to tabList's onKeyPress handler.
        fireEvent.keyPress(tabElements[1], { charCode: 13, key: "Enter" });
        fireEvent.keyPress(tabElements[2], { charCode: 32, key: " " });

        expect(changeSpy).toHaveBeenCalledTimes(2);
        expect(changeSpy.mock.calls[0]).toEqual(expect.arrayContaining([TAB_IDS[1], TAB_IDS[0]]));
        expect(changeSpy.mock.calls[1]).toEqual(expect.arrayContaining([TAB_IDS[2], TAB_IDS[1]]));
    });

    it("animate=false removes moving indicator element", () => {
        const { container, instance } = renderTabs(
            <Tabs id={ID} animate={false}>
                {getTabsContents()}
            </Tabs>,
        );
        assert.isUndefined(instance.state.indicatorWrapperStyle);
        assert.equal(container.querySelectorAll(`.${Classes.TAB_INDICATOR}`).length, 0);
    });

    it("removes indicator element when selected tab is removed", () => {
        const { instance, rerender } = renderTabs(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        const tabIdsWithoutFirstTab = TAB_IDS.slice(1);
        rerender(<Tabs id={ID}>{getTabsContents(tabIdsWithoutFirstTab)}</Tabs>);
        assert.deepEqual(instance.state.indicatorWrapperStyle, { display: "none" }, "indicator should be hidden");
    });

    it("leaves indicator element in place when non-selected tab is removed", () => {
        const { instance, rerender } = renderTabs(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        const lastTabIndex = TAB_IDS.length - 1;
        const tabIdsWithoutLastTab = TAB_IDS.slice(0, lastTabIndex - 1);
        rerender(<Tabs id={ID}>{getTabsContents(tabIdsWithoutLastTab)}</Tabs>);
        assertIndicatorPosition(instance, "first");
    });

    describe("when state is managed internally", () => {
        const TAB_ID_TO_SELECT = TAB_IDS[1];

        it("defaultSelectedTabId is initially selected", () => {
            const { container } = renderTabs(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.strictEqual(findTabById(container, TAB_ID_TO_SELECT)?.getAttribute("aria-selected"), "true");
        });

        it("unknown tab ID hides moving indicator element", () => {
            const { instance } = renderTabs(
                <Tabs id={ID} defaultSelectedTabId="unknown">
                    {getTabsContents()}
                </Tabs>,
            );
            assert.deepEqual(instance.state.indicatorWrapperStyle, { display: "none" });
        });

        it("does not reset selected tab to defaultSelectedTabId after a selection is made", () => {
            const { container } = renderTabs(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            fireEvent.click(findTabById(container, TAB_ID_TO_SELECT)!);
            assert.strictEqual(findTabById(container, TAB_ID_TO_SELECT)?.getAttribute("aria-selected"), "true");
        });

        it("invokes onChange() callback", () => {
            const onChangeSpy = vi.fn();
            const { container } = renderTabs(
                <Tabs id={ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>,
            );

            fireEvent.click(findTabById(container, TAB_ID_TO_SELECT)!);
            expect(onChangeSpy).toHaveBeenCalledOnce();
            expect(onChangeSpy).toHaveBeenCalledWith(TAB_ID_TO_SELECT, TAB_IDS[0], expect.anything());
        });

        it("moves indicator as expected", () => {
            const { instance, rerender } = renderTabs(<Tabs id={ID}>{getTabsContents()}</Tabs>);
            assertIndicatorPosition(instance, TAB_IDS[0]);

            rerender(
                <Tabs id={ID} selectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            assertIndicatorPosition(instance, TAB_ID_TO_SELECT);
        });
    });

    describe("when state is managed externally (selectedTabId prop is provided)", () => {
        const TAB_ID_TO_SELECT = TAB_IDS[1];
        const SELECTED_TAB_ID = TAB_IDS[2];

        it("prefers selectedTabId over defaultSelectedTabId", () => {
            const { instance } = renderTabs(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.strictEqual(getSelectedTabId(instance), SELECTED_TAB_ID);
        });

        it("selects nothing if invalid id provided", () => {
            const { container, instance } = renderTabs(
                <Tabs id={ID} selectedTabId="unknown">
                    {getTabsContents()}
                </Tabs>,
            );

            assert.strictEqual(getSelectedTabId(instance), "unknown");
            assert.isNull(container.querySelector("[aria-selected=true]"), "a tab was selected");
        });

        it("invokes onChange() callback but does not change state", () => {
            const onChangeSpy = vi.fn();
            const { container, instance } = renderTabs(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>,
            );

            fireEvent.click(findTabById(container, TAB_ID_TO_SELECT)!);
            expect(onChangeSpy).toHaveBeenCalledOnce();
            expect(onChangeSpy.mock.calls[0]).toEqual(expect.arrayContaining([TAB_ID_TO_SELECT, SELECTED_TAB_ID]));
            assert.deepEqual(getSelectedTabId(instance), SELECTED_TAB_ID);
        });

        it("state is synced with selectedTabId prop", () => {
            const { instance, rerender } = renderTabs(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.deepEqual(getSelectedTabId(instance), SELECTED_TAB_ID);
            rerender(
                <Tabs id={ID} selectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            assert.deepEqual(getSelectedTabId(instance), TAB_ID_TO_SELECT);
        });

        it("indicator moves correctly if tabs switch externally via the selectedTabId prop", async () => {
            const { instance, rerender } = renderTabs(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
            );
            rerender(
                <Tabs id={ID} selectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            await waitFor(() => {
                assertIndicatorPosition(instance, TAB_ID_TO_SELECT);
            });
        });
    });

    function assertIndicatorPosition(instance: Tabs, selectedTabId: string) {
        const style = instance.state.indicatorWrapperStyle;
        assert.isDefined(style, "Tabs should have a indicatorWrapperStyle prop set");
        const node = containerElement.querySelector<HTMLLIElement>(`${TAB_SELECTOR}[data-tab-id='${selectedTabId}']`)!;
        const expected = node.offsetLeft;
        assert.isTrue(style?.transform?.indexOf(`${expected}px`) !== -1, "indicator has not moved correctly");
    }

    function getTabsContents(tabIds: string[] = TAB_IDS): Array<React.ReactElement<any>> {
        return tabIds.map(id => <Tab id={id} key={id} panel={<Panel title={id} />} title={id} />);
    }
});

const Panel: React.FC<{ title: string }> = ({ title }) => <strong>{title} panel</strong>;
