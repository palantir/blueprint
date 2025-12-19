/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import enUS from "date-fns/locale/en-US";
import { useState } from "react";

import type { DateRange } from "../../common";
import { DateRangeInput } from "./dateRangeInput";

const meta = {
    title: "Datetime/DateRangeInput",
    component: DateRangeInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DateRangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A basic controlled DateRangeInput. Pick start and end dates from the calendar or type in the inputs.
 */
export const Basic: Story = {
    render: function BasicDateRangeInput() {
        const [value, setValue] = useState<DateRange>([null, null]);
        return <DateRangeInput locale={enUS} value={value} onChange={setValue} />;
    },
};
