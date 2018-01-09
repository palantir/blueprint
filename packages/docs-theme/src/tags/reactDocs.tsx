/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITag } from "documentalist/dist/client";
import * as React from "react";

export interface IDocsMap {
    [name: string]: React.ComponentClass<{}>;
}

export class ReactDocsTagRenderer {
    constructor(private docs: IDocsMap) {}

    /**
     * Given the name of a component, like `"ColorSchemes"`, attempts to resolve
     * it to an actual component class in the given map, or in the default map which contains
     * valid docs components from this package. Provide a custom map to inject your own components.
     */
    public render: React.SFC<ITag> = ({ value: componentName }) => {
        if (componentName == null) {
            return null;
        }

        const docsComponent = this.docs[componentName];
        if (docsComponent == null) {
            throw new Error(`Unknown @reactDocs component: ${componentName}`);
        }
        return React.createElement(docsComponent);
    };
}
