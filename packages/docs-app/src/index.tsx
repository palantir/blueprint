/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import "dom4";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { docsData as docs, IPackageInfo, releasesData, versionsData } from "@blueprintjs/docs-data";
import { createDefaultRenderers, ReactDocsTagRenderer, ReactExampleTagRenderer } from "@blueprintjs/docs-theme";

import { BlueprintDocs } from "./components/blueprintDocs";
import * as ReactDocs from "./tags/reactDocs";
import { reactExamples } from "./tags/reactExamples";

const releases: IPackageInfo[] = releasesData.map(pkg => ({
    ...pkg,
    url: `https://www.npmjs.com/package/${pkg.name}`,
}));

const versions: IPackageInfo[] = Object.keys(versionsData).map(majorVersion => ({
    url: `https://palantir.github.io/blueprint/docs/v${majorVersion}`,
    version: versionsData[majorVersion],
}));

const reactDocs = new ReactDocsTagRenderer(ReactDocs as any);
const reactExample = new ReactExampleTagRenderer(reactExamples);

const tagRenderers = {
    ...createDefaultRenderers(),
    reactDocs: reactDocs.render,
    reactExample: reactExample.render,
};

ReactDOM.render(
    <BlueprintDocs {...{ docs, tagRenderers, releases, versions }} defaultPageId="blueprint" />,
    document.querySelector("#blueprint-documentation"),
);
