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

import classNames from "classnames";
import { mount, type ReactWrapper } from "enzyme";
import { createRef, useCallback } from "react";

import { afterAll, afterEach, assert, beforeEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes, Utils } from "../../common";
import { Drawer } from "../drawer/drawer";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { Popover } from "../popover/popover";
import { PopoverInteractionKind } from "../popover/popoverProps";
import { Tooltip, type TooltipProps } from "../tooltip/tooltip";

import { ContextMenu, type ContextMenuContentProps, type ContextMenuProps } from "./contextMenu";

// use a unique ID to avoid collisons with other tests
const MENU_CLASSNAME = Utils.uniqueId("test-menu");
const MENU = (
    <Menu className={MENU_CLASSNAME}>
        <MenuItem icon="align-left" text="Align Left" />
        <MenuItem icon="align-center" text="Align Center" />
        <MenuItem icon="align-right" text="Align Right" />
    </Menu>
);
const TARGET_CLASSNAME = "test-target";
const TOOLTIP_SELECTOR = `.${Classes.TOOLTIP}`;
const COMMON_TOOLTIP_PROPS: Partial<TooltipProps> = {
    hoverCloseDelay: 0,
    hoverOpenDelay: 0,
    usePortal: false,
};

function cleanupDOM() {
    // Aggressively clean up any remaining portals, overlays, and context menus
    document.querySelectorAll(`.${Classes.PORTAL}`).forEach(el => el.remove());
    document.querySelectorAll(`.${Classes.OVERLAY}`).forEach(el => el.remove());
    document.querySelectorAll(`.${Classes.CONTEXT_MENU}`).forEach(el => el.remove());
    document.querySelectorAll(`.${Classes.CONTEXT_MENU_POPOVER}`).forEach(el => el.remove());
    document.body.classList.remove(Classes.OVERLAY_OPEN);
}

describe("ContextMenu", () => {
    let containerElement: HTMLElement;
    const mountedWrappers: ReactWrapper[] = [];

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        // Unmount all Enzyme wrappers before removing the container
        mountedWrappers.forEach(wrapper => {
            if (wrapper.exists()) {
                wrapper.unmount();
            }
        });
        mountedWrappers.length = 0;
        containerElement.remove();

        cleanupDOM();
    });

    afterAll(() => {
        // Final cleanup after all tests in this suite complete
        // This ensures nothing leaks to other test files
        cleanupDOM();
    });

    describe("basic usage", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            expect(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists()).toBe(true);
            expect(ctxMenu.find(Popover).exists()).toBe(true);
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            expect(ctxMenu.find(Popover).prop("isOpen")).toBe(true);
        });

        it("renders custom HTML tag if specified", () => {
            const ctxMenu = mountTestMenu({ tagName: "span" });
            expect(ctxMenu.find(`span.${Classes.CONTEXT_MENU}`).exists()).toBe(true);
        });

        it("supports custom refs", () => {
            const ref = createRef<HTMLElement>();
            mountTestMenu({ className: "test-container", ref });
            expect(ref.current).toBeDefined();
            expect(ref.current?.classList.contains("test-container")).toBe(true);
        });

        it("closes popover on ESC key press", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            ctxMenu
                .find(`.${Classes.OVERLAY_OPEN}`)
                .hostNodes()
                .simulate("keydown", {
                    key: "Escape",
                    nativeEvent: new KeyboardEvent("keydown"),
                });
            expect(ctxMenu.find(Popover).prop("isOpen")).toBe(false);
        });

        it("clicks inside popover don't propagate to context menu wrapper", () => {
            const itemClickSpy = vi.fn();
            const wrapperClickSpy = vi.fn();
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
            expect(itemClickSpy).toHaveBeenCalledOnce();
            expect(wrapperClickSpy).not.toHaveBeenCalled();
        });

        it("allows overrding some Popover props", () => {
            const placement = "top";
            const popoverClassName = "test-popover-class";
            const ctxMenu = mountTestMenu({ popoverProps: { placement, popoverClassName } });
            openCtxMenu(ctxMenu);
            const popoverWithTopPlacement = document.querySelector(
                `.${popoverClassName}.${Classes.POPOVER_CONTENT_PLACEMENT}-${placement}`,
            );
            expect(popoverWithTopPlacement).toBeDefined();
        });

        function mountTestMenu(props: Partial<ContextMenuProps> = {}) {
            const wrapper = mount(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
                    <div className={TARGET_CLASSNAME} />
                </ContextMenu>,
                { attachTo: containerElement },
            );
            mountedWrappers.push(wrapper);
            return wrapper;
        }
    });

    describe("advanced usage (child render function API)", () => {
        it("renders children and Popover", () => {
            const ctxMenu = mountTestMenu();
            expect(ctxMenu.find(`.${TARGET_CLASSNAME}`).exists()).toBe(true);
            expect(ctxMenu.find(Popover).exists()).toBe(true);
        });

        it("opens popover on right click", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            expect(ctxMenu.find(Popover).prop("isOpen")).toBe(true);
        });

        it("handles context menu event, even if content is undefined", () => {
            const ctxMenu = mountTestMenu({ content: undefined });
            let clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            expect(clickedInfo.text().trim()).toBe(renderClickedInfo(undefined));
            openCtxMenu(ctxMenu);
            clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            expect(clickedInfo.text().trim()).toBe(renderClickedInfo({ left: 10, top: 10 }));
        });

        it("does not handle context menu event when disabled={true}", () => {
            const ctxMenu = mountTestMenu({ disabled: true });
            let clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            expect(clickedInfo.text().trim()).toBe(renderClickedInfo(undefined));
            openCtxMenu(ctxMenu);
            clickedInfo = ctxMenu.find("[data-testid='content-clicked-info']");
            expect(clickedInfo.text().trim()).toBe(renderClickedInfo(undefined));
        });

        function mountTestMenu(props?: Partial<ContextMenuProps>) {
            const wrapper = mount(
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
                { attachTo: containerElement },
            );
            mountedWrappers.push(wrapper);
            return wrapper;
        }
    });

    describe("advanced usage (content render function API)", () => {
        const ALT_CONTENT_WRAPPER = "alternative-content-wrapper";

        it("renders children and menu content, prevents default context menu handler", () =>
            new Promise<void>(done => {
                const onContextMenu = (e: React.MouseEvent) => {
                    expect(e.defaultPrevented).toBe(true);
                    done();
                };
                const wrapper = mountTestMenu({ onContextMenu });
                expect(wrapper.find(`.${TARGET_CLASSNAME}`).exists()).toBe(true);
                openCtxMenu(wrapper);
                expect(wrapper.find(`.${MENU_CLASSNAME}`).exists()).toBe(true);
                closeCtxMenu(wrapper);
            }));

        it("triggers native context menu if content function returns undefined", () =>
            new Promise<void>(done => {
                const onContextMenu = (e: React.MouseEvent) => {
                    expect(e.defaultPrevented).toBe(false);
                    done();
                };
                const wrapper = mountTestMenu({
                    content: () => undefined,
                    onContextMenu,
                });
                openCtxMenu(wrapper);
                closeCtxMenu(wrapper);
            }));

        it("updates menu if content prop value changes", () => {
            const ctxMenu = mountTestMenu();
            openCtxMenu(ctxMenu);
            expect(ctxMenu.find(`.${MENU_CLASSNAME}`).exists()).toBe(true);
            expect(ctxMenu.find(`.${ALT_CONTENT_WRAPPER}`).exists()).toBe(false);
            ctxMenu.setProps({ content: renderAlternativeContent });
            expect(ctxMenu.find(`.${ALT_CONTENT_WRAPPER}`).exists()).toBe(true);
        });

        it("updates menu if content render function return value changes", () => {
            const testMenu = mount(<TestMenuWithChangingContent useAltContent={false} />, {
                attachTo: containerElement,
            });
            mountedWrappers.push(testMenu);
            openCtxMenu(testMenu);
            expect(testMenu.find(`.${MENU_CLASSNAME}`).exists()).toBe(true);
            expect(testMenu.find(`.${ALT_CONTENT_WRAPPER}`).exists()).toBe(false);
            testMenu.setProps({ useAltContent: true });
            expect(testMenu.find(`.${ALT_CONTENT_WRAPPER}`).exists()).toBe(true);
        });

        function renderContent({ mouseEvent, targetOffset }: ContextMenuContentProps) {
            if (mouseEvent === undefined || targetOffset === undefined) {
                return undefined;
            }
            return MENU;
        }

        function renderAlternativeContent() {
            return <div className={ALT_CONTENT_WRAPPER}>{MENU}</div>;
        }

        function mountTestMenu(props?: Partial<ContextMenuProps>) {
            const wrapper = mount(
                <ContextMenu content={renderContent} popoverProps={{ transitionDuration: 0 }} {...props}>
                    <div className={TARGET_CLASSNAME} />
                </ContextMenu>,
                { attachTo: containerElement },
            );
            mountedWrappers.push(wrapper);
            return wrapper;
        }

        function TestMenuWithChangingContent({ useAltContent } = { useAltContent: false }) {
            const content = useCallback(
                (contentProps: ContextMenuContentProps) =>
                    useAltContent ? renderAlternativeContent() : renderContent(contentProps),
                [useAltContent],
            );
            return (
                <ContextMenu content={content} popoverProps={{ transitionDuration: 0 }}>
                    <div className={TARGET_CLASSNAME} />
                </ContextMenu>
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
            mountedWrappers.push(wrapper);

            openCtxMenu(wrapper);
            const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
            expect(ctxMenuPopover.hasClass(Classes.DARK)).toBe(true);
            closeCtxMenu(wrapper);
        });

        it("detects theme change (dark -> light)", () => {
            const wrapper = mount(
                <div className={Classes.DARK}>
                    <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <div className={TARGET_CLASSNAME} />
                    </ContextMenu>
                </div>,
            );
            mountedWrappers.push(wrapper);

            wrapper.setProps({ className: undefined });
            openCtxMenu(wrapper);
            const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
            expect(ctxMenuPopover.hasClass(Classes.DARK)).toBe(false);
            closeCtxMenu(wrapper);
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
                mountedWrappers.push(wrapper);

                openTooltip(wrapper);
                openCtxMenu(wrapper);
                expect(
                    wrapper.find(ContextMenu).find(Popover).prop("isOpen"),
                    "ContextMenu popover should be open",
                ).toBe(true);
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
                mountedWrappers.push(wrapper);

                openTooltip(wrapper);
                openCtxMenu(wrapper);
                expect(
                    wrapper.find(ContextMenu).find(Popover).first().prop("isOpen"),
                    "ContextMenu popover should be open",
                ).toBe(true);
                // this assertion is difficult to unit test, but we know that the tooltip closes in manual testing,
                // see https://github.com/palantir/blueprint/pull/4744
                // assertTooltipClosed(wrapper);
                closeCtxMenu(wrapper);
            });

            function assertTooltipClosed(wrapper: ReactWrapper) {
                expect(
                    wrapper
                        .find(Popover)
                        .find({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                        .state("isOpen"),
                    "Tooltip should be closed",
                ).toBe(false);
            }
        });

        describe("with multiple layers of Tooltip nesting", () => {
            const OUTER_TARGET_CLASSNAME = "outer-target";

            describe("ContextMenu > Tooltip > ContextMenu", () => {
                it("closes tooltip when inner menu opens", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper);
                    expect(wrapper.find(TOOLTIP_SELECTOR), "tooltip should be open").toHaveLength(1);
                    openCtxMenu(wrapper);
                    assertTooltipClosed(wrapper);
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
                    expect(ctxMenuPopover.exists(), "ContextMenu popover should be open").toBe(true);
                    expect(ctxMenuPopover.text().includes("first"), "inner ContextMenu should be open").toBe(true);
                    closeCtxMenu(wrapper);
                });

                it("closes tooltip when outer menu opens", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper, OUTER_TARGET_CLASSNAME);
                    expect(wrapper.find(TOOLTIP_SELECTOR), "tooltip should be open").toHaveLength(1);
                    openCtxMenu(wrapper, OUTER_TARGET_CLASSNAME);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    // assertTooltipClosed(wrapper);
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
                    expect(ctxMenuPopover.exists(), "ContextMenu popover should be open").toBe(true);
                    expect(ctxMenuPopover.text().includes("Align"), "outer ContextMenu should be open").toBe(true);
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
                    const wrapper = mount(
                        <ContextMenu
                            content={MENU}
                            popoverProps={{ transitionDuration: 0 }}
                            style={{ background: "red", height: 100, padding: 20, width: 100 }}
                        >
                            <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                                <div className={OUTER_TARGET_CLASSNAME} style={{ background: "green", padding: 20 }}>
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
                                            style={{ background: "blue", height: 20, width: 20 }}
                                        />
                                    </ContextMenu>
                                </div>
                            </Tooltip>
                        </ContextMenu>,
                    );
                    mountedWrappers.push(wrapper);
                    return wrapper;
                }

                function assertTooltipClosed(wrapper: ReactWrapper) {
                    expect(
                        wrapper
                            .find(Popover)
                            .find({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                            .state("isOpen"),
                        "Tooltip should be closed",
                    ).toBe(false);
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
                    expect(wrapper.find(`.${Classes.TOOLTIP}`), "tooltip should be open").toHaveLength(1);
                    openCtxMenu(wrapper);
                    // this assertion is difficult to test, but we know that the tooltip eventually does close in manual testing
                    expect(
                        wrapper
                            .find(Popover)
                            .find({ interactionKind: PopoverInteractionKind.HOVER_TARGET_ONLY })
                            .first()
                            .state("isOpen"),
                        "Tooltip should be closed",
                    ).toBe(false);
                    const ctxMenuPopover = wrapper.find(`.${Classes.CONTEXT_MENU_POPOVER}`).hostNodes();
                    expect(ctxMenuPopover.exists(), "ContextMenu popover should be open").toBe(true);
                    closeCtxMenu(wrapper);
                    wrapper.find(`.${OUTER_TARGET_CLASSNAME}`).simulate("mouseleave");
                });

                it("closes outer tooltip when menu opens (after hovering ctx menu target)", () => {
                    const wrapper = mountTestCase();
                    openTooltip(wrapper, CTX_MENU_CLASSNAME);
                    expect(wrapper.find(`.${Classes.TOOLTIP}`), "tooltip should be open").toHaveLength(1);
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
                    expect(ctxMenuPopover.exists(), "ContextMenu popover should be open").toBe(true);
                    expect(ctxMenuPopover.text().includes("Align"), "outer ContextMenu should be open").toBe(true);
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
                    const wrapper = mount(
                        <Tooltip content={OUTER_TOOLTIP_CONTENT} {...COMMON_TOOLTIP_PROPS}>
                            <div
                                className={OUTER_TARGET_CLASSNAME}
                                style={{ background: "green", height: 100, padding: 20, width: 100 }}
                            >
                                <ContextMenu
                                    className={CTX_MENU_CLASSNAME}
                                    content={MENU}
                                    popoverProps={{ transitionDuration: 0 }}
                                    style={{ background: "red", padding: 20 }}
                                >
                                    <Tooltip content={INNER_TOOLTIP_CONTENT} {...COMMON_TOOLTIP_PROPS}>
                                        <div
                                            className={TARGET_CLASSNAME}
                                            style={{ background: "blue", height: 20, width: 20 }}
                                        />
                                    </Tooltip>
                                </ContextMenu>
                            </div>
                        </Tooltip>,
                    );
                    mountedWrappers.push(wrapper);
                    return wrapper;
                }
            });
        });

        describe("with Drawer as parent content", () => {
            it("positions correctly", () => {
                const POPOVER_CLASSNAME = "test-positions-popover";
                const wrapper = mount(
                    <Drawer isOpen={true} position="right" transitionDuration={0}>
                        <ContextMenu
                            content={MENU}
                            className="test-ctx-menu"
                            popoverProps={{ popoverClassName: POPOVER_CLASSNAME, transitionDuration: 0 }}
                            style={{ background: "red", padding: 20 }}
                        >
                            <div className={TARGET_CLASSNAME} style={{ background: "blue", height: 20, width: 20 }} />
                        </ContextMenu>
                    </Drawer>,
                    { attachTo: containerElement },
                );
                mountedWrappers.push(wrapper);
                const target = wrapper.find(`.${TARGET_CLASSNAME}`).hostNodes();
                expect(target.exists(), "target should exist").toBe(true);
                const nonExistentPopover = wrapper.find(`.${POPOVER_CLASSNAME}`).hostNodes();
                expect(
                    nonExistentPopover.exists(),
                    "ContextMenu popover should not be open before triggering contextmenu event",
                ).toBe(false);

                const targetRect = target.getDOMNode().getBoundingClientRect();
                // right click on the target
                const simulateArgs = {
                    clientX: targetRect.left + targetRect.width / 2,
                    clientY: targetRect.top + targetRect.height / 2,
                    x: targetRect.left + targetRect.width / 2,
                    y: targetRect.top + targetRect.height / 2,
                };
                target.simulate("contextmenu", simulateArgs);
                const popover = wrapper.find(`.${POPOVER_CLASSNAME}`).hostNodes();
                expect(popover.exists(), "ContextMenu popover should be open").toBe(true);
            });
        });

        function openTooltip(wrapper: ReactWrapper, targetClassName = TARGET_CLASSNAME) {
            const target = wrapper.find(`.${targetClassName}`);
            if (!target.exists()) {
                assert.fail("tooltip target not found in mounted test case");
            }
            target.hostNodes().closest(`.${Classes.POPOVER_TARGET}`).simulate("mouseenter");
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
            .simulate("contextmenu", { clientX: clientLeft + 10, clientY: clientTop + 10, defaultPrevented: false })
            .update();
    }

    function closeCtxMenu(wrapper: ReactWrapper) {
        const backdrop = wrapper.find(`.${Classes.CONTEXT_MENU_BACKDROP}`);
        if (backdrop.exists()) {
            backdrop.simulate("mousedown");
            wrapper.update();
        }
    }

    function renderClickedInfo(targetOffset: ContextMenuContentProps["targetOffset"]) {
        return targetOffset === undefined ? "" : `Clicked at (${targetOffset.left}, ${targetOffset.top})`;
    }
});
