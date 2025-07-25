/*
 * Copyright 2025 Palantir Technologies, Inc. All rights reserved.
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
import { Example, type ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";

export const FocusExample: React.FC<ExampleProps> = props => {
    const [isFocusActive, setIsFocusActive] = React.useState(true);

    const toggleFocus = handleBooleanChange(enabled => {
        if (enabled) {
            FocusStyleManager.onlyShowFocusOnTabs();
        } else {
            FocusStyleManager.alwaysShowFocus();
        }
        setIsFocusActive(FocusStyleManager.isActive());
    });

    const options = <Switch checked={isFocusActive} label="Only show focus on tab" onChange={toggleFocus} />;

    return (
        <Example options={options} {...props}>
            <InputGroup leftIcon="star" placeholder="Test me for focus" />
            <br />
            <Button className={Classes.FILL} text="Test me for focus" />
        </Example>
    );
};
