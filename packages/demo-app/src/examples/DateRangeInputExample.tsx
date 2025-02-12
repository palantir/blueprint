/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import React from "react";

import { DateRangeInput3 } from "@blueprintjs/datetime2";

import { ExampleCard } from "./ExampleCard";

export const DateRangeInputExample: React.FC = () => {
    return (
        <ExampleCard label="Date range input">
            <DateRangeInput3 />
        </ExampleCard>
    );
};
