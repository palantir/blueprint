/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { H1, Utils } from "@blueprintjs/core";
import { Entry } from "docz";
import React from "react";
import { withConfig } from "../../../config";
import { NavButton } from "./navButton";
import { NavMenu } from "./navMenu";

export interface ISidebarProps {
    currentPage: Entry;
    onSearchClick: () => void;
}

export const Sidebar = withConfig<ISidebarProps>(
    ({ currentPage, onSearchClick, title, renderHeader = defaultRenderHeader, renderFooter }) => (
        <div className="docs-nav-wrapper">
            <div className="docs-nav">
                {renderHeader(title)}
                <div className="docs-nav-divider" />
                <NavButton icon="search" hotkey="shift + s" text="Search..." onClick={onSearchClick} />
                <div className="docs-nav-divider" />
                <NavMenu currentPage={currentPage} />
                {Utils.safeInvoke(renderFooter)}
            </div>
        </div>
    ),
);

function defaultRenderHeader(title: string) {
    return <H1 className="docs-title">{title}</H1>;
}
