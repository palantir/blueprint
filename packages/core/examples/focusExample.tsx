/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Button, FocusStyleManager, InputGroup, Switch } from "@blueprintjs/core";
import { BaseExample, handleBooleanChange } from "@blueprintjs/docs";

export interface IFocusExampleState {
    isFocusActive?: boolean;
}

export class FocusExample extends BaseExample<IFocusExampleState> {
    public state = {
        isFocusActive: true,
    };

    private toggleFocus = handleBooleanChange((enabled) => {
        if (enabled) {
            FocusStyleManager.onlyShowFocusOnTabs();
        } else {
            FocusStyleManager.alwaysShowFocus();
        }
        this.setState({ isFocusActive: FocusStyleManager.isActive() });
    });

    protected renderExample() {
        return (
            <div>
                <InputGroup leftIconName="star" placeholder="Test me for focus" />
                <br />
                <Button className="pt-fill" text="Test me for focus" />
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Switch
                    checked={this.state.isFocusActive}
                    label="Only show focus on tab"
                    key="focus"
                    onChange={this.toggleFocus}
                />,
            ],
        ];
    }
}
