/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import React from "react";

import { TimezoneSelect } from "@blueprintjs/datetime2";

import { ExampleCard } from "./ExampleCard";

export const TimezoneSelectExample: React.FC = () => {
    return (
        <ExampleCard label="Timezone select">
            <TimezoneSelect />
        </ExampleCard>
    );
};
