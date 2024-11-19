/* !
 * (c) Copyright 2024 Palantir Technologies Inc. All rights reserved.
 */

import type { Tag } from "@documentalist/client";
import type * as React from "react";

import type { ExampleMap } from "./reactExample";

export class ReactCodeExampleTagRenderer {
    constructor(private examples: ExampleMap) {}

    public render: React.FC<Tag> = ({ value: exampleName }) => {
        if (exampleName == null) {
            return null;
        }

        const example = this.examples[exampleName];
        if (example == null) {
            throw new Error(`Unknown @example component: ${exampleName}`);
        }
        return example.render({ id: exampleName }) ?? null;
    };
}
