/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
