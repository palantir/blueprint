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
import * as React from "react";
import { DocumentationContextTypes, IDocumentationContext } from "../../common/context";

export interface IApiLinkProps extends IProps {
    children?: never;
    name: string;
}

/**
 * Renders a link to open a symbol in the API Browser.
 */
export class ApiLink extends React.PureComponent<IApiLinkProps> {
    public static contextTypes = DocumentationContextTypes;
    public context: IDocumentationContext;

    public render() {
        const { className, name } = this.props;
        return (
            <a className={className} href={`#api/${name}`} onClick={this.handleClick}>
                {name}
            </a>
        );
    }

    private handleClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        evt.preventDefault();
        this.context.showApiDocs(this.props.name);
    };
}
