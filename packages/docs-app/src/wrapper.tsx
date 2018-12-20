/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import "./index.scss";

import { docsData } from "@blueprintjs/docs-data";
import { Wrapper } from "@blueprintjs/docz-theme";
import React from "react";

interface IAppState {
    // add app state fields here
}

// Docz requires that this be a default export.
// tslint:disable-next-line:no-default-export
export default class extends React.Component<{}, IAppState> {
    public render() {
        return (
            <Wrapper
                {...this.props}
                docs={docsData}
                // lots more options in here...
            />
        );
    }
}
