/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useRef } from "react";
import { useArgs } from "storybook/preview-api";

import { Classes } from "../../common";
import { Button } from "../button/buttons";
import { ControlGroup } from "../forms/controlGroup";
import { InputGroup } from "../forms/inputGroup";
import { Code } from "../html/html";
import { HTMLSelect } from "../html-select/htmlSelect";
import { Menu } from "../menu/menu";
import { MenuItem } from "../menu/menuItem";
import { PopoverAnimation, PopoverInteractionKind } from "../popover/popoverProps";
import { Slider } from "../slider/slider";

import { PopoverNext } from "./popoverNext";
import type { PopoverNextPlacement } from "./popoverNextProps";

const PLACEMENTS: PopoverNextPlacement[] = [
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "right",
    "right-start",
    "right-end",
    "left",
    "left-start",
    "left-end",
];

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
    decorators: [
        Story => (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "300px",
                    padding: "40px",
                }}
            >
                <Story />
            </div>
        ),
    ],
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
            options: PLACEMENTS,
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

const PlacementPopover: React.FC<{ placement: PopoverNextPlacement } & React.ComponentProps<typeof PopoverNext>> = ({
    placement,
    ...popoverProps
}) => {
    const [sideLabel, alignmentLabel] = placement.split("-");
    const content = (
        <div style={{ padding: "1.25em" }}>
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
        ({ isOpen, ...p }: { isOpen: boolean } & Record<string, unknown>) => (
            <Button {...p} active={isOpen} className={Classes.BUTTON} text={placement} />
        ),
        [placement],
    );

    return <PopoverNext {...popoverProps} content={content} placement={placement} renderTarget={renderTarget} />;
};

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
 * The `content` prop accepts a plain string for simple text content.
 */
export const TextContentExample: Story = {
    name: "Content: Text",
    render: args => (
        <PopoverNext {...args} content="This is a simple string popover content.">
            <Button text="Open" endIcon="caret-down" />
        </PopoverNext>
    ),
};

/**
 * A popover containing form inputs. The popover manages focus so that
 * keyboard users can interact with form elements inside.
 */
export const InputContentExample: Story = {
    name: "Content: Input",
    render: args => (
        <PopoverNext
            {...args}
            content={
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <InputGroup placeholder="Enter a value..." />
                    <Button text="Submit" intent="primary" size="small" />
                </div>
            }
        >
            <Button text="Edit" icon="edit" />
        </PopoverNext>
    ),
};

/**
 * A popover with a slider. Useful for inline controls like opacity or volume adjustments.
 */
export const SliderContentExample: Story = {
    name: "Content: Slider",
    render: args => (
        <PopoverNext
            {...args}
            content={
                <div style={{ padding: 16, width: 200 }}>
                    <Slider min={0} max={100} stepSize={1} value={50} labelStepSize={25} />
                </div>
            }
        >
            <Button text="Adjust" icon="settings" />
        </PopoverNext>
    ),
};

/**
 * A popover with a menu is the most common use case.
 */
export const MenuContentExample: Story = {
    name: "Content: Menu",
    render: args => (
        <PopoverNext {...args} content={SAMPLE_MENU}>
            <Button text="Actions" endIcon="caret-down" />
        </PopoverNext>
    ),
};

/**
 * A popover with an HTML select element inside.
 */
export const SelectContentExample: Story = {
    name: "Content: Select",
    render: args => (
        <PopoverNext
            {...args}
            content={
                <div style={{ padding: 16 }}>
                    <HTMLSelect options={["Apple", "Banana", "Cherry", "Date"]} fill={true} />
                </div>
            }
        >
            <Button text="Choose fruit" endIcon="caret-down" />
        </PopoverNext>
    ),
};

/**
 * When `content` is empty or undefined, the popover will not open.
 */
export const EmptyContentExample: Story = {
    name: "Content: Empty",
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>undefined</span>
                <PopoverNext {...args} content={undefined}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Empty string</span>
                <PopoverNext {...args} content="">
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
        </div>
    ),
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <ControlGroup vertical={true}>
                    <PlacementPopover {...args} placement="right-start" />
                    <PlacementPopover {...args} placement="right" />
                    <PlacementPopover {...args} placement="right-end" />
                </ControlGroup>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <em className={Classes.TEXT_MUTED}>
                    Button positions are flipped here so that all popovers open inward.
                </em>
            </div>
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
    argTypes: {
        arrow: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>With Arrow</span>
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
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>No Arrow</span>
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
            </div>
        </div>
    ),
};

/**
 * Use `interactionKind` to control how the popover is triggered. `"click"` opens on click,
 * `"hover"` opens on mouse hover, and `"hover-target"` opens on hover but only tracks
 * the target element (not the popover content).
 */
export const InteractionKindExample: Story = {
    name: "Interaction Kind",
    argTypes: {
        interactionKind: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            {(
                [
                    ["Click", PopoverInteractionKind.CLICK],
                    ["Hover", PopoverInteractionKind.HOVER],
                    ["Hover Target Only", PopoverInteractionKind.HOVER_TARGET_ONLY],
                ] as Array<[string, PopoverInteractionKind]>
            ).map(([label, kind]) => (
                <div key={kind} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{label}</span>
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
                </div>
            ))}
        </div>
    ),
};

/**
 * Use `matchTargetWidth={true}` to make the popover content match the width of the
 * trigger element. This is useful for dropdown menus that should align with a wider trigger.
 */
export const MatchTargetWidthExample: Story = {
    name: "Match Target Width",
    argTypes: {
        matchTargetWidth: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default</span>
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
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Match Target Width</span>
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
            </div>
        </div>
    ),
};

/**
 * A disabled popover will not open regardless of user interaction.
 */
export const DisabledExample: Story = {
    name: "Disabled",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Enabled</span>
                <PopoverNext {...args} disabled={false} content={SAMPLE_MENU}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Disabled</span>
                <PopoverNext {...args} disabled={true} content={SAMPLE_MENU}>
                    <Button text="Click Me" endIcon="caret-down" />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Use `hasBackdrop={true}` with click interaction to render an invisible overlay behind the
 * popover that prevents interaction with the rest of the page until it is closed.
 */
export const HasBackdropExample: Story = {
    name: "Has Backdrop",
    argTypes: {
        hasBackdrop: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>No Backdrop</span>
                <PopoverNext {...args} hasBackdrop={false} content={SAMPLE_MENU}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>With Backdrop</span>
                <PopoverNext {...args} hasBackdrop={true} content={SAMPLE_MENU}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Use `fill={true}` to make the popover target take up the full width of its container.
 * This automatically sets the target tag name to `"div"`.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default (inline)</span>
                <PopoverNext {...args} fill={false} content={SAMPLE_MENU}>
                    <Button text="Open Menu" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Fill</span>
                <PopoverNext {...args} fill={true} content={SAMPLE_MENU}>
                    <Button text="Open Menu" endIcon="caret-down" fill={true} />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Use `isOpen` to control the popover's open state externally. In controlled mode,
 * the popover will only open or close when the `isOpen` prop changes. Use `onInteraction`
 * to respond to user interactions that would normally toggle the popover.
 */
export const ControlledExample: Story = {
    name: "Controlled",
    argTypes: {
        disabled: { table: { disable: true } },
    },
    render: function RenderControlled({ isOpen, ...args }) {
        const [, updateArgs] = useArgs();
        const handleInteraction = useCallback(
            (nextOpenState: boolean) => updateArgs({ isOpen: nextOpenState }),
            [updateArgs],
        );
        const handleToggle = useCallback(() => updateArgs({ isOpen: !isOpen }), [isOpen, updateArgs]);
        return (
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <PopoverNext {...args} isOpen={isOpen} onInteraction={handleInteraction} content={SAMPLE_MENU}>
                    <Button text="Popover Target" endIcon="caret-down" />
                </PopoverNext>
                <Button text={isOpen ? "Close" : "Open"} onClick={handleToggle} intent="primary" variant={"minimal"} />
            </div>
        );
    },
    args: {
        isOpen: false,
    },
};

/**
 * Use `defaultIsOpen={true}` to have the popover open on initial render in uncontrolled mode.
 */
export const DefaultIsOpenExample: Story = {
    name: "Default Is Open",
    render: args => (
        <PopoverNext {...args} defaultIsOpen={true} content={SAMPLE_MENU}>
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
    argTypes: {
        interactionKind: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Default delays</span>
                <PopoverNext {...args} interactionKind={PopoverInteractionKind.HOVER} content={SAMPLE_MENU}>
                    <Button text="Hover me" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Slow open (800ms)</span>
                <PopoverNext
                    {...args}
                    interactionKind={PopoverInteractionKind.HOVER}
                    hoverOpenDelay={800}
                    content={SAMPLE_MENU}
                >
                    <Button text="Hover me" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>No close delay</span>
                <PopoverNext
                    {...args}
                    interactionKind={PopoverInteractionKind.HOVER}
                    hoverCloseDelay={0}
                    content={SAMPLE_MENU}
                >
                    <Button text="Hover me" />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Use the `animation` prop to control the popover's entrance animation.
 * `"scale"` (default) applies a scale + fade transition, while `"minimal"` uses only a fade.
 */
export const AnimationExample: Story = {
    name: "Animation",
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Scale (default)</span>
                <PopoverNext {...args} animation="scale" content={SAMPLE_MENU}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>Minimal</span>
                <PopoverNext {...args} animation="minimal" content={SAMPLE_MENU}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Set `usePortal={false}` to render the popover inline in the DOM rather than in a portal.
 * This can be useful when the popover needs to inherit CSS styles from surrounding elements.
 */
export const UsePortalExample: Story = {
    name: "Use Portal",
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>With Portal (default)</span>
                <PopoverNext {...args} usePortal={true} content={SAMPLE_MENU}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.6 }}>No Portal</span>
                <PopoverNext {...args} usePortal={false} content={SAMPLE_MENU}>
                    <Button text="Open" endIcon="caret-down" />
                </PopoverNext>
            </div>
        </div>
    ),
};

/**
 * Use the `boundary` prop to constrain the popover within a specific container element.
 * When the popover would overflow the boundary, it flips or shifts to stay inside.
 * Try scrolling the container to see the popover reposition itself.
 */
export const BoundaryExample: Story = {
    name: "Boundary",
    render: function RenderBoundary(args) {
        const boundaryRef = useRef<HTMLDivElement>(null);
        return (
            <div
                ref={boundaryRef}
                style={{
                    border: "2px dashed rgba(128, 128, 128, 0.5)",
                    borderRadius: 4,
                    padding: 40,
                    width: 400,
                    height: 250,
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                        <span style={{ fontSize: 12, opacity: 0.6 }}>With boundary</span>
                        <PopoverNext
                            {...args}
                            placement="top"
                            boundary={boundaryRef.current ?? undefined}
                            content={SAMPLE_MENU}
                        >
                            <Button text="Open" endIcon="caret-down" />
                        </PopoverNext>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                        <span style={{ fontSize: 12, opacity: 0.6 }}>No boundary</span>
                        <PopoverNext {...args} placement="top" content={SAMPLE_MENU}>
                            <Button text="Open" endIcon="caret-down" />
                        </PopoverNext>
                    </div>
                </div>
            </div>
        );
    },
};
