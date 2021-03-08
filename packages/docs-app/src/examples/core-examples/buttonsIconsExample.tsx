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
