/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { ComponentClass } from "react";

// this is the default map, containing docs components defined locally.
import * as ReactDocs from "../components/reactDocs";

export type DocsMap = { [name: string]: ComponentClass<{}> };

/**
 * Given the name of a component, like `"ColorSchemes"`, attempts to resolve
 * it to an actual component class in the given map, or in the default map which contains
 * valid docs components from this package. Provide a custom map to inject your own components.
 */
export function resolveDocs(componentName: string, components: DocsMap = {}): ComponentClass<{}> {
    if (componentName == null) {
        return undefined;
    }

    const docsComponent = components[componentName] || (ReactDocs as any as DocsMap)[componentName];
    if (docsComponent == null) {
        throw new Error(`Unknown docs component: ${componentName}`);
    }
    return docsComponent;
}
