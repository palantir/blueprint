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
