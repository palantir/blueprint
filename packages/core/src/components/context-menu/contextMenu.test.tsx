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

import { fireEvent, render, type RenderOptions, type RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useCallback, useState } from "react";

import { afterEach, describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";
import { OverlaysProvider } from "../../context/overlays/overlaysProvider";
import { Drawer } from "../drawer/drawer";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { Tooltip, type TooltipProps } from "../tooltip/tooltip";

import { ContextMenu, type ContextMenuContentProps, type ContextMenuProps } from "./contextMenu";

const MENU_CLASSNAME = "test-menu";
const MENU = (
    <Menu className={MENU_CLASSNAME}>
        <MenuItem icon="align-left" text="Align Left" />
        <MenuItem icon="align-center" text="Align Center" />
        <MenuItem icon="align-right" text="Align Right" />
    </Menu>
);
const COMMON_TOOLTIP_PROPS: Partial<TooltipProps> = {
    hoverCloseDelay: 0,
    hoverOpenDelay: 0,
    usePortal: false,
};

function renderWithOverlaysProvider(ui: React.ReactElement, renderOptions: RenderOptions = {}): RenderResult {
    return render(ui, {
        wrapper: OverlaysProvider,
        ...renderOptions,
    });
}

describe("ContextMenu", () => {
    afterEach(() => {
        document.querySelectorAll(`.${Classes.PORTAL}`).forEach(el => el.remove());
    });

    describe("basic usage", () => {
        it("renders children", () => {
            renderWithOverlaysProvider(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            expect(target).toBeInTheDocument();
        });

        it("opens popover on right click", async () => {
            const user = userEvent.setup();
            const { baseElement } = renderWithOverlaysProvider(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).not.toBeInTheDocument();
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toBeInTheDocument();
        });

        it("renders custom HTML tag if specified", () => {
            renderWithOverlaysProvider(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }} tagName="span">
                    target
                </ContextMenu>,
            );
            const target = screen.getByText("target");
            expect(target.tagName.toLowerCase()).toBe("span");
        });

        it("supports custom refs", () => {
            const ref = createRef<HTMLElement>();
            renderWithOverlaysProvider(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }} className="test" ref={ref}>
                    <div data-testid="target" />
                </ContextMenu>,
            );
            expect(ref.current).not.toBeNull();
            expect(ref.current).toHaveClass("test");
        });

        it("closes popover on ESC key press", async () => {
            const user = userEvent.setup();
            const { baseElement } = renderWithOverlaysProvider(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).not.toBeInTheDocument();
            await user.pointer({ keys: "[MouseRight>]", target });
            const overlayElement = baseElement.querySelector(`.${Classes.OVERLAY_OPEN}`);
            expect(overlayElement).toBeInTheDocument();

            fireEvent.keyDown(overlayElement!, { key: "Escape" });

            await waitFor(() => {
                expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).not.toBeInTheDocument();
            });
        });

        it("clicks inside popover don't propagate to context menu wrapper", async () => {
            const user = userEvent.setup();
            const itemClickSpy = vi.fn();
            const wrapperClickSpy = vi.fn();
            const { baseElement } = renderWithOverlaysProvider(
                <ContextMenu
                    content={
                        <Menu>
                            <MenuItem text="item" onClick={itemClickSpy} />
                        </Menu>
                    }
                    popoverProps={{ transitionDuration: 0 }}
                    onClick={wrapperClickSpy}
                >
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).not.toBeInTheDocument();
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toBeInTheDocument();

            await user.click(screen.getByText("item"));

            expect(itemClickSpy).toHaveBeenCalledOnce();
            expect(wrapperClickSpy).not.toHaveBeenCalled();
        });

        it("allows overriding some Popover props", async () => {
            const user = userEvent.setup();
            const placement = "top";
            const popoverClassName = "test-popover-class";
            const { baseElement } = renderWithOverlaysProvider(
                <ContextMenu content={MENU} popoverProps={{ placement, popoverClassName, transitionDuration: 0 }}>
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).not.toBeInTheDocument();
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toBeInTheDocument();

            const popoverWithClassName = baseElement.querySelector(
                `.${Classes.POPOVER}.${popoverClassName}.${Classes.POPOVER_CONTENT_PLACEMENT}-${placement}`,
            );
            expect(popoverWithClassName).toBeInTheDocument();
        });
    });

    describe("advanced usage (child render function API)", () => {
        it("renders children", () => {
            renderChildFnMenu();
            expect(screen.getByTestId("target")).toBeInTheDocument();
        });

        it("opens popover on right click", async () => {
            const user = userEvent.setup();
            const { baseElement } = renderChildFnMenu();
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toBeInTheDocument();
        });

        it("handles context menu event, even if content is undefined", async () => {
            const user = userEvent.setup();
            renderChildFnMenu({ content: undefined });
            expect(screen.getByTestId("content-clicked-info")).toHaveTextContent("");
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(screen.getByTestId("content-clicked-info")).toHaveTextContent(
                renderClickedInfo({ left: 0, top: 0 }),
            );
        });

        it("does not handle context menu event when disabled={true}", async () => {
            const user = userEvent.setup();
            renderChildFnMenu({ disabled: true });
            expect(screen.getByTestId("content-clicked-info")).toHaveTextContent("");
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(screen.getByTestId("content-clicked-info")).toHaveTextContent("");
        });

        function renderChildFnMenu(props?: Partial<ContextMenuProps>) {
            return renderWithOverlaysProvider(
                <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }} {...props}>
                    {ctxMenuProps => (
                        <div
                            className={ctxMenuProps.className}
                            data-testid="target"
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

        function renderClickedInfo(targetOffset: ContextMenuContentProps["targetOffset"]) {
            return targetOffset === undefined ? "" : `Clicked at (${targetOffset.left}, ${targetOffset.top})`;
        }
    });

    describe("advanced usage (content render function API)", () => {
        const ALT_CONTENT_WRAPPER = "alternative-content-wrapper";

        it("renders children and menu content, prevents default context menu handler", async () => {
            const user = userEvent.setup();
            const onContextMenu = vi.fn((event: React.MouseEvent) => {
                expect(event.defaultPrevented).toBe(true);
            });
            const { baseElement } = renderWithOverlaysProvider(
                <ContextMenu
                    content={renderContent}
                    popoverProps={{ transitionDuration: 0 }}
                    onContextMenu={onContextMenu}
                >
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });

            expect(baseElement.querySelector(`.${MENU_CLASSNAME}`)).toBeInTheDocument();
            expect(onContextMenu).toHaveBeenCalledOnce();
        });

        it("triggers native context menu if content function returns undefined", async () => {
            const user = userEvent.setup();
            const onContextMenu = vi.fn((event: React.MouseEvent) => {
                expect(event.defaultPrevented).toBe(false);
            });
            renderWithOverlaysProvider(
                <ContextMenu
                    content={() => undefined}
                    popoverProps={{ transitionDuration: 0 }}
                    onContextMenu={onContextMenu}
                >
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(onContextMenu).toHaveBeenCalledOnce();
        });

        it("updates menu if content prop value changes", async () => {
            const user = userEvent.setup();
            const { baseElement, rerender } = renderWithOverlaysProvider(
                <ContextMenu content={renderContent} popoverProps={{ transitionDuration: 0 }}>
                    <div data-testid="target" />
                </ContextMenu>,
            );
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });

            expect(baseElement.querySelector(`.${ALT_CONTENT_WRAPPER}`)).not.toBeInTheDocument();

            rerender(
                <ContextMenu content={renderAlternativeContent} popoverProps={{ transitionDuration: 0 }}>
                    <div data-testid="target" />
                </ContextMenu>,
            );

            expect(baseElement.querySelector(`.${ALT_CONTENT_WRAPPER}`)).toBeInTheDocument();
        });

        it("updates menu if content render function return value changes", async () => {
            const user = userEvent.setup();
            const { baseElement, rerender } = renderWithOverlaysProvider(
                <TestMenuWithChangingContent useAltContent={false} />,
            );
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });
            expect(baseElement.querySelector(`.${MENU_CLASSNAME}`)).toBeInTheDocument();
            expect(baseElement.querySelector(`.${ALT_CONTENT_WRAPPER}`)).not.toBeInTheDocument();
            rerender(<TestMenuWithChangingContent useAltContent={true} />);
            expect(baseElement.querySelector(`.${ALT_CONTENT_WRAPPER}`)).toBeInTheDocument();
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

        function TestMenuWithChangingContent({ useAltContent } = { useAltContent: false }) {
            const content = useCallback(
                (contentProps: ContextMenuContentProps) =>
                    useAltContent ? renderAlternativeContent() : renderContent(contentProps),
                [useAltContent],
            );
            return (
                <ContextMenu content={content} popoverProps={{ transitionDuration: 0 }}>
                    <div data-testid="target" />
                </ContextMenu>
            );
        }
    });

    describe("theming", () => {
        it("detects dark theme", async () => {
            const user = userEvent.setup();
            const { baseElement } = renderWithOverlaysProvider(
                <div className={Classes.DARK}>
                    <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <div data-testid="target" />
                    </ContextMenu>
                </div>,
            );
            const target = screen.getByTestId("target");
            await user.pointer({ keys: "[MouseRight>]", target });
            const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
            expect(ctxMenuPopover).toBeInTheDocument();
            expect(ctxMenuPopover).toHaveClass(Classes.DARK);
        });

        it("detects theme change (dark -> light)", async () => {
            const user = userEvent.setup();

            function ThemeWrapper() {
                const [isDark, setIsDark] = useState(true);
                return (
                    <div className={isDark ? Classes.DARK : undefined}>
                        <button onClick={() => setIsDark(false)}>Toggle theme</button>
                        <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                            <div data-testid="target" />
                        </ContextMenu>
                    </div>
                );
            }
            const { baseElement } = renderWithOverlaysProvider(<ThemeWrapper />);
            const target = screen.getByTestId("target");

            // Open the context menu with dark theme
            await user.pointer({ keys: "[MouseRight>]", target });

            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toBeInTheDocument();
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toHaveClass(Classes.DARK);

            const overlayElement = baseElement.querySelector(`.${Classes.OVERLAY_OPEN}`);
            fireEvent.keyDown(overlayElement!, { key: "Escape" });
            await waitFor(() => {
                expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).not.toBeInTheDocument();
            });

            // Switch from dark to light via state change
            await user.click(screen.getByText("Toggle theme"));

            // Open the context menu again with light theme
            await user.pointer({ keys: "[MouseRight>]", target });

            const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
            expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toBeInTheDocument();
            expect(ctxMenuPopover).not.toHaveClass(Classes.DARK);
        });
    });

    describe("interacting with other components", () => {
        describe("with one level of nesting", () => {
            it("opens context menu when tooltip is parent", async () => {
                const user = userEvent.setup();
                const { baseElement } = renderWithOverlaysProvider(
                    <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                        <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                            <div data-testid="target" />
                        </ContextMenu>
                    </Tooltip>,
                );
                const target = screen.getByTestId("target");
                await user.pointer({ keys: "[MouseRight>]", target });
                const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
                expect(ctxMenuPopover).toBeInTheDocument();
            });

            it("opens context menu when tooltip is child", async () => {
                const user = userEvent.setup();
                const { baseElement } = renderWithOverlaysProvider(
                    <ContextMenu content={MENU} popoverProps={{ transitionDuration: 0 }}>
                        <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                            <div data-testid="target" />
                        </Tooltip>
                    </ContextMenu>,
                );
                const target = screen.getByTestId("target");
                await user.pointer({ keys: "[MouseRight>]", target });
                const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
                expect(ctxMenuPopover).toBeInTheDocument();
            });
        });

        describe("with multiple layers of Tooltip nesting", () => {
            describe("ContextMenu > Tooltip > ContextMenu", () => {
                it("opens inner context menu on right click", async () => {
                    const user = userEvent.setup();
                    const { baseElement } = renderWithOverlaysProvider(
                        <ContextMenu
                            content={MENU}
                            popoverProps={{ transitionDuration: 0 }}
                            style={{ background: "red", height: 100, padding: 20, width: 100 }}
                        >
                            <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                                <div style={{ background: "green", padding: 20 }}>
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
                                            data-testid="target"
                                            style={{ background: "blue", height: 20, width: 20 }}
                                        />
                                    </ContextMenu>
                                </div>
                            </Tooltip>
                        </ContextMenu>,
                    );
                    const target = screen.getByTestId("target");
                    await user.pointer({ keys: "[MouseRight>]", target });
                    const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
                    expect(ctxMenuPopover).toBeInTheDocument();
                    expect(ctxMenuPopover).toHaveTextContent("first");
                });

                it("opens outer context menu on right click of outer target", async () => {
                    const user = userEvent.setup();
                    const { baseElement } = renderWithOverlaysProvider(
                        <ContextMenu
                            content={MENU}
                            popoverProps={{ transitionDuration: 0 }}
                            style={{ background: "red", height: 100, padding: 20, width: 100 }}
                        >
                            <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                                <div data-testid="outer-target" style={{ background: "green", padding: 20 }}>
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
                                            data-testid="inner-target"
                                            style={{ background: "blue", height: 20, width: 20 }}
                                        />
                                    </ContextMenu>
                                </div>
                            </Tooltip>
                        </ContextMenu>,
                    );
                    const target = screen.getByTestId("outer-target");
                    await user.pointer({ keys: "[MouseRight>]", target });
                    const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
                    expect(ctxMenuPopover).toBeInTheDocument();
                    expect(ctxMenuPopover).toHaveTextContent("Align Left");
                });
            });

            describe("Tooltip > ContextMenu > Tooltip", () => {
                const CTX_MENU_CLASSNAME = "test-ctx-menu";

                it("opens context menu after hovering inner target", async () => {
                    const user = userEvent.setup();
                    const { baseElement } = renderWithOverlaysProvider(
                        <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                            <div
                                data-testid="outer-target"
                                style={{ background: "green", height: 100, padding: 20, width: 100 }}
                            >
                                <ContextMenu
                                    className={CTX_MENU_CLASSNAME}
                                    content={MENU}
                                    popoverProps={{ transitionDuration: 0 }}
                                    style={{ background: "red", padding: 20 }}
                                >
                                    <Tooltip content="goodbye" {...COMMON_TOOLTIP_PROPS}>
                                        <div
                                            data-testid="inner-target"
                                            style={{ background: "blue", height: 20, width: 20 }}
                                        />
                                    </Tooltip>
                                </ContextMenu>
                            </div>
                        </Tooltip>,
                    );
                    const target = screen.getByTestId("inner-target");
                    await user.pointer({ keys: "[MouseRight>]", target });
                    const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
                    expect(ctxMenuPopover).toBeInTheDocument();
                });

                it("opens context menu after hovering ctx menu target", async () => {
                    const user = userEvent.setup();
                    const { baseElement } = renderWithOverlaysProvider(
                        <Tooltip content="hello" {...COMMON_TOOLTIP_PROPS}>
                            <div
                                data-testid="outer-target"
                                style={{ background: "green", height: 100, padding: 20, width: 100 }}
                            >
                                <ContextMenu
                                    className={CTX_MENU_CLASSNAME}
                                    content={MENU}
                                    popoverProps={{ transitionDuration: 0 }}
                                    style={{ background: "red", padding: 20 }}
                                >
                                    <Tooltip content="goodbye" {...COMMON_TOOLTIP_PROPS}>
                                        <div
                                            data-testid="inner-target"
                                            style={{ background: "blue", height: 20, width: 20 }}
                                        />
                                    </Tooltip>
                                </ContextMenu>
                            </div>
                        </Tooltip>,
                    );
                    const target = screen.getByTestId("inner-target");
                    await user.pointer({ keys: "[MouseRight>]", target });
                    const ctxMenuPopover = baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`);
                    expect(ctxMenuPopover).toBeInTheDocument();
                    expect(ctxMenuPopover).toHaveTextContent("Align Left");
                });
            });
        });

        describe("with Drawer as parent content", () => {
            it("opens context menu inside Drawer", async () => {
                const user = userEvent.setup();
                const popoverClassName = "test-positions-popover";
                const { baseElement } = renderWithOverlaysProvider(
                    <Drawer isOpen={true} position="right" transitionDuration={0}>
                        <ContextMenu
                            content={MENU}
                            className="test-ctx-menu"
                            popoverProps={{ popoverClassName, transitionDuration: 0 }}
                            style={{ background: "red", padding: 20 }}
                        >
                            <div data-testid="target" style={{ background: "blue", height: 20, width: 20 }} />
                        </ContextMenu>
                    </Drawer>,
                );
                const target = screen.getByTestId("target");
                expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).not.toBeInTheDocument();
                await user.pointer({ keys: "[MouseRight>]", target });
                expect(baseElement.querySelector(`.${Classes.CONTEXT_MENU_POPOVER}`)).toBeInTheDocument();
                expect(baseElement.querySelector(`.${popoverClassName}`)).toBeInTheDocument();
            });
        });
    });
});
