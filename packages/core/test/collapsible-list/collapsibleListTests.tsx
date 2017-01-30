/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";

import {
    CollapseFrom,
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
        assert.lengthOf(list.find(".winner"), 1);
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

    it("CollapseFrom.START renders popover target first", () => {
        const list = renderCollapsibleList(5, { collapseFrom: CollapseFrom.START });
        assert.isTrue(list.children().first().childAt(0).is(Popover));
    });

    it("CollapseFrom.END renders popover target last", () => {
        const list = renderCollapsibleList(5, { collapseFrom: CollapseFrom.END });
        assert.isTrue(list.children().last().childAt(0).is(Popover));
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
            dropdownProps: { inline: true, isOpen: true },
            visibleItemCount: 2,
        });
        assertListItems(list, 2, 3);
    });

    it("does not complain when number of children is 0", () => {
        assert.doesNotThrow(() => renderCollapsibleList(0));
    });

    describe("renderVisibleItem", () => {
        it("is called with props of each child", () => {
            const renderVisibleItem = sinon.spy();
            // using END so it won't reverse the list
            renderCollapsibleList(5, { collapseFrom: CollapseFrom.END, renderVisibleItem, visibleItemCount: 3 });
            assert.equal(renderVisibleItem.callCount, 3);
            renderVisibleItem.args.map((arg, index) => {
                const props: IMenuItemProps = arg[0];
                assert.deepEqual(props.text, `Item ${index}`);
            });
        });

        it("is called with absolute index of item in props array when CollapseFrom.START", () => {
            const renderVisibleItem = sinon.spy();
            renderCollapsibleList(7, { renderVisibleItem, visibleItemCount: 3 });
            renderVisibleItem.args.map((arg) => {
                const props: IMenuItemProps = arg[0];
                assert.equal(props.text, `Item ${arg[1]}`);
            });
        });

        it("is called with absolute index of item in props array when CollapseFrom.END", () => {
            const renderVisibleItem = sinon.spy();
            renderCollapsibleList(6, { collapseFrom: CollapseFrom.END, renderVisibleItem, visibleItemCount: 3 });
            renderVisibleItem.args.map((arg) => {
                const props: IMenuItemProps = arg[0];
                assert.equal(props.text, `Item ${arg[1]}`);
            });
        });
    });

    function renderItem(props: IMenuItemProps, index: number) {
        return React.createElement("label", { key: index }, props.text);
    }

    function withItems(length: number) {
        let list: JSX.Element[] = [];
        for (let i = 0; i < length; i++) {
            list.push(<MenuItem key={i} text={`Item ${i}`} />);
        }
        return list;
    }

    function renderCollapsibleList(broodSize: number, props?: Partial<ICollapsibleListProps>) {
        return mount(
            <CollapsibleList dropdownTarget={<button />} renderVisibleItem={renderItem} {...props}>
                {withItems(broodSize)}
            </CollapsibleList>,
        );
    }

    function assertListItems(list: ReactWrapper<any, {}>, expVisibleCount: number, expCollapsedCount: number) {
        assert.lengthOf(list.find("label"), expVisibleCount, "incorrect visible count");
        assert.lengthOf(list.find(MenuItem), expCollapsedCount, "incorrect collapsed count");
    }
});
