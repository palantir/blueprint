/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import "dom4";

import { FocusStyleManager } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { resolveDocs } from "./common/resolveDocs";
import { resolveExample } from "./common/resolveExample";
import { IPackageInfo, IStyleguideSection, Styleguide } from "./components/styleguide";

/* tslint:disable:no-var-requires */
const pages = require<IStyleguideSection[]>("./generated/docs.json");
const releases = require<IPackageInfo[]>("./generated/releases.json")
    .map((pkg) => {
        pkg.url = `https://www.npmjs.com/package/${pkg.name}`;
        return pkg;
    });
const versions = require<string[]>("./generated/versions.json").reverse()
    .map((version) => ({
        url: `https://palantir.github.io/blueprint/docs/${version}`,
        version,
    } as IPackageInfo));
/* tslint:enable:no-var-requires */

// This function is called whenever the documentation page changes and should be used to
// run non-React code on the newly rendered sections.
const updateExamples = () => {
    // indeterminate checkbox styles must be applied via JavaScript.
    document.queryAll(".pt-checkbox input[indeterminate]").forEach((el: HTMLInputElement) => {
        el.indeterminate = true;
    });
};

// this is invoked exactly once so there's no penalty for lambdas and they make the code cleaner
// tslint:disable:jsx-no-lambda
ReactDOM.render(
    <Styleguide
        resolveDocs={({ reactDocs }) => resolveDocs(reactDocs)}
        resolveExample={({ reactExample }) => resolveExample(reactExample)}
        pages={pages}
        onUpdate={updateExamples}
        releases={releases}
        versions={versions}
    />,
    document.query("#blueprint-documentation")
);
// tslint:enable:jsx-no-lambda

FocusStyleManager.onlyShowFocusOnTabs();
