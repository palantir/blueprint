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

import { ITsTypeAlias } from "@documentalist/client";
import classNames from "classnames";
import React, { useContext } from "react";

import { Props } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../../common";
import { DocumentationContext } from "../../common/context";
import { ApiHeader } from "./apiHeader";

export interface TypeAliasTableProps extends Props {
    data: ITsTypeAlias;
}

export const TypeAliasTable: React.FC<TypeAliasTableProps> = ({ className, data }) => {
    const { renderBlock, renderType } = useContext(DocumentationContext);
    const aliases = data.type.split(" | ").map((type, i) => (
        <div key={i}>
            {i === 0 ? "=" : "|"} {renderType(type)}
        </div>
    ));
    return (
        <div className={classNames("docs-modifiers", className)}>
            <ApiHeader {...data} />
            {renderBlock(data.documentation)}
            <div className="docs-type-alias docs-code">{aliases}</div>
        </div>
    );
};
TypeAliasTable.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.TypeAliasTable`;
