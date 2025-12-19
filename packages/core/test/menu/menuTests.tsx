/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
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
import { mount, shallow } from "enzyme";
import sinon from "sinon";

import { Classes, H6, Menu, MenuDivider, MenuItem } from "../../src";

describe("<MenuDivider>", () => {
    it("React renders MenuDivider", () => {
        const divider = shallow(<MenuDivider />);
        assert.isTrue(divider.hasClass(Classes.MENU_DIVIDER));
        assert.isFalse(divider.hasClass(Classes.MENU_HEADER));
        assert.isFalse(divider.find(H6).exists());
    });

    it("React renders MenuDivider with title", () => {
        const divider = shallow(<MenuDivider title="Subject" />);
        assert.isFalse(divider.hasClass(Classes.MENU_DIVIDER));
        assert.isTrue(divider.hasClass(Classes.MENU_HEADER));
        assert.isTrue(divider.find(H6).exists());
    });
});

describe("<Menu>", () => {
    it("React renders Menu with children", () => {
        const menu = shallow(
            <Menu>
                <MenuItem icon="graph" text="Graph" />
            </Menu>,
        );
        assert.isTrue(menu.hasClass(Classes.MENU));
        assert.lengthOf(menu.find(MenuItem), 1);
    });

    // Tests for the trapFocus tabbing functionality.
    describe("trapFocus", () => {
        let container: HTMLElement;

        beforeEach(() => {
            container = document.createElement("div");
            document.body.appendChild(container);
        });

        afterEach(() => {
            document.body.removeChild(container);
        });

        it("does not trap focus when trapFocus is false", () => {
            const wrapper = mount(
                <Menu trapFocus={false}>
                    <MenuItem text="Item 1" />
                    <MenuItem text="Item 2" />
                    <MenuItem text="Item 3" />
                </Menu>,
                { attachTo: container },
            );

            const menuItems = container.querySelectorAll<HTMLElement>('[tabindex]:not([tabindex="-1"])');
            const lastItem = menuItems[menuItems.length - 1];

            // Focus the last item
            lastItem.focus();
            assert.strictEqual(document.activeElement, lastItem);

            // Simulate Tab keydown
            const event = new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: "Tab",
            });
            const preventDefaultSpy = sinon.spy(event, "preventDefault");

            wrapper.find("ul").simulate("keydown", { currentTarget: wrapper.find("ul").getDOMNode(), key: "Tab" });

            // preventDefault should NOT have been called
            assert.isFalse(preventDefaultSpy.called);

            wrapper.unmount();
        });

        it("does not trap focus when trapFocus is undefined", () => {
            const wrapper = mount(
                <Menu>
                    <MenuItem text="Item 1" />
                    <MenuItem text="Item 2" />
                </Menu>,
                { attachTo: container },
            );

            const ul = wrapper.find("ul").getDOMNode() as HTMLUListElement;
            const menuItems = ul.querySelectorAll<HTMLElement>('[tabindex]:not([tabindex="-1"])');
            const lastItem = menuItems[menuItems.length - 1];

            lastItem.focus();

            const preventDefaultCalled = { value: false };
            wrapper.find("ul").simulate("keydown", {
                currentTarget: ul,
                key: "Tab",
                preventDefault: () => {
                    preventDefaultCalled.value = true;
                },
            });

            assert.isFalse(preventDefaultCalled.value);

            wrapper.unmount();
        });

        it("wraps focus from last to first item when trapFocus is true and Tab is pressed", () => {
            const wrapper = mount(
                <Menu trapFocus={true}>
                    <MenuItem text="Item 1" />
                    <MenuItem text="Item 2" />
                    <MenuItem text="Item 3" />
                </Menu>,
                { attachTo: container },
            );

            const ul = wrapper.find("ul").getDOMNode() as HTMLUListElement;
            const menuItems = ul.querySelectorAll<HTMLElement>('[tabindex]:not([tabindex="-1"])');
            const firstItem = menuItems[0];
            const lastItem = menuItems[menuItems.length - 1];

            // Focus the last item
            lastItem.focus();
            assert.strictEqual(document.activeElement, lastItem);

            const preventDefaultCalled = { value: false };
            wrapper.find("ul").simulate("keydown", {
                currentTarget: ul,
                key: "Tab",
                preventDefault: () => {
                    preventDefaultCalled.value = true;
                },
            });

            // preventDefault should have been called
            assert.isTrue(preventDefaultCalled.value);
            // Focus should now be on the first item
            assert.strictEqual(document.activeElement, firstItem);

            wrapper.unmount();
        });

        it("does not wrap focus when Tab is pressed on non-last item", () => {
            const wrapper = mount(
                <Menu trapFocus={true}>
                    <MenuItem text="Item 1" />
                    <MenuItem text="Item 2" />
                    <MenuItem text="Item 3" />
                </Menu>,
                { attachTo: container },
            );

            const ul = wrapper.find("ul").getDOMNode() as HTMLUListElement;
            const menuItems = ul.querySelectorAll<HTMLElement>('[tabindex]:not([tabindex="-1"])');
            const firstItem = menuItems[0];

            // Focus the first item (not the last)
            firstItem.focus();
            assert.strictEqual(document.activeElement, firstItem);

            const preventDefaultCalled = { value: false };
            wrapper.find("ul").simulate("keydown", {
                currentTarget: ul,
                key: "Tab",
                preventDefault: () => {
                    preventDefaultCalled.value = true;
                },
            });

            // preventDefault should NOT have been called since we're not on the last item
            assert.isFalse(preventDefaultCalled.value);
            // Focus should still be on the first item (browser would normally handle Tab)
            assert.strictEqual(document.activeElement, firstItem);

            wrapper.unmount();
        });

        it("does not interfere with other keys when trapFocus is true", () => {
            const wrapper = mount(
                <Menu trapFocus={true}>
                    <MenuItem text="Item 1" />
                    <MenuItem text="Item 2" />
                </Menu>,
                { attachTo: container },
            );

            const ul = wrapper.find("ul").getDOMNode() as HTMLUListElement;
            const menuItems = ul.querySelectorAll<HTMLElement>('[tabindex]:not([tabindex="-1"])');
            const lastItem = menuItems[menuItems.length - 1];

            lastItem.focus();

            const preventDefaultCalled = { value: false };
            wrapper.find("ul").simulate("keydown", {
                currentTarget: ul,
                key: "Enter",
                preventDefault: () => {
                    preventDefaultCalled.value = true;
                },
            });

            assert.isFalse(preventDefaultCalled.value);

            wrapper.find("ul").simulate("keydown", {
                currentTarget: ul,
                key: "ArrowDown",
                preventDefault: () => {
                    preventDefaultCalled.value = true;
                },
            });

            assert.isFalse(preventDefaultCalled.value);

            wrapper.unmount();
        });

        it("handles menu with no focusable items gracefully", () => {
            const wrapper = mount(
                <Menu trapFocus={true}>
                    <li>Non-focusable item</li>
                </Menu>,
                { attachTo: container },
            );

            const ul = wrapper.find("ul").getDOMNode() as HTMLUListElement;

            // This should not throw
            wrapper.find("ul").simulate("keydown", {
                currentTarget: ul,
                key: "Tab",
            });

            wrapper.unmount();
        });

        it("handles menu with single focusable item", () => {
            const wrapper = mount(
                <Menu trapFocus={true}>
                    <MenuItem text="Only Item" />
                </Menu>,
                { attachTo: container },
            );

            const ul = wrapper.find("ul").getDOMNode() as HTMLUListElement;
            const menuItems = ul.querySelectorAll<HTMLElement>('[tabindex]:not([tabindex="-1"])');
            const onlyItem = menuItems[0];

            onlyItem.focus();
            assert.strictEqual(document.activeElement, onlyItem);

            const preventDefaultCalled = { value: false };
            wrapper.find("ul").simulate("keydown", {
                currentTarget: ul,
                key: "Tab",
                preventDefault: () => {
                    preventDefaultCalled.value = true;
                },
            });

            // When there's only one item, it's both first and last, so focus wraps to itself
            assert.isTrue(preventDefaultCalled.value);
            assert.strictEqual(document.activeElement, onlyItem);

            wrapper.unmount();
        });
    });
});
