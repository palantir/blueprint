/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, Classes, FocusStyleManager, InputGroup, Switch } from "@blueprintjs/core";
import { Example, handleBooleanChange, IExampleProps } from "@blueprintjs/docs-theme";

export interface IFocusExampleState {
    isFocusActive?: boolean;
}

export class FocusExample extends React.PureComponent<IExampleProps, IFocusExampleState> {
    public state = {
        isFocusActive: true,
    };

    private toggleFocus = handleBooleanChange(enabled => {
        if (enabled) {
            FocusStyleManager.onlyShowFocusOnTabs();
        } else {
            FocusStyleManager.alwaysShowFocus();
        }
        this.setState({ isFocusActive: FocusStyleManager.isActive() });
    });

    public render() {
        const options = (
            <Switch checked={this.state.isFocusActive} label="Only show focus on tab" onChange={this.toggleFocus} />
        );
        return (
            <Example options={options} {...this.props}>
                <InputGroup leftIcon="star" placeholder="Test me for focus" />
                <br />
                <Button className={Classes.FILL} text="Test me for focus" />
            </Example>
        );
    }
}
