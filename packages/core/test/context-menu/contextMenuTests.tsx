/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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
import classNames from "classnames";
import { mount, ReactWrapper } from "enzyme";
import React, { createRef } from "react";
import { spy } from "sinon";

import {
    Classes,
    ContextMenu,
    ContextMenuContentProps,
    ContextMenuProps,
    Keys,
    Menu,
    MenuItem,
    Popover,
    PopoverInteractionKind,
    Tooltip,
    TooltipProps,
} from "../../src";

const MENU_ITEMS = [
    <MenuItem key="left" icon="align-left" text="Align Left" />,
    <MenuItem key="center" icon="align-center" text="Align Center" />,
    <MenuItem key="right" icon="align-right" text="Align Right" />,
];
const MENU = <Menu>{MENU_ITEMS}</Menu>;
const TARGET_CLASSNAME = "test-target";
const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP}`;
const COMMON_TOOLTIP_PROPS: Partial<TooltipProps> = {
    hoverCloseDelay: 0,
    hoverOpenDelay: 0,
    usePortal: false,
};

describe("ContextMenu", () => {
    describe("basic usage", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover).prop("isOpen"));
        });

        it("renders custom HTML tag if specified", () => {
            const ctxMenu = mountTestMenu({ tagName: "span" });
            assert.isTrue(ctxMenu.find(`span.${Classes.CONTEXT_MENU}`).exists());
        });

        it("supports custom refs", () => {
            const ref = createRef<HTMLElement>();
            mountTestMenu({ className: "test-container", ref });
            assert.isDefined(ref.current);
            assert.isTrue(ref.current?.classList.contains("test-container"));
        });

        it("closes popover on ESC key press", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            ctxMenu
                .find(`.${Classes.OVERLAY_OPEN}`)
                .hostNodes()
                .simulate("keydown", {
                    nativeEvent: new KeyboardEvent("keydown"),
                    which: Keys.ESCAPE,
                });
            assert.isFalse(ctxMenu.find(Popover).prop("isOpen"));
        });

        it("clicks inside popover don't propagate to context menu wrapper", () => {
            const itemClickSpy = spy();
            const wrapperClickSpy = spy();
            const ctxMenu = mountTestMenu({
                content: (
                    <Menu>
                        <MenuItem data-testid="item" text="item" onClick={itemClickSpy} />
                    </Menu>
                ),
                onClick: wrapperClickSpy,
            });
            openCtxMenu(ctxMenu);
            ctxMenu.find("[data-testid='item']").hostNodes().simulate("click");
            assert.isTrue(itemClickSpy.calledOnce, "menu item click handler should be called once");
            assert.isFalse(wrapperClickSpy.called, "ctx menu wrapper click handler should not be called");
        });

        function mountTestMenu(props: Partial<ContextMenuProps> = {}) {
            return mount(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
                    <div className={TARGET_CLASSNAME} />
                </ContextMenu>,
            );
        }
    });

    describe("advanced usage (child render function API)", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover).prop("isOpen"));
        });

        it("handles context menu event, even if content is undefined", () => {
            const ctxMenu = mountTestMenu({ content: undefined });
            let clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo(undefined));
            openCtxMenu(ctxMenu);
            clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo({ left: 10, top: 10 }));
        });

        it("does not handle context menu event when disabled={true}", () => {
            const ctxMenu = mountTestMenu({ disabled: true });
            let clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo(undefined));
            openCtxMenu(ctxMenu);
            clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            assert.strictEqual(clickedInfo.text().trim(), renderClickedInfo(undefined));
        });

        function mountTestMenu(props?: Partial<ContextMenuProps>) {
            return mount(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
                    {ctxMenuProps => (
                        <div
                            className={classNames(ctxMenuProps.className, TARGET_CLASSNAME)}
                            onContextMenu={ctxMenuProps.onContextMenu}
                        >
                            {ctxMenuProps.popover}
                            <span data-testid="content-clicked-info">
                                {renderClickedInfo(ctxMenuProps.contentProps.targetOffset)}
                            </span>
                        </div>
                    )}
                </ContextMenu>,
            );
        }
    });

    describe("theming", () => {
        it("detects dark theme", () => {
            const wrapper = mount(
                <div className={Classes.DARK}>
                    <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <div className={TARGET_CLASSNAME} />
                    </ContextMenu>
                </div>,
            );

            openCtxMenu(wrapper);
            const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
            assert.isTrue(
                ctxMenuPopover.hasClass(Classes.DARK),
                "ContextMenu popover should be open WITH dark theme applied",
            );
        });

        it("detects theme change (dark -> light)", () => {
            const wrapper = mount(
                <div className={Classes.DARK}>
                    <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <div className={TARGET_CLASSNAME} />
                    </ContextMenu>
                </div>,
            );

            wrapper.setProps({ className: undefined });
            openCtxMenu(wrapper);
            const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
            assert.isFalse(
                ctxMenuPopover.hasClass(Classes.DARK),
                "ContextMenu popover should be open WITHOUT dark theme applied",
            );
        });
    });

    describe("interacting with other components", () => {
        describe("with one level of nesting", () => {
            it("closes parent Tooltip", () => {
                const wrapper = mount(
                    <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                        <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                            <div className={TARGET_CLASSNAME} />
                        </ContextMenu>
                    </Tooltip>,
                );

                openTooltip(wrapper);
                openCtxMenu(wrapper);
                assert.isTrue(
                    wrapper.find(ContextMenu).find(Popover).prop("isOpen"),
                    "ContextMenu popover should be open",
                );
                assertTooltipClosed(wrapper);
                closeCtxMenu(wrapper);
            });

            it("closes child Tooltip", () => {
                const wrapper = mount(
                    <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                            <div className={TARGET_CLASSNAME} />
                        </Tooltip>
                    </ContextMenu>,
                );

                openTooltip(wrapper);
                openCtxMenu(wrapper);
                assert.isTrue(
                    wrapper.find(ContextMenu).find(Popover).first().prop("isOpen"),
                    "ContextMenu popover should be open",
                );
                // this assertion is difficult to unit test, but we know that the tooltip closes in manual testing,
                // see https://github.com/palantir/blueprint/pull/4744
                // assertTooltipClosed(wrapper);
                closeCtxMenu(wrapper);
            });

            function assertTooltipClosed(wrapper: ReactWrapper) {
                assert.isFalse(
                    wrapper
                        .find(Popover)
                        .find({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                        .state("isOpen"),
                    "Tooltip should be closed",
                );
            }
        });

        describe("with multiple layers of Tooltip nesting", () => {
            const OUTER_TARGET_CLASSNAME = "outer-target";

            describe("ContextMenu > Tooltip > ContextMenu", () => {
                it("closes tooltip when inner menu opens", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper);
                    assert.lengthOf(wrapper.find(TOOLTIP_SELECTOR), 1, "tooltip should be open");
                    openCtxMenu(wrapper);
                    assertTooltipClosed(wrapper);
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu popover should be open");
                    assert.isTrue(ctxMenuPopover.text().includes("first"), "inner ContextMenu should be open");
                    closeCtxMenu(wrapper);
                });

                it("closes tooltip when outer menu opens", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper, OUTER_TARGET_CLASSNAME);
                    assert.lengthOf(wrapper.find(TOOLTIP_SELECTOR), 1, "tooltip should be open");
                    openCtxMenu(wrapper, OUTER_TARGET_CLASSNAME);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    // assertTooltipClosed(wrapper);
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu popover should be open");
                    assert.isTrue(ctxMenuPopover.text().includes("Align"), "outer ContextMenu should be open");
                    closeCtxMenu(wrapper);
                });

                function mountTestCase() {
                    /**
                     * Renders a component tree that looks like this:
                     *
                     *  ––––––––––––––––––––––––––––––––––––––
                     * |   outer ctx menu                     |
                     * |   ––––––––––––––––––––––––––––––––   |
                     * |  |   tooltip target               |  |
                     * |  |   ––––––––––––––––––––––––––   |  |
                     * |  |  | inner ctx menu w/ target |  |  |
                     * |  |  |                          |  |  |
                     * |  |   ––––––––––––––––––––––––––   |  |
                     * |   ––––––––––––––––––––––––––––––––   |
                     *  ––––––––––––––––––––––––––––––––––––––
                     *
                     * It is possible to click on just the outer ctx menu, hover on just the tooltip target
                     * (and not the inner target), and to click on the inner target.
                     */
                    return mount(
                        <ContextMenu
                            content={MENU}
                            popoverProps={{ transitionDuration: 0 }}
                            style={{ width: 100, height: 100, padding: 20, background: "red" }}
                        >
                            <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                                <div className={OUTER_TARGET_CLASSNAME} style={{ padding: 20, background: "green" }}>
                                    <ContextMenu
                                        content={
                                            <Menu>
                                                <MenuItem text="first" />
                                                <MenuItem text="second" />
                                                <MenuItem text="third" />
                                            </Menu>
                                        }
                                        popoverProps={{ transitionDuration: 0 }}
                                    >
                                        <div
                                            className={TARGET_CLASSNAME}
                                            style={{ width: 20, height: 20, background: "blue" }}
                                        />
                                    </ContextMenu>
                                </div>
                            </Tooltip>
                        </ContextMenu>,
                    );
                }

                function assertTooltipClosed(wrapper: ReactWrapper) {
                    assert.isFalse(
                        wrapper
                            .find(Popover)
                            .find({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                            .state("isOpen"),
                        "Tooltip should be closed",
                    );
                }
            });

            describe("Tooltip > ContextMenu > Tooltip", () => {
                const OUTER_TOOLTIP_CONTENT = "hello";
                const INNER_TOOLTIP_CONTENT = "goodbye";
                const CTX_MENU_CLASSNAME = "test-ctx-menu";

                it("closes inner tooltip when menu opens (after hovering inner target)", () => {
                    const wrapper = mountTestCase();
                    wrapper.find(`.${OUTER_TARGET_CLASSNAME}`).simulate("mouseenter");
                    openTooltip(wrapper);
                    assert.lengthOf(wrapper.find(`.${Classes.TOOLTIP}`), 1, "tooltip should be open");
                    openCtxMenu(wrapper);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    assert.isFalse(
                        wrapper
                            .find(Popover)
                            .find({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                            .first()
                            .state("isOpen"),
                        "Tooltip should be closed",
                    );
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu popover should be open");
                    closeCtxMenu(wrapper);
                    wrapper.find(`.${OUTER_TARGET_CLASSNAME}`).simulate("mouseleave");
                });

                it("closes outer tooltip when menu opens (after hovering ctx menu target)", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper, CTX_MENU_CLASSNAME);
                    assert.lengthOf(wrapper.find(`.${Classes.TOOLTIP}`), 1, "tooltip should be open");
                    openCtxMenu(wrapper, CTX_MENU_CLASSNAME);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    // assert.isFalse(
                    //     wrapper
                    //         .find(Popover)
                    //         .find({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                    //         .last()
                    //         .state("isOpen"),
                    //     "Tooltip should be closed",
                    // );
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu popover should be open");
                    assert.isTrue(ctxMenuPopover.text().includes("Align"), "outer ContextMenu should be open");
                    closeCtxMenu(wrapper);
                    wrapper.find(`.${OUTER_TARGET_CLASSNAME}`).simulate("mouseleave");
                });

                function mountTestCase() {
                    /**
                     * Renders a component tree that looks like this:
                     *
                     *  ––––––––––––––––––––––––––––––––––––––
                     * |  outer tooltip                       |
                     * |   ––––––––––––––––––––––––––––––––   |
                     * |  |  ctx menu target               |  |
                     * |  |   ––––––––––––––––––––––––––   |  |
                     * |  |  | inner tooltip w/ target  |  |  |
                     * |  |  |                          |  |  |
                     * |  |   ––––––––––––––––––––––––––   |  |
                     * |   ––––––––––––––––––––––––––––––––   |
                     *  ––––––––––––––––––––––––––––––––––––––
                     *
                     * It is possible to hover on just the outer tooltip area, click on just the ctx menu target
                     * (and not trigger the inner tooltip), and to click/hover on the inner target.
                     */
                    return mount(
                        <Tooltip content={OUTER_TOOLTIP_CONTENT} {...COMMON_TOOLTIP_PROPS}>
                            <div
                                className={OUTER_TARGET_CLASSNAME}
                                style={{ width: 100, height: 100, padding: 20, background: "green" }}
                            >
                                <ContextMenu
                                    className={CTX_MENU_CLASSNAME}
                                    content={MENU}
                                    popoverProps={{ transitionDuration: 0 }}
                                    style={{ padding: 20, background: "red" }}
                                >
                                    <Tooltip content={INNER_TOOLTIP_CONTENT} {...COMMON_TOOLTIP_PROPS}>
                                        <div
                                            className={TARGET_CLASSNAME}
                                            style={{ width: 20, height: 20, background: "blue" }}
                                        />
                                    </Tooltip>
                                </ContextMenu>
                            </div>
                        </Tooltip>,
                    );
                }
            });
        });

        function openTooltip(wrapper: ReactWrapper, targetClassName = TARGET_CLASSNAME) {
            const target = wrapper.find(`.${targetClassName}`);
            if (!target.exists()) {
                assert.fail("tooltip target not found in mounted test case");
            }
            target.hostNodes().closest(`.${Classes.POPOVER_TARGET}`).simulate("mouseenter");
        }

        function closeCtxMenu(wrapper: ReactWrapper) {
            const backdrop = wrapper.find(`.${Classes.CONTEXT_MENU_BACKDROP}`);
            if (backdrop.exists()) {
                backdrop.simulate("click");
                wrapper.update();
            }
        }
    });

    function openCtxMenu(ctxMenu: ReactWrapper, targetClassName = TARGET_CLASSNAME) {
        const target = ctxMenu.find(`.${targetClassName}`);
        if (!target.exists()) {
            assert.fail("Context menu target not found in mounted test case");
        }
        const { clientLeft, clientTop } = target.hostNodes().getDOMNode();
        target
            .hostNodes()
            .simulate("contextmenu", { defaultPrevented: false, clientX: clientLeft + 10, clientY: clientTop + 10 })
            .update();
    }

    function renderClickedInfo(targetOffset: ContextMenuContentProps["targetOffset"]) {
        return targetOffset === undefined ? "" : `Clicked at (${targetOffset.left}, ${targetOffset.top})`;
    }
});
