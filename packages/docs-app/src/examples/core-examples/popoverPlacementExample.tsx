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

import React from "react";

import { Button, Classes, Code, Popover, Placement } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";

const EXAMPLE_CLASS = "docs-popover-placement-example";
const SIDE_LABEL_CLASS = "docs-popover-placement-label-side";
const ALIGNMENT_LABEL_CLASS = "docs-popover-placement-label-alignment";

export class PopoverPlacementExample extends React.PureComponent<ExampleProps> {
    public static displayName = "PopoverPlacementExample";

    public render() {
        return (
            <Example className={EXAMPLE_CLASS} options={false} {...this.props}>
                {/* eslint-disable-next-line @blueprintjs/html-components */}
                <table>
                    <tbody>
                        <tr>
                            <td />
                            <td>
                                {this.renderPopover("bottom-start")}
                                {this.renderPopover("bottom")}
                                {this.renderPopover("bottom-end")}
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td>
                                {this.renderPopover("right-start")}
                                {this.renderPopover("right")}
                                {this.renderPopover("right-end")}
                            </td>
                            <td>
                                <em className={Classes.TEXT_MUTED}>
                                    Button positions are flipped here so that all popovers open inward.
                                </em>
                            </td>
                            <td>
                                {this.renderPopover("left-start")}
                                {this.renderPopover("left")}
                                {this.renderPopover("left-end")}
                            </td>
                        </tr>
                        <tr>
                            <td />
                            <td>
                                {this.renderPopover("top-start")}
                                {this.renderPopover("top")}
                                {this.renderPopover("top-end")}
                            </td>
                            <td />
                        </tr>
                    </tbody>
                </table>
            </Example>
        );
    }

    private renderPopover(placement: Placement) {
        const [sideLabel, alignmentLabel] = placement.split("-");
        const sideSpan = <span className={SIDE_LABEL_CLASS}>{sideLabel}</span>;

        const buttonLabel =
            alignmentLabel === undefined ? (
                <>{sideSpan}</>
            ) : (
                <>
                    {sideSpan}_{<span className={ALIGNMENT_LABEL_CLASS}>{alignmentLabel}</span>}
                </>
            );

        const popoverAlignmentSentence =
            alignmentLabel === undefined ? (
                <>
                    Aligned to <Code className={ALIGNMENT_LABEL_CLASS}>(center)</Code>
                </>
            ) : (
                <>
                    Aligned to <Code className={ALIGNMENT_LABEL_CLASS}>{alignmentLabel}</Code> edge
                </>
            );

        const content = (
            <div>
                Popover on <Code className={SIDE_LABEL_CLASS}>{sideLabel}</Code> side
                <br />
                {popoverAlignmentSentence}
            </div>
        );

        return (
            <Popover
                content={content}
                placement={placement}
                usePortal={false}
                // tslint:disable-next-line jsx-no-lambda
                renderTarget={({ isOpen, ...p }) => (
                    <Button {...p} active={isOpen} className={Classes.MONOSPACE_TEXT} text={buttonLabel} />
                )}
            />
        );
    }
}
