/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { H1 } from "@blueprintjs/core";
import { Box } from "@blueprintjs/labs";

import { ExampleCard } from "./ExampleCard";

export function BoxExample() {
    return (
        <ExampleCard label="Box">
            <Box
                asChild={true}
                className="box-example"
                display="flex"
                justifyContent="center"
                marginBottom={0}
                paddingX={5}
                paddingY={2}
            >
                <H1>BOX</H1>
            </Box>
        </ExampleCard>
    );
}

BoxExample.displayName = "DemoApp.BoxExample";
