/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { Intent, Spinner, SpinnerSize } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export const SpinnerExample = React.memo(() => {
    return (
        <ExampleCard label="Spinner">
            {Object.values(Intent).map(intent => (
                <Spinner key={`${intent}-spinner`} intent={intent} size={SpinnerSize.STANDARD} />
            ))}
        </ExampleCard>
    );
});

SpinnerExample.displayName = "DemoApp.SpinnerExample";
