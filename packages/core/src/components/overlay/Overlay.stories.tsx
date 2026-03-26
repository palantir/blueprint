/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Overlay2 } from "../overlay2/overlay2";
import { H3 } from "../html/html";

const meta: Meta<typeof Overlay2> = {
    title: "Core/Overlay",
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
        usePortal: true,
        autoFocus: true,
        enforceFocus: true,
        lazy: true,
        shouldReturnFocusOnClose: true,
        transitionDuration: 300,
    },
    argTypes: {
        isOpen: {
            control: "boolean",
        },
        hasBackdrop: {
            control: "boolean",
        },
        canEscapeKeyClose: {
            control: "boolean",
        },
        canOutsideClickClose: {
            control: "boolean",
        },
        usePortal: {
            control: "boolean",
        },
        autoFocus: {
            control: "boolean",
        },
        enforceFocus: {
            control: "boolean",
        },
        lazy: {
            control: "boolean",
        },
        shouldReturnFocusOnClose: {
            control: "boolean",
        },
        transitionDuration: {
            control: "number",
        },
        onClose: { action: "closed" },
    },
} satisfies Meta<typeof Overlay2>;

export default meta;
type Story = StoryObj<typeof meta>;

const OVERLAY_CONTENT_STYLE: React.CSSProperties = {
    background: "var(--pt-app-background-color, white)",
    borderRadius: 6,
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.2)",
    left: "calc(50vw - 200px)",
    margin: 0,
    padding: 30,
    position: "fixed",
    top: "calc(50vh - 75px)",
    width: 400,
    zIndex: 20,
};

/**
 * The default overlay with a backdrop. Click the button to open it, then close via the button inside,
 * pressing Escape, or clicking the backdrop.
 */
export const Default: Story = {
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <>
                <Button text="Open overlay" onClick={handleOpen} />
                <Overlay2 {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Overlay content</H3>
                        <p>
                            This is a simple overlay with a backdrop. You can close it by pressing Escape, clicking the
                            backdrop, or using the button below.
                        </p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * Comparing overlay with and without a backdrop side by side.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        hasBackdrop: { table: { disable: true } },
    },
    render: function Render(args) {
        const [backdropOpen, setBackdropOpen] = useState(false);
        const [noBackdropOpen, setNoBackdropOpen] = useState(false);

        const handleOpenBackdrop = useCallback(() => setBackdropOpen(true), []);
        const handleCloseBackdrop = useCallback(() => setBackdropOpen(false), []);
        const handleOpenNoBackdrop = useCallback(() => setNoBackdropOpen(true), []);
        const handleCloseNoBackdrop = useCallback(() => setNoBackdropOpen(false), []);

        return (
            <div style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>With backdrop</span>
                    <Button text="Open" onClick={handleOpenBackdrop} />
                    <Overlay2 {...args} isOpen={backdropOpen} hasBackdrop={true} onClose={handleCloseBackdrop}>
                        <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                            <H3>With backdrop</H3>
                            <p>
                                The backdrop darkens the page behind the overlay and prevents interaction with
                                underlying content.
                            </p>
                            <Button text="Close" intent="primary" onClick={handleCloseBackdrop} />
                        </div>
                    </Overlay2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>Without backdrop</span>
                    <Button text="Open" onClick={handleOpenNoBackdrop} />
                    <Overlay2 {...args} isOpen={noBackdropOpen} hasBackdrop={false} onClose={handleCloseNoBackdrop}>
                        <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                            <H3>Without backdrop</H3>
                            <p>No backdrop is rendered. You can still interact with the page behind the overlay.</p>
                            <Button text="Close" intent="primary" onClick={handleCloseNoBackdrop} />
                        </div>
                    </Overlay2>
                </div>
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
                <Button text="Toggle overlay" onClick={handleOpen} />
                <Overlay2
                    autoFocus={args.autoFocus}
                    canEscapeKeyClose={args.canEscapeKeyClose}
                    canOutsideClickClose={args.canOutsideClickClose}
                    enforceFocus={args.enforceFocus}
                    hasBackdrop={args.hasBackdrop}
                    isOpen={isOpen}
                    lazy={args.lazy}
                    onClose={handleClose}
                    shouldReturnFocusOnClose={args.shouldReturnFocusOnClose}
                    transitionDuration={args.transitionDuration}
                    usePortal={args.usePortal}
                >
                    <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Playground overlay</H3>
                        <p>Adjust the Storybook controls to experiment with different Overlay2 props.</p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <Button text="Close" intent="primary" onClick={handleClose} />
                            <Button text="Focus test" />
                        </div>
                    </div>
                </Overlay2>
            </>
        );
    },
};
