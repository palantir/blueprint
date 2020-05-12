/*
 * Copyright 2020 Palantir Technologies, Inc. All rights reserved.
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
import { isTsMethod, ITag, ITypescriptPluginData } from "@documentalist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../common/context";
import { MethodTable } from "../components/typescript/methodTable";

export const Method: React.SFC<ITag & IProps> = ({ className, value }, { getDocsData }: IDocumentationContext) => {
    const { typescript } = getDocsData() as ITypescriptPluginData;
    const member = typescript[value];
    if (member === undefined) {
        throw new Error(`Unknown @method ${name}`);
    } else if (isTsMethod(member)) {
        return <MethodTable className={className} data={member} />;
    } else {
        throw new Error(`"@method ${name}": unknown member kind "${(member as any).kind}"`);
    }
};
Method.contextTypes = DocumentationContextTypes;
Method.displayName = "Docs2.Method";
