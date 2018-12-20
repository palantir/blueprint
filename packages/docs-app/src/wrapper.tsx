/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/docs-theme/lib/css/docs-theme.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
// tslint:enable

import "./index.scss";

import { AnchorButton } from "@blueprintjs/core";
import { BlueprintDoczConfig, IThemeConfig } from "@blueprintjs/docz-theme";
import React from "react";
import { NavFooter } from "./components/navFooter";
import { NavHeader } from "./components/navHeader";

const GITHUB_SOURCE_URL = "https://github.com/palantir/blueprint/blob/develop/packages/docs-app";

const config: IThemeConfig = {
    renderFooter: () => <NavFooter />,
    renderHeader: title => <NavHeader onToggleDark={null} title={title} useDarkTheme={false} useNextVersion={false} />,
    renderPageActions: page => (
        <AnchorButton
            href={`${GITHUB_SOURCE_URL}/${page.filepath}`}
            icon="edit"
            minimal={true}
            target="_blank"
            text="Edit this page"
        />
    ),
};

const Wrapper: React.SFC = ({ children }) => <BlueprintDoczConfig value={config}>{children}</BlueprintDoczConfig>;

// Docz requires that this be a default export.
// tslint:disable-next-line:no-default-export
export default Wrapper;
