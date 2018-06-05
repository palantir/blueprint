/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Code, Label, Switch } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export class SwitchExample extends React.PureComponent<IExampleProps> {
    public render() {
        return (
            <Example options={false} {...this.props}>
                <div>
                    <Label>Privacy setting</Label>
                    <Switch labelElement={<strong>Enabled</strong>} />
                    <Switch labelElement={<em>Public</em>} />
                    <Switch labelElement={<u>Cooperative</u>} defaultChecked={true} />
                    <small>
                        This example uses <Code>labelElement</Code>
                        <br /> to demonstrate JSX labels.
                    </small>
                </div>
            </Example>
        );
    }
}
