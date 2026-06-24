/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryLabel } from "@storybook-common";
import { useCallback, useState } from "react";
import { useArgs } from "storybook/preview-api";
import { expect, screen, waitFor } from "storybook/test";

import { Box, Flex } from "@blueprintjs/labs";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { Dialog } from "../dialog/dialog";
import { DialogBody } from "../dialog/dialogBody";
import { DialogFooter } from "../dialog/dialogFooter";
import { ControlGroup } from "../forms/controlGroup";
import { Checkbox } from "../forms/controls";
import { InputGroup } from "../forms/inputGroup";
import { Code } from "../html/html";
import { HTMLSelect } from "../html-select/htmlSelect";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { PopoverAnimation, PopoverInteractionKind } from "../popover/popoverProps";
import { Slider } from "../slider/slider";

import { PopoverNext } from "./popoverNext";
import { POPOVER_NEXT_PLACEMENTS, type PopoverNextPlacement, type PopoverRenderTargetProps } from "./popoverNextProps";

const disabledArgs = [
    "autoUpdateOptions",
    "backdropProps",
    "middleware",
    "portalClassName",
    "portalContainer",
    "renderTarget",
    "rootBoundary",
    "targetProps",
    "targetTagName",
    "popupKind",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof PopoverNext>>;

const meta = {
    title: "Core/Overlays/PopoverNext",
    component: PopoverNext,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        disabled: false,
        arrow: true,
        matchTargetWidth: false,
        interactionKind: PopoverInteractionKind.CLICK,
        hasBackdrop: false,
    },
    argTypes: {
        placement: {
            control: "select",
            options: POPOVER_NEXT_PLACEMENTS,
        },
        interactionKind: {
            control: "select",
            options: Object.values(PopoverInteractionKind),
        },
        disabled: { control: "boolean" },
        arrow: { control: "boolean" },
        matchTargetWidth: { control: "boolean" },
        hasBackdrop: { control: "boolean" },
        fill: { control: "boolean" },
        canEscapeKeyClose: { control: "boolean" },
        usePortal: { control: "boolean" },
        isOpen: { control: "boolean" },
        defaultIsOpen: { control: "boolean" },
        animation: {
            control: "select",
            options: Object.values(PopoverAnimation),
        },
        hoverOpenDelay: { control: "number" },
        hoverCloseDelay: { control: "number" },
        onClose: { action: "closed" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof PopoverNext>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_MENU = (
    <Menu>
        <MenuItem text="Cut" icon="cut" />
        <MenuItem text="Copy" icon="duplicate" />
        <MenuItem text="Paste" icon="clipboard" />
    </Menu>
);

/**
 * A basic PopoverNext that opens a menu when clicked. PopoverNext wraps its children
 * and uses them as the trigger target. By default, clicking outside or on a menu item
 * closes the popover.
 */
export const Default: Story = {
    render: args => (
        <PopoverNext {...args} content={SAMPLE_MENU}>
            <Button text="Open Menu" endIcon="caret-down" />
        </PopoverNext>
    ),
};

/**
 * The `content` prop accepts any React node, from a plain string to rich form controls.
 * A menu is the most common use case.
 */
export const ContentExample: Story = {
    name: "Content",
    render: args => (
        <Flex gap={4} alignItems="start">
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Text" />
                <PopoverNext {...args} content="This is a simple string popover content.">
                    <Button text="Text" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Menu" />
                <PopoverNext {...args} content={SAMPLE_MENU}>
                    <Button text="Menu" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Input" />
                <PopoverNext
                    {...args}
                    content={
                        <Box padding={4}>
                            <Flex flexDirection="column" gap={2}>
                                <InputGroup placeholder="Enter a value..." />
                                <Button text="Submit" intent="primary" size="small" />
                            </Flex>
                        </Box>
                    }
                >
                    <Button text="Input" icon="edit" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Slider" />
                <PopoverNext
                    {...args}
                    content={
                        <Box padding={4}>
                            <Slider min={0} max={100} stepSize={1} value={50} labelStepSize={25} />
                        </Box>
                    }
                >
                    <Button text="Slider" icon="settings" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Select" />
                <PopoverNext
                    {...args}
                    content={
                        <Box padding={4}>
                            <HTMLSelect options={["Apple", "Banana", "Cherry", "Date"]} fill={true} />
                        </Box>
                    }
                >
                    <Button text="Select" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="undefined" />
                <PopoverNext {...args} content={undefined}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Empty string" />
                <PopoverNext {...args} content="">
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

const PlacementPopover: React.FC<{ placement: PopoverNextPlacement } & React.ComponentProps<typeof PopoverNext>> = ({
    placement,
    ...popoverProps
}) => {
    const [sideLabel, alignmentLabel] = placement.split("-");
    const content = (
        <div>
            Popover on <Code>{sideLabel}</Code> side
            <br />
            {alignmentLabel === undefined ? (
                <>
                    Aligned to <Code>(center)</Code>
                </>
            ) : (
                <>
                    Aligned to <Code>{alignmentLabel}</Code> edge
                </>
            )}
        </div>
    );

    const renderTarget = useCallback(
        ({ isOpen, className, ...props }: PopoverRenderTargetProps) => (
            <Button {...props} active={isOpen} text={placement} style={{ width: 100 }} />
        ),
        [placement],
    );

    return (
        <PopoverNext
            {...popoverProps}
            content={content}
            placement={placement}
            popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            renderTarget={renderTarget}
        />
    );
};

/**
 * Use the `placement` prop to control where the popover appears relative to its target.
 * The popover automatically flips to the opposite side if there is insufficient space.
 * Button positions are flipped here so that all popovers open inward.
 */
export const PlacementExample: Story = {
    name: "Placement",
    argTypes: {
        placement: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16 }}>
            {/* Row 1: bottom placements (buttons at top, popovers open downward) */}
            <div />
            <ControlGroup fill={true}>
                <PlacementPopover {...args} placement="bottom-start" />
                <PlacementPopover {...args} placement="bottom" />
                <PlacementPopover {...args} placement="bottom-end" />
            </ControlGroup>
            <div />

            {/* Row 2: right placements | center label | left placements */}
            <Flex justifyContent="end">
                <ControlGroup vertical={true}>
                    <PlacementPopover {...args} placement="right-start" />
                    <PlacementPopover {...args} placement="right" />
                    <PlacementPopover {...args} placement="right-end" />
                </ControlGroup>
            </Flex>
            <Flex alignItems="center" justifyContent="center">
                <em className={Classes.TEXT_MUTED}>
                    Button positions are flipped here so that all popovers open inward.
                </em>
            </Flex>
            <div>
                <ControlGroup vertical={true}>
                    <PlacementPopover {...args} placement="left-start" />
                    <PlacementPopover {...args} placement="left" />
                    <PlacementPopover {...args} placement="left-end" />
                </ControlGroup>
            </div>

            {/* Row 3: top placements (buttons at bottom, popovers open upward) */}
            <div />
            <ControlGroup fill={true}>
                <PlacementPopover {...args} placement="top-start" />
                <PlacementPopover {...args} placement="top" />
                <PlacementPopover {...args} placement="top-end" />
            </ControlGroup>
            <div />
        </div>
    ),
};

/**
 * Use `arrow={false}` to hide the arrow pointing to the target. This creates a cleaner
 * look for dropdown menus that should appear directly below the trigger.
 */
export const ArrowExample: Story = {
    name: "Arrow",
    args: {
        placement: "bottom",
    },
    argTypes: {
        arrow: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="With Arrow" />
                <PopoverNext
                    {...args}
                    arrow={true}
                    content={
                        <Menu>
                            <MenuItem text="Action 1" icon="play" />
                            <MenuItem text="Action 2" icon="pause" />
                        </Menu>
                    }
                >
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="No Arrow" />
                <PopoverNext
                    {...args}
                    arrow={false}
                    content={
                        <Menu>
                            <MenuItem text="Action 1" icon="play" />
                            <MenuItem text="Action 2" icon="pause" />
                        </Menu>
                    }
                >
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

/**
 * Use `interactionKind` to control how the popover is triggered. `"click"` opens on click,
 * `"hover"` opens on mouse hover, and the `"-target-only"` variants open on the same gesture
 * but only track the target element (not the popover content).
 */
export const InteractionKindExample: Story = {
    name: "Interaction Kind",
    argTypes: {
        interactionKind: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4}>
            {(
                [
                    ["Click", PopoverInteractionKind.CLICK],
                    ["Click Target Only", PopoverInteractionKind.CLICK_TARGET_ONLY],
                    ["Hover", PopoverInteractionKind.HOVER],
                    ["Hover Target Only", PopoverInteractionKind.HOVER_TARGET_ONLY],
                ] as Array<[string, PopoverInteractionKind]>
            ).map(([label, kind]) => (
                <Flex key={kind} flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title={label} />
                    <PopoverNext
                        {...args}
                        interactionKind={kind}
                        content={
                            <Menu>
                                <MenuItem text="Option 1" />
                                <MenuItem text="Option 2" />
                            </Menu>
                        }
                    >
                        <Button text={label} />
                    </PopoverNext>
                </Flex>
            ))}
        </Flex>
    ),
};

/**
 * Use `matchTargetWidth={true}` to make the popover content match the width of the
 * trigger element. This is useful for dropdown menus that should align with a wider trigger.
 */
export const MatchTargetWidthExample: Story = {
    name: "Match Target Width",
    args: {
        animation: "minimal",
        arrow: false,
        isOpen: true,
        placement: "bottom",
    },
    argTypes: {
        matchTargetWidth: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Default" />
                <PopoverNext
                    {...args}
                    matchTargetWidth={false}
                    content={
                        <Menu>
                            <MenuItem text="Short" />
                            <MenuItem text="Option" />
                        </Menu>
                    }
                >
                    <Button text="Wide Trigger Button" fill={true} style={{ width: 250 }} />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Match Target Width" />
                <PopoverNext
                    {...args}
                    matchTargetWidth={true}
                    content={
                        <Menu>
                            <MenuItem text="Short" />
                            <MenuItem text="Option" />
                        </Menu>
                    }
                >
                    <Button text="Wide Trigger Button" fill={true} style={{ width: 250 }} />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

/**
 * A disabled popover will not open regardless of user interaction.
 */
export const DisabledExample: Story = {
    name: "Disabled",
    args: {
        content: SAMPLE_MENU,
    },
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Enabled" />
                <PopoverNext {...args} disabled={false}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Disabled" />
                <PopoverNext {...args} disabled={true}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

/**
 * Use `hasBackdrop={true}` with click interaction to render an invisible overlay behind the
 * popover that prevents interaction with the rest of the page until it is closed.
 * Use `backdropProps` to add a visible background color to the backdrop.
 */
export const HasBackdropExample: Story = {
    name: "Has Backdrop",
    args: {
        content: SAMPLE_MENU,
    },
    argTypes: {
        hasBackdrop: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="No Backdrop" />
                <PopoverNext {...args} hasBackdrop={false}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Invisible Backdrop" />
                <PopoverNext {...args} hasBackdrop={true}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Visible Backdrop" />
                <PopoverNext
                    {...args}
                    hasBackdrop={true}
                    backdropProps={{
                        style: {
                            backgroundColor: "oklch(from var(--bp-palette-black) l c h / 0.3)",
                        },
                    }}
                >
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

/**
 * Use `fill={true}` to make the popover target take up the full width of its container.
 * This automatically sets the target tag name to `"div"`.
 */
export const FillExample: Story = {
    name: "Fill",
    args: {
        content: SAMPLE_MENU,
    },
    argTypes: {
        fill: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={4} style={{ width: 300 }}>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Default (inline)" />
                <PopoverNext {...args} fill={false}>
                    <Button text="Open Menu" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1}>
                <StoryLabel title="Fill" />
                <PopoverNext {...args} fill={true}>
                    <Button text="Open Menu" endIcon="caret-down" fill={true} />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

/**
 * Set `isOpen` to control the popover's open state externally. In controlled mode, the
 * popover only opens or closes when the `isOpen` prop changes. Use `onInteraction` to
 * respond to user interactions that would normally toggle the popover. This story defaults
 * to open; toggle the `isOpen` control to drive it.
 */
export const ControlledExample: Story = {
    name: "Controlled",
    args: {
        isOpen: true,
        content: SAMPLE_MENU,
    },
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: function RenderControlled({ isOpen, ...args }) {
        const [, updateArgs] = useArgs();
        const handleInteraction = useCallback(
            (nextOpenState: boolean) => updateArgs({ isOpen: nextOpenState }),
            [updateArgs],
        );
        return (
            <PopoverNext {...args} isOpen={isOpen} onInteraction={handleInteraction}>
                <Button text="Popover Target" endIcon="caret-down" />
            </PopoverNext>
        );
    },
};

/**
 * Use `defaultIsOpen={true}` to have the popover open on initial render in uncontrolled mode.
 */
export const DefaultIsOpenExample: Story = {
    name: "Default Is Open",
    args: {
        defaultIsOpen: true,
        content: SAMPLE_MENU,
    },
    render: args => (
        <PopoverNext {...args}>
            <Button text="Initially Open" endIcon="caret-down" />
        </PopoverNext>
    ),
};

/**
 * Use `hoverOpenDelay` and `hoverCloseDelay` to control the timing of hover-triggered popovers.
 * These props only apply when `interactionKind` is `"hover"` or `"hover-target"`.
 */
export const HoverDelaysExample: Story = {
    name: "Hover Delays",
    args: {
        interactionKind: PopoverInteractionKind.HOVER,
        content: SAMPLE_MENU,
    },
    argTypes: {
        interactionKind: { table: { disable: true } },
    },
    render: args => (
        <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Default delays" />
                <PopoverNext {...args}>
                    <Button text="Hover me" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Slow open (800ms)" />
                <PopoverNext {...args} hoverOpenDelay={800}>
                    <Button text="Hover me" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="No close delay" />
                <PopoverNext {...args} hoverCloseDelay={0}>
                    <Button text="Hover me" />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

/**
 * Use the `animation` prop to control the popover's entrance animation.
 * `"scale"` (default) applies a scale + fade transition, while `"minimal"` uses only a fade.
 */
export const AnimationExample: Story = {
    name: "Animation",
    args: {
        arrow: false,
        isOpen: true,
        placement: "bottom",
        content: SAMPLE_MENU,
    },
    render: args => (
        <Flex gap={4}>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Scale (default)" />
                <PopoverNext {...args} animation="scale">
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Minimal" />
                <PopoverNext {...args} animation="minimal">
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </Flex>
        </Flex>
    ),
};

/**
 * Set `usePortal={false}` to render the popover inline in the DOM rather than in a portal.
 * This can be useful when the popover needs to inherit CSS styles from surrounding elements.
 * Use `portalContainer` to render the portal into a specific DOM element instead of `document.body`.
 *
 * Open each popover, then scroll the dashed container. The default (`document.body`) portal stays
 * fixed relative to the viewport, while the inline (`usePortal={false}`) popover scrolls with the
 * container content.
 */
export const UsePortalExample: Story = {
    name: "Use Portal",
    render: function RenderUsePortal(args) {
        return (
            <div
                style={{
                    border: "2px dashed var(--bp-surface-border-color-default)",
                    borderRadius: "var(--bp-surface-border-radius)",
                    width: 400,
                    height: 250,
                    overflow: "auto",
                }}
            >
                {/* Taller than the container so it scrolls. */}
                <Flex gap={4} justifyContent="center" style={{ padding: "180px 40px" }}>
                    <Flex flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title="With Portal (default)" />
                        <PopoverNext {...args} usePortal={true} placement="bottom" content={SAMPLE_MENU}>
                            <Button text="Open" endIcon="caret-down" />
                        </PopoverNext>
                    </Flex>
                    <Flex flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title="No Portal" />
                        <PopoverNext {...args} usePortal={false} content={SAMPLE_MENU}>
                            <Button text="Open" endIcon="caret-down" />
                        </PopoverNext>
                    </Flex>
                </Flex>
            </div>
        );
    },
};

/**
 * Use the `boundary` prop to constrain the popover within a specific container element.
 * When the popover would overflow the boundary it flips or shifts to stay inside. Scroll
 * the dashed container so the bottom-placed popover bumps against the top edge: the popover
 * with a `boundary` flips to stay inside the container, while the unbounded popover keeps its
 * requested placement and overflows.
 */
export const BoundaryExample: Story = {
    name: "Boundary",
    args: {
        defaultIsOpen: true,
    },
    render: function RenderBoundary(args) {
        // Use state (not a ref) so the popover re-renders once the boundary element mounts.
        const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);
        return (
            <div
                ref={setBoundary}
                style={{
                    border: "2px dashed var(--bp-surface-border-color-default)",
                    borderRadius: "var(--bp-surface-border-radius)",
                    width: 400,
                    height: 250,
                    overflow: "auto",
                    position: "relative",
                }}
            >
                {/* Taller than the container so it scrolls; extra space above/below lets the
                    targets be scrolled toward the container edges. */}
                <Flex flexDirection="column" alignItems="center" gap={4} style={{ padding: "180px 40px" }}>
                    <Flex gap={4}>
                        <Flex flexDirection="column" gap={1} alignItems="center">
                            <StoryLabel title="With boundary" />
                            <PopoverNext
                                {...args}
                                placement="bottom"
                                boundary={boundary ?? undefined}
                                content={SAMPLE_MENU}
                            >
                                <Button text="Open" endIcon="caret-down" />
                            </PopoverNext>
                        </Flex>
                        <Flex flexDirection="column" gap={1} alignItems="center">
                            <StoryLabel title="No boundary" />
                            <PopoverNext {...args} placement="bottom" content={SAMPLE_MENU}>
                                <Button text="Open" endIcon="caret-down" />
                            </PopoverNext>
                        </Flex>
                    </Flex>
                </Flex>
            </div>
        );
    },
};

/**
 * A popover can open a Dialog from within its content. Even though the dialog is
 * rendered in a portal outside the popover, PopoverNext recognizes it as a child
 * overlay and stays open while the dialog is on screen. Closing the dialog leaves
 * the popover open so the user can take further actions.
 */
export const OpensDialog: Story = {
    name: "Opens Dialog",
    render: function RenderOpensDialog(args) {
        const [{ isOpen, dialogOpen }, updateArgs] = useArgs<{ isOpen?: boolean; dialogOpen?: boolean }>();
        const handleInteraction = useCallback(
            (nextOpenState: boolean) => updateArgs({ isOpen: nextOpenState }),
            [updateArgs],
        );
        const openDialog = useCallback(() => updateArgs({ dialogOpen: true }), [updateArgs]);
        const closeDialog = useCallback(() => updateArgs({ dialogOpen: false }), [updateArgs]);
        return (
            <>
                <PopoverNext
                    {...args}
                    isOpen={isOpen}
                    onInteraction={handleInteraction}
                    content={
                        <Box padding={4}>
                            <Flex flexDirection="column" gap={2}>
                                <span>Choose an action</span>
                                <Button text="Edit details" icon="edit" onClick={openDialog} />
                            </Flex>
                        </Box>
                    }
                >
                    <Button text="Open menu" endIcon="caret-down" />
                </PopoverNext>
                <Dialog isOpen={dialogOpen === true} title="Edit details" onClose={closeDialog} usePortal={true}>
                    <DialogBody>
                        <p>This dialog was launched from inside a popover. The popover remains open behind it.</p>
                        <Checkbox label={"Clickable"} />
                        <Checkbox label={"Options"} />
                    </DialogBody>
                    <DialogFooter
                        actions={
                            <>
                                <Button text="Cancel" onClick={closeDialog} />
                                <Button text="Save" intent="primary" onClick={closeDialog} />
                            </>
                        }
                    />
                </Dialog>
            </>
        );
    },
    args: {
        isOpen: false,
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Open the popover", async () => {
            await userEvent.click(canvas.getByRole("button", { name: "Open menu" }));
            await waitFor(() => expect(screen.getByRole("button", { name: /Edit details/ })).toBeVisible());
        });

        await step("Open the dialog from inside the popover", async () => {
            await userEvent.click(screen.getByRole("button", { name: /Edit details/ }));
            await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
        });

        await step("Popover remains open while dialog is on screen", async () => {
            await expect(screen.getByRole("dialog")).toBeVisible();
            await expect(screen.getByRole("button", { name: /Edit details/ })).toBeVisible();
        });

        await step("Clicking inside the dialog does not close the popover", async () => {
            await userEvent.click(screen.getByLabelText("Clickable"));
            await expect(screen.getByRole("dialog")).toBeVisible();
            await expect(screen.getByRole("button", { name: /Edit details/ })).toBeVisible();
        });

        await step("Closing the dialog leaves the popover open", async () => {
            await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
            await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
            await expect(screen.getByRole("button", { name: /Edit details/ })).toBeVisible();
        });
    },
};

/**
 * The same child-overlay handling applies when the popover is triggered by hover.
 * Moving the cursor into a dialog launched from the popover does not count as moving
 * away from the popover, so the popover stays open while the dialog is on screen.
 */
export const OpensDialogOnHover: Story = {
    name: "Opens Dialog (Hover)",
    render: function RenderOpensDialogOnHover(args) {
        const [{ isOpen, dialogOpen }, updateArgs] = useArgs<{ isOpen?: boolean; dialogOpen?: boolean }>();
        const openDialog = useCallback(() => updateArgs({ dialogOpen: true }), [updateArgs]);
        const closeDialog = useCallback(() => updateArgs({ dialogOpen: false }), [updateArgs]);

        const handleInteraction = useCallback(
            (nextOpenState: boolean) => updateArgs({ isOpen: nextOpenState }),
            [updateArgs],
        );

        return (
            <>
                <PopoverNext
                    {...args}
                    isOpen={isOpen}
                    onInteraction={handleInteraction}
                    interactionKind={PopoverInteractionKind.HOVER}
                    content={
                        <Box padding={4}>
                            <Flex flexDirection="column" gap={2}>
                                <span>Hover-triggered popover</span>
                                <Button text="Open settings" icon="cog" onClick={openDialog} />
                            </Flex>
                        </Box>
                    }
                >
                    <Button text="Hover me" />
                </PopoverNext>
                <Dialog isOpen={dialogOpen === true} title="Settings" onClose={closeDialog} usePortal={true}>
                    <DialogBody>
                        <p>Clicking inside this dialog does not dismiss the hover-triggered popover behind it.</p>
                        <Checkbox label={"Clickable"} />
                        <Checkbox label={"Options"} />
                    </DialogBody>
                    <DialogFooter actions={<Button text="Done" intent="primary" onClick={closeDialog} />} />
                </Dialog>
            </>
        );
    },
    args: {
        isOpen: false,
    },
    play: async ({ canvas, userEvent, step }) => {
        await step("Hover the target to open the popover", async () => {
            await userEvent.hover(canvas.getByRole("button", { name: "Hover me" }));
            await waitFor(() => expect(screen.getByRole("button", { name: /Open settings/ })).toBeVisible());
        });

        await step("Click the popover action to open the dialog", async () => {
            await userEvent.click(screen.getByRole("button", { name: /Open settings/ }));
            await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
        });

        await step("Popover stays open while dialog is on screen", async () => {
            await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());
            await expect(screen.getByRole("button", { name: /Open settings/ })).toBeVisible();
        });

        await step("Close the dialog — popover remains open", async () => {
            await userEvent.click(screen.getByRole("button", { name: "Done" }));
            await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
            await expect(screen.getByRole("button", { name: /Open settings/ })).toBeVisible();
        });
    },
};
