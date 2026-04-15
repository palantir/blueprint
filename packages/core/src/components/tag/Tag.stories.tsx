/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useCallback, useState } from "react";

import { Intent } from "../../common";

import { Tag } from "./tag";

// These props are deprecated on Tag — hide them from the Storybook controls panel.
const disabledArgs = ["large", "rightIcon", "children"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof Tag>
>;

const meta: Meta<typeof Tag> = {
    title: "Core/Tag/Tag",
    component: Tag,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        children: "Tag",
        intent: "none",
        size: "medium",
        icon: undefined,
        endIcon: undefined,
        fill: false,
        active: false,
        minimal: false,
        round: false,
        interactive: false,
    },
    argTypes: {
        intent: {
            control: "select",
            options: Object.values(Intent),
        },
        size: {
            control: "select",
            options: ["medium", "large"],
        },
        icon: {
            control: "text",
        },
        endIcon: {
            control: "text",
        },
        active: {
            control: "boolean",
        },
        fill: {
            control: "boolean",
        },
        interactive: {
            control: "boolean",
        },
        minimal: {
            control: "boolean",
        },
        multiline: {
            control: "boolean",
        },
        round: {
            control: "boolean",
        },
        onClick: { action: "clicked" },
        onRemove: { action: "removed" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = {
                    table: {
                        disable: true,
                    },
                };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic tag with default styling.
 */
export const Default: Story = {
    args: {
        children: "Tag",
    },
};

/**
 * Use the `intent` prop to apply a semantic color that conveys the purpose or status of the tag.
 */
export const IntentExample: Story = {
    name: "Intent",
    argTypes: {
        intent: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <Tag key={intent} {...args} intent={intent}>
                        {intent.charAt(0).toUpperCase() + intent.slice(1)}
                    </Tag>
                ))}
        </div>
    ),
};

/**
 * Use the `minimal` prop to render a tag with reduced visual weight, without a filled background.
 */
export const VariantExample: Story = {
    name: "Variant",
    argTypes: {
        minimal: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="Default" />
                <Tag {...args} minimal={false}>
                    Tag
                </Tag>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="Minimal" />
                <Tag {...args} minimal={true}>
                    Tag
                </Tag>
            </div>
        </div>
    ),
};

/**
 * Use the `size` prop to adjust the tag dimensions. Tag supports `"medium"` (default) and `"large"`.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Tag {...args} size="medium">
                Medium
            </Tag>
            <Tag {...args} size="large">
                Large
            </Tag>
        </div>
    ),
};

/**
 * Tags support `active` and `interactive` states, and can be made removable with the `onRemove` prop.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        active: { table: { disable: true } },
        interactive: { table: { disable: true } },
    },
    render: function Render(args) {
        return (
            <div style={{ display: "flex", gap: 8 }}>
                <Tag {...args}>Default</Tag>
                <Tag {...args} active={true}>
                    Active
                </Tag>
                <Tag {...args} interactive={true}>
                    Interactive
                </Tag>
                <Tag {...args} onRemove={args.onRemove}>
                    Removable
                </Tag>
            </div>
        );
    },
};

/**
 * Use `icon` and `endIcon` props to render icons alongside the tag content.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
        endIcon: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8 }}>
            <Tag {...args} icon="home">
                Start icon
            </Tag>
            <Tag {...args} endIcon="map">
                End icon
            </Tag>
            <Tag {...args} icon="home" endIcon="map">
                Both
            </Tag>
        </div>
    ),
};

/**
 * Use the `fill` prop to make the tag expand to the full width of its container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "400px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
            <Tag {...args} fill={true}>
                Full Width
            </Tag>
            <Tag {...args} fill={false}>
                Auto Width
            </Tag>
        </div>
    ),
};

/**
 * All intents across default and minimal variants, with all states (default, active, interactive, removable).
 */
export const AllIntentsAllVariants: Story = {
    argTypes: {
        intent: { table: { disable: true } },
        minimal: { table: { disable: true } },
        interactive: { table: { disable: true } },
        active: { table: { disable: true } },
    },
    render: function Render(args) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[false, true].map(minimal => (
                    <div key={String(minimal)} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <StoryLabel title={minimal ? "Minimal" : "Default"} />
                        <div style={{ display: "flex", gap: 8 }}>
                            {Object.values(Intent).map(intent => (
                                <Tag key={intent} {...args} minimal={minimal} intent={intent}>
                                    {intent === Intent.NONE ? "none" : intent}
                                </Tag>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            {Object.values(Intent).map(intent => (
                                <Tag
                                    key={intent}
                                    {...args}
                                    minimal={minimal}
                                    intent={intent}
                                    active={true}
                                    interactive={true}
                                >
                                    {intent === Intent.NONE ? "none" : intent}
                                </Tag>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    },
};

/**
 * Interactive playground with removable city tags and all props togglable via Storybook controls.
 */
const PLAYGROUND_INITIAL_TAGS = ["London", "New York", "San Francisco", "Seattle"];

export const Playground: Story = {
    render: function Render(args) {
        const [tags, setTags] = useState(PLAYGROUND_INITIAL_TAGS);

        const handleRemove = useCallback((tag: string) => () => setTags(prev => prev.filter(t => t !== tag)), []);

        const handleReset = useCallback(() => setTags(PLAYGROUND_INITIAL_TAGS), []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {tags.map(tag => (
                        <Tag
                            key={tag}
                            active={args.active}
                            endIcon={args.endIcon}
                            fill={args.fill}
                            icon={args.icon}
                            intent={args.intent}
                            interactive={args.interactive}
                            minimal={args.minimal}
                            onRemove={args.onRemove != null ? handleRemove(tag) : undefined}
                            round={args.round}
                            size={args.size}
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
                {tags.length === 0 && (
                    <button type="button" onClick={handleReset}>
                        Reset tags
                    </button>
                )}
            </div>
        );
    },
    args: {
        children: undefined,
        icon: "home",
        endIcon: "map",
        interactive: true,
    },
};
