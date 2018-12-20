/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps, Pre } from "@blueprintjs/core";
import { isTsClass, isTsEnum, isTsInterface, isTsTypeAlias } from "documentalist/dist/client";
import * as React from "react";
import { hasTypescriptData, IDocumentationContext } from "../common/context";
import { EnumTable } from "../components/typescript/enumTable";
import { InterfaceTable } from "../components/typescript/interfaceTable";
import { TypeAliasTable } from "../components/typescript/typeAliasTable";

export interface IInterfaceProps extends IProps {
    name: string;
}

export const Interface: React.SFC<IInterfaceProps & IDocumentationContext> = ({ name, ...props }) => {
    if (!hasTypescriptData(props.docs)) {
        return <Pre>{name}: No typescript data available.</Pre>;
    }
    const { typescript } = props.docs;
    if (typescript == null || typescript[name] == null) {
        return null;
    }
    const member = typescript[name];
    if (member === undefined) {
        throw new Error(`Unknown @interface ${name}`);
    } else if (isTsClass(member) || isTsInterface(member)) {
        return <InterfaceTable {...props} data={member} title="Props" />;
    } else if (isTsEnum(member)) {
        return <EnumTable {...props} data={member} />;
    } else if (isTsTypeAlias(member)) {
        return <TypeAliasTable {...props} data={member} />;
    } else {
        throw new Error(`"@interface ${name}": unknown member kind "${(member as any).kind}"`);
    }
};
Interface.displayName = "Docs.Interface";
