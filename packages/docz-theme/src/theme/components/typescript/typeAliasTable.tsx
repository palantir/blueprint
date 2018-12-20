/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps } from "@blueprintjs/core";
import classNames from "classnames";
import { ITsTypeAlias } from "documentalist/dist/client";
import * as React from "react";
import { IDocumentationContext } from "../../common/context";
import { ApiHeader } from "./apiHeader";

export interface ITypeAliasTableProps extends IProps {
    data: ITsTypeAlias;
}

export class TypeAliasTable extends React.PureComponent<ITypeAliasTableProps & IDocumentationContext> {
    public static displayName = "Docs2.TypeAliasTable";

    public render() {
        const { data, renderBlock, renderType } = this.props;
        const aliases = data.type.split(" | ").map((type, i) => (
            <div>
                {i === 0 ? "=" : "|"} {renderType(type)}
            </div>
        ));
        return (
            <div className={classNames("docs-modifiers", this.props.className)}>
                <ApiHeader entry={data} {...this.props} />
                {renderBlock(data.documentation)}
                <div className="docs-type-alias docs-code">{aliases}</div>
            </div>
        );
    }
}
