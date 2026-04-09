/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { BlueprintProvider } from "./blueprintProvider";
import { HotkeysContext } from "./hotkeys/hotkeysProvider";
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
