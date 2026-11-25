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

import { mount, type ReactWrapper } from "enzyme";
import { act } from "react";

import { afterEach, assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { OverflowList, type OverflowListProps, type OverflowListState } from "./overflowList";

type OverflowProps = OverflowListProps<TestItemProps>;

interface TestItemProps {
    id: number;
}

const IDS = [0, 1, 2, 3, 4, 5];
const ITEMS: TestItemProps[] = IDS.map(id => ({ id }));

const VISIBLE_ITEM_CLASS = "test-visible-item";
const ITEM_WIDTH = 10;

const TestItem: React.FC<TestItemProps> = () => (
    <div className={VISIBLE_ITEM_CLASS} style={{ flex: "0 0 auto", height: ITEM_WIDTH, width: ITEM_WIDTH }} />
);
const TestOverflow: React.FC<{ items: TestItemProps[] }> = () => <div />;

/**
 * jsdom performs no layout, so `OverflowList` (which measures its spacer element to decide whether
 * items fit) cannot be tested against real dimensions. These two mocks model just enough of the
 * browser for the component's measurement loop to behave deterministically:
 *
 *  - `MockResizeObserver` lets a test drive `ResizeSensor` on demand instead of waiting on a real
 *    observer, which jsdom does not implement at all.
 *  - the `offsetWidth` mock reproduces the spacer's flex behavior: the spacer is 1px wide and
 *    shrinkable, so it keeps its width only while the visible items still fit in the list.
 */
class MockResizeObserver implements ResizeObserver {
    public static instances: MockResizeObserver[] = [];

    /** Notify every live observer, mimicking a browser resize pass. */
    public static triggerAll() {
        for (const instance of MockResizeObserver.instances) {
            instance.trigger();
        }
    }

    private elements = new Set<Element>();

    constructor(private readonly callback: ResizeObserverCallback) {
        MockResizeObserver.instances.push(this);
    }

    public observe(element: Element) {
        this.elements.add(element);
    }

    public unobserve(element: Element) {
        this.elements.delete(element);
    }

    public disconnect() {
        this.elements.clear();
    }

    private trigger() {
        if (this.elements.size > 0) {
            this.callback([], this);
        }
    }
}

describe("<OverflowList>", () => {
    const onOverflowSpy = vi.fn();
    let containerElement: HTMLElement;
    let wrapper: OverflowListWrapper;
    /** Simulated width of the list, in px. Read by the `offsetWidth` mock below. */
    let listWidth = 0;
    let originalOffsetWidth: PropertyDescriptor | undefined;
    let originalResizeObserver: typeof globalThis.ResizeObserver | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);

        originalResizeObserver = globalThis.ResizeObserver;
        MockResizeObserver.instances = [];
        globalThis.ResizeObserver = MockResizeObserver;

        originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            get(this: HTMLElement) {
                if (!this.classList.contains(Classes.OVERFLOW_LIST_SPACER)) {
                    return 0;
                }
                const list = this.parentElement;
                if (list == null) {
                    return 0;
                }
                const visibleCount = list.querySelectorAll(`.${VISIBLE_ITEM_CLASS}`).length;
                // the spacer only keeps its 1px width while the visible items still fit
                return listWidth - visibleCount * ITEM_WIDTH >= 1 ? 1 : 0;
            },
        });
    });

    afterEach(() => {
        // clean up wrapper to remove Portal element from DOM
        wrapper?.unmount();
        wrapper?.detach();
        containerElement.remove();
        onOverflowSpy.mockClear();

        if (originalOffsetWidth !== undefined) {
            Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
        }
        globalThis.ResizeObserver = originalResizeObserver!;
        MockResizeObserver.instances = [];
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

    // rendering 10k items through the measurement loop is slow under jsdom
    it("overflows correctly on initial mount with large number of items", { timeout: 30_000 }, () => {
        overflowList(45, { items: new Array(10000).fill(0).map((_, i) => ({ id: i })) }).assertVisibleItemSplit(4);
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
            expect(onOverflowSpy).not.toHaveBeenCalled();
        });

        it("invoked once per resize", async () => {
            // initial render shows all items (empty overflow)
            await overflowList(200).waitForResize();
            // assert that at given width, onOverflow receives given IDs
            const tests = [
                { overflowIds: [0, 1, 2, 3, 4], width: 15 },
                { overflowIds: [0], width: 55 },
                { overflowIds: [0, 1, 2, 3], width: 25 },
                { overflowIds: [0, 1, 2], width: 35 },
            ];
            for (const { overflowIds, width } of tests) {
                (await wrapper.setWidth(width).waitForResize()).assertLastOnOverflowArgs(overflowIds);
            }
            // ensure onOverflow is not called additional times.
            expect(onOverflowSpy).toHaveBeenCalledTimes(tests.length);
        });

        it("invoked with no items once the list stops overflowing", async () => {
            await overflowList(22).waitForResize();
            wrapper.assertLastOnOverflowArgs([0, 1, 2, 3]);
            // growing the list until everything fits must report the now-empty overflow
            await wrapper.setWidth(200).waitForResize();
            wrapper.assertLastOnOverflowArgs([]);
        });

        it("not invoked if resize doesn't change overflow", async () => {
            // show a few items
            await overflowList(22).waitForResize();
            // small adjustments don't change overflow state, but it is recomputed internally.
            // assert that the callback was not invoked because the appearance hasn't changed.
            onOverflowSpy.mockClear();
            await wrapper.setWidth(25).waitForResize();
            await wrapper.setWidth(28).waitForResize();
            await wrapper.setWidth(29).waitForResize();
            await wrapper.setWidth(26).waitForResize();
            await wrapper.setWidth(22).waitForResize();
            expect(onOverflowSpy).not.toHaveBeenCalled();
        });

        it("invoked when items change", async () => {
            await overflowList(22).waitForResize();
            // copy of same items so overflow state should end up the same.
            await wrapper.setProps({ items: [...ITEMS] }).waitForResize();
            expect(onOverflowSpy).toHaveBeenCalledTimes(2);
            expect(onOverflowSpy.mock.calls[0][0]).toEqual(expect.arrayContaining(onOverflowSpy.mock.calls[1][0]));
            expect(onOverflowSpy.mock.calls[1][0]).toEqual(expect.arrayContaining(onOverflowSpy.mock.calls[0][0]));
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
        listWidth = initialWidth;
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
            { attachTo: containerElement },
        ) as OverflowListWrapper;
        wrapper = wrapper.update();

        wrapper.assertHasOverflow = (exists: boolean) => {
            assert.equal(wrapper.find(TestOverflow).exists(), exists, "has overflow");
            return wrapper;
        };

        /** Asserts that the last call to `onOverflow` received the given item IDs. */
        wrapper.assertLastOnOverflowArgs = (ids: number[]) => {
            expect(onOverflowSpy.mock.calls.at(-1)![0].map((i: TestItemProps) => i.id)).toEqual(ids);
            return wrapper;
        };

        /**
         * Invokes both assertions below with the expected visible and
         * overflow IDs assuming `collapseFrom="start"`.
         */
        wrapper.assertVisibleItemSplit = (visibleCount: number) => {
            const ids = (props.items ?? ITEMS).map(({ id }) => id);
            return wrapper
                .assertOverflowItems(...ids.slice(0, -visibleCount))
                .assertVisibleItems(...ids.slice(-visibleCount));
        };

        /** Assert ordered IDs of overflow items. */
        wrapper.assertOverflowItems = (...ids: number[]) => {
            // enzyme's wrapper.find returns `any` type here, so we need to cast to the correct type
            // see: https://github.com/palantir/blueprint/pull/7161/files#r1915372750
            const overflowItems: TestItemProps[] = wrapper.find(TestOverflow).prop("items");
            assert.sameMembers(
                overflowItems.map(({ id }) => id),
                ids,
                "overflow items",
            );
            return wrapper;
        };

        /** Assert ordered IDs of visible items. */
        wrapper.assertVisibleItems = (...ids: number[]) => {
            const visibleItems = wrapper.find(TestItem).map(div => div.prop("id"));
            assert.sameMembers(visibleItems, ids, "visible items");
            return wrapper;
        };

        wrapper.setWidth = (width: number) => {
            listWidth = width;
            act(() => {
                wrapper.setProps({ style: { height: 10, width } });
                MockResizeObserver.triggerAll();
            });
            return wrapper;
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
