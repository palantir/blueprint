/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { ITsTypeAlias } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";
import { ApiHeader } from "./apiHeader";

export interface ITypeAliasTableProps {
    data: ITsTypeAlias;
}

export class TypeAliasTable extends React.PureComponent<ITypeAliasTableProps> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs2.TypeAliasTable";

    public context: IDocumentationContext;

    public render() {
        const { data } = this.props;
        const { renderBlock, renderType } = this.context;
        return (
            <div className="docs-modifiers">
                <ApiHeader {...data} />
                <p className="docs-code">= {renderType(data.type)}</p>
                {renderBlock(data.documentation)}
            </div>
        );
    }
}
