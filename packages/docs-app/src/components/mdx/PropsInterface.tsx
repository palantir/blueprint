/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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

import {
    isTsClass,
    isTsEnum,
    isTsInterface,
    isTsTypeAlias,
    type TypescriptPluginData,
} from "@documentalist/client";
import { useContext } from "react";

import type { Props } from "@blueprintjs/core";
import { DocumentationContext, EnumTable, InterfaceTable, TypeAliasTable } from "@blueprintjs/docs-theme";

export interface PropsInterfaceProps extends Props {
    /** The name of the TypeScript interface, class, enum, or type alias to render */
    name: string;
}

/**
 * PropsInterface renders a TypeScript interface/class/enum/type alias as a props table.
 * This is the MDX-compatible replacement for the Documentalist `@interface` directive.
 *
 * Usage in MDX:
 * ```mdx
 * <PropsInterface name="CalloutProps" />
 * ```
 */
export const PropsInterface: React.FC<PropsInterfaceProps> = ({ className, name }) => {
    const { getDocsData } = useContext(DocumentationContext);
    const { typescript } = getDocsData() as TypescriptPluginData;

    if (typescript == null || typescript[name] == null) {
        return (
            <div className={className}>
                <em>Unknown interface: {name}</em>
            </div>
        );
    }

    const member = typescript[name];

    if (isTsClass(member) || isTsInterface(member)) {
        return <InterfaceTable className={className} data={member} title="Props" />;
    } else if (isTsEnum(member)) {
        return <EnumTable className={className} data={member} />;
    } else if (isTsTypeAlias(member)) {
        return <TypeAliasTable className={className} data={member} />;
    } else {
        return (
            <div className={className}>
                <em>Unknown member kind for: {name}</em>
            </div>
        );
    }
};
