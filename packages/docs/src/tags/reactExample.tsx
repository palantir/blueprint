/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
};

export interface IExampleProps {
    example: IExample;
    name: string;
}

export const ReactExample: React.SFC<IExampleProps> = (props) => (
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
    }
}
