/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconNames } from "@blueprintjs/icons";

import { Intent } from "../../common/intent";
import { Icon, IconSize } from "./icon";

const meta = {
    title: "Core/Icon",
    component: Icon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default icon (e.g. calendar).
 */
export const Default: Story = {
    args: {
        icon: IconNames.CALENDAR,
    },
};

/**
 * Icon with primary intent.
 */
export const WithIntent: Story = {
    args: {
        icon: IconNames.CALENDAR,
        intent: Intent.PRIMARY,
    },
};

/**
 * Size variants: standard and large.
 */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Icon icon={IconNames.CALENDAR} size={IconSize.STANDARD} />
            <Icon icon={IconNames.CALENDAR} size={IconSize.LARGE} />
        </div>
    ),
};
