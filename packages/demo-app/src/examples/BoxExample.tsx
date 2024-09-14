/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import * as React from "react";

import { Box } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export function BoxExample() {
    return (
        <ExampleCard label="Box">
            <Box as="h1" display="flex" justifyContent="center" my={5} px={5} py={2} bg="gray-1" color="white">
                BOX
            </Box>
        </ExampleCard>
    );
}
