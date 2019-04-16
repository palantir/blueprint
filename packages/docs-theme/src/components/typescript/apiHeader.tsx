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

import { isTsClass, isTsInterface, ITsDocBase } from "@documentalist/client";
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";

export class ApiHeader extends React.PureComponent<ITsDocBase> {
    public static contextTypes = DocumentationContextTypes;
    public static displayName = "Docs2.ApiHeader";

    public context: IDocumentationContext;

    public render() {
        return (
            <div className="docs-interface-header">
                <div className="docs-interface-name">
                    <small>{this.props.kind}</small> {this.props.name} <small>{this.renderInheritance()}</small>
                </div>
                <small className="docs-package-name">
                    <a href={this.props.sourceUrl} target="_blank">
                        {this.context.renderViewSourceLinkText(this.props)}
                    </a>
                </small>
                {this.props.children}
            </div>
        );
    }

    private renderInheritance() {
        if (isTsClass(this.props) || isTsInterface(this.props)) {
            const extendsTypes = maybeJoinArray("extends", this.props.extends);
            const implementsTypes = maybeJoinArray("implements", this.props.implements);
            return this.context.renderType(`${extendsTypes} ${implementsTypes}`);
        }
        return "";
    }
}

function maybeJoinArray(title: string, array: string[] | undefined): string {
    if (array == null || array.length === 0) {
        return "";
    }
    return `${title} ${array.join(", ")}`;
}
