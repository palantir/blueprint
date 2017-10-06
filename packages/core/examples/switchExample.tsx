/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Classes, Switch } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export class SwitchExample extends BaseExample<{}> {
    protected renderExample() {
        return (
            <div>
                <label className={Classes.LABEL}>Privacy setting</label>
                <Switch labelElement={<strong>Enabled</strong>} />
                <Switch labelElement={<em>Public</em>} />
                <Switch labelElement={<u>Cooperative</u>} defaultChecked={true} />
                <small>
                    This example uses <code>labelElement</code> to demonstrate JSX labels.
                </small>
            </div>
        );
    }
}
