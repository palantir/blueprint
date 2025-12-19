/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tab } from "./tab";
import { Tabs } from "./tabs";

const meta = {
    title: "Core/Tabs",
    component: Tabs,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "tabs-story",
        animate: true,
        size: "medium",
        vertical: false,
    },
    argTypes: {
        size: {
            control: "select",
            options: ["medium", "large"],
        },
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic horizontal tabs.
 */
export const Default: Story = {
    render: args => (
        <div style={{ width: 400 }}>
            <Tabs {...args}>
                <Tab id="one" title="Tab one" panel={<div>Panel one content</div>} />
                <Tab id="two" title="Tab two" panel={<div>Panel two content</div>} />
                <Tab id="three" title="Tab three" panel={<div>Panel three content</div>} />
            </Tabs>
        </div>
    ),
};

/**
 * Vertical tabs on the left.
 */
export const Vertical: Story = {
    render: args => (
        <div style={{ width: 400, height: 200 }}>
            <Tabs {...args} vertical={true}>
                <Tab id="a" title="First" panel={<div>First panel</div>} />
                <Tab id="b" title="Second" panel={<div>Second panel</div>} />
                <Tab id="c" title="Third" panel={<div>Third panel</div>} />
            </Tabs>
        </div>
    ),
};

/**
 * Large tab titles.
 */
export const Large: Story = {
    render: args => (
        <div style={{ width: 400 }}>
            <Tabs {...args} size="large">
                <Tab id="1" title="Overview" panel={<div>Overview content</div>} />
                <Tab id="2" title="Details" panel={<div>Details content</div>} />
            </Tabs>
        </div>
    ),
};

/**
 * Disabled tab.
 */
export const WithDisabledTab: Story = {
    render: args => (
        <div style={{ width: 400 }}>
            <Tabs {...args}>
                <Tab id="enabled" title="Enabled" panel={<div>Enabled panel</div>} />
                <Tab id="disabled" title="Disabled" panel={<div>Disabled panel</div>} disabled={true} />
            </Tabs>
        </div>
    ),
};
