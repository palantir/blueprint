/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import * as React from "react";

import { Classes, HTMLTable } from "@blueprintjs/core";

import { ExampleCard } from "./ExampleCard";

export class HtmlTableExample extends React.PureComponent {
    public render() {
        return (
            <ExampleCard label="HTML Table">
                <HTMLTable className="html-table-example" interactive={true} striped={true}>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Description</th>
                            <th>Techonlogies</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={Classes.INTENT_PRIMARY}>Blueprint</td>
                            <td className={Classes.INTENT_SUCCESS}>CSS framework and UI toolkit</td>
                            <td className={Classes.INTENT_WARNING}>Sass, Typescript, React</td>
                            <td className={Classes.INTENT_DANGER}>268</td>
                        </tr>
                        <tr>
                            <td>TSLint</td>
                            <td>Static analysis linter for Typescript</td>
                            <td>Typescript</td>
                            <td>403</td>
                        </tr>
                        <tr>
                            <td>Plottable</td>
                            <td>Composable charting library built on top of D3</td>
                            <td>SVG, TypeScript, D3</td>
                            <td>737</td>
                        </tr>
                    </tbody>
                </HTMLTable>
            </ExampleCard>
        );
    }
}
