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

import { act, render } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { OverflowList } from "./overflowList";

const items = [1, 2, 3, 4, 5, 6];
const renderItem = (item: number) => (
    <span key={item} data-item={true}>
        {item}
    </span>
);
const renderOverflow = () => <span data-overflow={true}>More</span>;

describe("OverflowList overflow notifications", () => {
    let width: number;
    let resize: ResizeObserverCallback;

    beforeEach(() => {
        width = 55;
        vi.stubGlobal(
            "ResizeObserver",
            class {
                constructor(callback: ResizeObserverCallback) {
                    resize = callback;
                }
                public observe = vi.fn();
                public disconnect = vi.fn();
            },
        );
        vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
            if (this.classList.contains(Classes.OVERFLOW_LIST_SPACER)) {
                const list = this.parentElement!;
                const used =
                    list.querySelectorAll("[data-item]").length * 20 + (list.querySelector("[data-overflow]") ? 10 : 0);
                return used < width ? 1 : 0;
            }
            return 20;
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it.each(["start", "end"] as const)("notifies when resizing removes the %s overflow", collapseFrom => {
        const onOverflow = vi.fn();
        render(
            <OverflowList
                items={items}
                collapseFrom={collapseFrom}
                visibleItemRenderer={renderItem}
                overflowRenderer={renderOverflow}
                onOverflow={onOverflow}
            />,
        );
        expect(onOverflow).toHaveBeenCalledTimes(1);
        expect(onOverflow.mock.calls[0][0]).toHaveLength(4);
        width = 200;
        act(() => resize([], {} as ResizeObserver));
        expect(onOverflow).toHaveBeenLastCalledWith([]);
        expect(onOverflow).toHaveBeenCalledTimes(2);
        act(() => resize([], {} as ResizeObserver));
        expect(onOverflow).toHaveBeenCalledTimes(2);
    });

    it.each(["start", "end"] as const)("notifies when a parent render removes the %s overflow", collapseFrom => {
        const onOverflow = vi.fn();
        const renderList = (values: number[]) => (
            <OverflowList
                items={values}
                collapseFrom={collapseFrom}
                visibleItemRenderer={renderItem}
                overflowRenderer={renderOverflow}
                onOverflow={onOverflow}
            />
        );
        const { rerender } = render(renderList(items));
        expect(onOverflow.mock.calls[0][0]).toHaveLength(4);
        rerender(renderList([...items]));
        expect(onOverflow).toHaveBeenCalledTimes(1);
        rerender(renderList(items.map(item => item + 10)));
        expect(onOverflow).toHaveBeenCalledTimes(2);
        expect(onOverflow).toHaveBeenLastCalledWith(collapseFrom === "start" ? [11, 12, 13, 14] : [13, 14, 15, 16]);
        width = 200;
        rerender(renderList([...items]));
        expect(onOverflow).toHaveBeenLastCalledWith([]);
        expect(onOverflow).toHaveBeenCalledTimes(3);
        width = 55;
        act(() => resize([], {} as ResizeObserver));
        expect(onOverflow).toHaveBeenCalledTimes(4);
        rerender(renderList([]));
        expect(onOverflow).toHaveBeenLastCalledWith([]);
        expect(onOverflow).toHaveBeenCalledTimes(5);
    });
});
