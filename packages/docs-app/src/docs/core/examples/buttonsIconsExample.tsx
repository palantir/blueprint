/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Icon } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

export class ButtonsIconsExample extends React.PureComponent<IExampleProps> {
    public render() {
        return (
            <Example options={false} {...this.props}>
                {/* icon and rightIcon props */}
                <Button icon="refresh" intent="danger" text="Reset" />
                <Button icon="user" rightIcon="caret-down" text="Profile settings" />
                <Button rightIcon="arrow-right" intent="success" text="Next step" />
                {/* <Icon> children as inline text elements */}
                <Button>
                    <Icon icon="document" /> Upload... <Icon icon="small-cross" />
                </Button>
            </Example>
        );
    }
}
