/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { StorybookLayout, storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useCallback, useState } from "react";

import { Intent } from "../../common";
import { Button } from "../button/buttons";

import { CompoundTag } from "./compoundTag";

// These props are deprecated on CompoundTag — hide them from the Storybook controls panel.
const disabledArgs = ["large", "rightIcon", "children"] as const satisfies ReadonlyArray<
    keyof React.ComponentProps<typeof CompoundTag>
>;

const meta: Meta<typeof CompoundTag> = {
    title: "Core/Tag/CompoundTag",
    component: CompoundTag,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        leftContent: "Key",
        children: "Value",
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
} satisfies Meta<typeof CompoundTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic compound tag displaying a key-value pair.
 */
export const Basic: Story = {
    args: {
        leftContent: "Key",
        children: "Value",
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.values(Intent)
                .filter(i => i !== "none")
                .map(intent => (
                    <CompoundTag key={intent} {...args} leftContent="Status" intent={intent}>
                        {intent.charAt(0).toUpperCase() + intent.slice(1)}
                    </CompoundTag>
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
                <CompoundTag {...args} leftContent="Key" minimal={false}>
                    Value
                </CompoundTag>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                <StoryLabel title="Minimal" />
                <CompoundTag {...args} leftContent="Key" minimal={true}>
                    Value
                </CompoundTag>
            </div>
        </div>
    ),
};

/**
 * Use the `size` prop to adjust the tag dimensions. CompoundTag supports `"medium"` (default) and `"large"`.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CompoundTag {...args} leftContent="Size" size="medium">
                Medium
            </CompoundTag>
            <CompoundTag {...args} leftContent="Size" size="large">
                Large
            </CompoundTag>
        </div>
    ),
};

/**
 * CompoundTags support `active` and `interactive` states, and can be made removable with the `onRemove` prop.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        active: { table: { disable: true } },
        interactive: { table: { disable: true } },
    },
    render: function Render(args) {
        return (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <CompoundTag {...args} leftContent="Key">
                    Default
                </CompoundTag>
                <CompoundTag {...args} leftContent="Key" active={true}>
                    Active
                </CompoundTag>
                <CompoundTag {...args} leftContent="Key" interactive={true}>
                    Interactive
                </CompoundTag>
                <CompoundTag {...args} leftContent="Key" onRemove={args.onRemove}>
                    Removable
                </CompoundTag>
            </div>
        );
    },
};

/**
 * Use `icon` and `endIcon` props to render icons before the left content or after the right content.
 */
export const IconExample: Story = {
    name: "Icons",
    argTypes: {
        icon: { table: { disable: true } },
        endIcon: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <CompoundTag {...args} leftContent="City" icon="globe">
                London
            </CompoundTag>
            <CompoundTag {...args} leftContent="City" endIcon="map-marker">
                Seattle
            </CompoundTag>
            <CompoundTag {...args} leftContent="City" icon="globe" endIcon="map-marker">
                New York
            </CompoundTag>
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
            <CompoundTag {...args} leftContent="Region" fill={true}>
                Full Width
            </CompoundTag>
            <CompoundTag {...args} leftContent="Region" fill={false}>
                Auto Width
            </CompoundTag>
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
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {Object.values(Intent).map(intent => (
                                <CompoundTag key={intent} {...args} leftContent="Key" minimal={minimal} intent={intent}>
                                    {intent === Intent.NONE ? "none" : intent}
                                </CompoundTag>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {Object.values(Intent).map(intent => (
                                <CompoundTag
                                    key={intent}
                                    {...args}
                                    leftContent="Key"
                                    minimal={minimal}
                                    intent={intent}
                                    active={true}
                                    interactive={true}
                                >
                                    {intent === Intent.NONE ? "none" : intent}
                                </CompoundTag>
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
                        <CompoundTag
                            key={tag}
                            active={args.active}
                            endIcon={args.endIcon}
                            fill={args.fill}
                            icon={args.icon}
                            intent={args.intent}
                            interactive={args.interactive}
                            leftContent="City"
                            minimal={args.minimal}
                            onRemove={args.onRemove != null ? handleRemove(tag) : undefined}
                            round={args.round}
                            size={args.size}
                        >
                            {tag}
                        </CompoundTag>
                    ))}
                </div>
                {tags.length === 0 && (
                    <Button icon="refresh" variant="outlined" size="small" text="Reset tags" onClick={handleReset} />
                )}
            </div>
        );
    },
    args: {
        leftContent: "City",
        children: undefined,
        icon: "globe",
        endIcon: "map-marker",
        interactive: true,
    },
};
