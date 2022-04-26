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
import { Popover2, Popover2InteractionKind } from "@blueprintjs/popover2";

import { FileMenu } from "../core-examples/common/fileMenu";

export class Popover2InteractionKindExample extends React.PureComponent<IExampleProps> {
    public static displayName = "Popover2InteractionKindExample";

    public render() {
        return (
            <Example className="docs-popover2-interaction-kind-example" options={false} {...this.props}>
                <div>
                    {this.renderPopover("hover")}
                    {this.renderPopover("hover-target")}
                    {this.renderPopover("click")}
                    {this.renderPopover("click-target")}
                </div>
            </Example>
        );
    }

    private renderPopover(interactionKind: Popover2InteractionKind) {
        // MenuItem's default shouldDismissPopover={true} behavior is confusing
        // in this example, since it introduces an additional way popovers can
        // close. set it to false here for clarity.
        return (
            <Popover2
                enforceFocus={false}
                placement="bottom-end"
                interactionKind={interactionKind}
                content={<FileMenu shouldDismissPopover={false} />}
                renderTarget={({ isOpen, ref, ...p }) => (
                    <Button {...p} active={isOpen} elementRef={ref} intent={Intent.PRIMARY} text={interactionKind} />
                )}
            />
        );
    }
}
