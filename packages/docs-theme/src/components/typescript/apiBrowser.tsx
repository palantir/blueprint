/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { DocumentationContextTypes, hasTypescriptData, IDocumentationContext } from "../../common/context";
import { TypescriptExample } from "../../tags/typescript";
import { ApiLink } from "./apiLink";

export interface IApiBrowserProps {
    section: string;
}

export class ApiBrowser extends React.PureComponent<IApiBrowserProps> {
    public static contextTypes = DocumentationContextTypes;
    public context: IDocumentationContext;

    public render() {
        const { section } = this.props;
        const data = this.context.getDocsData();
        if (!hasTypescriptData(data)) {
            return <h1>No Typescript data found.</h1>;
        }
        return (
            <div className="docs-api-browser">
                <div className="docs-api-list">
                    {Object.keys(data.typescript).map(name => (
                        <ApiLink className={classNames(Classes.MENU_ITEM, "docs-code")} key={name} name={name} />
                    ))}
                </div>
                <div className="docs-api-content">
                    <TypescriptExample tag="typescript" value={section} />
                </div>
            </div>
        );
    }
}
