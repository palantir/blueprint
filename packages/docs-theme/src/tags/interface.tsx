/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isTsClass, isTsInterface, ITypescriptPluginData } from "documentalist/dist/client";
import * as React from "react";
import { InterfaceTable } from "../components/interfaceTable";
import { TagRenderer } from "./";

export class InterfaceTagRenderer {
    constructor(private docs: ITypescriptPluginData) {}

    public render: TagRenderer = ({ value: name }, key, tagRenderers) => {
        const iface = this.docs.typescript[name];
        if (iface === undefined) {
            throw new Error(`Unknown @interface ${name}`);
        }
        if (isTsClass(iface) || isTsInterface(iface)) {
            return <InterfaceTable key={key} iface={iface} tagRenderers={tagRenderers} />;
        }
        throw new Error(`@interface cannot render ${iface.kind}`);
    };
}
