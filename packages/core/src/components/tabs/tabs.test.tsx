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

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { Tab } from "./tab";
import { Tabs } from "./tabs";
import { generateTabIds } from "./tabTitle";

describe("<Tabs>", () => {
    const ID = "tabsTests";
    // default tabs content is generated from these IDs in each test
    const TAB_IDS = ["first", "second", "third"];

    it("gets by without children", () => {
        expect(() => render(<Tabs id="childless" />)).not.toThrow();
    });

    it("supports non-existent children", () => {
        expect(() =>
            render(
                <Tabs id={ID}>
                    {null}
                    <Tab id="one" />
                    {undefined}
                    <Tab id="two" />
                </Tabs>,
            ),
        ).not.toThrow();
    });

    it("default selectedTabId is first non-null Tab id", () => {
        render(
            <Tabs id={ID}>
                {null}
                {<button id="btn" />}
                {getTabsContents()}
            </Tabs>,
        );
        expect(screen.getAllByRole("tab")).toHaveLength(3);
        // first tab should be selected by default
        expect(screen.getAllByRole("tab")[0]).toHaveAttribute("aria-selected", "true");
    });

    it("renders one TabTitle and one TabPanel for each Tab, aria roles are correct", () => {
        render(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        expect(screen.getAllByRole("tab")).toHaveLength(3);
        expect(screen.getByRole("tablist")).toBeInTheDocument();
        expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(3);
    });

    it("renders all Tab children, active is not aria-hidden", async () => {
        const user = userEvent.setup();
        render(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        // click the second tab to make it active
        await user.click(screen.getByRole("tab", { name: "second" }));
        const tabPanels = screen.getAllByRole("tabpanel", { hidden: true });
        expect(tabPanels).toHaveLength(3);
        for (let i = 0; i < TAB_IDS.length; i++) {
            expect(tabPanels[i]).toHaveAttribute("aria-hidden", i !== 1 ? "true" : "false");
        }
    });

    it(`renders without ${Classes.LARGE} when by default`, () => {
        render(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        expect(screen.getByRole("tablist")).not.toHaveClass(Classes.LARGE);
    });

    it(`renders using ${Classes.LARGE} when size="large"`, () => {
        render(
            <Tabs id={ID} size="large">
                {getTabsContents()}
            </Tabs>,
        );
        expect(screen.getByRole("tablist")).toHaveClass(Classes.LARGE);
    });

    it("attaches className to both tab and panel container if set", () => {
        const tabClassName = "tabClassName";
        const { container } = render(
            <Tabs id={ID}>
                <Tab id="first" title="First" className={tabClassName} panel={<Panel title="first" />} />
                ,
                <Tab id="second" title="Second" className={tabClassName} panel={<Panel title="second" />} />
                ,
                <Tab id="third" title="Third" className={tabClassName} panel={<Panel title="third" />} />,
            </Tabs>,
        );
        const NUM_TABS = 3;
        expect(screen.getAllByRole("tab")).toHaveLength(NUM_TABS);
        expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(NUM_TABS);
        // className applied to both tab title and tab panel
        expect(container.querySelectorAll(`.${tabClassName}`)).toHaveLength(NUM_TABS * 2);
    });

    it("attaches panelClassName to panel container if set", () => {
        const panelClassName = "secondPanelClassName";
        const { container } = render(
            <Tabs id={ID}>
                <Tab id="first" title="First" panel={<Panel title="first" />} />,
                <Tab id="second" title="Second" panelClassName={panelClassName} panel={<Panel title="second" />} />
                ,
                <Tab id="third" title="Third" panel={<Panel title="third" />} />,
            </Tabs>,
        );
        const NUM_TABS = 3;
        expect(screen.getAllByRole("tab")).toHaveLength(NUM_TABS);
        expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(NUM_TABS);
        expect(container.querySelectorAll(`.${panelClassName}`)).toHaveLength(1);
    });

    it("passes correct tabTitleId and tabPanelId to panel renderer", () => {
        const expectedIds = generateTabIds(ID, "first");
        const panelRenderer = vi.fn(({ tabTitleId, tabPanelId }) => {
            expect(tabTitleId).toBe(expectedIds.tabTitleId);
            expect(tabPanelId).toBe(expectedIds.tabPanelId);
            return <Panel title="a" />;
        });
        render(
            <Tabs id={ID}>
                <Tab id="first" panel={panelRenderer} />
            </Tabs>,
        );
        expect(panelRenderer).toHaveBeenCalled();
    });

    it("renderActiveTabPanelOnly only renders active tab panel", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Tabs id={ID} renderActiveTabPanelOnly={true}>
                {getTabsContents()}
            </Tabs>,
        );
        // first tab is active by default
        expect(container.querySelectorAll("strong")).toHaveLength(1);

        // click second tab
        await user.click(screen.getByRole("tab", { name: "second" }));
        expect(container.querySelectorAll("strong")).toHaveLength(1);

        // click third tab
        await user.click(screen.getByRole("tab", { name: "third" }));
        expect(container.querySelectorAll("strong")).toHaveLength(1);
    });

    it("sets aria-* attributes with matching IDs", () => {
        render(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        const tabs = screen.getAllByRole("tab");
        tabs.forEach(tab => {
            const titleControls = tab.getAttribute("aria-controls")!;
            const panel = document.getElementById(titleControls)!;
            expect(panel).not.toBeNull();
            expect(panel.getAttribute("role")).toBe("tabpanel");
            expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
        });
    });

    it("sets arbitrary data-* attributes on Tab elements", () => {
        const tabs = TAB_IDS.map(id => (
            <Tab id={id} key={id} panel={<Panel title={id} />} title={id} data-arbitrary-attr="foo" />
        ));
        render(<Tabs id={ID}>{tabs}</Tabs>);
        screen.getAllByRole("tab").forEach(tab => {
            expect(tab).toHaveAttribute("data-arbitrary-attr", "foo");
        });
    });

    it("clicking selected tab still fires onChange", async () => {
        const user = userEvent.setup();
        const tabId = TAB_IDS[0];
        const changeSpy = vi.fn();
        render(
            <Tabs defaultSelectedTabId={tabId} id={ID} onChange={changeSpy}>
                {getTabsContents()}
            </Tabs>,
        );
        await user.click(screen.getByRole("tab", { name: tabId }));
        expect(changeSpy).toHaveBeenCalledWith(tabId, tabId, expect.anything());
    });

    it("clicking nested tab should not affect parent", async () => {
        const user = userEvent.setup();
        const changeSpy = vi.fn();
        render(
            <Tabs id={ID} onChange={changeSpy}>
                {getTabsContents()}
                <Tabs id="nested">
                    <Tab id="last" title="Click me" />
                </Tabs>
            </Tabs>,
        );
        // first tab is selected by default in the parent
        const parentTabs = screen.getAllByRole("tablist")[0].querySelectorAll("[role='tab']");
        expect(parentTabs[0]).toHaveAttribute("aria-selected", "true");
        // click the nested tab ("Click me")
        await user.click(screen.getByRole("tab", { name: "Click me" }));
        // parent tab selection should not have changed
        expect(parentTabs[0]).toHaveAttribute("aria-selected", "true");
        expect(changeSpy).not.toHaveBeenCalled();
    });

    it("changes tab focus when arrow keys are pressed", () => {
        const { container } = render(
            <Tabs id={ID}>
                <Tab id="first" title="First" panel={<Panel title="first" />} />,
                <Tab disabled={true} id="second" title="Second" panel={<Panel title="second" />} />,
                <Tab id="third" title="Third" panel={<Panel title="third" />} />,
            </Tabs>,
        );

        const tabList = screen.getByRole("tablist");
        const tabElements = container.querySelectorAll<HTMLElement>("[role='tab']");
        tabElements[0].focus();

        fireKeyDown(tabList, "ArrowRight");
        expect(document.activeElement).toBe(tabElements[2]);
        fireKeyDown(tabList, "ArrowRight");
        expect(document.activeElement).toBe(tabElements[0]);
        fireKeyDown(tabList, "ArrowLeft");
        expect(document.activeElement).toBe(tabElements[2]);
        fireKeyDown(tabList, "ArrowLeft");
        expect(document.activeElement).toBe(tabElements[0]);
    });

    it("enter and space keys click focused tab", () => {
        const changeSpy = vi.fn();
        const { container } = render(
            <Tabs id={ID} onChange={changeSpy}>
                {getTabsContents()}
            </Tabs>,
        );
        const tabElements = container.querySelectorAll<HTMLElement>("[role='tab']");

        // must target different elements each time as onChange is only called when id changes
        fireEvent.keyPress(tabElements[1], { charCode: 13, key: "Enter" });
        fireEvent.keyPress(tabElements[2], { charCode: 32, key: " " });

        expect(changeSpy).toHaveBeenCalledTimes(2);
        expect(changeSpy.mock.calls[0]).toEqual(expect.arrayContaining([TAB_IDS[1], TAB_IDS[0]]));
        expect(changeSpy.mock.calls[1]).toEqual(expect.arrayContaining([TAB_IDS[2], TAB_IDS[1]]));
    });

    it("animate=false removes moving indicator element", () => {
        const { container } = render(
            <Tabs id={ID} animate={false}>
                {getTabsContents()}
            </Tabs>,
        );
        expect(container.querySelector(`.${Classes.TAB_INDICATOR}`)).toBeNull();
    });

    it("removes indicator element when selected tab is removed", () => {
        const tabIdsWithoutFirstTab = TAB_IDS.slice(1);
        const { container, rerender } = render(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        // first tab is selected by default. now remove it.
        rerender(<Tabs id={ID}>{getTabsContents(tabIdsWithoutFirstTab)}</Tabs>);
        const indicatorWrapper = container.querySelector<HTMLElement>(`.${Classes.TAB_INDICATOR_WRAPPER}`);
        expect(indicatorWrapper).not.toBeNull();
        expect(indicatorWrapper!.style.display).toBe("none");
    });

    it("leaves indicator element in place when non-selected tab is removed", () => {
        const { container, rerender } = render(<Tabs id={ID}>{getTabsContents()}</Tabs>);
        // first tab is selected by default. now remove the last one.
        const tabIdsWithoutLastTab = TAB_IDS.slice(0, TAB_IDS.length - 2);
        rerender(<Tabs id={ID}>{getTabsContents(tabIdsWithoutLastTab)}</Tabs>);
        assertIndicatorPosition(container, "first");
    });

    describe("when state is managed internally", () => {
        const TAB_ID_TO_SELECT = TAB_IDS[1];

        it("defaultSelectedTabId is initially selected", () => {
            render(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            expect(screen.getByRole("tab", { name: TAB_ID_TO_SELECT })).toHaveAttribute("aria-selected", "true");
        });

        it("unknown tab ID hides moving indicator element", () => {
            const { container } = render(
                <Tabs id={ID} defaultSelectedTabId="unknown">
                    {getTabsContents()}
                </Tabs>,
            );
            const indicatorWrapper = container.querySelector<HTMLElement>(`.${Classes.TAB_INDICATOR_WRAPPER}`);
            expect(indicatorWrapper).not.toBeNull();
            expect(indicatorWrapper!.style.display).toBe("none");
        });

        it("does not reset selected tab to defaultSelectedTabId after a selection is made", async () => {
            const user = userEvent.setup();
            render(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            await user.click(screen.getByRole("tab", { name: TAB_ID_TO_SELECT }));
            expect(screen.getByRole("tab", { name: TAB_ID_TO_SELECT })).toHaveAttribute("aria-selected", "true");
        });

        it("invokes onChange() callback", async () => {
            const user = userEvent.setup();
            const onChangeSpy = vi.fn();
            render(
                <Tabs id={ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>,
            );

            await user.click(screen.getByRole("tab", { name: TAB_ID_TO_SELECT }));
            expect(onChangeSpy).toHaveBeenCalledOnce();
            // initial selection is first tab
            expect(onChangeSpy).toHaveBeenCalledWith(TAB_ID_TO_SELECT, TAB_IDS[0], expect.anything());
        });

        it("moves indicator as expected", () => {
            const { container, rerender } = render(<Tabs id={ID}>{getTabsContents()}</Tabs>);
            assertIndicatorPosition(container, TAB_IDS[0]);

            rerender(
                <Tabs id={ID} selectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            assertIndicatorPosition(container, TAB_ID_TO_SELECT);
        });
    });

    describe("when state is managed externally (selectedTabId prop is provided)", () => {
        const TAB_ID_TO_SELECT = TAB_IDS[1];
        const SELECTED_TAB_ID = TAB_IDS[2];

        it("prefers selectedTabId over defaultSelectedTabId", () => {
            render(
                <Tabs id={ID} defaultSelectedTabId={TAB_ID_TO_SELECT} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
            );
            expect(screen.getByRole("tab", { name: SELECTED_TAB_ID })).toHaveAttribute("aria-selected", "true");
        });

        it("selects nothing if invalid id provided", () => {
            render(
                <Tabs id={ID} selectedTabId="unknown">
                    {getTabsContents()}
                </Tabs>,
            );
            const selectedTabs = screen.getAllByRole("tab").filter(t => t.getAttribute("aria-selected") === "true");
            expect(selectedTabs).toHaveLength(0);
        });

        it("invokes onChange() callback but does not change state", async () => {
            const user = userEvent.setup();
            const onChangeSpy = vi.fn();
            render(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID} onChange={onChangeSpy}>
                    {getTabsContents()}
                </Tabs>,
            );

            await user.click(screen.getByRole("tab", { name: TAB_ID_TO_SELECT }));
            expect(onChangeSpy).toHaveBeenCalledOnce();
            expect(onChangeSpy).toHaveBeenCalledWith(TAB_ID_TO_SELECT, SELECTED_TAB_ID, expect.anything());
            // selected tab should remain the same (controlled)
            expect(screen.getByRole("tab", { name: SELECTED_TAB_ID })).toHaveAttribute("aria-selected", "true");
        });

        it("state is synced with selectedTabId prop", () => {
            const { rerender } = render(
                <Tabs id={ID} selectedTabId={SELECTED_TAB_ID}>
                    {getTabsContents()}
                </Tabs>,
            );
            expect(screen.getByRole("tab", { name: SELECTED_TAB_ID })).toHaveAttribute("aria-selected", "true");
            rerender(
                <Tabs id={ID} selectedTabId={TAB_ID_TO_SELECT}>
                    {getTabsContents()}
                </Tabs>,
            );
            expect(screen.getByRole("tab", { name: TAB_ID_TO_SELECT })).toHaveAttribute("aria-selected", "true");
        });

        it("indicator moves correctly if tabs switch externally via the selectedTabId prop", async () => {
            const { container, rerender } = render(
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
                assertIndicatorPosition(container, TAB_ID_TO_SELECT);
            });
        });
    });

    function getTabsContents(tabIds: string[] = TAB_IDS): Array<React.ReactElement<any>> {
        return tabIds.map(id => <Tab id={id} key={id} panel={<Panel title={id} />} title={id} />);
    }
});

function assertIndicatorPosition(container: HTMLElement, selectedTabId: string) {
    const indicatorWrapper = container.querySelector<HTMLElement>(`.${Classes.TAB_INDICATOR_WRAPPER}`);
    expect(indicatorWrapper).not.toBeNull();
    const tab = container.querySelector<HTMLElement>(`[role='tab'][data-tab-id='${selectedTabId}']`);
    expect(tab).not.toBeNull();
    const expected = tab!.offsetLeft;
    expect(indicatorWrapper!.style.transform).toContain(`${expected}px`);
}

function fireKeyDown(element: HTMLElement, key: string) {
    const event = new KeyboardEvent("keydown", { bubbles: true, key });
    element.dispatchEvent(event);
}

const Panel: React.FC<{ title: string }> = ({ title }) => <strong>{title} panel</strong>;
