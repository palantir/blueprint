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

import { isTsClass, isTsMethod, ITag, ITsClass, ITypescriptPluginData } from "@documentalist/client";
import React, { useContext } from "react";

import { Props } from "@blueprintjs/core";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";
import { DocumentationContext } from "../common/context";
import { MethodTable } from "../components/typescript/methodTable";

export const Method: React.FC<ITag & Props> = ({ className, value }) => {
    const { getDocsData } = useContext(DocumentationContext);
    const { typescript } = getDocsData() as ITypescriptPluginData;
    const member = typescript[value];

    if (member === undefined) {
        const possibleClass = value.split(".")[0];
        const possibleClassMethod = value.split(".")[1];
        const classMember = typescript[possibleClass] as ITsClass;
        if (isTsClass(classMember) && possibleClassMethod) {
            const classMethod = classMember.methods.find(method => method.name === possibleClassMethod);
            if (isTsMethod(classMethod)) {
                return <MethodTable className={className} data={classMethod} />;
            }
        }
        throw new Error(`Unknown @method ${value}`);
    } else if (isTsMethod(member)) {
        return <MethodTable className={className} data={member} />;
    } else {
        throw new Error(`"@method ${value}": unknown member kind "${(member as any).kind}"`);
    }
};
Method.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.Method`;
