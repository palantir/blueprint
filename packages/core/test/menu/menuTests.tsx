/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { assert } from "chai";
import { mount, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import * as ReactDOM from "react-dom";

import * as Errors from "../../src/common/errors";
import { Classes, IMenuItemProps, IMenuProps, Menu, MenuDivider, MenuItem, Popover } from "../../src/index";
import { MenuDividerFactory, MenuFactory, MenuItemFactory } from "../../src/index";

describe("MenuItem", () => {
    it("React renders MenuItem", () => {
        const wrapper = shallow(<MenuItem iconName="graph" text="Graph" />);
        assert.lengthOf(wrapper.find(".pt-icon-graph"), 1);
        assert.strictEqual(wrapper.text(), "Graph");
    });

    it("children appear in submenu", () => {
        const wrapper = shallow(
            <MenuItem iconName="style" text="Style">
                <MenuItem iconName="bold" text="Bold" />
                <MenuItem iconName="italic" text="Italic" />
                <MenuItem iconName="underline" text="Underline" />
            </MenuItem>,
        );
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, 3);
    });

    it("submenu props appear as MenuItems in submenu", () => {
        const items: IMenuItemProps[] = [
            { iconName: "align-left", text: "Align Left" },
            { iconName: "align-center", text: "Align Center" },
            { iconName: "align-right", text: "Align Right" },
        ];
        const wrapper = shallow(<MenuItem iconName="align" text="Alignment" submenu={items} />);
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, items.length);
    });

    it("throws error if given children and submenu", () => {
        assert.throws(() => shallow(
            <MenuItem iconName="style" text="Style" submenu={[{text: "foo"}]}>
                <MenuItem text="bar" />
            </MenuItem>,
        ), Errors.MENU_CHILDREN_SUBMENU_MUTEX);
    });

    it("Clicking MenuItem triggers onClick prop", () => {
        const onClick = sinon.spy();
        shallow(<MenuItem text="Graph" onClick={onClick} />).find("a").simulate("click");
        assert.isTrue(onClick.calledOnce);
    });

    it("Clicking disabled MenuItem does not trigger onClick prop", () => {
        const onClick = sinon.spy();
        shallow(<MenuItem disabled text="Graph" onClick={onClick} />).find("a").simulate("click");
        assert.isTrue(onClick.notCalled);
    });

    it("shouldDismissPopover=false prevents a clicked MenuItem from closing the Popover automatically", () => {
        const handleClose = sinon.spy();
        const menu = <MenuItem text="Graph" shouldDismissPopover={false} />;
        const wrapper = mount(
            <Popover content={menu} isOpen={true} inline={true} onInteraction={handleClose}>
                <button className="pt-button" type="button" />
            </Popover>,
        );
        wrapper.find(MenuItem).find("a").simulate("click");
        assert.isTrue(handleClose.notCalled);
    });

    it("Factory renders MenuItem", () => {
        const wrapper = shallow(MenuItemFactory({ iconName: "graph", text: "Object" }));
        assert.lengthOf(wrapper.find(".pt-icon-graph"), 1);
        assert.strictEqual(wrapper.text(), "Object");
    });

    /**
     *  If debugging `gulp karma-unit-core` in an actual browser,
     *  the window size should be set to 480 width x 800 height (identical to PhantomJS).
     */
    describe("dynamic layout:", () => {
        let childContainer: HTMLElement;
        let menuItem: MenuItem;

        before(() => {
            childContainer = document.createElement("div");

            // karma's window size is by default 480px, so need to confine space
            childContainer.style.width = "1px";
            childContainer.style.marginLeft = `${document.documentElement.clientWidth - 30}px`;
            document.documentElement.appendChild(childContainer);
        });

        afterEach(() => ReactDOM.unmountComponentAtNode(childContainer));

        it("children can display left", (done) => {
            menuItem = ReactDOM.render((
                <MenuItem iconName="style" text="Style">
                    <MenuItem iconName="bold" text="Bold" />
                    <MenuItem iconName="italic" text="Italic" />
                    <MenuItem iconName="underline" text="Underline" />
                </MenuItem>
            ), childContainer) as MenuItem;
            hoverOverTarget(0, () => {
                assert.isNotNull(childContainer.query(`.${Classes.ALIGN_LEFT}`));
                done();
            });
        });

        it("useSmartPositioning=false prevents display left behavior", (done) => {
            menuItem = ReactDOM.render((
                <MenuItem iconName="style" text="Style" useSmartPositioning={false}>
                    <MenuItem iconName="bold" text="Bold" />
                    <MenuItem iconName="italic" text="Italic" />
                    <MenuItem iconName="underline" text="Underline" />
                </MenuItem>
            ), childContainer) as MenuItem;
            hoverOverTarget(0, () => {
                assert.isNotNull(childContainer.query(`.${Classes.OVERLAY_OPEN}`));
                assert.isNull(childContainer.query(`.${Classes.ALIGN_LEFT}`));
                done();
            });
        });

        it("children will continue displaying in the same direction if possible", (done) => {
            menuItem = ReactDOM.render((
                <MenuItem iconName="style" text="Style">
                    <MenuItem iconName="bold" text="Bold" />
                    <MenuItem iconName="italic" text="Italic" />
                    <MenuItem iconName="underline" text="Underline" />
                    <MenuItem iconName="style" text="Style">
                        <MenuItem iconName="bold" text="Bold" />
                        <MenuItem iconName="italic" text="Italic" />
                        <MenuItem iconName="underline" text="Underline" />
                    </MenuItem>
                </MenuItem>
            ), childContainer) as MenuItem;
            hoverOverTarget(0, () => {
                hoverOverTarget(4, () => {
                    assertClassNameCount(Classes.ALIGN_LEFT, 2);
                    done();
                });
            });
        });

        it("children will flip direction after no more room in the existing direction", (done) => {
            menuItem = ReactDOM.render((
                <MenuItem iconName="style" text="Style">
                    <MenuItem iconName="bold" text="Bold" />
                    <MenuItem iconName="italic" text="Italic" />
                    <MenuItem iconName="underline" text="Underline" />
                    <MenuItem iconName="style" text="Style">
                        <MenuItem iconName="bold" text="Bold" />
                        <MenuItem iconName="italic" text="Italic" />
                        <MenuItem iconName="underline" text="Underline" />
                        <MenuItem iconName="style" text="Style">
                            <MenuItem iconName="bold" text="Bold" />
                            <MenuItem iconName="italic" text="Italic" />
                            <MenuItem iconName="underline" text="Underline" />
                        </MenuItem>
                    </MenuItem>
                </MenuItem>
            ), childContainer) as MenuItem;
            hoverOverTarget(0, () => {
                hoverOverTarget(4, () => {
                    hoverOverTarget(8, () => {
                        assertClassNameCount(Classes.OVERLAY_OPEN, 3);
                        assertClassNameCount(Classes.ALIGN_LEFT, 2);
                        done();
                    });
                });
            });
        });

        it("submenu as props can display left", (done) => {
            const items: IMenuItemProps[] = [
                { iconName: "align-left", text: "Align Left" },
                { iconName: "align-center", text: "Align Center" },
                { iconName: "align-right", text: "Align Right" },
            ];
            menuItem = ReactDOM.render((
                <MenuItem iconName="align" text="Alignment" submenu={items} />
            ), childContainer) as MenuItem;
            hoverOverTarget(0, () => {
                assert.isNotNull(childContainer.query(`.${Classes.ALIGN_LEFT}`));
                done();
            });
        });

        it("submenu as props can inherit submenuViewportMargin prop from parent", (done) => {
            const items: IMenuItemProps[] = [
                { iconName: "align-left", text: "Align Left" },
                { iconName: "align-center", text: "Align Center" },
                { iconName: "align-right", submenu: [
                    { iconName: "align-left", text: "Align Left" },
                    { iconName: "align-center", text: "Align Center" },
                    { iconName: "align-right", text: "Align Right" },
                ], text: "Align Right" },
            ];
            menuItem = ReactDOM.render((
                <MenuItem iconName="align" submenu={items} submenuViewportMargin={{ left: 150 }} text="Alignment" />
            ), childContainer) as MenuItem;
            hoverOverTarget(0, () => {
                hoverOverTarget(3, () => {
                    assertClassNameCount(Classes.ALIGN_LEFT, 1);
                    assertClassNameCount(Classes.OVERLAY_OPEN, 2);
                    done();
                });
            });
        });

        function hoverOverTarget(index: number, handler: () => void, timeout = 150) {
            // if popover's hoverOpenDelay !== 0 this function needs to also be slowed down;
            // otherwise, the submenu will not have been opened yet for the test
            const a = TestUtils.scryRenderedDOMComponentsWithTag(menuItem, "a")[index];
            // TODO: (BLUEPRINT-536) try and find an alternative to SimulateNative
            (TestUtils as any).SimulateNative.mouseOver(a);
            return setTimeout(handler, timeout);
        }

        function assertClassNameCount(className: string, count: number) {
            assert.strictEqual(childContainer.queryAll(`.${className}`).length, count, `${count}x .${className}`);
        }
    });
});

describe("MenuDivider", () => {
    it("React renders MenuDivider", () => {
        const divider = shallow(<MenuDivider />);
        assert.isTrue(divider.hasClass(Classes.MENU_DIVIDER));
    });

    it("React renders MenuDivider with title", () => {
        const divider = shallow(<MenuDivider title="Subject" />);
        assert.isFalse(divider.hasClass(Classes.MENU_DIVIDER));
        assert.isTrue(divider.hasClass(Classes.MENU_HEADER));
        assert.strictEqual(divider.text(), "Subject");
    });

    it("Factory renders MenuDivider", () => {
        const divider = shallow(MenuDividerFactory({ title: "Object" }));
        assert.isTrue(divider.hasClass(Classes.MENU_HEADER));
    });
});

describe("Menu", () => {
    it("React renders Menu with children", () => {
        const menu = shallow(<Menu><MenuItem iconName="graph" text="Graph" /></Menu>);
        assert.isTrue(menu.hasClass(Classes.MENU));
        assert.lengthOf(menu.find(MenuItem), 1);
    });

    it("Factory renders Menu", () => {
        const menu = shallow(MenuFactory({}, MenuItemFactory({iconName: "layout", text: "Layout"})));
        assert.isTrue(menu.hasClass(Classes.MENU));
        assert.lengthOf(menu.find(MenuItem), 1);
    });
});

function findSubmenu(wrapper: ShallowWrapper<any, any>) {
    return wrapper.find(Popover).prop("content") as
        (React.ReactElement<IMenuProps & { children: Array<React.ReactElement<IMenuItemProps>> }>);
}
