/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Checkbox, Label } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export class CheckboxExample extends React.PureComponent<IExampleProps> {
    public render() {
        return (
            <Example options={false} {...this.props}>
                <div>
                    <Label>Assign responsibility</Label>
                    <Checkbox label="Gilad Gray" defaultIndeterminate={true} />
                    <Checkbox label="Jason Killian" />
                    <Checkbox label="Antoine Llorca" />
                </div>
            </Example>
        );
    }
}
