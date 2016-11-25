/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import * as CoreExamples from "@blueprintjs/core/examples";
import * as DateExamples from "@blueprintjs/datetime/examples";
import * as TableExamples from "@blueprintjs/table/examples";

const Examples: ExampleMap = {
    core: CoreExamples as any,
    datetime: DateExamples as any,
    table: TableExamples as any,
};

export type ExampleComponentClass = React.ComponentClass<{ getTheme: () => string }>;

// construct a map of package name to all examples defined in that package.
// packageName must match directory name as it is used to generate sourceUrl.
export type ExampleMap = {
    [packageName: string]: {
        [componentName: string]: ExampleComponentClass;
    };
};

export interface IResolvedExample {
    component: ExampleComponentClass;
    sourceUrl: string;
}

/**
 * Searches the given examples for a component with the given name and returns the class
 * and name of package in which it was found.
 */
export function getExample(componentName: string, examples: ExampleMap) {
    for (const packageName of Object.keys(examples)) {
        const component = examples[packageName][componentName];
        if (component != null) {
            return { component, packageName };
        }
    }
    return { component: null, packageName: null };
}

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/master/packages";

/**
 * Given the name of an example component, like `"AlertExample"`, attempts to resolve
 * it to an actual example component exported by one of the packages. Also returns
 * the URL of the source code on GitHub.
 */
export function resolveExample(exampleName: string): IResolvedExample {
    if (exampleName == null) {
        return { component: null, sourceUrl: "" };
    }

    const { component, packageName } = getExample(exampleName, Examples);
    if (component == null) {
        throw new Error(`Unknown example component: ${exampleName}`);
    }
    const fileName = exampleName.charAt(0).toLowerCase() + exampleName.slice(1) + ".tsx";
    return {
        component,
        sourceUrl: [SRC_HREF_BASE, packageName, "examples", fileName].join("/"),
    };
}
