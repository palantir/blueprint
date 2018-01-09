/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { isTsClass, isTsInterface, ITag, ITypescriptPluginData } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";
import { InterfaceTable } from "../components/typescript/interfaceTable";

export const TypescriptExample: React.SFC<ITag> = ({ value }, { getDocsData }: IDocumentationContext) => {
    const { typescript } = getDocsData() as ITypescriptPluginData;
    if (typescript == null || typescript[value] == null) {
        return null;
    }
    const iface = typescript[value];
    if (iface === undefined) {
        throw new Error(`Unknown @interface ${name}`);
    }
    if (isTsClass(iface) || isTsInterface(iface)) {
        return <InterfaceTable key={name} data={iface} title="Props" />;
    }
    throw new Error(`@interface cannot render ${iface.kind}`);
};
TypescriptExample.contextTypes = DocumentationContextTypes;
TypescriptExample.displayName = "Docs.TypescriptExample";
