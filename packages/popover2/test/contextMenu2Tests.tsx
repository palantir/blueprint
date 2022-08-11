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
import * as React from "react";
import { spy } from "sinon";

import { Classes as CoreClasses, Menu, MenuItem } from "@blueprintjs/core";

import {
    Classes,
    ContextMenu2,
    ContextMenu2ContentProps,
    ContextMenu2Props,
    Popover2,
    Popover2InteractionKind,
    Tooltip2,
    Tooltip2Props,
} from "../src";

const MENU_ITEMS = [
    <MenuItem key="left" icon="align-left" text="Align Left" />,
    <MenuItem key="center" icon="align-center" text="Align Center" />,
    <MenuItem key="right" icon="align-right" text="Align Right" />,
];
const MENU = <Menu>{MENU_ITEMS}</Menu>;
const TARGET_CLASSNAME = "test-target";
const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP2}`;
const COMMON_TOOLTIP_PROPS: Partial<Tooltip2Props> = {
    hoverCloseDelay: 0,
    hoverOpenDelay: 0,
    usePortal: false,
};

describe("ContextMenu2", () => {
    describe("basic usage", () => {
        it("renders children and Popover2", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover2).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover2).prop("isOpen"));
        });

        it("renders custom HTML tag if specified", () => {
            const ctxMenu = mountTestMenu({ tagName: "span" });
            assert.isTrue(ctxMenu.find(`span.${Classes.CONTEXT_MENU2}`).exists());
        });

        it("supports custom refs", () => {
            const ref = React.createRef<HTMLElement>();
            mountTestMenu({ className: "test-container", ref });
            assert.isDefined(ref.current);
            assert.isTrue(ref.current?.classList.contains("test-container"));
        });

        it("closes popover on ESC key press", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            ctxMenu
                .find(`.${CoreClasses.OVERLAY_OPEN}`)
                .hostNodes()
                .simulate("keydown", {
                    key: "Escape",
                    nativeEvent: new KeyboardEvent("keydown"),
                });
            assert.isFalse(ctxMenu.find(Popover2).prop("isOpen"));
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

        function mountTestMenu(props: Partial<ContextMenu2Props> = {}) {
            return mount(
                <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
                    <div className={TARGET_CLASSNAME} />
                </ContextMenu2>,
            );
        }
    });

    describe("advanced usage (child render function API)", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            assert.isTrue(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists());
            assert.isTrue(ctxMenu.find(Popover2).exists());
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            assert.isTrue(ctxMenu.find(Popover2).prop("isOpen"));
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

        function mountTestMenu(props?: Partial<ContextMenu2Props>) {
            return mount(
                <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
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
                </ContextMenu2>,
            );
        }
    });

    describe("theming", () => {
        it("detects dark theme", () => {
            const wrapper = mount(
                <div className={CoreClasses.DARK}>
                    <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <div className={TARGET_CLASSNAME} />
                    </ContextMenu2>
                </div>,
            );

            openCtxMenu(wrapper);
            const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU2_POPOVER2}`).hostNodes();
            assert.isTrue(
                ctxMenuPopover.hasClass(CoreClasses.DARK),
                "ContextMenu2 popover should be open WITH dark theme applied",
            );
        });

        it("detects theme change (dark -> light)", () => {
            const wrapper = mount(
                <div className={CoreClasses.DARK}>
                    <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <div className={TARGET_CLASSNAME} />
                    </ContextMenu2>
                </div>,
            );

            wrapper.setProps({ className: undefined });
            openCtxMenu(wrapper);
            const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU2_POPOVER2}`).hostNodes();
            assert.isFalse(
                ctxMenuPopover.hasClass(CoreClasses.DARK),
                "ContextMenu2 popover should be open WITHOUT dark theme applied",
            );
        });
    });

    describe("interacting with other components", () => {
        describe("with one level of nesting", () => {
            it("closes parent Tooltip2", () => {
                const wrapper = mount(
                    <Tooltip2 content="hello" {...COMMON_TOOLTIP_PROPS}>
                        <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }}>
                            <div className={TARGET_CLASSNAME} />
                        </ContextMenu2>
                    </Tooltip2>,
                );

                openTooltip(wrapper);
                openCtxMenu(wrapper);
                assert.isTrue(
                    wrapper.find(ContextMenu2).find(Popover2).prop("isOpen"),
                    "ContextMenu2 popover should be open",
                );
                assertTooltipClosed(wrapper);
                closeCtxMenu(wrapper);
            });

            it("closes child Tooltip2", () => {
                const wrapper = mount(
                    <ContextMenu2 content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <Tooltip2 content="hello" {...COMMON_TOOLTIP_PROPS}>
                            <div className={TARGET_CLASSNAME} />
                        </Tooltip2>
                    </ContextMenu2>,
                );

                openTooltip(wrapper);
                openCtxMenu(wrapper);
                assert.isTrue(
                    wrapper.find(ContextMenu2).find(Popover2).first().prop("isOpen"),
                    "ContextMenu2 popover should be open",
                );
                // this assertion is difficult to unit test, but we know that the tooltip closes in manual testing,
                // see https://github.com/palantir/blueprint/pull/4744
                // assertTooltipClosed(wrapper);
                closeCtxMenu(wrapper);
            });

            function assertTooltipClosed(wrapper: ReactWrapper) {
                assert.isFalse(
                    wrapper
                        .find(Popover2)
                        .find({ interactionKind: Popover2InteractionKind.HOVER_TARGET_ONLY })
                        .state("isOpen"),
                    "Tooltip2 should be closed",
                );
            }
        });

        describe("with multiple layers of Tooltip2 nesting", () => {
            const OUTER_TARGET_CLASSNAME = "outer-target";

            describe("ContextMenu2 > Tooltip2 > ContextMenu2", () => {
                it("closes tooltip when inner menu opens", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper);
                    assert.lengthOf(wrapper.find(TOOLTIP_SELECTOR), 1, "tooltip should be open");
                    openCtxMenu(wrapper);
                    assertTooltipClosed(wrapper);
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU2_POPOVER2}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu2 popover should be open");
                    assert.isTrue(ctxMenuPopover.text().includes("first"), "inner ContextMenu2 should be open");
                    closeCtxMenu(wrapper);
                });

                it("closes tooltip when outer menu opens", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper, OUTER_TARGET_CLASSNAME);
                    assert.lengthOf(wrapper.find(TOOLTIP_SELECTOR), 1, "tooltip should be open");
                    openCtxMenu(wrapper, OUTER_TARGET_CLASSNAME);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    // assertTooltipClosed(wrapper);
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU2_POPOVER2}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu2 popover should be open");
                    assert.isTrue(ctxMenuPopover.text().includes("Align"), "outer ContextMenu2 should be open");
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
                        <ContextMenu2
                            content={MENU}
                            popoverProps={{ transitionDuration: 0 }}
                            style={{ width: 100, height: 100, padding: 20, background: "red" }}
                        >
                            <Tooltip2 content="hello" {...COMMON_TOOLTIP_PROPS}>
                                <div className={OUTER_TARGET_CLASSNAME} style={{ padding: 20, background: "green" }}>
                                    <ContextMenu2
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
                                    </ContextMenu2>
                                </div>
                            </Tooltip2>
                        </ContextMenu2>,
                    );
                }

                function assertTooltipClosed(wrapper: ReactWrapper) {
                    assert.isFalse(
                        wrapper
                            .find(Popover2)
                            .find({ interactionKind: Popover2InteractionKind.HOVER_TARGET_ONLY })
                            .state("isOpen"),
                        "Tooltip2 should be closed",
                    );
                }
            });

            describe("Tooltip2 > ContextMenu2 > Tooltip2", () => {
                const OUTER_TOOLTIP_CONTENT = "hello";
                const INNER_TOOLTIP_CONTENT = "goodbye";
                const CTX_MENU_CLASSNAME = "test-ctx-menu";

                it("closes inner tooltip when menu opens (after hovering inner target)", () => {
                    const wrapper = mountTestCase();
                    wrapper.find(`.${OUTER_TARGET_CLASSNAME}`).simulate("mouseenter");
                    openTooltip(wrapper);
                    assert.lengthOf(wrapper.find(`.${Classes.TOOLTIP2}`), 1, "tooltip should be open");
                    openCtxMenu(wrapper);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    assert.isFalse(
                        wrapper
                            .find(Popover2)
                            .find({ interactionKind: Popover2InteractionKind.HOVER_TARGET_ONLY })
                            .first()
                            .state("isOpen"),
                        "Tooltip2 should be closed",
                    );
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU2_POPOVER2}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu2 popover should be open");
                    closeCtxMenu(wrapper);
                    wrapper.find(`.${OUTER_TARGET_CLASSNAME}`).simulate("mouseleave");
                });

                it("closes outer tooltip when menu opens (after hovering ctx menu target)", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper, CTX_MENU_CLASSNAME);
                    assert.lengthOf(wrapper.find(`.${Classes.TOOLTIP2}`), 1, "tooltip should be open");
                    openCtxMenu(wrapper, CTX_MENU_CLASSNAME);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    // assert.isFalse(
                    //     wrapper
                    //         .find(Popover2)
                    //         .find({ interactionKind: Popover2InteractionKind.HOVER_TARGET_ONLY })
                    //         .last()
                    //         .state("isOpen"),
                    //     "Tooltip2 should be closed",
                    // );
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU2_POPOVER2}`).hostNodes();
                    assert.isTrue(ctxMenuPopover.exists(), "ContextMenu2 popover should be open");
                    assert.isTrue(ctxMenuPopover.text().includes("Align"), "outer ContextMenu2 should be open");
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
                        <Tooltip2 content={OUTER_TOOLTIP_CONTENT} {...COMMON_TOOLTIP_PROPS}>
                            <div
                                className={OUTER_TARGET_CLASSNAME}
                                style={{ width: 100, height: 100, padding: 20, background: "green" }}
                            >
                                <ContextMenu2
                                    className={CTX_MENU_CLASSNAME}
                                    content={MENU}
                                    popoverProps={{ transitionDuration: 0 }}
                                    style={{ padding: 20, background: "red" }}
                                >
                                    <Tooltip2 content={INNER_TOOLTIP_CONTENT} {...COMMON_TOOLTIP_PROPS}>
                                        <div
                                            className={TARGET_CLASSNAME}
                                            style={{ width: 20, height: 20, background: "blue" }}
                                        />
                                    </Tooltip2>
                                </ContextMenu2>
                            </div>
                        </Tooltip2>,
                    );
                }
            });
        });

        function openTooltip(wrapper: ReactWrapper, targetClassName = TARGET_CLASSNAME) {
            const target = wrapper.find(`.${targetClassName}`);
            if (!target.exists()) {
                assert.fail("tooltip target not found in mounted test case");
            }
            target.hostNodes().closest(`.${Classes.POPOVER2_TARGET}`).simulate("mouseenter");
        }

        function closeCtxMenu(wrapper: ReactWrapper) {
            const backdrop = wrapper.find(`.${Classes.CONTEXT_MENU2_BACKDROP}`);
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

    function renderClickedInfo(targetOffset: ContextMenu2ContentProps["targetOffset"]) {
        return targetOffset === undefined ? "" : `Clicked at (${targetOffset.left}, ${targetOffset.top})`;
    }
});
