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
import { PropsTable } from "./components/propsTable";
import { IPackageInfo, Styleguide } from "./components/styleguide";

import { IPageData, IPageNode, slugify } from "documentalist/dist/client";
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

function resolveCssExample(reference: string, key: React.Key) {
    const example = docs.css[reference];
    return <CssExample {...example} key={key} />;
}

const propsStore = new PropsStore(docs.ts);
function resolveInterface(name: string, key: React.Key) {
    const props = propsStore.getProps(name);
    return <PropsTable key={key} name={name} props={props} />;
}

const Heading: React.SFC<{ depth: number, header: string, reference: string }> =
    ({ depth, header, reference }) => (
        // use createElement so we can dynamically choose tag based on depth
        React.createElement(`h${depth}`, { className: "kss-title" },
            <a className="docs-anchor" key="anchor" name={reference} />,
            <a className="docs-anchor-link" href={"#" + reference} key="link">
                <span className="pt-icon-standard pt-icon-link" />
            </a>,
            header,
        )
    );

function renderHeading(depth: number) {
    return (heading: string, key: React.Key, page: IPageData): JSX.Element => {
        const ref = (depth === 1 ? page.reference : slugify(page.reference, heading));
        return <Heading depth={depth} header={heading} key={key} reference={ref} />;
    };
}

// tslint:disable:object-literal-key-quotes
const TAGS = {
    "#": renderHeading(1),
    "##": renderHeading(2),
    "###": renderHeading(3),
    "####": renderHeading(4),
    css: resolveCssExample,
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

// this is invoked exactly once so there's no penalty for lambdas and they make the code cleaner
// tslint:disable:jsx-no-lambda
ReactDOM.render(
    <Styleguide
        defaultPageId="components"
        layout={docs.layout}
        onUpdate={updateExamples}
        pages={docs.docs}
        releases={releases}
        tagRenderers={TAGS}
        versions={versions}
    />,
    document.query("#blueprint-documentation"),
);
// tslint:enable:jsx-no-lambda

FocusStyleManager.onlyShowFocusOnTabs();
