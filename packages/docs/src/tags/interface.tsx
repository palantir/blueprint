/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ITypescriptPluginData } from "documentalist/dist/client";
import * as React from "react";
import { PropsStore } from "../common/propsStore";
import { InterfaceTable } from "../components/interfaceTable";
import { TagRenderer } from "./";

export class InterfaceTagRenderer {
    private propsStore: PropsStore;

    constructor(docs: ITypescriptPluginData) {
        this.propsStore = new PropsStore(docs.ts);
    }

    public render: TagRenderer = ({ value: name }, key, tagRenderers) => {
        const iface = this.propsStore.getInterface(name);
        const props = this.propsStore.getProps(iface);
        if (iface === undefined) {
            throw new Error(`Unknown @interface ${name}`);
        }
        return <InterfaceTable key={key} iface={iface} props={props} tagRenderers={tagRenderers} />;
    };
}
