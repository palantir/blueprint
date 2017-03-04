/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ComponentClass } from "react";

// this is the default map, containing docs components defined locally.
import * as ReactDocs from "../components/reactDocs";

export interface IDocsMap {
    [name: string]: ComponentClass<{}>;
};

/**
 * Given the name of a component, like `"ColorSchemes"`, attempts to resolve
 * it to an actual component class in the given map, or in the default map which contains
 * valid docs components from this package. Provide a custom map to inject your own components.
 */
export function resolveDocs(componentName: string, components: IDocsMap = {}): ComponentClass<{}> {
    if (componentName == null) {
        return undefined;
    }

    const docsComponent = components[componentName] || (ReactDocs as any as IDocsMap)[componentName];
    if (docsComponent == null) {
        throw new Error(`Unknown docs component: ${componentName}`);
    }
    return docsComponent;
}
