/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { storybookLayoutDecorator } from "@storybook-common";

import { loadDateFnsLocaleFake } from "../../common/loadDateFnsLocaleFake";

import { DateInputNext } from "./dateInputNext";

const meta: Meta<typeof DateInputNext> = {
    title: "Datetime/DateInputNext",
    component: DateInputNext,
    decorators: [storybookLayoutDecorator],
    args: {
        dateFnsLocaleLoader: loadDateFnsLocaleFake,
    },
} satisfies Meta<typeof DateInputNext>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic date input using PopoverNext.
 */
export const Default: Story = {};

/**
 * DateInputNext with a pre-selected value.
 */
export const WithValue: Story = {
    args: {
        value: "2024-03-15T10:30:00Z",
    },
};

/**
 * DateInputNext in disabled state.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        value: "2024-03-15T10:30:00Z",
    },
};

/**
 * DateInputNext taking full width of its container.
 */
export const Fill: Story = {
    args: {
        fill: true,
    },
};
