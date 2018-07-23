/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Code, Label, Switch } from "@blueprintjs/core";
import { CheckboxExample } from "./checkboxExample";

export class SwitchExample extends CheckboxExample {
    // See CheckboxExample for options
    protected renderExample() {
        return (
            <>
                <div>
                    <Label>Privacy setting</Label>
                    <Switch {...this.state} labelElement={<strong>Enabled</strong>} />
                    <Switch {...this.state} labelElement={<em>Public</em>} />
                    <Switch {...this.state} labelElement={<u>Cooperative</u>} defaultChecked={true} />
                </div>
                <small style={{ width: "100%", textAlign: "center" }}>
                    This example uses <Code>labelElement</Code> to demonstrate JSX labels.
                </small>
            </>
        );
    }
}
