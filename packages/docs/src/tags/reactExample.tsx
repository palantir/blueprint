/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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
import { TagRenderer } from "./";

export interface IExample {
    sourceUrl: string;
    render: (props: { id: string }) => JSX.Element | undefined;
}

// construct a map of package name to all examples defined in that package.
// packageName must match directory name as it is used to generate sourceUrl.
export interface IExampleMap {
    [componentName: string]: IExample;
}

export interface IExampleProps {
    example: IExample;
    name: string;
}

export const ReactExample: React.SFC<IExampleProps> = props => (
    <div className="docs-example-wrapper">
        {props.example.render({ id: props.name })}
        <a className="view-example-source" href={props.example.sourceUrl} target="_blank">
            <span className="pt-icon-standard pt-icon-code">&nbsp;</span>View source on GitHub
        </a>
    </div>
);
ReactExample.displayName = "Docs.ReactExample";

export class ReactExampleTagRenderer {
    constructor(private examples: IExampleMap) {}

    /**
     * Given the name of an example component, like `"AlertExample"`, attempts to resolve
     * it to an actual example component exported by one of the packages. Also returns
     * the URL of the source code on GitHub.
     */
    public render: TagRenderer = ({ value: exampleName }, key) => {
        if (exampleName == null) {
            return undefined;
        }

        const example = this.examples[exampleName];
        if (example == null) {
            throw new Error(`Unknown @example component: ${exampleName}`);
        }
        return <ReactExample example={example} key={key} name={exampleName} />;
    };
}
