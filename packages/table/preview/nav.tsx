/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// styles are bundled and loaded with webpack
// tslint:disable:no-var-requires
require("../node_modules/@blueprintjs/core/dist/blueprint.css");
require("../dist/table.css");
// tslint:enable:no-var-requires

import * as React from "react";

import { Switch } from "@blueprintjs/core";

export interface INavProps {
    selected?: string;
}

export class Nav extends React.Component<INavProps, {}> {
    public render() {
        return <nav className="pt-navbar pt-dark pt-fixed-top">
            <div className="pt-navbar-group pt-align-left">
                <div className="pt-navbar-heading">Blueprint Table preview</div>
            </div>
            <div className="pt-navbar-group pt-align-right">
                <a href="index.html" className="pt-button pt-minimal pt-icon-home">Feature gallery</a>
                <a href="perf.html" className="pt-button pt-minimal pt-icon-document">Spreadsheet</a>
                <span className="pt-navbar-divider" />
                <Switch style={{marginBottom: "0"}} label="Dark theme" onChange={this.handleToggleDarkTheme} />
            </div>
        </nav>;
    }

    private handleToggleDarkTheme() {
        document.body.classList.toggle("pt-dark");
    }
}
