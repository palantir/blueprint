/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Classes } from "../../common";
import { Button } from "../button/buttons";

import { Overlay2 } from "./overlay2";

const disabledArgs = ["childRef", "childRefs", "portalStopPropagationEvents"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Overlay2>
>;

const meta = {
    title: "Core/Overlays/Overlay2",
    component: Overlay2,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        isOpen: false,
        hasBackdrop: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        autoFocus: true,
        enforceFocus: true,
        usePortal: true,
    },
    argTypes: {
        hasBackdrop: { control: "boolean" },
        canEscapeKeyClose: { control: "boolean" },
        canOutsideClickClose: { control: "boolean" },
        autoFocus: { control: "boolean" },
        enforceFocus: { control: "boolean" },
        usePortal: { control: "boolean" },
        lazy: { control: "boolean" },
        shouldReturnFocusOnClose: { control: "boolean" },
        transitionDuration: { control: "number" },
        onClose: { action: "closed" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Overlay2>;

export default meta;
type Story = StoryObj<typeof meta>;

const OVERLAY_CONTENT_STYLE: React.CSSProperties = {
    background: "var(--pt-app-background-color, white)",
    borderRadius: 6,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    left: "calc(50% - 200px)",
    margin: "10vh 0",
    padding: 30,
    position: "fixed",
    top: 0,
    width: 400,
    zIndex: 20,
};

/**
 * A basic overlay with backdrop. Click the button to open the overlay, then click
 * the backdrop or press Escape to close it.
 */
export const Default: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <h3>Overlay Content</h3>
                        <p>This is the overlay body content. Click outside or press Escape to close.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * An overlay without a backdrop. Users can still interact with the content behind the overlay.
 * The overlay closes when clicking outside of its content area.
 */
export const WithoutBackdrop: Story = {
    name: "Without Backdrop",
    argTypes: {
        hasBackdrop: { table: { disable: true } },
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} hasBackdrop={false} isOpen={isOpen} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <h3>No Backdrop</h3>
                        <p>
                            This overlay has no backdrop. You can still interact with the page behind it. Click outside
                            or press Escape to close.
                        </p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * An inline overlay rendered without a Portal. The overlay is rendered in place within
 * the DOM hierarchy instead of being appended to the document body.
 */
export const InlineOverlay: Story = {
    name: "Inline (No Portal)",
    argTypes: {
        usePortal: { table: { disable: true } },
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);
        return (
            <div style={{ position: "relative", minHeight: 200, width: 400 }}>
                <Button text="Toggle Inline Overlay" onClick={isOpen ? handleClose : handleOpen} />
                <Overlay2 {...args} usePortal={false} hasBackdrop={false} isOpen={isOpen} onClose={handleClose}>
                    <div
                        style={{
                            background: "var(--pt-app-background-color, white)",
                            border: "1px solid var(--pt-divider-black, #ccc)",
                            borderRadius: 6,
                            marginTop: 8,
                            padding: 20,
                        }}
                    >
                        <h4 style={{ marginTop: 0 }}>Inline Overlay</h4>
                        <p>This overlay is rendered inline without a Portal.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </div>
        );
    },
};

/**
 * Interactive playground with all props togglable via Storybook controls.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);
        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2
                    autoFocus={args.autoFocus}
                    canEscapeKeyClose={args.canEscapeKeyClose}
                    canOutsideClickClose={args.canOutsideClickClose}
                    enforceFocus={args.enforceFocus}
                    hasBackdrop={args.hasBackdrop}
                    isOpen={isOpen}
                    lazy={args.lazy}
                    shouldReturnFocusOnClose={args.shouldReturnFocusOnClose}
                    transitionDuration={args.transitionDuration}
                    usePortal={args.usePortal}
                    onClose={handleClose}
                >
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <h3>Playground Overlay</h3>
                        <p>Use the Storybook controls to customize overlay behavior.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};
