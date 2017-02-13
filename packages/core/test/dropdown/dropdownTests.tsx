/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import {
    Button,
    Dropdown,
    IDropdownMenuItemProps,
    IDropdownProps,
    InputGroup,
    MenuDivider,
    MenuItem,
} from "../../src/index";

const SIMPLE_ITEMS: IDropdownMenuItemProps[] = [
    { id: "a", text: "Apple" },
    { id: "b", text: "Banana" },
    { id: "c", text: "Copper" },
    { id: "d", text: "Driftwood" },
    { id: "e", text: "Elephant" },
];

describe("Dropdown", () => {
    describe("target", () => {
        it("renders Button by default", () => {
            const { target } = dropdown();
            assert.equal(target.length, 1);
        });

        it("renders custom target", () => {
            const targetRenderer = sinon.spy((props: any) => <strong>{props.children}</strong>);
            const { root } = dropdown({ targetRenderer });
            assert.equal(targetRenderer.callCount, 1);
            assert.equal(root.find("strong").length, 1);
        });

        it("placeholder is default target text", () => {
            const placeholder = "Pick me!";
            const { target } = dropdown({ placeholder });
            assert.equal(target.text(), placeholder);
        });

        it("active item text becomes target text", () => {
            const { root, target } = dropdown();
            root.setState({ value: "b" });
            assert.equal(target.text(), "Banana");
        });
    });

    describe("items", () => {
        it("renders MenuItem per item (default)", () => {
            const { findItems } = dropdown();
            assert.equal(findItems().length, SIMPLE_ITEMS.length);
        });

        it("renders custom items", () => {
            const itemRenderer = sinon.spy(
                (props: IDropdownMenuItemProps) => <strong key={props.id}>{props.text}</strong>,
            );
            const { root } = dropdown({ itemRenderer });
            assert.equal(itemRenderer.callCount, 5);
            assert.equal(root.find("strong").length, 5);
        });

        it("emits onChange with id when item is clicked", () => {
            const onChange = sinon.spy();
            const { findItems } = dropdown({ onChange });
            findItems().at(2).find("a").simulate("click");
            assert.isTrue(onChange.calledOnce);
            assert.deepEqual(onChange.args[0], ["c"]);
        });

        it("invokes item onClick when item is clicked", () => {
            const onClick = sinon.spy();
            const { findItems } = dropdown({
                items: { default: [{...SIMPLE_ITEMS[0], onClick }] },
            });
            findItems().find("a").simulate("click");
            assert.isTrue(onClick.calledOnce);
        });
    });

    describe("filterable", () => {
        it("renders an InputGroup", () => {
            const { filter } = dropdown();
            assert.equal(filter.length, 1);
        });

        it("filterProps are passed to InputGroup", () => {
            const filterProps = {
                className: "test-class",
                leftIconName: "build",
                onKeyDown: sinon.spy(),
            };
            const { filter } = dropdown({ filterProps });
            assert.match(filter.prop("className"), new RegExp(filterProps.className), "filter missing className");
            assert.equal(filter.prop("leftIconName"), filterProps.leftIconName, "filter missing leftIconName");
            filter.find("input").simulate("keydown", { which: 0 });
            assert.isTrue(filterProps.onKeyDown.calledOnce, "filter onKeyDown not invoked");
        });

        it("does not render an InputGroup when false", () => {
            const { filter } = dropdown({ filterEnabled: false });
            assert.equal(filter.length, 0);
        });

        it("query filters visible items by case-insensitive substring", () => {
            const { findItems, root } = dropdown();
            root.setState({ searchQuery: "pp" }).update();
            assert.equal(findItems().length, 2, "substring"); // Apple, Copper
            root.setState({ searchQuery: "APPLE" }).update();
            assert.equal(findItems().length, 1, "case-insensitive");
        });

        it("filterItem customizes filter algorithm", () => {
            const filterItem = sinon.spy((props: IDropdownMenuItemProps, query: string) => {
                // case-sensitive prefix
                return props.text.indexOf(query) === 0;
            });
            const { root } = dropdown({ filterItem });

            // all items return false:
            root.setState({ searchQuery: "f" });
            assert.equal(filterItem.callCount, SIMPLE_ITEMS.length);
            for (let i = 0; i < SIMPLE_ITEMS.length; i++) {
                assert.deepEqual(filterItem.args[i], [SIMPLE_ITEMS[i], "f"], `args #${i}`);
                assert.isFalse(filterItem.returnValues[i], `return value #${i}`);
            }
            filterItem.reset();

            // last item returns true:
            root.setState({ searchQuery: "Ele" });
            assert.equal(filterItem.callCount, SIMPLE_ITEMS.length);
            for (let i = 0; i < SIMPLE_ITEMS.length; i++) {
                assert.deepEqual(filterItem.args[i], [SIMPLE_ITEMS[i], "Ele"], `args #${i}`);
                assert.equal(filterItem.returnValues[i], i === SIMPLE_ITEMS.length - 1, `return value #${i}`);
            }
        });
    });

    describe("groups", () => {
        const GROUPS = {
            animals: [
                SIMPLE_ITEMS[4],
            ],
            fruits: [
                SIMPLE_ITEMS[0],
                SIMPLE_ITEMS[1],
            ],
            materials: [
                SIMPLE_ITEMS[2],
                SIMPLE_ITEMS[3],
            ],
        };

        it("renders MenuDividers for each group", () => {
            const { root } = dropdown({ items: GROUPS });
            assert.equal(root.find(MenuDivider).length, 3);
        });
    });

    function dropdown(props: Partial<IDropdownProps> = {}) {
        const root = mount(
            <Dropdown
                items={SIMPLE_ITEMS}
                popoverProps={{ inline: true, isOpen: true, ...props.popoverProps }}
                {...props}
            />,
        );
        return {
            root,
            filter: root.find(InputGroup),
            findItems: () => root.find(MenuItem),
            target: root.find(Button),
        };
    }
});
