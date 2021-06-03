/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import React from "react";
import { spy } from "sinon";

import { OverflowListProps, OverflowListState, OverflowList } from "../../src/components/overflow-list/overflowList";

type OverflowProps = OverflowListProps<TestItemProps>;

interface TestItemProps {
    id: number;
}

const IDS = [0, 1, 2, 3, 4, 5];
const ITEMS: TestItemProps[] = IDS.map(id => ({ id }));

const TestItem: React.FC<TestItemProps> = () => <div style={{ height: 10, width: 10, flex: "0 0 auto" }} />;
const TestOverflow: React.FC<{ items: TestItemProps[] }> = () => <div />;

describe("<OverflowList>", function (this) {
    // these tests rely on DOM measurement which can be flaky, so we allow some retries
    this.retries(3);

    const onOverflowSpy = spy();
    let testsContainerElement: HTMLElement;
    let wrapper: OverflowListWrapper;

    beforeEach(() => {
        testsContainerElement = document.createElement("div");
        document.body.appendChild(testsContainerElement);
    });

    afterEach(() => {
        // clean up wrapper to remove Portal element from DOM
        wrapper?.unmount();
        wrapper?.detach();
        testsContainerElement.remove();
        onOverflowSpy.resetHistory();
    });

    it("adds className to itself", () => {
        assert.isTrue(overflowList(30, { className: "winner" }).find(".winner").exists());
    });

    it("uses custom tagName", () => {
        assert.lengthOf(overflowList(undefined, { tagName: "section" }).find("section"), 1);
    });

    it("overflows correctly on initial mount", () => {
        overflowList().assertVisibleItemSplit(4);
    });

    it("shows more after growing", async () => {
        overflowList(15);
        wrapper.assertVisibleItemSplit(1);

        await wrapper.setWidth(35).waitForResize();
        wrapper.assertVisibleItemSplit(3);

        await wrapper.setWidth(200).waitForResize();
        wrapper.assertVisibleItems(...IDS);
    });

    it("shows fewer after shrinking", async () => {
        overflowList(45).assertVisibleItemSplit(4);
        await wrapper.setWidth(15).waitForResize();
        wrapper.assertVisibleItemSplit(1);
    });

    it("shows at least minVisibleItems", () => {
        overflowList(15, { minVisibleItems: 5 }).assertVisibleItemSplit(5);
    });

    it("shows more after increasing minVisibleItems", () => {
        overflowList(35, { minVisibleItems: 2 });
        wrapper.assertVisibleItemSplit(3);

        wrapper.setProps({ minVisibleItems: 5 });
        wrapper.update();
        wrapper.assertVisibleItemSplit(5);
    });

    it("does not render the overflow if all items are displayed", () => {
        overflowList(200).assertHasOverflow(false);
    });

    it("renders the overflow if not all items are displayed", () => {
        overflowList().assertHasOverflow(true);
    });

    it("should render overflow if alwaysRenderOverflow props is true", () => {
        overflowList(200, { alwaysRenderOverflow: true }).assertHasOverflow(true);
    });

    it("renders overflow items in the correct order (collapse from start)", () => {
        overflowList(45, { collapseFrom: "start" }).assertOverflowItems(0, 1);
    });

    it("renders overflow items in the correct order (collapse from end)", () => {
        overflowList(45, { collapseFrom: "end" }).assertOverflowItems(4, 5);
    });

    describe("onOverflow", () => {
        it("invoked on initial render if has overflow", async () => {
            await overflowList(22).waitForResize();
            wrapper.assertLastOnOverflowArgs([0, 1, 2, 3]);
        });

        it("not invoked on initial render if all visible", async () => {
            await overflowList(200).waitForResize();
            assert.isTrue(onOverflowSpy.notCalled, "not called");
        });

        it("invoked once per resize", async () => {
            // initial render shows all items (empty overflow)
            await overflowList(200).waitForResize();
            // assert that at given width, onOverflow receives given Ds
            const tests = [
                { width: 15, overflowIds: [0, 1, 2, 3, 4] },
                { width: 55, overflowIds: [0] },
                { width: 25, overflowIds: [0, 1, 2, 3] },
                { width: 35, overflowIds: [0, 1, 2] },
            ];
            for (const { overflowIds, width } of tests) {
                (await wrapper.setWidth(width).waitForResize()).assertLastOnOverflowArgs(overflowIds);
            }
            // ensure onOverflow is not called additional times.
            assert.equal(onOverflowSpy.callCount, tests.length, "should invoke once per resize");
        });

        it("not invoked if resize doesn't change overflow", async () => {
            // show a few items
            await overflowList(22).waitForResize();
            // small adjustments don't change overflow state, but it is recomputed internally.
            // assert that the callback was not invoked because the appearance hasn't changed.
            onOverflowSpy.resetHistory();
            await wrapper.setWidth(25).waitForResize();
            await wrapper.setWidth(28).waitForResize();
            await wrapper.setWidth(29).waitForResize();
            await wrapper.setWidth(26).waitForResize();
            await wrapper.setWidth(22).waitForResize();
            assert.isTrue(onOverflowSpy.notCalled, "should not invoke");
        });

        it("invoked when items change", async () => {
            await overflowList(22).waitForResize();
            // copy of same items so overflow state should end up the same.
            await wrapper.setProps({ items: [...ITEMS] }).waitForResize();
            assert.isTrue(onOverflowSpy.calledTwice, "should be called twice");
            const [one, two] = onOverflowSpy.args;
            assert.sameDeepMembers(one, two, "items should be the same");
        });
    });

    function renderOverflow(items: TestItemProps[]) {
        return <TestOverflow items={items} />;
    }

    function renderVisibleItem(item: TestItemProps, index: number) {
        return <TestItem key={index} {...item} />;
    }

    interface OverflowListWrapper
        extends ReactWrapper<OverflowListProps<TestItemProps>, OverflowListState<TestItemProps>> {
        assertHasOverflow(exists: boolean): OverflowListWrapper;
        assertLastOnOverflowArgs(ids: number[]): OverflowListWrapper;
        assertVisibleItemSplit(visibleCount: number): OverflowListWrapper;
        assertOverflowItems(...ids: number[]): OverflowListWrapper;
        assertVisibleItems(...ids: number[]): OverflowListWrapper;
        // setProps<K extends keyof OverflowProps>(newProps: Pick<OverflowProps, K>): OverflowListWrapper;
        setWidth(width: number): OverflowListWrapper;
        waitForResize(): Promise<OverflowListWrapper>;
    }

    function overflowList(initialWidth = 45, props: Partial<OverflowProps> = {}) {
        wrapper = mount<OverflowProps, OverflowListState<TestItemProps>>(
            <OverflowList
                items={ITEMS}
                onOverflow={onOverflowSpy}
                overflowRenderer={renderOverflow}
                visibleItemRenderer={renderVisibleItem}
                style={{ height: 10, width: initialWidth }}
                {...props}
            />,
            // measuring elements only works in the DOM, so this element actually needs to be attached
            { attachTo: testsContainerElement },
        ) as OverflowListWrapper;
        wrapper = wrapper.update();

        wrapper.assertHasOverflow = (exists: boolean) => {
            assert.equal(wrapper.find(TestOverflow).exists(), exists, "has overflow");
            return wrapper;
        };

        /** Asserts that the last call to `onOverflow` received the given item Ds. */
        wrapper.assertLastOnOverflowArgs = (ids: number[]) => {
            assert.sameMembers(
                onOverflowSpy.lastCall.args[0].map((i: TestItemProps) => i.id),
                ids,
            );
            return wrapper;
        };

        /**
         * Invokes both assertions below with the expected visible and
         * overflow Dsassuming `collapseFrom="start"`.
         */
        wrapper.assertVisibleItemSplit = (visibleCount: number) => {
            return wrapper
                .assertOverflowItems(...IDS.slice(0, -visibleCount))
                .assertVisibleItems(...IDS.slice(-visibleCount));
        };

        /** Assert ordered Dsof overflow items. */
        wrapper.assertOverflowItems = (...ids: number[]) => {
            const overflowItems = wrapper.find(TestOverflow).prop("items");
            assert.sameMembers(
                overflowItems.map(it => it.id),
                ids,
                "overflow items",
            );
            return wrapper;
        };

        /** Assert ordered Dsof visible items. */
        wrapper.assertVisibleItems = (...ids: number[]) => {
            const visibleItems = wrapper.find(TestItem).map(div => div.prop("id"));
            assert.sameMembers(visibleItems, ids, "visible items");
            return wrapper;
        };

        wrapper.setWidth = (width: number) => {
            return wrapper.setProps({ style: { width } });
        };

        /** Promise that resolves after DOM has a chance to settle. */
        wrapper.waitForResize = async () => {
            return new Promise<OverflowListWrapper>(resolve =>
                setTimeout(() => {
                    wrapper.update();
                    resolve(wrapper);
                }, 30),
            );
        };

        return wrapper;
    }
});
