/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import { InputGroup, NonIdealState } from "@blueprintjs/core";
import BaseExample from "./common/baseExample";

export class NonIdealStateExample extends BaseExample<{}> {
    protected renderExample() {
        const description = <span>Your search didn't match any files.<br />Try searching for something else.</span>;
        return (
            <NonIdealState
                visual="search"
                title="No Search Results"
                description={description}
                action={<InputGroup className="pt-round" leftIconName="search" placeholder="Search..." />}
            />
        );
    }
}
