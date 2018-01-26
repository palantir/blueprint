/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, InputGroup } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { DocumentationContextTypes, hasTypescriptData, IDocumentationContext } from "../../common/context";
import { TypescriptExample } from "../../tags/typescript";
import { handleStringChange } from "../baseExample";
import { ApiLink } from "./apiLink";

export interface IApiBrowserProps {
    section: string;
}

export interface IApiBrowserState {
    query: string;
}

export class ApiBrowser extends React.PureComponent<IApiBrowserProps, IApiBrowserState> {
    public static contextTypes = DocumentationContextTypes;
    public context: IDocumentationContext;

    public state: IApiBrowserState = { query: "" };
    private handleQueryChange = handleStringChange(query => this.setState({ query }));

    public render() {
        const { section } = this.props;
        const { query } = this.state;
        const data = this.context.getDocsData();
        if (!hasTypescriptData(data)) {
            return <h1>No Typescript data found.</h1>;
        }
        const filteredLinks = Object.keys(data.typescript)
            .filter(name => name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
            .map(name => <ApiLink className={classNames(Classes.MENU_ITEM, "docs-code")} key={name} name={name} />);
        return (
            <div className="docs-api-browser">
                <div className="docs-api-sidebar">
                    <div className="docs-api-search">
                        <InputGroup
                            leftIconName="search"
                            placeholder="Filter..."
                            value={query}
                            onChange={this.handleQueryChange}
                        />
                    </div>
                    <div className="docs-api-list">{filteredLinks}</div>
                </div>
                <div className="docs-api-content">
                    <TypescriptExample tag="typescript" value={section} />
                </div>
            </div>
        );
    }
}
