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

import { Button, Intent, Popover, type PopoverInteractionKind } from "@blueprintjs/core";
import { Example, type ExampleProps } from "@blueprintjs/docs-theme";

import { FileMenu } from "./common/fileMenu";

const interactionKinds: PopoverInteractionKind[] = [
    "click",
    "click-target",
    "hover",
    "hover-target",
];

export const PopoverInteractionKindExample: React.FC<ExampleProps> = props => {
    return (
        <Example className="docs-popover-interaction-kind-example" options={false} {...props}>
            <div>
                {interactionKinds.map(interactionKind => (
                    // MenuItem's default shouldDismissPopover={true} behavior is confusing
                    // in this example, since it introduces an additional way popovers can
                    // close. set it to false here for clarity.
                    <Popover
                        key={interactionKind}
                        content={<FileMenu shouldDismissPopover={false} />}
                        enforceFocus={false}
                        interactionKind={interactionKind}
                        placement="bottom-end"
                        renderTarget={({ isOpen, ...rest }) => (
                            <Button
                                {...rest}
                                active={isOpen}
                                intent={Intent.PRIMARY}
                                text={interactionKind}
                            />
                        )}
                    />
                ))}
            </div>
        </Example>
    );
};
