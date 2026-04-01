/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type CSSProperties, useCallback } from "react";
import { useArgs } from "storybook/preview-api";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { InputGroup } from "../forms/inputGroup";
import { Code, H3, H4 } from "../html/html";

import { Overlay2 } from "./overlay2";

const disabledArgs = ["childRef", "childRefs", "portalStopPropagationEvents"] as const satisfies ReadonlyArray<
    keyof ComponentProps<typeof Overlay2>
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

const OVERLAY_CONTENT_STYLE: CSSProperties = {
    background: "var(--bp-surface-background-color, white)",
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
    render: function RenderDefault(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Overlay Content</H3>
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
    args: {
        hasBackdrop: false,
    },
    argTypes: {
        hasBackdrop: { table: { disable: true } },
    },
    render: function RenderWithoutBackdrop(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>No Backdrop</H3>
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
    args: {
        usePortal: false,
        hasBackdrop: false,
    },
    argTypes: {
        usePortal: { table: { disable: true } },
    },
    render: function RenderInlineOverlay(args) {
        const [, updateArgs] = useArgs();
        const handleToggle = useCallback(() => updateArgs({ isOpen: !args.isOpen }), [args.isOpen, updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <div style={{ position: "relative", minHeight: 200, width: 400 }}>
                <Button text="Toggle Inline Overlay" onClick={handleToggle} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div
                        style={{
                            background: "var(--bp-surface-background-color, white)",
                            border: "1px solid var(--bp-surface-border-color-default, #ccc)",
                            borderRadius: 6,
                            marginTop: 8,
                            padding: 20,
                        }}
                    >
                        <H4 style={{ marginTop: 0 }}>Inline Overlay</H4>
                        <p>This overlay is rendered inline without a Portal.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </div>
        );
    },
};

/**
 * Demonstrates `autoFocus` behavior. When enabled (the default), focus moves inside the
 * overlay on open — specifically to an internal focus trap element, not the first interactive
 * child. Press Tab once after opening to reach the first input. Toggle the `autoFocus` control
 * to `false` to see that focus stays on the trigger button instead.
 */
export const AutoFocus: Story = {
    name: "Auto Focus",
    render: function RenderAutoFocus(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Auto Focus</H3>
                        <p>
                            Focus is moved inside the overlay on open. Press <Code>Tab</Code> to reach the first input.
                        </p>
                        <InputGroup placeholder="First input" style={{ marginBottom: 10 }} />
                        <InputGroup placeholder="Second input" style={{ marginBottom: 10 }} />
                        <div style={{ display: "flex", gap: 10 }}>
                            <Button text="OK" intent="primary" onClick={handleClose} />
                            <Button text="Cancel" onClick={handleClose} />
                        </div>
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * When `enforceFocus` is enabled (the default), the overlay traps keyboard focus inside its
 * content. Open the overlay, then press Tab repeatedly — focus wraps from the last focusable
 * element back to the first. Press Shift+Tab at the first element to wrap to the last.
 */
export const EnforceFocus: Story = {
    name: "Enforce Focus (Focus Trap)",
    render: function RenderEnforceFocus(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Focus Trap</H3>
                        <p>Tab and Shift+Tab wrap around the focusable elements. Focus cannot leave this overlay.</p>
                        <InputGroup placeholder="Field 1" style={{ marginBottom: 10 }} />
                        <InputGroup placeholder="Field 2" style={{ marginBottom: 10 }} />
                        <InputGroup placeholder="Field 3" style={{ marginBottom: 10 }} />
                        <div style={{ display: "flex", gap: 10 }}>
                            <Button text="Submit" intent="primary" onClick={handleClose} />
                            <Button text="Cancel" onClick={handleClose} />
                        </div>
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * When `enforceFocus` is disabled, focus can leave the overlay and reach elements behind it.
 * Open the overlay, then Tab past the "Close" button — focus should reach the background input.
 * Compare with the "Enforce Focus" story above.
 */
export const WithoutEnforceFocus: Story = {
    name: "Without Enforce Focus",
    args: {
        enforceFocus: false,
        hasBackdrop: false,
    },
    render: function RenderWithoutEnforceFocus(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    <Button text="Open Overlay" onClick={handleOpen} />
                    <InputGroup placeholder="Background input (should be reachable with Tab)" />
                </div>
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>No Focus Trap</H3>
                        <p>Focus can leave this overlay. Try tabbing past the button below.</p>
                        <InputGroup placeholder="Overlay input" style={{ marginBottom: 10 }} />
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * When `shouldReturnFocusOnClose` is enabled (the default), focus returns to the element
 * that had focus before the overlay opened. Open the overlay, then press Escape — focus
 * should return to the "Open Overlay" button (not "Before" or "After").
 */
export const ReturnFocusOnClose: Story = {
    name: "Return Focus on Close",
    args: {
        shouldReturnFocusOnClose: true,
    },
    render: function RenderReturnFocusOnClose(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <div style={{ display: "flex", gap: 10 }}>
                    <Button text="Before" />
                    <Button text="Open Overlay" onClick={handleOpen} />
                    <Button text="After" />
                </div>
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Return Focus on Close</H3>
                        <p>Press Escape to close. Focus should return to the "Open Overlay" button.</p>
                        <Button text="Close" intent="primary" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * When `canEscapeKeyClose` is true (the default), pressing Escape closes the overlay.
 * Toggle the control to disable Escape-to-close — the overlay can then only be closed
 * by clicking the Close button or the backdrop.
 */
export const EscapeKeyClose: Story = {
    name: "Escape Key Close",
    render: function RenderEscapeKeyClose(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Escape Key Close</H3>
                        <p>
                            Press Escape to close this overlay. Use the Storybook controls to toggle{" "}
                            <Code>canEscapeKeyClose</Code>.
                        </p>
                        <InputGroup placeholder="Type here, then press Escape" style={{ marginBottom: 10 }} />
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};

/**
 * Interactive playground with all props toggleable via Storybook controls.
 */
export const Playground: Story = {
    render: function RenderPlayground(args) {
        const [, updateArgs] = useArgs();
        const handleOpen = useCallback(() => updateArgs({ isOpen: true }), [updateArgs]);
        const handleClose = useCallback(() => updateArgs({ isOpen: false }), [updateArgs]);
        return (
            <>
                <Button text="Open Overlay" onClick={handleOpen} />
                <Overlay2 {...args} onClose={handleClose}>
                    <div className={Classes.OVERLAY_CONTENT} style={OVERLAY_CONTENT_STYLE}>
                        <H3>Playground Overlay</H3>
                        <p>Use the Storybook controls to customize overlay behavior.</p>
                        <Button text="Close" onClick={handleClose} />
                    </div>
                </Overlay2>
            </>
        );
    },
};
