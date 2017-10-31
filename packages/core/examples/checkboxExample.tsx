/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Checkbox, Classes } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export class CheckboxExample extends BaseExample<{}> {
    protected renderExample() {
        return (
            <div>
                <label className={Classes.LABEL}>Assign responsibility</label>
                <Checkbox label="Gilad Gray" defaultIndeterminate={true} />
                <Checkbox label="Jason Killian" />
                <Checkbox label="Antoine Llorca" />
            </div>
        );
    }
}
