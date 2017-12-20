/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import "dom4";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { createDefaultRenderers, ReactDocsTagRenderer, ReactExampleTagRenderer } from "@blueprintjs/docs-theme";
import { docsData as docs, IPackageInfo, releasesData, versionsData } from "@blueprintjs/docs-data";

import { BlueprintDocs } from "./components/blueprintDocs";
import * as ReactDocs from "./tags/reactDocs";
import { reactExamples } from "./tags/reactExamples";

const releases = releasesData.map((pkg: IPackageInfo) => {
    pkg.url = `https://www.npmjs.com/package/${pkg.name}`;
    return pkg;
});

const versions = versionsData.map((version: string) => ({
    url: `https://palantir.github.io/blueprint/docs/${version}`,
    version,
}));
/* tslint:enable:no-var-requires */

const reactDocs = new ReactDocsTagRenderer(ReactDocs as any);
const reactExample = new ReactExampleTagRenderer(reactExamples);

const tagRenderers = {
    ...createDefaultRenderers(docs),
    reactDocs: reactDocs.render,
    reactExample: reactExample.render,
};

ReactDOM.render(
    <BlueprintDocs {...{ docs, tagRenderers, releases, versions }} defaultPageId="blueprint" />,
    document.query("#blueprint-documentation"),
);
