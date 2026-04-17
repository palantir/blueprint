/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Colors } from "../../common";
import { Tab } from "./tab";
import { Tabs } from "./tabs";
import { DashedPaddedContainer, StoryLabel, storybookLayoutDecorator } from "@storybook-common";

// These props are deprecated on Tabs — hide them from the Storybook controls panel.
const disabledArgs = [
    "large",
    "className",
    "children",
    "defaultSelectedTabId",
    "selectedTabId",
    "onChange",
    "id",
] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Tabs>>;

const meta: Meta<typeof Tabs> = {
    title: "Core/Tabs",
    component: Tabs,
    decorators: [storybookLayoutDecorator],
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "tabs-story",
        animate: true,
        vertical: false,
        fill: false,
        size: "medium",
        renderActiveTabPanelOnly: false,
    },
    argTypes: {
        size: {
            control: "select",
            options: ["medium", "large"],
        },
        animate: { control: "boolean" },
        vertical: { control: "boolean" },
        fill: { control: "boolean" },
        renderActiveTabPanelOnly: { control: "boolean" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: args => (
        <Tabs {...args}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
        </Tabs>
    ),
};

/**
 * Use the `size` prop to control the tab size. Tabs support `medium` (default) and `large`.
 */
export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            <div>
                <StoryLabel title="Medium" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="size-medium" size="medium">
                        <Tab id="tab1" title="First" panel={<p>First panel</p>} />
                        <Tab id="tab2" title="Second" panel={<p>Second panel</p>} />
                        <Tab id="tab3" title="Third" panel={<p>Third panel</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Large" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="size-large" size="large">
                        <Tab id="tab1" title="First" panel={<p>First panel</p>} />
                        <Tab id="tab2" title="Second" panel={<p>Second panel</p>} />
                        <Tab id="tab3" title="Third" panel={<p>Third panel</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
        </div>
    ),
};

/**
 * Tabs support vertical layout and individual tabs can be disabled.
 */
export const StateExample: Story = {
    name: "State",
    argTypes: {
        vertical: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", gap: 32 }}>
            <div>
                <StoryLabel title="Vertical" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="state-vertical" vertical={true}>
                        <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
                        <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
                        <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="With Disabled Tab" />
                <DashedPaddedContainer>
                    <Tabs {...args} id="state-disabled">
                        <Tab id="tab1" title="Enabled" panel={<p>Enabled panel content</p>} />
                        <Tab id="tab2" title="Disabled" disabled={true} panel={<p>Disabled panel content</p>} />
                        <Tab id="tab3" title="Also Enabled" panel={<p>Also enabled panel content</p>} />
                    </Tabs>
                </DashedPaddedContainer>
            </div>
        </div>
    ),
};

/**
 * Use the `fill` prop to make tabs stretch to fill their container.
 */
export const FillExample: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
                <StoryLabel title="Default" />
                <DashedPaddedContainer width={500}>
                    <div style={{ background: Colors.BLUE5, borderRadius: 4, padding: 4 }}>
                        <Tabs {...args} id="fill-default" fill={false}>
                            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
                            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
                            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
                        </Tabs>
                    </div>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Fill" />
                <DashedPaddedContainer width={500}>
                    <div style={{ background: Colors.RED5, borderRadius: 4, padding: 4 }}>
                        <Tabs {...args} id="fill-enabled" fill={true}>
                            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
                            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
                            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
                        </Tabs>
                    </div>
                </DashedPaddedContainer>
            </div>
        </div>
    ),
};

/**
 * Tabs can display a `<Tag>` next to the title using the `tagContent` prop.
 */
export const WithTagExample: Story = {
    name: "With Tag",
    render: args => (
        <Tabs {...args} id="with-tag">
            <Tab id="tab1" title="Inbox" tagContent={42} panel={<p>Inbox panel content</p>} />
            <Tab id="tab2" title="Sent" tagContent={3} panel={<p>Sent panel content</p>} />
            <Tab id="tab3" title="Drafts" panel={<p>Drafts panel content</p>} />
        </Tabs>
    ),
};

/**
 * Interactive playground for experimenting with all Tabs props.
 */
export const Playground: Story = {
    render: function Render(args) {
        const [selectedTabId, setSelectedTabId] = useState<string | number>("tab1");
        const handleChange = useCallback((newTabId: string | number) => {
            setSelectedTabId(newTabId);
        }, []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Tabs {...args} selectedTabId={selectedTabId} onChange={handleChange}>
                    <Tab
                        id="tab1"
                        title="React"
                        icon="code"
                        panel={<p>React is a JavaScript library for building user interfaces.</p>}
                    />
                    <Tab
                        id="tab2"
                        title="Angular"
                        icon="application"
                        panel={<p>Angular is a platform for building mobile and desktop web applications.</p>}
                    />
                    <Tab
                        id="tab3"
                        title="Ember"
                        icon="flame"
                        panel={<p>Ember.js is a productive, battle-tested JavaScript framework.</p>}
                    />
                    <Tab id="tab4" title="Backbone" disabled={true} icon="disable" panel={<p>Backbone panel</p>} />
                </Tabs>
            </div>
        );
    },
};
