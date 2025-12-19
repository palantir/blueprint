/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import enUS from "date-fns/locale/en-US";

import { DatePicker } from "./datePicker";

const meta = {
    title: "Datetime/DatePicker",
    component: DatePicker,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic DatePicker component showing the calendar interface.
 * Click on a date to select it.
 */
export const Basic: Story = {
    args: {
        locale: enUS,
        onChange: (date: Date | null) => {
            console.log("Selected date:", date);
        },
    },
};
