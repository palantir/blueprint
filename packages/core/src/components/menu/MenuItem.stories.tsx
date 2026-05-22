/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { expect, screen, waitFor } from "storybook/test";

import { Flex } from "@blueprintjs/labs";

import { Intent } from "../../common";

import { Menu } from "./menu";
import { MenuDivider } from "./menuDivider";
import { MenuItem } from "./menuItem";

const meta: Meta<typeof MenuItem> = {
    title: "Core/Menu/MenuItem",
    component: MenuItem,
    decorators: [
        Story => (
            <Menu>
                <Story />
            </Menu>
        ),
        storybookLayoutDecorator,
    ],
    tags: ["autodocs"],
    args: {
        text: "Menu item",
        active: false,
        disabled: false,
        multiline: false,
        shouldDismissPopover: true,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        roleStructure: {
            control: "select",
            options: ["menuitem", "listoption", "listitem", "none"],
        },
        icon: {
            control: "text",
        },
        label: {
            control: "text",
        },
        text: {
            control: "text",
        },
        active: {
            control: "boolean",
        },
        disabled: {
            control: "boolean",
        },
        multiline: {
            control: "boolean",
        },
        selected: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
    },
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic menu item with an icon and text.
 */
export const Default: Story = {
    args: {
        icon: "document",
        text: "New file",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the item.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <>
            {Object.values(Intent).map(intent => (
                <MenuItem
                    key={intent}
                    {...args}
                    icon="graph"
                    text={intent.charAt(0).toUpperCase() + intent.slice(1)}
                    intent={intent}
                />
            ))}
        </>
    ),
};

/**
 * Menu items support `active`, `disabled`, and `selected` states (the latter only when
 * `roleStructure` is `"listoption"`).
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        active: { table: { disable: true } },
        disabled: { table: { disable: true } },
        selected: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <Flex gap={4} alignItems="start">
                <Story />
            </Flex>
        ),
    ],
    render: args => (
        <>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Default" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" />
                </Menu>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Active" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" active={true} />
                </Menu>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Disabled" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" disabled={true} />
                </Menu>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Selected" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" roleStructure="listoption" selected={true} />
                </Menu>
            </Flex>
        </>
    ),
};

/**
 * Use the `icon` prop to render an icon to the left of the text. Items render correctly with or without an icon.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
    },
    render: args => (
        <>
            <MenuItem {...args} icon="applications" text="With icon" />
            <MenuItem {...args} text="Without icon" />
            <MenuItem {...args} icon="graph" text="With icon and label" label="⌘G" />
            <MenuItem {...args} icon="add" text="With label element" labelElement={<span>Ctrl+N</span>} />
        </>
    ),
};

/**
 * Use the `label` prop for a string label (e.g. a keyboard shortcut), or `labelElement` for a JSX label.
 */
export const LabelExample: Story = {
    name: "Label",
    argTypes: {
        label: { table: { disable: true } },
    },
    render: args => (
        <>
            <MenuItem {...args} icon="document" text="With string label" label="⌘N" />
            <MenuItem {...args} icon="floppy-disk" text="With label element" labelElement={<span>⌘S</span>} />
            <MenuItem {...args} icon="cog" text="Without label" />
        </>
    ),
};

/**
 * Pass `MenuItem` children to render a submenu that appears in a popover on hover or click.
 */
export const SubmenuExample: Story = {
    name: "Submenu",
    render: args => (
        <MenuItem {...args} icon="style" text="Text formatting">
            <MenuItem icon="bold" text="Bold" label="⌘B" />
            <MenuItem icon="italic" text="Italic" label="⌘I" />
            <MenuItem icon="underline" text="Underline" label="⌘U" />
            <MenuDivider />
            <MenuItem icon="font" text="Font" />
        </MenuItem>
    ),
};

/**
 * Use the `multiline` prop to allow long text to wrap to multiple lines instead of being
 * truncated with an ellipsis. The parent menu must have a constrained width for wrapping to
 * be observable.
 */
export const MultilineExample: Story = {
    name: "Multiline",
    argTypes: {
        multiline: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <Flex gap={4} alignItems="start">
                <Story />
            </Flex>
        ),
    ],
    render: args => {
        const longText = "This is a very long menu item label that will not fit on a single line";
        return (
            <>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Ellipsized (default)" />
                    <div style={{ width: 220 }}>
                        <Menu>
                            <MenuItem {...args} icon="paragraph" text={longText} multiline={false} />
                        </Menu>
                    </div>
                </Flex>
                <Flex flexDirection="column" gap={1} alignItems="center">
                    <StoryLabel title="Multiline" />
                    <div style={{ width: 220 }}>
                        <Menu>
                            <MenuItem {...args} icon="paragraph" text={longText} multiline={true} />
                        </Menu>
                    </div>
                </Flex>
            </>
        );
    },
};

/**
 * Use `roleStructure` to adapt the ARIA role of the item to its parent. `"menuitem"` (default) suits a
 * `<ul role="menu">`, `"listoption"` suits a `<ul role="listbox">` and enables the selected tick icon,
 * and `"listitem"` suits a plain `<ul>`.
 */
export const RoleStructureExample: Story = {
    name: "Role Structure",
    argTypes: {
        roleStructure: { table: { disable: true } },
        selected: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <Flex gap={4} alignItems="start">
                <Story />
            </Flex>
        ),
    ],
    render: args => (
        <>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="menuitem" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" roleStructure="menuitem" />
                </Menu>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="listoption (selected)" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" roleStructure="listoption" selected={true} />
                </Menu>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="listoption (unselected)" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" roleStructure="listoption" selected={false} />
                </Menu>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="listitem" />
                <Menu>
                    <MenuItem {...args} icon="home" text="Home" roleStructure="listitem" />
                </Menu>
            </Flex>
        </>
    ),
};

/**
 * Use `tagName` to change the HTML tag that wraps the menu item. Defaults to `"a"`; set to `"button"`
 * for items that don't navigate, or `"div"` when nesting inside another interactive element.
 */
export const TagNameExample: Story = {
    name: "Tag Name",
    render: args => (
        <>
            <MenuItem {...args} icon="link" text="Anchor (default)" tagName="a" href="#" />
            <MenuItem {...args} icon="hand-up" text="Button" tagName="button" />
            <MenuItem {...args} icon="layout" text="Div" tagName="div" />
        </>
    ),
};

/**
 * By default, clicking a non-submenu item dismisses its parent popover. Set `shouldDismissPopover` to
 * `false` to keep the popover open after click — useful for multi-select menus or persistent toggles.
 */
export const ShouldDismissPopoverExample: Story = {
    name: "Should Dismiss Popover",
    argTypes: {
        shouldDismissPopover: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <Flex gap={4} alignItems="start">
                <Story />
            </Flex>
        ),
    ],
    render: args => (
        <>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Dismisses (default)" />
                <Menu>
                    <MenuItem {...args} icon="tick" text="Dismiss on click" shouldDismissPopover={true} />
                </Menu>
            </Flex>
            <Flex flexDirection="column" gap={1} alignItems="center">
                <StoryLabel title="Persists" />
                <Menu>
                    <MenuItem {...args} icon="pin" text="Keep open on click" shouldDismissPopover={false} />
                </Menu>
            </Flex>
        </>
    ),
};

/**
 * Interactive playground with all props
 */
export const Playground: Story = {
    args: {
        icon: "floppy-disk",
        text: "Save",
        label: "⌘S",
        intent: "primary",
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
