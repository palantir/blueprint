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

import { CssExample } from "./common/cssExample";
import { PropsStore } from "./common/propsStore";
import { resolveDocs } from "./common/resolveDocs";
import { resolveExample } from "./common/resolveExample";
import { TagRenderer } from "./components/page";
import { PropsTable } from "./components/propsTable";
import { IPackageInfo, Styleguide } from "./components/styleguide";

import { IHeadingTag, IPageNode } from "documentalist/dist/client";
import { IKssPluginData, IMarkdownPluginData, ITypescriptPluginData } from "documentalist/dist/plugins";

interface IDocsData extends IKssPluginData, IMarkdownPluginData, ITypescriptPluginData {
    layout: IPageNode[];
}

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

const resolveCssExample: TagRenderer = ({ value: reference }, key) => {
    const example = docs.css[reference];
    if (example === undefined || example.reference === undefined) {
        throw new Error(`Unknown @css reference: ${reference}`);
    }
    return <CssExample {...example} key={key} />;
};

const propsStore = new PropsStore(docs.ts);
const resolveInterface: TagRenderer = ({ value: name }, key) => {
    const props = propsStore.getProps(name);
    return <PropsTable key={key} name={name} props={props} />;
};

const Heading: React.SFC<IHeadingTag> = ({ level, route, value }) => (
    // use createElement so we can dynamically choose tag based on depth
    React.createElement(`h${level}`, { className: "docs-title" },
        <a className="docs-anchor" key="anchor" name={route} />,
        <a className="docs-anchor-link" href={"#" + route} key="link">
            <span className="pt-icon-standard pt-icon-link" />
        </a>,
        value,
    )
);
Heading.displayName = "Docs.Heading";
const renderHeading: TagRenderer = (heading: IHeadingTag, key) => <Heading key={key} {...heading} />;

// tslint:disable:object-literal-key-quotes
const TAGS = {
    css: resolveCssExample,
    heading: renderHeading,
    interface: resolveInterface,
    page: () => undefined as JSX.Element,
    reactDocs: resolveDocs,
    reactExample: resolveExample,
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
    <Styleguide
        defaultPageId="styleguide"
        layout={docs.nav}
        onUpdate={updateExamples}
        pages={docs.pages}
        releases={releases}
        tagRenderers={TAGS}
        versions={versions}
    />,
    document.query("#blueprint-documentation"),
);

FocusStyleManager.onlyShowFocusOnTabs();
