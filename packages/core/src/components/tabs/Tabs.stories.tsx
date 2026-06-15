/*
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashedPaddedContainer, storybookLayoutDecorator, StoryLabel } from "@storybook-common";
import { useCallback } from "react";
import { useArgs } from "storybook/preview-api";

import { Home } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { Colors } from "../../common";

import { Tab } from "./tab";
import { Tabs, type TabsProps } from "./tabs";

// These props are deprecated on Tabs — hide them from the Storybook controls panel.
const disabledArgs = [
    "large",
    "className",
    "children",
    "defaultSelectedTabId",
    "selectedTabId",
    "onChange",
    "id",
    "renderActiveTabPanelOnly",
] as const satisfies ReadonlyArray<keyof TabsProps>;

const meta: Meta<TabsProps> = {
    title: "Core/Tabs",
    component: Tabs,
    decorators: [storybookLayoutDecorator],
    args: {
        id: "tabs-story",
        animate: true,
        vertical: false,
        fill: false,
        size: "medium",
    },
    argTypes: {
        size: {
            control: "select",
            options: ["medium", "large"],
        },
        animate: { control: "boolean" },
        vertical: { control: "boolean" },
        fill: { control: "boolean" },
        ...disabledArgs.reduce(
            (acc, argName) => {
                acc[argName] = { table: { disable: true } };
                return acc;
            },
            {} as Record<(typeof disabledArgs)[number], { table: { disable: boolean } }>,
        ),
    },
} satisfies Meta<TabsProps>;

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
        <Flex flexDirection="column" gap={6} alignItems="start">
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
        </Flex>
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
        <Flex gap={8}>
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
        </Flex>
    ),
};

/**
 * Use the `fill` prop to make the tab list fill the height of its parent container.
 *
 * Whether to make the tabs list fill the height of its parent.
 * This has no effect when vertical={true}.
 */
export const FillExample: Story = {
    name: "Fill Height",
    argTypes: {
        fill: { table: { disable: true } },
        vertical: { table: { disable: true } },
    },
    render: args => (
        <Flex flexDirection="column" gap={6}>
            <div>
                <StoryLabel title="Default" />
                <DashedPaddedContainer>
                    <div style={{ background: Colors.LIGHT_GRAY3, borderRadius: 4, padding: 4, height: 80 }}>
                        <Tabs {...args} id="fill-default" fill={false}>
                            <Tab id="tab1" title="First" />
                            <Tab id="tab2" title="Second" />
                            <Tab id="tab3" title="Third" />
                        </Tabs>
                    </div>
                </DashedPaddedContainer>
            </div>
            <div>
                <StoryLabel title="Fill Height" />
                <DashedPaddedContainer>
                    <div style={{ background: Colors.LIGHT_GRAY3, borderRadius: 4, padding: 4, height: 80 }}>
                        <Tabs {...args} id="fill-enabled" fill={true}>
                            <Tab id="tab1" title="First" />
                            <Tab id="tab2" title="Second" />
                            <Tab id="tab3" title="Third" />
                        </Tabs>
                    </div>
                </DashedPaddedContainer>
            </div>
        </Flex>
    ),
};

/**
 * Use the `vertical` prop to display tabs in a vertical layout.
 *
 * In vertical mode, the tab list is rendered as a column alongside the tab panels.
 */
export const VerticalExample: Story = {
    name: "Vertical",
    argTypes: {
        vertical: { table: { disable: true } },
        fill: { table: { disable: true } },
    },
    render: args => (
        <Tabs {...args} id="vertical-example" vertical={true}>
            <Tab id="tab1" title="First" panel={<p>First panel content</p>} />
            <Tab id="tab2" title="Second" panel={<p>Second panel content</p>} />
            <Tab id="tab3" title="Third" panel={<p>Third panel content</p>} />
        </Tabs>
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
 * Each tab can display an icon using the `icon` prop.
 */
export const IconExample: Story = {
    name: "Icon",
    render: args => (
        <Tabs {...args} id="with-icon">
            <Tab id="tab1" title="Books" icon="book" panel={<p>Books panel content</p>} />
            <Tab id="tab2" title="Documents" icon="document" panel={<p>Documents panel content</p>} />
            <Tab id="tab3" title="Applications" icon="application" panel={<p>Applications panel content</p>} />
            <Tab id="tab4" title="Element icon" icon={<Home />} panel={<p>Element icon panel</p>} />
        </Tabs>
    ),
};

/**
 * Interactive playground for experimenting with all Tabs props.
 */
export const Playground: Story = {
    args: {
        selectedTabId: "tab1",
    },
    render: function Render(args) {
        const [, updateArgs] = useArgs();
        const handleChange = useCallback(
            (newTabId: string | number) => updateArgs({ selectedTabId: newTabId }),
            [updateArgs],
        );

        return (
            <Tabs {...args} onChange={handleChange}>
                <Tab id="tab1" title="Photos" icon="media" panel={<p>Photos panel content</p>} />
                <Tab id="tab2" title="Videos" icon="video" panel={<p>Videos panel content</p>} />
                <Tab id="tab3" title="Music" icon="music" panel={<p>Music panel content</p>} />
                <Tab id="tab4" title="Books" disabled={true} icon="book" panel={<p>Books panel content</p>} />
            </Tabs>
        );
    },
};
