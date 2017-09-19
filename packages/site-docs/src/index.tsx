/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import "dom4";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { createDefaultRenderers, IDocsData, ReactDocsTagRenderer, ReactExampleTagRenderer } from "@blueprintjs/docs";

import { BlueprintDocs } from "./components/blueprintDocs";
import { IPackageInfo } from "./components/navbarActions";
import * as ReactDocs from "./tags/reactDocs";
import { reactExamples } from "./tags/reactExamples";

/* tslint:disable:no-var-requires */
const docs = require<IDocsData>("./generated/docs.json");

const releases = require<IPackageInfo[]>("./generated/releases.json").map(pkg => {
    pkg.url = `https://www.npmjs.com/package/${pkg.name}`;
    return pkg;
});

const versions = require<string[]>("./generated/versions.json").map(
    version =>
        ({
            url: `https://palantir.github.io/blueprint/docs/${version}`,
            version,
        } as IPackageInfo),
);
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
