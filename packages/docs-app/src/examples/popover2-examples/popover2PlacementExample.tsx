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

import { Button, Classes, Code } from "@blueprintjs/core";
import { Example, IExampleProps } from "@blueprintjs/docs-theme";
import { Placement, Popover2 } from "@blueprintjs/popover2";

const EXAMPLE_CLASS = "docs-popover2-placement-example";
const SIDE_LABEL_CLASS = "docs-popover2-placement-label-side";
const ALIGNMENT_LABEL_CLASS = "docs-popover2-placement-label-alignment";

export class Popover2PlacementExample extends React.PureComponent<IExampleProps> {
    public static displayName = "Popover2PlacementExample";

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

        return (
            <Popover2
                content={content}
                placement={placement}
                usePortal={false}
                renderTarget={({ isOpen, ref, ...p }) => (
                    <Button
                        {...p}
                        active={isOpen}
                        elementRef={ref}
                        className={Classes.MONOSPACE_TEXT}
                        text={buttonLabel}
                    />
                )}
            />
        );
    }
}
