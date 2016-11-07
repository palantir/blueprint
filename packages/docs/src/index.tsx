/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import "dom4";

import { FocusStyleManager } from "@blueprint/core";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { IPackageInfo, IStyleguideSection, Styleguide } from "./components/styleguide";

import * as CoreExamples from "@blueprint/core/examples";
import * as DateExamples from "@blueprint/datetime/examples";
const Examples: { [packageName: string]: { [name: string]: React.ComponentClass<any> } } = {
    core: CoreExamples as any,
    datetime: DateExamples as any,
};
function getExample(componentName: string) {
    // tslint:disable-next-line:forin
    for (let packageName in Examples) {
        const component = Examples[packageName][componentName];
        if (component != null) {
            return { component, packageName };
        }
    }
    return { component: null, packageName: null };
}

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/master/packages";

function renderExample({ reactExample }: IStyleguideSection) {
    if (reactExample == null) {
        return { element: null, sourceUrl: "" };
    }

    const { component, packageName } = getExample(reactExample);
    if (component == null) {
        throw new Error(`Unknown component: Blueprint.Examples.${reactExample}`);
    }
    const fileName = reactExample.charAt(0).toLowerCase() + reactExample.slice(1) + ".tsx";
    return {
        element: <div className="kss-example">{React.createElement(component)}</div>,
        sourceUrl: [SRC_HREF_BASE, packageName, "examples", fileName].join("/"),
    };
}

/* tslint:disable:no-var-requires */
const pages = require<IStyleguideSection[]>("./generated/docs.json");
const releases = require<IPackageInfo[]>("./generated/releases.json");
const versions = require<string[]>("./generated/versions.json").reverse();
/* tslint:enable:no-var-requires */

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
        exampleRenderer={renderExample}
        pages={pages}
        onUpdate={updateExamples}
        releases={releases}
        versions={versions}
    />,
    document.query("#blueprint-documentation")
);

FocusStyleManager.onlyShowFocusOnTabs();
