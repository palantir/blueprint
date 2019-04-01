/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Intent, IPopoverProps, Popover, Position } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { FileMenu } from "./common/fileMenu";

export class PopoverMinimalExample extends React.PureComponent<IExampleProps> {
    public render() {
        const baseProps: IPopoverProps = { content: <FileMenu />, position: Position.BOTTOM_LEFT };

        return (
            <Example options={false} {...this.props}>
                <Popover {...baseProps} minimal={true}>
                    <Button intent={Intent.PRIMARY}>Minimal</Button>
                </Popover>
                <Popover {...baseProps}>
                    <Button>Default</Button>
                </Popover>
            </Example>
        );
    }
}
