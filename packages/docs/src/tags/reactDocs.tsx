/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import { TagRenderer } from "./";

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
    public render: TagRenderer = ({ value: componentName }, key) => {
        if (componentName == null) {
            return undefined;
        }

        const docsComponent = this.docs[componentName];
        if (docsComponent == null) {
            throw new Error(`Unknown @reactDocs component: ${componentName}`);
        }
        return React.createElement(docsComponent, { key });
    };
}
