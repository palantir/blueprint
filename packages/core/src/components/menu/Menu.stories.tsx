/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { expect, screen, waitFor } from "storybook/test";

import { Flex } from "@blueprintjs/labs";

import { Intent, Size } from "../../common";
import { Button } from "../button/buttons";
import { PopoverNext } from "../popover-next/popoverNext";

import { Menu } from "./menu";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

type MenuItemArg = React.ComponentProps<typeof MenuItem>;

// Story args combine Menu's own props with the MenuItem props exposed in the controls table so that the
// stories below can flow them down to their MenuItem children.
type MenuStoryArgs = React.ComponentProps<typeof Menu> & {
    text: MenuItemArg["text"];
    icon: MenuItemArg["icon"];
    label: MenuItemArg["label"];
    intent: MenuItemArg["intent"];
    active: MenuItemArg["active"];
    disabled: MenuItemArg["disabled"];
    multiline: MenuItemArg["multiline"];
    selected: MenuItemArg["selected"];
    roleStructure: MenuItemArg["roleStructure"];
    shouldDismissPopover: MenuItemArg["shouldDismissPopover"];
};

// These props are deprecated on Menu — hide them from the Storybook controls panel.
const disabledArgs = ["large", "small"] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Menu>>;

const meta: Meta<MenuStoryArgs> = {
    title: "Core/Menu",
    component: Menu,
    subcomponents: { MenuItem, MenuDivider },
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        size: "medium",
        active: false,
        disabled: false,
        multiline: false,
        shouldDismissPopover: true,
    },
    argTypes: {
        size: {
            control: "select",
            options: Object.values(Size),
            table: { category: "Menu" },
        },
        text: { control: "text", table: { category: "MenuItem" } },
        icon: { control: "text", table: { category: "MenuItem" } },
        label: { control: "text", table: { category: "MenuItem" } },
        intent: {
            control: "select",
            options: Object.values(Intent),
            table: { category: "MenuItem" },
        },
        active: { control: "boolean", table: { category: "MenuItem" } },
        disabled: { control: "boolean", table: { category: "MenuItem" } },
        multiline: { control: "boolean", table: { category: "MenuItem" } },
        selected: { control: "boolean", table: { category: "MenuItem" } },
        roleStructure: {
            control: "select",
            options: ["menuitem", "listoption", "listitem", "none"],
            table: { category: "MenuItem" },
        },
        shouldDismissPopover: { control: "boolean", table: { category: "MenuItem" } },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<MenuStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Split combined story args into the props that belong on <Menu> vs. the shared props applied to each
// <MenuItem>. This lets the MenuItem controls in the table drive the items without leaking onto the <ul>.
function splitArgs({
    text,
    icon,
    label,
    intent,
    active,
    disabled,
    multiline,
    selected,
    roleStructure,
    shouldDismissPopover,
    ...menuProps
}: MenuStoryArgs) {
    return {
        menuProps,
        itemArgs: { intent, active, disabled, multiline, selected, roleStructure, shouldDismissPopover },
    };
}

export const Default: Story = {
    render: args => {
        const { menuProps, itemArgs } = splitArgs(args);
        return (
            <Menu {...menuProps}>
                <MenuItem {...itemArgs} icon="new-text-box" text="New text box" />
                <MenuItem {...itemArgs} icon="new-object" text="New object" />
                <MenuItem {...itemArgs} icon="new-link" text="New link" />
                <MenuDivider />
                <MenuItem {...itemArgs} icon="cog" text="Settings" label="⌘," />
            </Menu>
        );
    },
};

export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Flex gap={2}>
                {Object.values(Intent).map(intent => (
                    <Menu key={intent} {...menuProps}>
                        <MenuItem
                            icon="graph"
                            text={<span style={{ textTransform: "capitalize" }}>{intent}</span>}
                            intent={intent}
                        />
                        <MenuItem icon="notifications" text="Active" intent={intent} active={true} />
                    </Menu>
                ))}
            </Flex>
        );
    },
};

export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Flex gap={4} alignItems="start">
                {Object.values(Size).map(size => (
                    <Flex key={size} flexDirection="column" gap={1} alignItems="center">
                        <StoryLabel title={size} />
                        <Menu {...menuProps} size={size}>
                            <MenuItem icon="document" text="New file" />
                            <MenuItem icon="folder-close" text="New folder" />
                            <MenuDivider />
                            <MenuItem icon="cog" text="Settings" />
                        </Menu>
                    </Flex>
                ))}
            </Flex>
        );
    },
};

export const StateExample: Story = {
    name: "State",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="States" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Default" />
                        <MenuItem active={true} icon="walk" text="Active" />
                        <MenuItem icon="ban-circle" text="Disabled" disabled={true} />
                        <MenuItem icon="tick-circle" text="Selected" roleStructure="listoption" selected={true} />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Active Combinations" />
                    <Menu {...menuProps}>
                        <MenuItem active={true} icon="walk" text="Active" />
                        <MenuItem active={true} icon="ban-circle" text="Disabled" disabled={true} />
                        <MenuItem
                            active={true}
                            icon="tick-circle"
                            text="Selected"
                            roleStructure="listoption"
                            selected={true}
                        />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Disabled Combinations" />
                    <Menu {...menuProps}>
                        <MenuItem disabled={true} icon="ban-circle" text="Disabled" />
                        <MenuItem disabled={true} active={true} icon="walk" text="Active" />
                        <MenuItem
                            disabled={true}
                            icon="tick-circle"
                            text="Selected"
                            roleStructure="listoption"
                            selected={true}
                        />
                    </Menu>
                </Flex>
            </Flex>
        );
    },
};

export const IconExample: Story = {
    name: "Icons",
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Menu {...menuProps}>
                <MenuItem icon="applications" text="With icon" />
                <MenuItem text="Without icon" />
                <MenuItem icon="graph" text="With icon and label" label="⌘G" />
                <MenuItem icon="add" text="With label element" labelElement={<span>Ctrl+N</span>} />
            </Menu>
        );
    },
};

/**
 * Use a `MenuItem`'s `label` prop for a string label (e.g. a keyboard shortcut), or `labelElement` for a JSX label.
 */
export const LabelExample: Story = {
    name: "Label",
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Menu {...menuProps}>
                <MenuItem icon="document" text="With string label" label="⌘N" />
                <MenuItem icon="floppy-disk" text="With label element" labelElement={<span>⌘S</span>} />
                <MenuItem icon="cog" text="Without label" />
            </Menu>
        );
    },
};

/**
 * Pass `MenuItem` children to render a submenu that appears in a popover on hover or click.
 */
export const SubmenuExample: Story = {
    name: "Submenu",
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Menu {...menuProps}>
                <MenuItem icon="style" text="Text formatting">
                    <MenuItem icon="bold" text="Bold" label="⌘B" />
                    <MenuItem icon="italic" text="Italic" label="⌘I" />
                    <MenuItem icon="underline" text="Underline" label="⌘U" />
                    <MenuDivider />
                    <MenuItem icon="font" text="Font" />
                </MenuItem>
            </Menu>
        );
    },
};

/**
 * Use a `MenuItem`'s `multiline` prop to allow long text to wrap to multiple lines instead of being
 * truncated with an ellipsis. The parent menu must have a constrained width for wrapping to be observable.
 */
export const MultilineExample: Story = {
    name: "Multiline",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => {
        const { menuProps } = splitArgs(args);
        const longText = "This is a very long menu item label that will not fit on a single line";
        return (
            <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Ellipsized (default)" />
                    <div style={{ width: 220 }}>
                        <Menu {...menuProps}>
                            <MenuItem icon="paragraph" text={longText} multiline={false} />
                        </Menu>
                    </div>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Multiline" />
                    <div style={{ width: 220 }}>
                        <Menu {...menuProps}>
                            <MenuItem icon="paragraph" text={longText} multiline={true} />
                        </Menu>
                    </div>
                </Flex>
            </Flex>
        );
    },
};

/**
 * Use a `MenuItem`'s `roleStructure` to adapt its ARIA role to the parent. `"menuitem"` (default) suits a
 * `<ul role="menu">`, `"listoption"` suits a `<ul role="listbox">` and enables the selected tick icon,
 * and `"listitem"` suits a plain `<ul>`.
 */
export const RoleStructureExample: Story = {
    name: "Role Structure",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="menuitem" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="menuitem" />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="listoption (selected)" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="listoption" selected={true} />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="listoption (unselected)" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="listoption" selected={false} />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="listitem" />
                    <Menu {...menuProps}>
                        <MenuItem icon="home" text="Home" roleStructure="listitem" />
                    </Menu>
                </Flex>
            </Flex>
        );
    },
};

/**
 * Use a `MenuItem`'s `tagName` to change the HTML tag that wraps it. Defaults to `"a"`; set to `"button"`
 * for items that don't navigate, or `"div"` when nesting inside another interactive element.
 */
export const TagNameExample: Story = {
    name: "Tag Name",
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Menu {...menuProps}>
                <MenuItem icon="link" text="Anchor (default)" tagName="a" href="#" />
                <MenuItem icon="hand-up" text="Button" tagName="button" />
                <MenuItem icon="layout" text="Div" tagName="div" />
            </Menu>
        );
    },
};

/**
 * By default, clicking a non-submenu item dismisses its parent popover. Set `shouldDismissPopover` to
 * `false` to keep the popover open after click — useful for multi-select menus or persistent toggles.
 */
export const ShouldDismissPopoverExample: Story = {
    name: "Should Dismiss Popover",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <PopoverNext
                        content={
                            <Menu {...menuProps}>
                                <MenuItem icon="tick" text="Dismiss on click" shouldDismissPopover={true} />
                            </Menu>
                        }
                        placement="bottom"
                    >
                        <Button icon="caret-down" text="Dismisses menu (default)" />
                    </PopoverNext>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <PopoverNext
                        content={
                            <Menu {...menuProps}>
                                <MenuItem icon="pin" text="Keep open on click" shouldDismissPopover={false} />
                            </Menu>
                        }
                        placement="bottom"
                    >
                        <Button icon="caret-down" text="Persists menu" />
                    </PopoverNext>
                </Flex>
            </Flex>
        );
    },
};

/**
 * Use `MenuDivider` to separate groups of items. Pass a `title` to render a section header; omit it for a
 * plain horizontal separator.
 */
export const MenuDividerExample: Story = {
    name: "Divider",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => {
        const { menuProps } = splitArgs(args);
        return (
            <Flex gap={4} alignItems="start">
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="With title (section header)" />
                    <Menu {...menuProps}>
                        <MenuDivider title="Edit" />
                        <MenuItem icon="cut" text="Cut" label="⌘X" />
                        <MenuItem icon="duplicate" text="Copy" label="⌘C" />
                        <MenuDivider title="View" />
                        <MenuItem icon="zoom-in" text="Zoom in" label="⌘+" />
                        <MenuItem icon="zoom-out" text="Zoom out" label="⌘-" />
                    </Menu>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Without title (separator)" />
                    <Menu {...menuProps}>
                        <MenuItem icon="document" text="New file" />
                        <MenuItem icon="folder-close" text="New folder" />
                        <MenuDivider />
                        <MenuItem icon="cog" text="Settings" />
                    </Menu>
                </Flex>
            </Flex>
        );
    },
};

export const Playground: Story = {
    args: {
        icon: "floppy-disk",
        text: "Save",
        label: "⌘S",
        intent: "primary",
    },
    render: args => {
        const { menuProps, itemArgs } = splitArgs(args);
        return (
            <Menu {...menuProps}>
                <MenuItem {...itemArgs} icon={args.icon} text={args.text} label={args.label} />
            </Menu>
        );
    },
};

/**
 * Hovering a menu item with children opens its submenu popover.
 */
export const SubmenuOpensOnHover: Story = {
    name: "Submenu Opens On Hover",
    ...SubmenuExample,
    play: async ({ canvas, userEvent, step }) => {
        await step("Submenu items are not visible before hover", async () => {
            await expect(screen.queryByText("Bold")).not.toBeInTheDocument();
        });

        await step("Hover parent item to open submenu", async () => {
            const parent = canvas.getByText("Text formatting");
            await userEvent.hover(parent);
            await waitFor(() => expect(screen.getByText("Bold")).toBeVisible());
            await expect(screen.getByText("Italic")).toBeVisible();
            await expect(screen.getByText("Underline")).toBeVisible();
        });
    },
};
