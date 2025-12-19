/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Boundary } from "../../common";
import { Breadcrumbs } from "./breadcrumbs";

const meta = {
    title: "Core/Breadcrumbs",
    component: Breadcrumbs,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        items: [
            { text: "Files", href: "#" },
            { text: "Project", href: "#" },
            { text: "src", href: "#" },
            { text: "index.tsx", current: true },
        ],
        collapseFrom: Boundary.START,
    },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic breadcrumb trail with links and current page.
 */
export const Default: Story = {};

/**
 * Breadcrumbs that collapse from the end when space is limited.
 */
export const CollapseFromEnd: Story = {
    args: {
        collapseFrom: Boundary.END,
    },
};

/**
 * Short trail that fits without overflow.
 */
export const ShortTrail: Story = {
    args: {
        items: [
            { text: "Home", href: "#" },
            { text: "Settings", current: true },
        ],
    },
};
