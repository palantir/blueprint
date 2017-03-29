/*
 * Copyright 2017-present Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { ITypescriptPluginData } from "documentalist/dist/plugins";
import * as React from "react";
import { PropsStore } from "../common/propsStore";
import { PropsTable } from "../components/propsTable";
import { TagRenderer } from "./";

export class InterfaceTagRenderer {
    private propsStore: PropsStore;

    constructor(docs: ITypescriptPluginData) {
        this.propsStore = new PropsStore(docs.ts);
    }

    public render: TagRenderer = ({ value: name }, key) => {
        const props = this.propsStore.getProps(name);
        return <PropsTable key={key} name={name} props={props} />;
    }
}
