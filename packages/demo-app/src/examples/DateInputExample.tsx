/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import React from "react";

import { DateInput3 } from "@blueprintjs/datetime2";

import { ExampleCard } from "./ExampleCard";

export const DateInputExample: React.FC = () => {
    return (
        <ExampleCard label="Date input">
            <DateInput3 />
        </ExampleCard>
    );
};
