/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps } from "@blueprintjs/core";
import {
    isTsClass,
    isTsEnum,
    isTsInterface,
    isTsTypeAlias,
    ITag,
    ITypescriptPluginData,
} from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";
import { EnumTable } from "../components/typescript/enumTable";
import { InterfaceTable } from "../components/typescript/interfaceTable";
import { TypeAliasTable } from "../components/typescript/typeAliasTable";

export const TypescriptExample: React.SFC<ITag & IProps> = (
    { className, value },
    { getDocsData }: IDocumentationContext,
) => {
    const { typescript } = getDocsData() as ITypescriptPluginData;
    if (typescript == null || typescript[value] == null) {
        return null;
    }
    const member = typescript[value];
    if (member === undefined) {
        throw new Error(`Unknown @interface ${name}`);
    } else if (isTsClass(member) || isTsInterface(member)) {
        return <InterfaceTable className={className} data={member} title="Props" />;
    } else if (isTsEnum(member)) {
        return <EnumTable className={className} data={member} />;
    } else if (isTsTypeAlias(member)) {
        return <TypeAliasTable className={className} data={member} />;
    } else {
        throw new Error(`"@interface ${name}": unknown member kind "${(member as any).kind}"`);
    }
};
TypescriptExample.contextTypes = DocumentationContextTypes;
TypescriptExample.displayName = "Docs2.TypescriptExample";
