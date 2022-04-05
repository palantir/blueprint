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

import { Button, Classes, Code, Popover, Position } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";

const EXAMPLE_CLASS = "docs-popover-position-example";

const SIDE_LABEL_CLASS = "docs-popover-position-label-side";
const ALIGNMENT_LABEL_CLASS = "docs-popover-position-label-alignment";

export class PopoverPositionExample extends React.PureComponent<IExampleProps> {
    public render() {
        return (
            <Example className={EXAMPLE_CLASS} options={false} {...this.props}>
                {/* eslint-disable-next-line @blueprintjs/html-components */}
                <table>
                    <tbody>
                        <tr>
                            <td />
                            <td>
                                {this.renderPopover(Position.BOTTOM_LEFT, "bottom", "left")}
                                {this.renderPopover(Position.BOTTOM, "bottom")}
                                {this.renderPopover(Position.BOTTOM_RIGHT, "bottom", "right")}
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td>
                                {this.renderPopover(Position.RIGHT_TOP, "right", "top")}
                                {this.renderPopover(Position.RIGHT, "right")}
                                {this.renderPopover(Position.RIGHT_BOTTOM, "right", "bottom")}
                            </td>
                            <td>
                                <em className={Classes.TEXT_MUTED}>
                                    Button positions are flipped here so that all popovers open inward.
                                </em>
                            </td>
                            <td>
                                {this.renderPopover(Position.LEFT_TOP, "left", "top")}
                                {this.renderPopover(Position.LEFT, "left")}
                                {this.renderPopover(Position.LEFT_BOTTOM, "left", "bottom")}
                            </td>
                        </tr>
                        <tr>
                            <td />
                            <td>
                                {this.renderPopover(Position.TOP_LEFT, "top", "left")}
                                {this.renderPopover(Position.TOP, "top")}
                                {this.renderPopover(Position.TOP_RIGHT, "top", "right")}
                            </td>
                            <td />
                        </tr>
                    </tbody>
                </table>
            </Example>
        );
    }

    private renderPopover(position: "auto" | Position, sideLabel: string, alignmentLabel?: string) {
        const sideSpan = <span className={SIDE_LABEL_CLASS}>{sideLabel}</span>;

        const buttonLabel =
            alignmentLabel === undefined ? (
                <>{sideSpan}</>
            ) : (
                <>
                    {sideSpan}-{<span className={ALIGNMENT_LABEL_CLASS}>{alignmentLabel}</span>}
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

        /* eslint-disable deprecation/deprecation */
        return (
            <Popover content={content} position={position} usePortal={false}>
                <Button className={Classes.MONOSPACE_TEXT}>{buttonLabel}</Button>
            </Popover>
        );
        /* eslint-enable deprecation/deprecation */
    }
}
