/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";

import { Tab } from "./tab";
import { Tabs, TabsExpander } from "./tabs";

// These props are deprecated on Tabs — hide them from the Storybook controls panel.
const disabledArgs = ["large"] as const satisfies ReadonlyArray<keyof React.ComponentProps<typeof Tabs>>;

const meta: Meta<typeof Tabs> = {
    title: "Core/Tabs/Tabs",
    component: Tabs,
    decorators: [
        Story => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "400px" }}>
                <Story />
            </div>
        ),
    ],
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
        onChange: { action: "changed" },
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

export const Vertical: Story = {
    name: "Vertical",
    argTypes: {
        vertical: { table: { disable: true } },
    },
    render: args => (
        <Tabs {...args} vertical={true}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
            <Tab id="tab4" title="Disabled" disabled={true} panel={<p>Disabled panel</p>} />
        </Tabs>
    ),
};

export const SizeExample: Story = {
    name: "Size",
    argTypes: {
        size: { table: { disable: true } },
    },
    render: args => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Medium</div>
                <Tabs {...args} id="size-medium" size="medium">
                    <Tab id="tab1" title="First" panel={<p>First panel</p>} />
                    <Tab id="tab2" title="Second" panel={<p>Second panel</p>} />
                    <Tab id="tab3" title="Third" panel={<p>Third panel</p>} />
                </Tabs>
            </div>
            <div>
                <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Large</div>
                <Tabs {...args} id="size-large" size="large">
                    <Tab id="tab1" title="First" panel={<p>First panel</p>} />
                    <Tab id="tab2" title="Second" panel={<p>Second panel</p>} />
                    <Tab id="tab3" title="Third" panel={<p>Third panel</p>} />
                </Tabs>
            </div>
        </div>
    ),
};

export const DisabledTab: Story = {
    name: "Disabled Tab",
    render: args => (
        <Tabs {...args}>
            <Tab id="tab1" title="Enabled" panel={<p>Enabled panel content</p>} />
            <Tab id="tab2" title="Disabled" disabled={true} panel={<p>Disabled panel content</p>} />
            <Tab id="tab3" title="Also Enabled" panel={<p>Also enabled panel content</p>} />
        </Tabs>
    ),
};

export const WithIcons: Story = {
    name: "With Icons",
    render: args => (
        <Tabs {...args}>
            <Tab id="tab1" title="Home" icon="home" panel={<p>Home panel</p>} />
            <Tab id="tab2" title="Settings" icon="cog" panel={<p>Settings panel</p>} />
            <Tab id="tab3" title="Notifications" icon="notifications" panel={<p>Notifications panel</p>} />
        </Tabs>
    ),
};

export const WithTags: Story = {
    name: "With Tags",
    render: args => (
        <Tabs {...args}>
            <Tab id="tab1" title="Messages" tagContent={5} panel={<p>Messages panel</p>} />
            <Tab id="tab2" title="Alerts" tagContent={12} panel={<p>Alerts panel</p>} />
            <Tab id="tab3" title="Archive" panel={<p>Archive panel</p>} />
        </Tabs>
    ),
};

export const FillWidth: Story = {
    name: "Fill",
    argTypes: {
        fill: { table: { disable: true } },
    },
    decorators: [
        Story => (
            <div style={{ width: "500px", height: "200px", border: "1px dashed gray" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Tabs {...args} fill={true}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
        </Tabs>
    ),
};

export const WithExpander: Story = {
    name: "With Expander",
    decorators: [
        Story => (
            <div style={{ width: "600px" }}>
                <Story />
            </div>
        ),
    ],
    render: args => (
        <Tabs {...args}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <TabsExpander />
            <Tab id="tab3" title="Right-aligned" panel={<p>Right-aligned panel content</p>} />
        </Tabs>
    ),
};

export const NoAnimation: Story = {
    name: "No Animation",
    argTypes: {
        animate: { table: { disable: true } },
    },
    render: args => (
        <Tabs {...args} animate={false}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
        </Tabs>
    ),
};

export const Playground: Story = {
    render: function Render(args) {
        const [selectedTabId, setSelectedTabId] = useState<string | number>("tab1");
        const handleChange = useCallback((newTabId: string | number) => {
            setSelectedTabId(newTabId);
        }, []);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Tabs {...args} selectedTabId={selectedTabId} onChange={handleChange}>
                    <Tab id="tab1" title="React" icon="code" panel={<p>React is a JavaScript library for building user interfaces.</p>} />
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
                <div style={{ fontSize: 12, opacity: 0.6 }}>Selected tab: {selectedTabId}</div>
            </div>
        );
    },
};
