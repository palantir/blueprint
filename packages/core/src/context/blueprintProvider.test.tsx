/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type PropsWithChildren, useContext, useMemo, useState } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { Dialog } from "../components/dialog/dialog";
import { useHotkeys } from "../hooks";

import { BlueprintProvider } from "./blueprintProvider";
import { HotkeysContext } from "./hotkeys/hotkeysProvider";
import { OverlaysContext } from "./overlays/overlaysProvider";
import { PortalContext, type PortalContextOptions } from "./portal/portalProvider";

describe("BlueprintProvider", () => {
    it("renders children", () => {
        render(
            <BlueprintProvider>
                <span>hello</span>
            </BlueprintProvider>,
        );
        expect(screen.getByText("hello")).toBeInTheDocument();
    });

    describe("PortalProvider", () => {
        it("forwards portalClassName to PortalProvider", () => {
            const PortalContextConsumer = () => {
                const { portalClassName } = useContext(PortalContext);
                return <span data-testid="portal-class" className={portalClassName} />;
            };

            render(
                <BlueprintProvider portalClassName="my-portal">
                    <PortalContextConsumer />
                </BlueprintProvider>,
            );
            expect(screen.getByTestId("portal-class")).toHaveClass("my-portal");
        });

        it("forwards portalContainer to PortalProvider", () => {
            const container = document.createElement("div");
            let receivedContainer: HTMLElement | undefined;

            const PortalContainerConsumer = () => {
                const { portalContainer } = useContext(PortalContext);
                receivedContainer = portalContainer;
                return null;
            };

            render(
                <BlueprintProvider portalContainer={container}>
                    <PortalContainerConsumer />
                </BlueprintProvider>,
            );
            expect(receivedContainer).toBe(container);
        });

        it("does not forward hotkeys props to PortalProvider", () => {
            let receivedContext: PortalContextOptions | undefined;

            const PortalContextSpy = () => {
                const ctx = useContext(PortalContext);
                receivedContext = ctx;
                return null;
            };

            render(
                <BlueprintProvider
                    portalClassName="portal-only"
                    portalContainer={document.createElement("div")}
                    hotkeysProviderDialogProps={{ className: "my-dialog" }}
                >
                    <PortalContextSpy />
                </BlueprintProvider>,
            );
            expect(receivedContext).toBeDefined();
            expect(receivedContext).not.toHaveProperty("hotkeysProviderDialogProps");
            expect(receivedContext!.portalClassName).toBe("portal-only");
            expect(Object.keys(receivedContext!)).toEqual(
                expect.objectContaining(["portalClassName", "portalContainer"]),
            );
        });
    });

    describe("HotkeysProvider", () => {
        // Test helper that reads HotkeysContext and provides a button to open the dialog.
        const HotkeysDialogTrigger = () => {
            const [_, dispatch] = useContext(HotkeysContext);
            return (
                <button type="button" data-testid="open-dialog" onClick={() => dispatch({ type: "OPEN_DIALOG" })}>
                    Open dialog
                </button>
            );
        };

        it("forwards hotkeysProviderRenderDialog to HotkeysProvider", () => {
            const renderDialog = vi.fn(() => <div data-testid="custom-dialog" />);
            render(
                <BlueprintProvider hotkeysProviderRenderDialog={renderDialog}>
                    <HotkeysDialogTrigger />
                </BlueprintProvider>,
            );
            // renderDialog is called on every render with current state
            expect(renderDialog).toHaveBeenCalledOnce();
            expect(screen.getByTestId("custom-dialog")).toBeInTheDocument();
        });

        it("forwards hotkeysProviderDialogProps to HotkeysProvider", async () => {
            const user = userEvent.setup();
            render(
                <BlueprintProvider hotkeysProviderDialogProps={{ className: "my-hotkeys-dialog" }}>
                    <HotkeysDialogTrigger />
                </BlueprintProvider>,
            );
            // Open the dialog so HotkeysDialog renders via Overlay2
            await user.click(screen.getByTestId("open-dialog"));
            expect(document.querySelector(".my-hotkeys-dialog")).toBeInTheDocument();
        });

        it("uses provided dispatch from hotkeysProviderValue", async () => {
            const user = userEvent.setup();
            const state = { hasProvider: true, hotkeys: [], isDialogOpen: false };
            const dispatch = vi.fn();
            const contextValue = [state, dispatch] as const;

            render(
                <BlueprintProvider hotkeysProviderValue={contextValue}>
                    <HotkeysDialogTrigger />
                </BlueprintProvider>,
            );
            await user.click(screen.getByTestId("open-dialog"));
            expect(dispatch).toHaveBeenCalledWith({ type: "OPEN_DIALOG" });
        });
    });
});

function PreservedScope({ children }: PropsWithChildren) {
    const overlays = useContext(OverlaysContext);
    const hotkeys = useContext(HotkeysContext);
    return (
        <BlueprintProvider
            theme={{ borderRadius: "SQUARE" }}
            overlaysProviderValue={overlays}
            hotkeysProviderValue={hotkeys}
        >
            {children}
        </BlueprintProvider>
    );
}

for (const useComposite of [false, true]) {
    describe(`Workshop scopes (${useComposite ? "BlueprintProvider" : "baseline"})`, () => {
        const Boundary = useComposite ? PreservedScope : ({ children }: PropsWithChildren) => <>{children}</>;

        it("preserves focus containment, stack order, Escape and focus restoration across separate roots", async () => {
            const firstClose = vi.fn();
            const secondClose = vi.fn();
            function TestDialog({ name, onClose }: { name: string; onClose: () => void }) {
                const [isOpen, setOpen] = useState(true);
                return (
                    <Dialog
                        isOpen={isOpen}
                        transitionDuration={0}
                        onClose={() => {
                            onClose();
                            setOpen(false);
                        }}
                    >
                        <input autoFocus={true} data-testid={name} />
                    </Dialog>
                );
            }
            const module = render(
                <Boundary>
                    <TestDialog name="module" onClose={firstClose} />
                </Boundary>,
            );
            await waitFor(() =>
                expect(screen.getByTestId("module").closest(".bp6-overlay")!.contains(document.activeElement)).toBe(
                    true,
                ),
            );
            const widget = render(<TestDialog name="widget" onClose={secondClose} />);
            const top = screen.getByTestId("widget").closest(".bp6-overlay")!;
            await waitFor(() => expect(top.contains(document.activeElement)).toBe(true));
            screen.getByTestId("module").focus();
            await waitFor(() => expect(top.contains(document.activeElement)).toBe(true));
            fireEvent.keyDown(document.activeElement!, { key: "Escape" });
            await waitFor(() => expect(screen.queryByTestId("widget")).not.toBeInTheDocument());
            expect(secondClose).toHaveBeenCalledOnce();
            expect(firstClose).not.toHaveBeenCalled();
            await waitFor(() =>
                expect(screen.getByTestId("module").closest(".bp6-overlay")!.contains(document.activeElement)).toBe(
                    true,
                ),
            );
            widget.unmount();
            module.unmount();
        });

        it("dismisses only the top overlay on document Escape or backdrop click", async () => {
            const firstClose = vi.fn();
            const secondClose = vi.fn();
            const module = render(
                <Boundary>
                    <Dialog isOpen={true} autoFocus={false} enforceFocus={false} onClose={firstClose}>
                        Module
                    </Dialog>
                </Boundary>,
            );
            const widget = render(
                <Dialog isOpen={true} autoFocus={false} enforceFocus={false} onClose={secondClose}>
                    Widget
                </Dialog>,
            );
            fireEvent.keyDown(document, { key: "Escape" });
            expect(firstClose).not.toHaveBeenCalled();
            expect(secondClose).toHaveBeenCalledOnce();
            const backdrops = document.querySelectorAll(".bp6-overlay-backdrop");
            fireEvent.mouseDown(backdrops[backdrops.length - 1]);
            expect(firstClose).not.toHaveBeenCalled();
            expect(secondClose).toHaveBeenCalledTimes(2);
            widget.unmount();
            expect(document.body).toHaveClass("bp6-overlay-open");
            module.unmount();
            expect(document.body).not.toHaveClass("bp6-overlay-open");
        });

        it("keeps global and local hotkeys single-fired and shares the existing help dialog", async () => {
            const local = vi.fn();
            const global = vi.fn();
            function Keys() {
                const keys = useMemo(
                    () => [
                        { combo: "a", group: "Workshop", label: "Local", onKeyDown: local },
                        { combo: "b", global: true, label: "Global action", onKeyDown: global },
                    ],
                    [],
                );
                const { handleKeyDown, handleKeyUp } = useHotkeys(keys);
                const [, dispatch] = useContext(HotkeysContext);
                return (
                    <div tabIndex={0} data-testid="keys" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                        <button onClick={() => dispatch({ type: "OPEN_DIALOG" })}>Help</button>
                    </div>
                );
            }
            render(
                <BlueprintProvider>
                    <Boundary>
                        <Keys />
                    </Boundary>
                </BlueprintProvider>,
            );
            const user = userEvent.setup();
            screen.getByTestId("keys").focus();
            await user.keyboard("ab");
            expect(local).toHaveBeenCalledOnce();
            expect(global).toHaveBeenCalledOnce();
            await user.click(screen.getByText("Help"));
            expect(document.querySelectorAll(".bp6-hotkey-dialog")).toHaveLength(1);
            expect(screen.getByText("Local")).toBeInTheDocument();
            expect(screen.getByText("Global action")).toBeInTheDocument();
        });
    });
}
