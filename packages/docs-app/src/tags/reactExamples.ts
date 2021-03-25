/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";

import { ExampleMap, ExampleProps } from "@blueprintjs/docs-theme";

import { getTheme } from "../components/blueprintDocs";
import * as CoreExamples from "../examples/core-examples";
import * as DateExamples from "../examples/datetime-examples";
import * as SelectExamples from "../examples/select-examples";
import * as TableExamples from "../examples/table-examples";
import * as TimezoneExamples from "../examples/timezone-examples";
import { BlueprintExampleData } from "./types";

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples";

function getPackageExamples(
    packageName: string,
    packageExamples: { [name: string]: React.ComponentClass<ExampleProps<BlueprintExampleData>> },
) {
    const ret: ExampleMap = {};
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

export const reactExamples: ExampleMap = (() => {
    return {
        ...getPackageExamples("core", CoreExamples as any),
        ...getPackageExamples("datetime", DateExamples as any),
        ...getPackageExamples("select", SelectExamples as any),
        ...getPackageExamples("table", TableExamples as any),
        ...getPackageExamples("timezone", TimezoneExamples as any),
    };
})();
