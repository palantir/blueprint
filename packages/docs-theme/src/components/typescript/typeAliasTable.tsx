/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { IProps } from "@blueprintjs/core";
import { ITsTypeAlias } from "@documentalist/client";
import classNames from "classnames";
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
        const aliases = data.type.split(" | ").map((type, i) => (
            <div>
                {i === 0 ? "=" : "|"} {renderType(type)}
            </div>
        ));
        return (
            <div className={classNames("docs-modifiers", this.props.className)}>
                <ApiHeader {...data} />
                {renderBlock(data.documentation)}
                <div className="docs-type-alias docs-code">{aliases}</div>
            </div>
        );
    }
}
