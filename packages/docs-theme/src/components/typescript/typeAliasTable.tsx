/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps } from "@blueprintjs/core";
import classNames from "classnames";
import { ITsTypeAlias } from "documentalist/dist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";
import { ApiHeader } from "./apiHeader";

export interface ITypeAliasTableProps extends IProps {
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
            <div className={classNames("docs-modifiers", "pt-running-text-small", this.props.className)}>
                <ApiHeader {...data} />
                <div className="docs-interface-table">
                    {renderBlock(data.documentation)}
                    <p className="docs-code">= {renderType(data.type)}</p>
                </div>
            </div>
        );
    }
}
