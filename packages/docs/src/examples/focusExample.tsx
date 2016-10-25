/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { FocusStyleManager } from "@blueprint/core";
import { Button, InputGroup, Switch } from "@blueprint/core";
import * as React from "react";

import BaseExample, { handleBooleanChange } from "./baseExample";

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
