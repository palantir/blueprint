/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { spy } from "sinon";
import { IOverflowListProps, IOverflowListState, OverflowList } from "../../src/components/overflow-list/overflowList";

type OverflowProps = IOverflowListProps<ITestItem>;

interface ITestItem {
    id: number;
}

const IDS = [0, 1, 2, 3, 4, 5];
const ITEMS: ITestItem[] = IDS.map(id => ({ id }));

const TestItem: React.SFC<ITestItem> = () => <div style={{ width: 10, flex: "0 0 auto" }} />;
const TestOverflow: React.SFC<{ items: ITestItem[] }> = () => <div />;

describe("<OverflowList>", function(this) {
    // these tests rely on DOM measurement which can be flaky, so we allow some retries
    this.retries(3);

    const testsContainerElement = document.createElement("div");
    document.documentElement.appendChild(testsContainerElement);

    it("adds className to itself", () => {
        assert.isTrue(
            overflowList(30, { className: "winner" })
                .wrapper.find(".winner")
                .exists(),
        );
    });

    it("uses custom tagName", () => {
        assert.lengthOf(overflowList(undefined, { tagName: "section" }).wrapper.find("section"), 1);
    });

    it("overflows correctly on initial mount", () => {
        overflowList().assertVisibleItemSplit(4);
    });

    it("shows more after growing", async () => {
        // :O it sure reads synchronously
        return (await (await overflowList(15)
            .assertVisibleItemSplit(1)
            .setWidth(35)
            .waitForResize())
            .assertVisibleItemSplit(3)
            .setWidth(200)
            .waitForResize()).assertVisibleItems(...IDS);
    });

    it("shows fewer after shrinking", () => {
        overflowList(45)
            .assertVisibleItemSplit(4)
            .setWidth(15)
            .assertVisibleItemSplit(1);
    });

    it("shows at least minVisibleItems", () => {
        overflowList(15, { minVisibleItems: 5 }).assertVisibleItemSplit(5);
    });

    it("shows more after increasing minVisibleItems", () => {
        overflowList(35, { minVisibleItems: 2 })
            .assertVisibleItemSplit(3)
            .setProps({ minVisibleItems: 5 })
            .assertVisibleItemSplit(5);
    });

    it("does not render the overflow if all items are displayed", () => {
        overflowList(200).assertHasOverflow(false);
    });

    it("renders the overflow if not all items are displayed", () => {
        overflowList().assertHasOverflow(true);
    });

    it("renders overflow items in the correct order (collapse from start)", () => {
        overflowList(45, { collapseFrom: "start" }).assertOverflowItems(0, 1);
    });

    it("renders overflow items in the correct order (collapse from end)", () => {
        overflowList(45, { collapseFrom: "end" }).assertOverflowItems(4, 5);
    });

    describe("onOverflow", () => {
        it("invoked on initial render if has overflow", async () => {
            const list = await overflowList(22).waitForResize();
            list.assertLastOnOverflowArgs([0, 1, 2, 3]);
        });

        it("not invoked on initial render if all visible", async () => {
            const list = await overflowList(200).waitForResize();
            assert.isTrue(list.onOverflow.notCalled, "not called");
        });

        it("invoked once per resize", async () => {
            // initial render shows all items (empty overflow)
            const list = await overflowList(200).waitForResize();
            // assert that at given width, onOverflow receives given IDs
            const tests = [
                { width: 15, overflowIds: [0, 1, 2, 3, 4] },
                { width: 55, overflowIds: [0] },
                { width: 25, overflowIds: [0, 1, 2, 3] },
                { width: 35, overflowIds: [0, 1, 2] },
            ];
            for (const { overflowIds, width } of tests) {
                (await list.setWidth(width).waitForResize()).assertLastOnOverflowArgs(overflowIds);
            }
            // ensure onOverflow is not called additional times.
            assert.equal(list.onOverflow.callCount, tests.length, "should invoke once per resize");
        });

        it("not invoked if resize doesn't change overflow", async () => {
            // show a few items
            const list = await overflowList(22).waitForResize();
            // small adjustments don't change overflow state, but it is recomputed internally.
            // assert that the callback was not invoked because the appearance hasn't changed.
            list.onOverflow.resetHistory();
            await list.setWidth(25).waitForResize();
            await list.setWidth(28).waitForResize();
            await list.setWidth(29).waitForResize();
            await list.setWidth(26).waitForResize();
            await list.setWidth(22).waitForResize();
            assert.isTrue(list.onOverflow.notCalled, "should not invoke");
        });

        it("invoked when items change", async () => {
            const list = await overflowList(22).waitForResize();
            // copy of same items so overflow state should end up the same.
            await list.setProps({ items: [...ITEMS] }).waitForResize();
            assert.isTrue(list.onOverflow.calledTwice, "should be called twice");
            const [one, two] = list.onOverflow.args;
            assert.sameDeepMembers(one, two, "items should be the same");
        });
    });

    function renderOverflow(items: ITestItem[]) {
        return <TestOverflow items={items} />;
    }

    function renderVisibleItem(item: ITestItem, index: number) {
        return <TestItem key={index} {...item} />;
    }

    function overflowList(initialWidth = 45, props: Partial<OverflowProps> = {}) {
        const onOverflow = spy();
        const wrapper = mount<OverflowProps, IOverflowListState<ITestItem>>(
            <OverflowList
                items={ITEMS}
                onOverflow={onOverflow}
                overflowRenderer={renderOverflow}
                visibleItemRenderer={renderVisibleItem}
                style={{ width: initialWidth }}
                {...props}
            />,
            // measuring elements only works in the DOM, so this element actually needs to be attached
            { attachTo: testsContainerElement },
        ).update();

        const harness = {
            /** Assert existence of overflow element. */
            assertHasOverflow(exists: boolean) {
                assert.equal(wrapper.find(TestOverflow).exists(), exists, "has overflow");
                return harness;
            },
            /** Asserts that the last call to `onOverflow` received the given item IDs. */
            assertLastOnOverflowArgs(ids: number[]) {
                assert.sameMembers(onOverflow.lastCall.args[0].map((i: ITestItem) => i.id), ids);
            },
            /**
             * Invokes both assertions below with the expected visible and
             * overflow IDs assuming `collapseFrom="start"`.
             */
            assertVisibleItemSplit(visibleCount: number) {
                return harness
                    .assertOverflowItems(...IDS.slice(0, -visibleCount))
                    .assertVisibleItems(...IDS.slice(-visibleCount));
            },
            /** Assert ordered IDs of overflow items. */
            assertOverflowItems(...ids: number[]) {
                const overflowItems = wrapper.find(TestOverflow).prop("items");
                assert.sameMembers(overflowItems.map(it => it.id), ids, "overflow items");
                return harness;
            },
            /** Assert ordered IDs of visible items. */
            assertVisibleItems(...ids: number[]) {
                const visibleItems = wrapper.find(TestItem).map(div => div.prop("id"));
                assert.sameMembers(visibleItems, ids, "visible items");
                return harness;
            },
            setProps<K extends keyof OverflowProps>(newProps: Pick<OverflowProps, K>) {
                wrapper.setProps(newProps).update();
                return harness;
            },
            setWidth(width: number) {
                return harness.setProps({ style: { width } });
            },
            /** Promise that resolves after DOM has a chance to settle. */
            waitForResize() {
                return new Promise<typeof harness>(resolve =>
                    setTimeout(() => {
                        wrapper.update();
                        resolve(harness);
                    }, 30),
                );
            },

            onOverflow,
            wrapper,
        };
        return harness;
    }
});
