/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "../tag/tag";
import { EntityTitle } from "./entityTitle";

const meta = {
    title: "Core/EntityTitle",
    component: EntityTitle,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        title: "Entity name",
        subtitle: "Optional subtitle or description",
        ellipsize: false,
        fill: false,
        loading: false,
    },
} satisfies Meta<typeof EntityTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic entity title with subtitle.
 */
export const Default: Story = {};

/**
 * Entity title with icon.
 */
export const WithIcon: Story = {
    args: {
        title: "Document",
        subtitle: "Last modified yesterday",
        icon: "document",
    },
};

/**
 * Entity title with tags.
 */
export const WithTags: Story = {
    args: {
        title: "Project Alpha",
        subtitle: "Active project",
        tags: (
            <>
                <Tag>Active</Tag>
                <Tag intent="primary">v2.0</Tag>
            </>
        ),
    },
};

/**
 * Loading state with skeleton placeholder.
 */
export const Loading: Story = {
    args: {
        title: "Loading entity",
        subtitle: "Fetching details...",
        loading: true,
    },
};

/**
 * Title with link.
 */
export const WithLink: Story = {
    args: {
        title: "Linked entity",
        subtitle: "Click the title to navigate",
        titleURL: "#",
    },
};
