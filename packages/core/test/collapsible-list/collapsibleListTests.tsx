/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
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
import * as React from "react";
import { spy } from "sinon";

import {
    Boundary,
    CollapsibleList,
    ICollapsibleListProps,
    IMenuItemProps,
    MenuItem,
    Popover,
    Position,
} from "../../src/index";

describe("<CollapsibleList>", () => {
    it("adds className to itself", () => {
        const list = renderCollapsibleList(3, { className: "winner" });
        assert.lengthOf(list.find(".winner").hostNodes(), 1);
    });

    it("adds visibleItemClassName to each item", () => {
        const list = renderCollapsibleList(3, { visibleItemClassName: "chicken dinner" });
        assert.lengthOf(list.find(".chicken.dinner"), 3);
    });

    it("renders dropdownTarget with given popover props", () => {
        const list = renderCollapsibleList(5, {
            dropdownProps: {
                position: Position.TOP_LEFT,
            },
            dropdownTarget: <strong />,
        });
        const popover = list.find(Popover);
        assert.strictEqual(popover.prop("position"), Position.TOP_LEFT);
    });

    it("Boundary.START renders popover target first", () => {
        const list = renderCollapsibleList(5, { collapseFrom: Boundary.START });
        assert.strictEqual(
            list
                .find("ul")
                .childAt(0) // li
                .childAt(0) // Popover
                .type(),
            Popover,
        );
    });

    it("Boundary.END renders popover target last", () => {
        const list = renderCollapsibleList(5, { collapseFrom: Boundary.END });
        assert.strictEqual(
            list
                .find("ul")
                .children()
                .last() // li
                .childAt(0) // Popover
                .type(),
            Popover,
        );
    });

    it("shows all items when visibleItemCount > number of children", () => {
        const list = renderCollapsibleList(3, { visibleItemCount: 5 });
        assertListItems(list, 3, 0);
    });

    it("shows all items when visibleItemCount == number of children", () => {
        const list = renderCollapsibleList(3, { visibleItemCount: 3 });
        assertListItems(list, 3, 0);
    });

    it("hides some items when visibleItemCount < number of children", () => {
        const list = renderCollapsibleList(5, {
            dropdownProps: { isOpen: true, usePortal: false },
            visibleItemCount: 2,
        });
        assertListItems(list, 2, 3);
    });

    it("does not complain when number of children is 0", () => {
        assert.doesNotThrow(() => renderCollapsibleList(0));
    });

    describe("visibleItemRenderer", () => {
        it("is called with props of each child", () => {
            const visibleItemRenderer = spy();
            // using END so it won't reverse the list
            renderCollapsibleList(5, { collapseFrom: Boundary.END, visibleItemRenderer, visibleItemCount: 3 });
            assert.equal(visibleItemRenderer.callCount, 3);
            visibleItemRenderer.args.map((arg, index) => {
                const props: IMenuItemProps = arg[0];
                assert.deepEqual(props.text, `Item ${index}`);
            });
        });

        it("is called with absolute index of item in props array when Boundary.START", () => {
            const visibleItemRenderer = spy();
            renderCollapsibleList(7, { visibleItemRenderer, visibleItemCount: 3 });
            visibleItemRenderer.args.map(arg => {
                const props: IMenuItemProps = arg[0];
                const absoluteIndex = +props.text.toString().slice(5); // "Item #"
                assert.equal(absoluteIndex, arg[1]);
            });
        });

        it("is called with absolute index of item in props array when Boundary.END", () => {
            const visibleItemRenderer = spy();
            renderCollapsibleList(6, { collapseFrom: Boundary.END, visibleItemRenderer, visibleItemCount: 3 });
            visibleItemRenderer.args.map(arg => {
                const props: IMenuItemProps = arg[0];
                const absoluteIndex = +props.text.toString().slice(5); // "Item #"
                assert.equal(absoluteIndex, arg[1]);
            });
        });
    });

    function renderItem(props: IMenuItemProps, index: number) {
        return React.createElement("label", { key: index }, props.text);
    }

    function withItems(length: number) {
        const list: JSX.Element[] = [];
        for (let i = 0; i < length; i++) {
            list.push(<MenuItem key={i} text={`Item ${i}`} />);
        }
        return list;
    }

    function renderCollapsibleList(broodSize: number, props?: Partial<ICollapsibleListProps>) {
        return mount(
            <CollapsibleList dropdownTarget={<button />} visibleItemRenderer={renderItem} {...props}>
                {withItems(broodSize)}
            </CollapsibleList>,
        );
    }

    function assertListItems(list: ReactWrapper<any, {}>, expVisibleCount: number, expCollapsedCount: number) {
        assert.lengthOf(list.find("label"), expVisibleCount, "incorrect visible count");
        assert.lengthOf(list.find(MenuItem), expCollapsedCount, "incorrect collapsed count");
    }
});
