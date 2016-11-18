/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { InputGroup, NonIdealState } from "../src";
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
