/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Sandpack } from "@codesandbox/sandpack-react";
import * as React from "react";

import { ExampleCard } from "./ExampleCard";

export const SandpackExample = () => {
    return (
        <ExampleCard label="Sandpack Example">
            <Sandpack />
        </ExampleCard>
    );
};
