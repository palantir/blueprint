/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Box, H1 } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export function BoxExample() {
    return (
        <ExampleCard label="Box">
            <Box
                asChild={true}
                className="box-example"
                display="flex"
                justifyContent="center"
                marginBlock={0}
                paddingInline={5}
                paddingBlock={2}
            >
                <H1>BOX</H1>
            </Box>
        </ExampleCard>
    );
}

BoxExample.displayName = "DemoApp.BoxExample";
