/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import enUS from "date-fns/locale/en-US";
import { useState } from "react";

import { DateInput } from "./dateInput";

const meta = {
    title: "Datetime/DateInput",
    component: DateInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic controlled DateInput. Pick a date from the calendar or type in the input.
 */
export const Basic: Story = {
    render: function BasicDateInput() {
        const [value, setValue] = useState<string | null>(null);
        return <DateInput locale={enUS} value={value} onChange={setValue} />;
    },
};

/**
 * Uncontrolled DateInput with a default value.
 */
export const Uncontrolled: Story = {
    args: {
        defaultValue: "2025-03-15T00:00:00.000",
        locale: enUS,
        onChange: (date: string | null) => {
            console.log("Selected date:", date);
        },
    },
};
