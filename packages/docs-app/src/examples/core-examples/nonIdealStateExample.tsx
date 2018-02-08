/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { InputGroup, NonIdealState } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

export class NonIdealStateExample extends BaseExample<{}> {
    protected renderExample() {
        const description = (
            <span>
                Your search didn't match any files.<br />Try searching for something else.
            </span>
        );
        return (
            <NonIdealState
                visual="search"
                title="No search results"
                description={description}
                action={<InputGroup className="pt-round" leftIcon="search" placeholder="Search..." />}
            />
        );
    }
}
