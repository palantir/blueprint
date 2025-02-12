/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import React from "react";

import { TimePicker } from "@blueprintjs/datetime2";

import { ExampleCard } from "./ExampleCard";

export const TimePickerExample: React.FC = () => {
    return (
        <ExampleCard label="Time picker">
            <TimePicker />
        </ExampleCard>
    );
};
