/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { useContext } from "react";

import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

import { BlueprintProvider } from "./blueprintProvider";
import { HotkeysContext } from "./hotkeys/hotkeysProvider";
import { PortalContext } from "./portal/portalProvider";

// A simple consumer that reads PortalContext and renders values for assertion
const PortalContextConsumer = () => {
    const { portalClassName } = useContext(PortalContext);
    return <span data-testid="portal-class">{portalClassName}</span>;
};

// Test helper that reads HotkeysContext and provides a button to open the dialog.
const HotkeysDialogTrigger = () => {
    const [, dispatch] = useContext(HotkeysContext);
    return (
        <button type="button" data-testid="open-dialog" onClick={() => dispatch({ type: "OPEN_DIALOG" })}>
            Open dialog
        </button>
    );
};

describe("BlueprintProvider", () => {
    it("renders children", () => {
        render(
            <BlueprintProvider>
                <span data-testid="child">hello</span>
            </BlueprintProvider>,
        );
        expect(screen.getByTestId("child")).toHaveTextContent("hello");
    });

    describe("PortalProvider", () => {
        it("forwards portalClassName to PortalProvider", () => {
            render(
                <BlueprintProvider portalClassName="my-portal">
                    <PortalContextConsumer />
                </BlueprintProvider>,
            );
            expect(screen.getByTestId("portal-class")).toHaveTextContent("my-portal");
        });

        it("forwards portalContainer to PortalProvider", () => {
            const container = document.createElement("div");
            const PortalContainerConsumer = () => {
                const { portalContainer } = useContext(PortalContext);
                return <span data-testid="has-container">{String(portalContainer === container)}</span>;
            };
            render(
                <BlueprintProvider portalContainer={container}>
                    <PortalContainerConsumer />
                </BlueprintProvider>,
            );
            expect(screen.getByTestId("has-container")).toHaveTextContent("true");
        });

        it("does not forward hotkeys props to PortalProvider", () => {
            // If hotkeys props leaked into PortalContext, this would break.
            // This test ensures clean separation.
            render(
                <BlueprintProvider
                    portalClassName="portal-only"
                    hotkeysProviderDialogProps={{ className: "my-dialog" }}
                >
                    <PortalContextConsumer />
                </BlueprintProvider>,
            );
            expect(screen.getByTestId("portal-class")).toHaveTextContent("portal-only");
        });
    });

    describe("HotkeysProvider", () => {
        // TODO: unskip once BlueprintProvider destructures prefixed hotkeys props
        it.skip("forwards hotkeysProviderRenderDialog to HotkeysProvider", () => {
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

        // TODO: unskip once BlueprintProvider destructures prefixed hotkeys props
        it.skip("forwards hotkeysProviderDialogProps to HotkeysProvider", () => {
            render(
                <BlueprintProvider hotkeysProviderDialogProps={{ className: "my-hotkeys-dialog" }}>
                    <HotkeysDialogTrigger />
                </BlueprintProvider>,
            );
            // Open the dialog so HotkeysDialog renders via Overlay2
            fireEvent.click(screen.getByTestId("open-dialog"));
            expect(document.querySelector(".my-hotkeys-dialog")).toBeInTheDocument();
        });

        it("uses provided dispatch from hotkeysProviderValue", () => {
            const state = { hasProvider: true, hotkeys: [], isDialogOpen: false };
            const dispatch = vi.fn();
            const contextValue = [state, dispatch] as const;

            render(
                <BlueprintProvider hotkeysProviderValue={contextValue}>
                    <HotkeysDialogTrigger />
                </BlueprintProvider>,
            );
            fireEvent.click(screen.getByTestId("open-dialog"));
            expect(dispatch).toHaveBeenCalledWith({ type: "OPEN_DIALOG" });
        });
    });
});
