/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { Box, H1 } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export function BoxExample() {
    return (
        <ExampleCard label="Box">
            <Box
                className="box-example"
                as={H1}
                display="flex"
                justifyContent="center"
                marginBlock={0}
                paddingInline={5}
                paddingBlock={2}
            >
                BOX
            </Box>
        </ExampleCard>
    );
}

BoxExample.displayName = "DemoApp.BoxExample";
