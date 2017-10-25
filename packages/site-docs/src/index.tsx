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

const versions = require<string[]>("./generated/versions.json").map(version => ({
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
