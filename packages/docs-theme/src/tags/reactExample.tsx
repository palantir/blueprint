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

import { ITag } from "@documentalist/client";
import React from "react";

import { AnchorButton, Intent } from "@blueprintjs/core";
import { Code } from "@blueprintjs/icons";

import { ExampleProps } from "../components/example";

export interface ExampleRenderInfo {
    sourceUrl: string;
    render: (props: ExampleProps) => JSX.Element | undefined;
}

// construct a map of package name to all examples defined in that package.
// packageName must match directory name as it is used to generate sourceUrl.
export interface ExampleMap {
    [componentName: string]: ExampleRenderInfo;
}

export class ReactExampleTagRenderer {
    constructor(private examples: ExampleMap) {}

    /**
     * Given the name of an example component, like `"AlertExample"`, attempts to resolve
     * it to an actual example component exported by one of the packages. Also returns
     * the URL of the source code on GitHub.
     */
    public render: React.FC<ITag> = ({ value: exampleName }) => {
        if (exampleName == null) {
            return null;
        }

        const example = this.examples[exampleName];
        if (example == null) {
            throw new Error(`Unknown @example component: ${exampleName}`);
        }
        return (
            <>
                {example.render({ id: exampleName })}
                <AnchorButton
                    className="docs-example-view-source"
                    fill={true}
                    href={example.sourceUrl}
                    icon={<Code />}
                    intent={Intent.PRIMARY}
                    minimal={true}
                    target="_blank"
                    text="View source on GitHub"
                />
            </>
        );
    };
}
