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

import { IBaseExampleProps, IExampleMap } from "@blueprintjs/docs";
import * as React from "react";

// tslint:disable no-submodule-imports
import * as CoreExamples from "@blueprintjs/core/examples";
import * as DateExamples from "@blueprintjs/datetime/examples";
import * as LabsExamples from "@blueprintjs/labs/examples";
import * as TableExamples from "@blueprintjs/table/examples";

import { getTheme } from "../components/blueprintDocs";

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/master/packages";

export const reactExamples: IExampleMap = {};

function addPackageExamples(
    packageName: string,
    packageExamples: { [name: string]: React.ComponentClass<IBaseExampleProps> },
) {
    for (const exampleName of Object.keys(packageExamples)) {
        const example = packageExamples[exampleName];
        const fileName = exampleName.charAt(0).toLowerCase() + exampleName.slice(1) + ".tsx";
        reactExamples[exampleName] = {
            render: props => React.createElement(example, { ...props, themeName: getTheme() }),
            sourceUrl: [SRC_HREF_BASE, packageName, "examples", fileName].join("/"),
        };
    }
}

addPackageExamples("core", CoreExamples as any);
addPackageExamples("datetime", DateExamples as any);
addPackageExamples("labs", LabsExamples as any);
addPackageExamples("table", TableExamples as any);
