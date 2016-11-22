/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import "dom4";

import { FocusStyleManager } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { IInterfaceEntry } from "ts-quick-docs/src/interfaces";

import { PropsStore } from "./common/propsStore";
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
const versions = require<string[]>("./generated/versions.json")
    .map((version) => ({
        url: `https://palantir.github.io/blueprint/docs/${version}`,
        version,
    } as IPackageInfo));

const propsStore = new PropsStore(require<IInterfaceEntry[]>("./generated/props.json"));
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
        resolveInterface={propsStore.getProps}
        pages={pages}
        onUpdate={updateExamples}
        releases={releases}
        versions={versions}
    />,
    document.query("#blueprint-documentation")
);
// tslint:enable:jsx-no-lambda

FocusStyleManager.onlyShowFocusOnTabs();

// scroll down a bit when the page loads so the first heading appears below the fixed navbar.
// i think this is necessary because the negative margin trick doesn't work on page load
// with react (might work via SSR where HTML is already there).
// (80px = navbar height + content padding)
scrollBy(0, -80);
