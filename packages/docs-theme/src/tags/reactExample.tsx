/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { AnchorButton, Intent } from "@blueprintjs/core";
import { ITag } from "documentalist/dist/client";
import * as React from "react";
import { IExampleProps } from "../components/example";

export interface IExample {
    sourceUrl: string;
    render: (props: IExampleProps) => JSX.Element | undefined;
}

// construct a map of package name to all examples defined in that package.
// packageName must match directory name as it is used to generate sourceUrl.
export interface IExampleMap {
    [componentName: string]: IExample;
}

export class ReactExampleTagRenderer {
    constructor(private examples: IExampleMap) {}

    /**
     * Given the name of an example component, like `"AlertExample"`, attempts to resolve
     * it to an actual example component exported by one of the packages. Also returns
     * the URL of the source code on GitHub.
     */
    public render: React.SFC<ITag> = ({ value: exampleName }) => {
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
                    icon="code"
                    intent={Intent.PRIMARY}
                    minimal={true}
                    target="_blank"
                    text="View source on GitHub"
                />
            </>
        );
    };
}
