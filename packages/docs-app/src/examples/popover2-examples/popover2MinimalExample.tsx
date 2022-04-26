/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { Button, Intent } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Popover2, Popover2Props } from "@blueprintjs/popover2";

import { FileMenu } from "../core-examples/common/fileMenu";

export class Popover2MinimalExample extends React.PureComponent<IExampleProps> {
    public static displayName = "Popover2MinimalExample";

    public render() {
        const baseProps: Partial<Popover2Props> = { content: <FileMenu />, placement: "bottom-end" };

        return (
            <Example options={false} {...this.props}>
                <Popover2
                    {...baseProps}
                    minimal={true}
                    renderTarget={({ isOpen, ref, ...p }) => (
                        <Button {...p} active={isOpen} elementRef={ref} intent={Intent.PRIMARY} text="Minimal" />
                    )}
                />
                <Popover2
                    {...baseProps}
                    renderTarget={({ isOpen, ref, ...p }) => (
                        <Button {...p} active={isOpen} elementRef={ref} text="Default" />
                    )}
                />
            </Example>
        );
    }
}
