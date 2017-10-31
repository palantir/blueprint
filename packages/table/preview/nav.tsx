/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// styles are bundled and loaded with webpack
// tslint:disable:no-var-requires no-submodule-imports
require("@blueprintjs/core/dist/blueprint.css");
require("../dist/table.css");
// tslint:enable:no-var-requires no-submodule-imports

import * as React from "react";

import { Switch } from "@blueprintjs/core";

export interface INavProps {
    selected?: string;
}

export class Nav extends React.Component<INavProps, {}> {
    public render() {
        const darkThemeToggleStyles = {
            marginBottom: 0,
            marginTop: "3px",
        };

        return (
            <nav className="pt-navbar pt-dark pt-fixed-top">
                <div className="pt-navbar-group pt-align-left">
                    <div className="pt-navbar-heading">Blueprint Table</div>
                </div>
                <div className="pt-navbar-group pt-align-right">
                    <a href="index.html" className="pt-button pt-minimal">
                        Home
                    </a>
                    <a href="features.html" className="pt-button pt-minimal">
                        Features (Legacy)
                    </a>
                    <span className="pt-navbar-divider" />
                    <Switch style={darkThemeToggleStyles} label="Dark theme" onChange={this.handleToggleDarkTheme} />
                </div>
            </nav>
        );
    }

    private handleToggleDarkTheme() {
        document.body.classList.toggle("pt-dark");
    }
}
