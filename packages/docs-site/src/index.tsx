/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import "dom4";

import * as React from "react";
import * as ReactDOM from "react-dom";

import {
    createDefaultRenderers,
    Documentation,
    getTheme,
    IBaseExampleProps,
    IDocsData,
    IExampleMap,
    IPackageInfo,
    ReactDocsTagRenderer,
    ReactExampleTagRenderer,
} from "@blueprintjs/docs";

import * as ReactDocs from "./reactDocs";

import * as CoreExamples from "@blueprintjs/core/examples";
import * as DateExamples from "@blueprintjs/datetime/examples";
import * as TableExamples from "@blueprintjs/table/examples";

/* tslint:disable:no-var-requires */
const docs = require<IDocsData>("./generated/docs.json");

const releases = require<IPackageInfo[]>("./generated/releases.json")
    .map((pkg) => {
        pkg.url = `https://www.npmjs.com/package/${pkg.name}`;
        return pkg;
    });
const versions = require<string[]>("./generated/versions.json")
    .map((version) => ({
        url: `https://palantir.github.io/blueprint/docs/${version}`,
        version,
    } as IPackageInfo));
/* tslint:enable:no-var-requires */

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/master/packages";

const reactDocs = new ReactDocsTagRenderer(ReactDocs as any);

const examples: IExampleMap = {};
function addPackageExamples(
    packageName: string,
    packageExamples: { [name: string]: React.ComponentClass<IBaseExampleProps> },
) {
    for (const exampleName of Object.keys(packageExamples)) {
        const example = packageExamples[exampleName];
        const fileName = exampleName.charAt(0).toLowerCase() + exampleName.slice(1) + ".tsx";
        examples[exampleName] = {
            render: (props) => React.createElement(example, { ...props, getTheme }),
            sourceUrl: [SRC_HREF_BASE, packageName, "examples", fileName].join("/"),
        };
    }
}
addPackageExamples("core", CoreExamples as any);
addPackageExamples("datetime", DateExamples as any);
addPackageExamples("table", TableExamples as any);
const reactExample = new ReactExampleTagRenderer(examples);

const TAGS = {
    ...createDefaultRenderers(docs),
    reactDocs: reactDocs.render,
    reactExample: reactExample.render,
};

// This function is called whenever the documentation page changes and should be used to
// run non-React code on the newly rendered sections.
const updateExamples = () => {
    // indeterminate checkbox styles must be applied via JavaScript.
    document.queryAll(".pt-checkbox input[indeterminate]").forEach((el: HTMLInputElement) => {
        el.indeterminate = true;
    });
};

ReactDOM.render(
    <Documentation
        defaultPageId="styleguide"
        docs={docs}
        onUpdate={updateExamples}
        releases={releases}
        tagRenderers={TAGS}
        versions={versions}
    />,
    document.query("#blueprint-documentation"),
);
