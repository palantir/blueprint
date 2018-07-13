/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import { IOverflowListProps, OverflowList } from "../../src/components/overflow-list/overflowList";

interface ITestItem {
    id: number;
}

const ITEMS: ITestItem[] = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

const TestItem: React.SFC = () => <div style={{ width: 10 }} />;
const TestOverflow: React.SFC<{ items: ITestItem[] }> = () => <div />;

describe("<OverflowList>", function(this) {
    // these tests rely on DOM measurement which can be flaky, so we allow some retries
    this.retries(3);

    let list: ReactWrapper<IOverflowListProps<{}>, any> | undefined;
    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    afterEach(() => {
        // clean up list after each test, if it was used
        if (list !== undefined) {
            list.unmount();
            list.detach();
            list = undefined;
        }
    });

    it("adds className to itself", () => {
        list = renderOverflowList({ className: "winner" });
        assert.lengthOf(list.find(".winner").hostNodes(), 1);
    });

    it("overflows correctly on initial mount", () => {
        list = renderOverflowList({ style: { width: 35 } });
        assert.lengthOf(list.find(TestItem), 3);
    });

    it("shows more after growing", done => {
        list = renderOverflowList({ style: { width: 35 } });
        assert.lengthOf(list.find(TestItem), 3);
        list.setProps({ style: { width: 45 } });
        setTimeout(() => {
            list.update();
            assert.lengthOf(list.find(TestItem), 4);
            done();
        }, 30);
    });

    it("shows all after growing", done => {
        list = renderOverflowList({ style: { width: 15 } });
        assert.lengthOf(list.find(TestItem), 1);
        list.setProps({ style: { width: 200 } });
        setTimeout(() => {
            list.update();
            assert.lengthOf(list.find(TestItem), ITEMS.length);
            done();
        }, 30);
    });

    it("shows fewer after shrinking", () => {
        list = renderOverflowList({ style: { width: 45 } });
        assert.lengthOf(list.find(TestItem), 4);
        list.setProps({ style: { width: 15 } });
        list.update();
        assert.lengthOf(list.find(TestItem), 1);
    });

    it("shows at least minVisibleItems", () => {
        list = renderOverflowList({ minVisibleItems: 5, style: { width: 15 } });
        assert.lengthOf(list.find(TestItem), 5);
    });

    it("shows more after increasing minVisibleItems", () => {
        list = renderOverflowList({ minVisibleItems: 2, style: { width: 35 } });
        assert.lengthOf(list.find(TestItem), 3);
        list.setProps({ minVisibleItems: 5 });
        list.update();
        assert.lengthOf(list.find(TestItem), 5);
    });

    it("does not render the overflow if all items are displayed", () => {
        list = renderOverflowList();
        assert.lengthOf(list.find(TestOverflow), 0);
    });

    it("renders the overflow if not all items are displayed", () => {
        list = renderOverflowList({ style: { width: 45 } });
        assert.lengthOf(list.find(TestOverflow), 1);
    });

    it("renders overflow items in the correct order (collapse from start)", () => {
        list = renderOverflowList({ collapseFrom: "start", style: { width: 45 } });
        const overflowItems = list.find(TestOverflow).prop("items");
        assert.lengthOf(overflowItems, 2);
        assert.strictEqual(overflowItems[0].id, 0);
        assert.strictEqual(overflowItems[1].id, 1);
    });

    it("renders overflow items in the correct order (collapse from end)", () => {
        list = renderOverflowList({ collapseFrom: "end", style: { width: 45 } });
        const overflowItems = list.find(TestOverflow).prop("items");
        assert.lengthOf(overflowItems, 2);
        assert.strictEqual(overflowItems[0].id, 4);
        assert.strictEqual(overflowItems[1].id, 5);
    });

    function renderOverflow(items: ITestItem[]): React.ReactNode {
        return <TestOverflow items={items} />;
    }

    function renderItem(_props: {}, index: number) {
        return <TestItem key={index} />;
    }

    function renderOverflowList(props?: Partial<IOverflowListProps<{}>>) {
        return mount(
            <OverflowList
                items={ITEMS}
                overflowRenderer={renderOverflow}
                visibleItemRenderer={renderItem}
                {...props}
            />,
            // measuring elements only works in the DOM, so this element actually needs to be attached
            { attachTo: testsContainerElement },
        );
    }
});
