/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
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
