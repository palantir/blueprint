/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IExampleMap, IExampleProps } from "@blueprintjs/docs-theme";
import * as React from "react";

import * as CoreExamples from "../examples/core-examples";
import * as DateExamples from "../examples/datetime-examples";
import * as SelectExamples from "../examples/select-examples";
import * as TableExamples from "../examples/table-examples";
import * as TimezoneExamples from "../examples/timezone-examples";

/** Interface for `IExampleProps` `data` in this here Blueprint docs-app. */
export interface IBlueprintExampleData {
    /** CSS class of theme, typically `""` or `Classes.DARK`. */
    themeName: string;
}

import { getTheme } from "../components/blueprintDocs";

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples";

function getPackageExamples(
    packageName: string,
    packageExamples: { [name: string]: React.ComponentClass<IExampleProps<IBlueprintExampleData>> },
) {
    const ret: IExampleMap = {};
    for (const exampleName of Object.keys(packageExamples)) {
        const example = packageExamples[exampleName];
        const fileName = exampleName.charAt(0).toLowerCase() + exampleName.slice(1) + ".tsx";
        ret[exampleName] = {
            render: props => React.createElement(example, { ...props, data: { themeName: getTheme() } }),
            sourceUrl: [SRC_HREF_BASE, `${packageName}-examples`, fileName].join("/"),
        };
    }
    return ret;
}

export const reactExamples: IExampleMap = (() => {
    return {
        ...getPackageExamples("core", CoreExamples as any),
        ...getPackageExamples("datetime", DateExamples as any),
        ...getPackageExamples("select", SelectExamples as any),
        ...getPackageExamples("table", TableExamples as any),
        ...getPackageExamples("timezone", TimezoneExamples as any),
    };
})();
