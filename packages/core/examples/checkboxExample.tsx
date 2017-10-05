/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
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
