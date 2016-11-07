/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import "dom4";

import { FocusStyleManager } from "@blueprint/core";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { resolveExample } from "./common/examples";
import { IPackageInfo, IStyleguideSection, Styleguide } from "./components/styleguide";

function renderExample({ reactExample }: IStyleguideSection ) {
    return resolveExample(reactExample);
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
        renderExample={renderExample}
        pages={pages}
        onUpdate={updateExamples}
        releases={releases}
        versions={versions}
    />,
    document.query("#blueprint-documentation")
);

FocusStyleManager.onlyShowFocusOnTabs();
