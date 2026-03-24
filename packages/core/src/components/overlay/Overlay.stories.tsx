/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Overlay2 } from "../overlay2/overlay2";

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
                        <h3>Overlay content</h3>
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
 * Overlay rendered with `hasBackdrop={true}` (the default). A dark scrim covers the page behind the overlay content.
 */
export const WithBackdrop: Story = {
    args: {
        hasBackdrop: true,
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <>
                <Button text="Open with backdrop" onClick={handleOpen} />
                <Overlay2 {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                        <h3>With backdrop</h3>
                        <p>
                            The backdrop darkens the page behind the overlay and prevents interaction with underlying
                            content.
                        </p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * Overlay rendered with `hasBackdrop={false}`. Users can still interact with the rest of the page
 * while the overlay is open.
 */
export const WithoutBackdrop: Story = {
    args: {
        hasBackdrop: false,
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <>
                <Button text="Open without backdrop" onClick={handleOpen} />
                <Overlay2 {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                        <h3>Without backdrop</h3>
                        <p>No backdrop is rendered. You can still interact with the page behind the overlay.</p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * Overlay rendered inline (without a Portal) using `usePortal={false}`. The overlay content is rendered
 * within the DOM hierarchy of its parent rather than being appended to `document.body`.
 */
export const InlineOverlay: Story = {
    args: {
        usePortal: false,
        hasBackdrop: false,
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <div style={{ position: "relative", minHeight: 200, width: 400 }}>
                <Button text="Toggle inline overlay" onClick={handleOpen} />
                <Overlay2 {...args} isOpen={isOpen} onClose={handleClose}>
                    <div
                        style={{
                            background: "var(--pt-app-background-color, white)",
                            borderRadius: 6,
                            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.2)",
                            marginTop: 10,
                            padding: 20,
                        }}
                    >
                        <h3>Inline overlay</h3>
                        <p>This overlay is rendered inline without a Portal.</p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </div>
        );
    },
};

/**
 * Overlay with `canEscapeKeyClose={false}`, so pressing Escape does not close the overlay.
 */
export const NoEscapeKeyClose: Story = {
    args: {
        canEscapeKeyClose: false,
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <>
                <Button text="Open (Escape disabled)" onClick={handleOpen} />
                <Overlay2 {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                        <h3>Escape key disabled</h3>
                        <p>Pressing Escape will not close this overlay. Use the button below or click the backdrop.</p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * Overlay with `canOutsideClickClose={false}`, so clicking the backdrop does not close the overlay.
 */
export const NoOutsideClickClose: Story = {
    args: {
        canOutsideClickClose: false,
    },
    render: function Render(args) {
        const [isOpen, setIsOpen] = useState(false);

        const handleOpen = useCallback(() => setIsOpen(true), []);
        const handleClose = useCallback(() => setIsOpen(false), []);

        return (
            <>
                <Button text="Open (outside click disabled)" onClick={handleOpen} />
                <Overlay2 {...args} isOpen={isOpen} onClose={handleClose}>
                    <div className={Classes.CARD} style={OVERLAY_CONTENT_STYLE}>
                        <h3>Outside click disabled</h3>
                        <p>Clicking the backdrop will not close this overlay. Use the button below or press Escape.</p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
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
                        <h3>Playground overlay</h3>
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
