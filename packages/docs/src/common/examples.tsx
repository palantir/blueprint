/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import * as CoreExamples from "@blueprint/core/examples";
import * as DateExamples from "@blueprint/datetime/examples";

import { getTheme } from "./theme";

// construct a map of package name to all examples defined in that package.
// packageName must match directory name as it is used to generate sourceUrl.
const Examples: { [packageName: string]: { [name: string]: React.ComponentClass<{ getTheme: () => string }> } } = {
    core: CoreExamples as any,
    datetime: DateExamples as any,
};
function getExample(componentName: string) {
    for (const packageName of Object.keys(Examples)) {
        const component = Examples[packageName][componentName];
        if (component != null) {
            return { component, packageName };
        }
    }
    return { component: null, packageName: null };
}

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/master/packages";

/**
 * Given the name of an example component, like `"AlertExample"`, attempts to resolve it to an actual example component
 * exported by one of the packages. Returns the `ComponentClass` and the URL of the source code on GitHub.
 */
export function resolveExample(exampleName: string) {
    if (exampleName == null) {
        return { element: null, sourceUrl: "" };
    }

    const { component, packageName } = getExample(exampleName);
    if (component == null) {
        throw new Error(`Unknown component: Blueprint.Examples.${exampleName}`);
    }
    const fileName = exampleName.charAt(0).toLowerCase() + exampleName.slice(1) + ".tsx";
    const element = <div className="kss-example">{React.createElement(component, { getTheme })}</div>;
    return {
        element,
        sourceUrl: [SRC_HREF_BASE, packageName, "examples", fileName].join("/"),
    };
}
