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

import { render, type RenderResult } from "@testing-library/react";

import { afterEach, assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { OverflowList, type OverflowListProps } from "./overflowList";

type OverflowProps = OverflowListProps<TestItemProps>;

interface TestItemProps {
    id: number;
}

const IDS = [0, 1, 2, 3, 4, 5];
const ITEMS: TestItemProps[] = IDS.map(id => ({ id }));

const TEST_ITEM_CLASS = "test-item";
const TEST_OVERFLOW_CLASS = "test-overflow";
const TEST_OVERFLOW_ITEM_CLASS = "test-overflow-item";
const TestItem: React.FC<TestItemProps> = ({ id }) => (
    <div className={TEST_ITEM_CLASS} data-id={id} style={{ flex: "0 0 auto", height: 10, width: 10 }} />
);
const TestOverflow: React.FC<{ items: TestItemProps[] }> = ({ items }) => (
    <div className={TEST_OVERFLOW_CLASS}>
        {items.map(item => (
            <span key={item.id} className={TEST_OVERFLOW_ITEM_CLASS} data-id={item.id} />
        ))}
    </div>
);

describe.skip("<OverflowList>", { retry: 3 }, () => {
    // these tests rely on DOM measurement which can be flaky, so we allow some retries
    const onOverflowSpy = vi.fn();
    let containerElement: HTMLElement;
    let result: RenderResult | undefined;
    let lastProps: OverflowProps | undefined;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        result?.unmount();
        result = undefined;
        containerElement.remove();
        onOverflowSpy.mockClear();
    });

    it("adds className to itself", () => {
        const r = overflowList(30, { className: "winner" });
        assert.isNotNull(r.container.querySelector(".winner"));
    });

    it("uses custom tagName", () => {
        const r = overflowList(undefined, { tagName: "section" });
        assert.lengthOf(r.container.querySelectorAll("section"), 1);
    });

    it("overflows correctly on initial mount", () => {
        overflowList();
        assertVisibleItemSplit(4);
    });

    it("overflows correctly on initial mount with large number of items", () => {
        overflowList(45, { items: new Array(10000).fill(0).map((_, i) => ({ id: i })) });
        assertVisibleItemSplit(4);
    });

    it("shows more after growing", async () => {
        overflowList(15);
        assertVisibleItemSplit(1);

        await setWidth(35);
        assertVisibleItemSplit(3);

        await setWidth(200);
        assertVisibleItems(...IDS);
    });

    it("shows fewer after shrinking", async () => {
        overflowList(45);
        assertVisibleItemSplit(4);
        await setWidth(15);
        assertVisibleItemSplit(1);
    });

    it("shows at least minVisibleItems", () => {
        overflowList(15, { minVisibleItems: 5 });
        assertVisibleItemSplit(5);
    });

    it("shows more after increasing minVisibleItems", () => {
        overflowList(35, { minVisibleItems: 2 });
        assertVisibleItemSplit(3);

        setProps({ minVisibleItems: 5 });
        assertVisibleItemSplit(5);
    });

    it("does not render the overflow if all items are displayed", () => {
        overflowList(200);
        assertHasOverflow(false);
    });

    it("renders the overflow if not all items are displayed", () => {
        overflowList();
        assertHasOverflow(true);
    });

    it("should render overflow if alwaysRenderOverflow props is true", () => {
        overflowList(200, { alwaysRenderOverflow: true });
        assertHasOverflow(true);
    });

    it("renders overflow items in the correct order (collapse from start)", () => {
        overflowList(45, { collapseFrom: "start" });
        assertOverflowItems(0, 1);
    });

    it("renders overflow items in the correct order (collapse from end)", () => {
        overflowList(45, { collapseFrom: "end" });
        assertOverflowItems(4, 5);
    });

    describe("onOverflow", () => {
        it("invoked on initial render if has overflow", async () => {
            overflowList(22);
            await waitForResize();
            assertLastOnOverflowArgs([0, 1, 2, 3]);
        });

        it("not invoked on initial render if all visible", async () => {
            overflowList(200);
            await waitForResize();
            expect(onOverflowSpy).not.toHaveBeenCalled();
        });

        it("invoked once per resize", async () => {
            overflowList(200);
            await waitForResize();
            const tests = [
                { overflowIds: [0, 1, 2, 3, 4], width: 15 },
                { overflowIds: [0], width: 55 },
                { overflowIds: [0, 1, 2, 3], width: 25 },
                { overflowIds: [0, 1, 2], width: 35 },
            ];
            for (const { overflowIds, width } of tests) {
                await setWidth(width);
                assertLastOnOverflowArgs(overflowIds);
            }
            expect(onOverflowSpy).toHaveBeenCalledTimes(tests.length);
        });

        it("not invoked if resize doesn't change overflow", async () => {
            overflowList(22);
            await waitForResize();
            onOverflowSpy.mockClear();
            await setWidth(25);
            await setWidth(28);
            await setWidth(29);
            await setWidth(26);
            await setWidth(22);
            expect(onOverflowSpy).not.toHaveBeenCalled();
        });

        it("invoked when items change", async () => {
            overflowList(22);
            await waitForResize();
            setProps({ items: [...ITEMS] });
            await waitForResize();
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

    function overflowList(initialWidth = 45, props: Partial<OverflowProps> = {}) {
        lastProps = {
            items: ITEMS,
            onOverflow: onOverflowSpy,
            overflowRenderer: renderOverflow,
            style: { height: 10, width: initialWidth },
            visibleItemRenderer: renderVisibleItem,
            ...props,
        } as OverflowProps;
        result = render(<OverflowList {...lastProps} />, { container: containerElement });
        return result;
    }

    function setProps(newProps: Partial<OverflowProps>) {
        lastProps = { ...lastProps!, ...newProps } as OverflowProps;
        result!.rerender(<OverflowList {...lastProps} />);
    }

    function setWidth(width: number) {
        setProps({ style: { ...(lastProps!.style as object), width } });
        return waitForResize();
    }

    function waitForResize() {
        return new Promise<void>(resolve => setTimeout(resolve, 30));
    }

    function assertHasOverflow(exists: boolean) {
        const overflow = result!.container.querySelector(`.${TEST_OVERFLOW_CLASS}`);
        assert.equal(overflow != null, exists, "has overflow");
    }

    function assertLastOnOverflowArgs(ids: number[]) {
        expect(onOverflowSpy.mock.calls.at(-1)![0].map((i: TestItemProps) => i.id)).toEqual(ids);
    }

    function assertVisibleItemSplit(visibleCount: number) {
        const ids = (lastProps?.items ?? ITEMS).map(({ id }) => id);
        assertOverflowItems(...ids.slice(0, -visibleCount));
        assertVisibleItems(...ids.slice(-visibleCount));
    }

    function assertOverflowItems(...ids: number[]) {
        const overflowIds = Array.from(
            result!.container.querySelectorAll<HTMLElement>(`.${TEST_OVERFLOW_ITEM_CLASS}`),
        ).map(el => Number(el.dataset.id));
        assert.sameMembers(overflowIds, ids, "overflow items");
    }

    function assertVisibleItems(...ids: number[]) {
        const visibleIds = Array.from(result!.container.querySelectorAll<HTMLElement>(`.${TEST_ITEM_CLASS}`)).map(el =>
            Number(el.dataset.id),
        );
        assert.sameMembers(visibleIds, ids, "visible items");
    }
});
