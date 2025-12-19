/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/buttons";
import { Spinner } from "../spinner/spinner";
import { NonIdealState, NonIdealStateIconSize } from "./nonIdealState";

const meta = {
    title: "Core/NonIdealState",
    component: NonIdealState,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        title: "No items",
        description: "There are no items to display. Create one to get started.",
        icon: "folder-open",
        iconSize: NonIdealStateIconSize.STANDARD,
        iconMuted: true,
        layout: "vertical",
    },
    argTypes: {
        layout: {
            control: "select",
            options: ["vertical", "horizontal"],
        },
    },
} satisfies Meta<typeof NonIdealState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default empty state with icon, title, and description.
 */
export const Default: Story = {};

/**
 * With an action button to resolve the state.
 */
export const WithAction: Story = {
    args: {
        title: "No search results",
        description: "Try adjusting your query or filters.",
        action: <Button text="Clear filters" intent="primary" />,
    },
};

/**
 * Horizontal layout.
 */
export const Horizontal: Story = {
    args: {
        layout: "horizontal",
        title: "Loading...",
        description: "Please wait.",
        icon: "time",
    },
};

/**
 * Small icon size.
 */
export const SmallIcon: Story = {
    args: {
        iconSize: NonIdealStateIconSize.SMALL,
        title: "Compact",
        description: "Smaller icon size.",
    },
};

/**
 * With spinner as icon (loading state).
 */
export const Loading: Story = {
    args: {
        title: "Loading",
        description: "Fetching data...",
        icon: <Spinner size={24} />,
    },
};
