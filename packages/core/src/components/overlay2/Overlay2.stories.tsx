/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type CSSProperties, useCallback } from "react";
import { useArgs } from "storybook/preview-api";
import { expect, screen, waitFor } from "storybook/test";

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
        transitionDuration: 0,
        transitionName: "no-transition",
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
 * overlay on open. Toggle `autoFocus` to `false` to see that focus stays on the trigger
 * button instead.
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
 * content. Tab and Shift+Tab wrap around the focusable elements.
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
 * that had focus before the overlay opened.
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
 * Interactive playground with all props.
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

/**
 * Clicking the trigger button opens the overlay.
 */
export const OpenOnClick: Story = {
    name: "Open on Click",
    ...Default,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Open Overlay" }));
        await waitFor(() => expect(screen.getByText("Overlay Content")).toBeVisible());
        await userEvent.keyboard("{Escape}");
    },
};

/**
 * Pressing Escape closes an open overlay.
 */
export const CloseOnEscape: Story = {
    name: "Close on Escape",
    ...Default,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Open Overlay" }));
        await waitFor(() => expect(screen.getByText("Overlay Content")).toBeVisible());
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByText("Overlay Content")).not.toBeInTheDocument());
    },
};

/**
 * Typing into an input inside the overlay updates its value.
 */
export const TypeIntoInput: Story = {
    name: "Type into Input",
    ...EscapeKeyClose,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Open Overlay" }));
        const input = await screen.findByPlaceholderText<HTMLInputElement>("Type here, then press Escape");
        await userEvent.click(input);
        await userEvent.type(input, "hello");
        await expect(input).toHaveValue("hello");
        await userEvent.keyboard("{Escape}");
    },
};

/**
 * With `enforceFocus`, Tab moves focus from the overlay's container into the first user-focusable element.
 */
export const TabIntoFocusTrap: Story = {
    name: "Tab into Focus Trap",
    ...EnforceFocus,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Open Overlay" }));
        const field1 = await screen.findByPlaceholderText("Field 1");
        await userEvent.tab();
        await userEvent.tab();
        await waitFor(() => expect(document.activeElement).toBe(field1));
        await userEvent.keyboard("{Escape}");
    },
};

/**
 * With `shouldReturnFocusOnClose`, closing the overlay restores focus to the trigger.
 */
export const RestoreFocusOnClose: Story = {
    name: "Restore Focus on Close",
    ...ReturnFocusOnClose,
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole("button", { name: "Open Overlay" });
        trigger.focus();
        await userEvent.keyboard("{Enter}");
        await waitFor(() => expect(screen.getByText("Return Focus on Close")).toBeVisible());
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(document.activeElement).toBe(trigger));
    },
};
